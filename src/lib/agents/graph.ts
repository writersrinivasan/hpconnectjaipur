// The multi-agent "export desk" for Rangrez Crafts, built with LangGraph.
//
//   START → Dwarpal (guardrails) ─blocked→ Sandesh
//                 │
//                 ▼
//           Sutradhar (LLM planner) ──fan-out in parallel──► Gyani (RAG) · Bhandari · Munim-ji · Saarthi (MCP)
//                                                                   │
//                                                                   ▼
//                                     Niti (rules) → Malik-ji (human approval gate) → Sandesh (LLM writer) → END

import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { groqChat, GroqError, type Msg } from "../groq";
import { retrieve } from "../knowledge";
import { callTool } from "../mcp/server";
import { PRODUCTS, findProduct, currencyFor, APPROVAL_THRESHOLD_INR, MAX_SALES_DISCOUNT, inr } from "../catalog";
import type { TraceEntry, AgentId } from "./meta";

type Plan = {
  intent: "quote" | "product_info" | "policy" | "greeting" | "off_topic";
  language: string;
  sku: string | null;
  quantity: number | null;
  country: string | null;
  mode: "sea" | "air" | null;
  requested_discount: number | null;
  agents: ("gyani" | "bhandari" | "munim" | "saarthi")[];
  reasoning: string;
};

type Check = { rule: string; pass: boolean; note: string };

const concat = <T,>(a: T[], b: T[]) => a.concat(b);

const State = Annotation.Root({
  question: Annotation<string>,
  history: Annotation<Msg[]>,
  text: Annotation<string>, // sanitized question
  blocked: Annotation<string | null>,
  plan: Annotation<Plan | null>,
  findings: Annotation<Record<string, unknown>>({ reducer: (a, b) => ({ ...a, ...b }), default: () => ({}) }),
  citations: Annotation<string[]>({ reducer: concat, default: () => [] }),
  checks: Annotation<Check[]>,
  needsApproval: Annotation<string[]>,
  status: Annotation<"ok" | "blocked" | "draft">,
  answer: Annotation<string>,
  trace: Annotation<TraceEntry[]>({ reducer: concat, default: () => [] }),
});
type S = typeof State.State;

const SPECIALISTS = ["gyani", "bhandari", "munim", "saarthi"] as const;

export function buildGraph(apiKey: string, model: string) {
  const llm = (messages: Msg[], json = false, maxTokens = 700) => groqChat({ apiKey, model, messages, json, maxTokens });
  const t = (agent: AgentId, kind: TraceEntry["kind"], title: string, detail?: string, data?: unknown, ms?: number): TraceEntry => ({ agent, kind, title, detail, data, ms });

  // ── 1. Dwarpal: input guardrails (pure code, runs in ~1 ms) ───────────────────────────────
  async function dwarpal(s: S): Promise<Partial<S>> {
    const t0 = Date.now();
    let text = s.question.slice(0, 2000);
    const masked: string[] = [];
    const rules: [RegExp, string, string][] = [
      [/\b(?:\d[ -]?){13,16}\b/g, "[CARD-MASKED]", "card number"],
      [/\b\d{4}\s?\d{4}\s?\d{4}\b/g, "[AADHAAR-MASKED]", "Aadhaar number"],
      [/\b[\w.+-]+@[\w-]+\.[\w.]+\b/g, "[EMAIL-MASKED]", "email"],
      [/(\+91[\s-]?)?\b[6-9]\d{9}\b/g, "[PHONE-MASKED]", "phone number"],
    ];
    for (const [re, rep, label] of rules) if (re.test(text)) { masked.push(label); text = text.replace(re, rep); }

    const injection = /(ignore|forget|disregard)\s+(all\s+|any\s+|the\s+|your\s+)?(previous|prior|above|earlier)?\s*(instructions|rules|prompt)|system prompt|reveal (your|the) (prompt|instructions)|you are now|jailbreak|developer mode|pretend (you are|to be)/i;
    const trace: TraceEntry[] = [];
    if (masked.length) trace.push(t("dwarpal", "guard", `Masked ${masked.join(", ")}`, "Private data is hidden before any AI model sees it.", { masked }));
    if (injection.test(text)) {
      trace.push(t("dwarpal", "guard", "Blocked: prompt-injection attempt", "The message tries to override the assistant's rules, so it never reaches the LLM.", { pattern: "instruction override" }, Date.now() - t0));
      return { text, blocked: "injection", status: "blocked", trace };
    }
    trace.push(t("dwarpal", "guard", "Message is safe", masked.length ? "Passed after masking." : "No private data, no injection patterns.", undefined, Date.now() - t0));
    return { text, blocked: null, trace };
  }

  // ── 2. Sutradhar: LLM planner + router ────────────────────────────────────────────────────
  async function sutradhar(s: S): Promise<Partial<S>> {
    const t0 = Date.now();
    const catalog = PRODUCTS.map((p) => `${p.sku}: ${p.name} (MOQ ${p.moq})`).join("\n");
    const sys = `You are Sutradhar, the planner for Rangrez Crafts, a handicraft & textile exporter in Jaipur.
Classify the buyer's latest message and extract details. Use the conversation history to fill gaps in follow-up questions.
Products:\n${catalog}
Specialists you can call (choose the minimum needed):
- gyani: company policies & knowledge (payment terms, lead times, GST/export docs, HS codes, samples, custom designs, care, GI tags, packaging)
- bhandari: stock & production time (needs sku + quantity)
- munim: price quote & currency conversion (needs sku + quantity)
- saarthi: shipping cost & transit time (needs sku + quantity + country)
Return ONLY JSON: {"intent":"quote|product_info|policy|greeting|off_topic","language":"English|Hindi|...","sku":string|null,"quantity":number|null,"country":string|null,"mode":"sea"|"air"|null,"requested_discount":number|null,"agents":[...],"reasoning":"one short sentence"}
off_topic = anything not about this business (e.g. cricket, coding, politics).`;
    const msgs: Msg[] = [{ role: "system", content: sys }, ...s.history.slice(-6), { role: "user", content: s.text }];
    let plan: Plan;
    let usedLlm = true;
    try {
      const r = await llm(msgs, true, 300);
      plan = JSON.parse(r.text) as Plan;
    } catch (e) {
      if (e instanceof GroqError && (e.status === 401 || e.status === 403)) throw e;
      usedLlm = false;
      plan = heuristicPlan(s.text);
    }
    // Normalise and fill gaps with simple code — never trust the LLM blindly.
    const prod = (plan.sku && PRODUCTS.find((p) => p.sku === plan.sku)) || findProduct(s.text) || (plan.sku ? findProduct(plan.sku) : undefined);
    plan.sku = prod?.sku ?? null;
    if (!Array.isArray(plan.agents)) plan.agents = [];
    plan.agents = plan.agents.filter((a) => (SPECIALISTS as readonly string[]).includes(a));
    if (plan.intent === "quote" && plan.sku) {
      plan.quantity = plan.quantity || prod!.moq;
      for (const a of ["bhandari", "munim", "saarthi"] as const) if (!plan.agents.includes(a)) plan.agents.push(a);
    }
    if (!plan.sku) plan.agents = plan.agents.filter((a) => a === "gyani");
    if ((plan.intent === "policy" || plan.intent === "product_info") && !plan.agents.includes("gyani")) plan.agents.push("gyani");
    if (plan.intent === "off_topic" || plan.intent === "greeting") plan.agents = [];
    plan.language = plan.language || "English";

    const who = plan.agents.length ? plan.agents.join(" + ") : "none (Sandesh replies directly)";
    return {
      plan,
      trace: [t("sutradhar", "plan", `Intent: ${plan.intent} → calling ${who}`, plan.reasoning || (usedLlm ? "" : "LLM plan failed, used keyword fallback."), { ...plan, planner: usedLlm ? model : "keyword-fallback" }, Date.now() - t0)],
    };
  }

  // ── 3a. Gyani: RAG ─────────────────────────────────────────────────────────────────────────
  async function gyani(s: S): Promise<Partial<S>> {
    const t0 = Date.now();
    const { terms, hits } = retrieve(s.text, 3);
    const trace: TraceEntry[] = [t("gyani", "rag", `Retrieved ${hits.length} of 16 documents`, `Search words: ${terms.slice(0, 8).join(", ")}`, hits.map((h) => ({ id: h.doc.id, title: h.doc.title, score: h.score, matched: h.matched, text: h.doc.text })))];
    if (!hits.length) {
      trace.push(t("gyani", "rag", "Nothing relevant in the company library", "Gyani will say 'I don't know' instead of guessing.", undefined, Date.now() - t0));
      return { findings: { knowledge: { summary: "No relevant company document found." } }, trace };
    }
    const context = hits.map((h) => `[${h.doc.id}] ${h.doc.title}: ${h.doc.text}`).join("\n\n");
    const r = await llm([
      { role: "system", content: "You are Gyani, the knowledge keeper. Answer ONLY from the documents given. Cite document IDs like [KB-05] after each fact. If the documents do not answer, say so. Max 90 words, bullet points." },
      { role: "user", content: `Documents:\n${context}\n\nQuestion: ${s.text}` },
    ], false, 300);
    trace.push(t("gyani", "llm", "Wrote a grounded summary with citations", r.text, { prompt_tokens: r.usage?.prompt_tokens, completion_tokens: r.usage?.completion_tokens }, Date.now() - t0));
    return { findings: { knowledge: { summary: r.text, sources: hits.map((h) => h.doc.id) } }, citations: hits.map((h) => h.doc.id), trace };
  }

  // ── 3b–d. MCP tool agents (no LLM needed: fast, exact, auditable) ──────────────────────────
  const mcpTrace = (agent: AgentId, c: ReturnType<typeof callTool>, title: string, ms?: number) =>
    t(agent, c.error ? "error" : "mcp", c.error ? `Tool error: ${c.error}` : title, `tools/call → ${(c.request.params as { name: string }).name}`, { request: c.request, response: c.response }, ms);

  async function bhandari(s: S): Promise<Partial<S>> {
    const t0 = Date.now(); const p = s.plan!;
    const c = callTool("check_inventory", { sku: p.sku, quantity: p.quantity });
    const d = c.data as { in_stock: number; shortfall: number; weeks_to_produce_shortfall: number } | undefined;
    const title = d ? (d.shortfall ? `${d.in_stock} in stock, ${d.shortfall} to make (~${d.weeks_to_produce_shortfall} wk)` : `All ${p.quantity} pieces in stock`) : "Inventory check";
    return { findings: { inventory: c.data }, trace: [mcpTrace("bhandari", c, title, Date.now() - t0)] };
  }

  async function munim(s: S): Promise<Partial<S>> {
    const t0 = Date.now(); const p = s.plan!;
    const q = callTool("get_price_quote", { sku: p.sku, quantity: p.quantity });
    const qd = q.data as { total_inr: number; unit_price_inr: number; volume_discount_pct: number } | undefined;
    const trace = [mcpTrace("munim", q, qd ? `${inr(qd.total_inr)} total (${qd.volume_discount_pct}% volume discount)` : "Price quote")];
    let fx: unknown = null;
    if (qd) {
      const cur = currencyFor(p.country);
      const c = callTool("convert_currency", { amount_inr: qd.total_inr, currency: cur });
      const cd = c.data as { converted: number; currency: string } | undefined;
      fx = { ...cd, unit_converted: cd ? Math.round((qd.unit_price_inr / (qd.total_inr / cd.converted)) * 100) / 100 : null };
      trace.push(mcpTrace("munim", c, cd ? `≈ ${cd.currency} ${cd.converted.toLocaleString("en-IN")}` : "Currency", Date.now() - t0));
    }
    return { findings: { pricing: { quote: q.data, fx } }, trace };
  }

  async function saarthi(s: S): Promise<Partial<S>> {
    const t0 = Date.now(); const p = s.plan!;
    const c = callTool("estimate_shipping", { sku: p.sku, quantity: p.quantity, country: p.country ?? "USA", ...(p.mode ? { mode: p.mode } : {}) });
    const d = c.data as { mode: string; cost_inr: number; transit_days: number; weight_kg: number } | undefined;
    return { findings: { shipping: c.data }, trace: [mcpTrace("saarthi", c, d ? `${d.mode.toUpperCase()}: ${d.weight_kg} kg, ${inr(d.cost_inr)}, ${d.transit_days} days` : "Shipping", Date.now() - t0)] };
  }

  // ── 4. Niti: deterministic compliance rules ────────────────────────────────────────────────
  async function niti(s: S): Promise<Partial<S>> {
    const t0 = Date.now();
    const p = s.plan!;
    const f = s.findings as { inventory?: { meets_moq: boolean; moq: number; weeks_to_produce_shortfall: number }; pricing?: { quote?: { total_inr: number } }; shipping?: { fragile: boolean } };
    const checks: Check[] = [];
    const needs: string[] = [];
    if (f.inventory) checks.push({ rule: "Minimum order quantity (KB-03)", pass: f.inventory.meets_moq, note: f.inventory.meets_moq ? "Meets MOQ" : `Below MOQ of ${f.inventory.moq} pieces` });
    const total = f.pricing?.quote?.total_inr ?? 0;
    if (f.pricing) {
      const big = total > APPROVAL_THRESHOLD_INR;
      checks.push({ rule: "Order value ≤ ₹5 lakh (KB-16)", pass: !big, note: big ? `${inr(total)} needs founder sign-off` : `${inr(total)} within sales authority` });
      if (big) needs.push(`Order value ${inr(total)} is above ₹5 lakh`);
    }
    if (p.requested_discount != null) {
      const ok = p.requested_discount <= MAX_SALES_DISCOUNT;
      checks.push({ rule: "Discount ≤ 15% (KB-16)", pass: ok, note: ok ? `${p.requested_discount}% is allowed` : `${p.requested_discount}% asked; only the founder can approve above 15%` });
      if (!ok) needs.push(`Buyer asked for ${p.requested_discount}% discount`);
    }
    if (f.shipping?.fragile) checks.push({ rule: "Fragile goods packaging (KB-10)", pass: true, note: "Double-boxed; 2% transit breakage allowance applies" });
    const month = new Date().getMonth() + 1;
    if (f.inventory) {
      const extra = (month >= 7 && month <= 9 ? 2 : 0) + (f.inventory.weeks_to_produce_shortfall ?? 0);
      checks.push({ rule: "Lead time (KB-04)", pass: true, note: `Estimated ${3 + extra}–${5 + extra} weeks after advance${month >= 7 && month <= 9 ? " (monsoon delay included)" : ""}` });
    }
    if (p.intent === "quote") checks.push({ rule: "Export documents (KB-06)", pass: true, note: "Commercial invoice, packing list, certificate of origin, BL/AWB. Zero-rated under GST LUT" });
    const trace = [t("niti", "rule", checks.length ? `${checks.filter((c) => c.pass).length}/${checks.length} rules passed${needs.length ? " · approval needed" : ""}` : "No rules apply to this question", "These checks are plain code, not AI, so they behave the same way every time.", checks, Date.now() - t0)];
    return { checks, needsApproval: needs, citations: checks.length ? ["KB-16"] : [], trace };
  }

  // ── 5. Malik-ji: human-in-the-loop gate ────────────────────────────────────────────────────
  async function malik(s: S): Promise<Partial<S>> {
    if (s.needsApproval?.length) {
      return { status: "draft", trace: [t("malik", "human", "Paused for founder approval", "In production LangGraph's interrupt() pauses the graph here and waits for a human click. The reply is sent as a DRAFT.", { reasons: s.needsApproval, approver: "Meera Rathore (Founder)" })] };
    }
    return { status: "ok", trace: [t("malik", "human", "No approval needed: auto-cleared", "Within the limits the founder has set.")] };
  }

  // ── 6. Sandesh: LLM writer ─────────────────────────────────────────────────────────────────
  async function sandesh(s: S): Promise<Partial<S>> {
    const t0 = Date.now();
    if (s.blocked) {
      const answer = "🛡️ **Dwarpal stopped this message.** It looked like an attempt to override my instructions, so it never reached the AI model.\n\nI'm the export desk assistant for **Rangrez Crafts, Jaipur**. Ask me about products, prices, stock, shipping, payment terms or export documents.";
      return { answer, status: "blocked", trace: [t("sandesh", "info", "Sent a safe refusal (no LLM call)")] };
    }
    const p = s.plan!;
    const sys = `You are Sandesh, the export desk assistant of Rangrez Crafts (Sanganer, Jaipur): hand-block textiles, blue pottery, leheriya, kundan, mojaris, dhurries.
Write the final reply to the buyer in ${p.language}.
RULES:
- Use ONLY the facts in FINDINGS. Never invent prices, stock, dates or policies.
- Cite knowledge documents like [KB-05]. When you use a tool result, mention the tool in backticks once, e.g. (via \`get_price_quote\`).
- For quotes, show a compact markdown table: item, qty, unit price, total INR, total in buyer currency, shipping, transit, lead time.
- ${s.status === "draft" ? 'Start with "📝 **Draft — awaiting founder approval**" and say what needs approval. Do not promise the deal.' : "This reply is cleared to send."}
- If intent is off_topic, politely say you only handle Rangrez Crafts export questions and suggest 2 things you can help with. If greeting, introduce yourself in 2 lines.
- Warm, professional, under 180 words. End with one helpful next-step question.`;
    const findings = { plan: { intent: p.intent, sku: p.sku, product: PRODUCTS.find((x) => x.sku === p.sku)?.name, quantity: p.quantity, country: p.country }, ...s.findings, compliance: s.checks, approval_needed: s.needsApproval };
    const r = await llm([{ role: "system", content: sys }, ...s.history.slice(-4), { role: "user", content: `BUYER MESSAGE: ${s.text}\n\nFINDINGS:\n${JSON.stringify(findings, null, 1)}` }], false, 700);
    return { answer: r.text, status: s.status ?? "ok", trace: [t("sandesh", "llm", "Composed the final reply", `Model ${model} · ${r.usage?.total_tokens ?? "?"} tokens`, { prompt_tokens: r.usage?.prompt_tokens, completion_tokens: r.usage?.completion_tokens }, Date.now() - t0)] };
  }

  // ── Wiring the graph ───────────────────────────────────────────────────────────────────────
  return new StateGraph(State)
    .addNode("dwarpal", dwarpal)
    .addNode("sutradhar", sutradhar)
    .addNode("gyani", gyani)
    .addNode("bhandari", bhandari)
    .addNode("munim", munim)
    .addNode("saarthi", saarthi)
    .addNode("niti", niti)
    .addNode("malik", malik)
    .addNode("sandesh", sandesh)
    .addEdge(START, "dwarpal")
    .addConditionalEdges("dwarpal", (s: S) => (s.blocked ? "sandesh" : "sutradhar"), ["sandesh", "sutradhar"])
    // Parallel fan-out: returning several node names runs them at the same time.
    .addConditionalEdges("sutradhar", (s: S) => (s.plan?.agents.length ? s.plan.agents : ["niti"]), ["gyani", "bhandari", "munim", "saarthi", "niti"])
    .addEdge("gyani", "niti")
    .addEdge("bhandari", "niti")
    .addEdge("munim", "niti")
    .addEdge("saarthi", "niti")
    .addEdge("niti", "malik")
    .addEdge("malik", "sandesh")
    .addEdge("sandesh", END)
    .compile();
}

function heuristicPlan(text: string): Plan {
  const l = text.toLowerCase();
  const qty = Number((l.match(/(\d[\d,]*)\s*(pcs|pieces|units|nos|quilts|vases|sets|pairs|rugs|dupattas|necklaces|tiles)?/) ?? [])[1]?.replace(/,/g, "")) || null;
  const prod = findProduct(l);
  const countries = ["usa", "united states", "uk", "united kingdom", "germany", "france", "netherlands", "italy", "spain", "uae", "dubai", "australia", "canada", "singapore", "japan"];
  const country = countries.find((c) => l.includes(c)) ?? null;
  const disc = Number((l.match(/(\d{1,2})\s*%/) ?? [])[1]) || null;
  const quote = /price|quote|cost|how much|order|buy|rate/.test(l) && !!prod;
  const offTopic = !prod && !/payment|gst|lead|ship|sample|custom|hs code|export|document|care|discount|moq|gi|organic|packag|claim|return|rangrez|craft|textile|pottery/.test(l);
  return {
    intent: quote ? "quote" : offTopic ? (/^(hi|hello|namaste|hey)\b/.test(l) ? "greeting" : "off_topic") : prod ? "product_info" : "policy",
    language: /[ऀ-ॿ]/.test(text) ? "Hindi" : "English",
    sku: prod?.sku ?? null, quantity: qty, country, mode: /\bair\b/.test(l) ? "air" : /\bsea\b/.test(l) ? "sea" : null,
    requested_discount: disc, agents: quote ? ["bhandari", "munim", "saarthi"] : offTopic ? [] : ["gyani"], reasoning: "Keyword fallback plan",
  };
}
