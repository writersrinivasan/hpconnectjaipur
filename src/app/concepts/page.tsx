"use client";
import { useEffect, useMemo, useState } from "react";
import { Play, Search } from "lucide-react";
import { retrieve } from "@/lib/knowledge";
import { TOOLS } from "@/lib/mcp/server";
import { Section, Title, PlainWords, Pill } from "@/components/ui";

const GLOSSARY = [
  { e: "🧠", k: "LLM", s: "Large Language Model", d: "A very well-read intern. It has read most of the internet, so it writes and reasons well, but it has never seen your price list.", c: "bg-pink-100 text-pink-700" },
  { e: "✍️", k: "Prompt", s: "Your instruction", d: "The brief you give the intern. A clear brief gets a better result, same as with people.", c: "bg-amber-100 text-amber-700" },
  { e: "🪙", k: "Token", s: "How AI counts words", d: "Roughly ¾ of a word. You pay per token, like paying a courier per kilo.", c: "bg-yellow-100 text-yellow-700" },
  { e: "🌫️", k: "Hallucination", s: "Confident guessing", d: "When the AI makes up a believable answer. RAG and rules are the cure.", c: "bg-rose-100 text-rose-700" },
  { e: "🛠️", k: "Tool", s: "An action the AI can take", d: "Check stock, convert currency, send an email. The AI asks, your code does the work.", c: "bg-teal-100 text-teal-700" },
  { e: "🤖", k: "Agent", s: "LLM + tools + loop", d: "Thinks → uses a tool → looks at the result → decides the next step, until the goal is met.", c: "bg-indigo-100 text-indigo-700" },
  { e: "🧭", k: "Orchestration", s: "Who does what, when", d: "The plan that connects many agents, like a wedding planner who coordinates the caterer, decorator and band.", c: "bg-fuchsia-100 text-fuchsia-700" },
  { e: "🧍", k: "Human-in-the-loop", s: "You stay the boss", d: "Agents pause and ask a person before risky or expensive actions.", c: "bg-emerald-100 text-emerald-700" },
];

const SAMPLE_Q = ["What are your payment terms?", "Is blue pottery GI tagged?", "Do you charge GST on exports?", "How long for a custom block design?", "What if vases break in transit?", "Delivery time during monsoon?"];

const PATTERNS = [
  { k: "Sequential", e: "🚂", an: "Like a train stopping at stations in order: Jaipur → Ajmer → Udaipur.", use: "When each step needs the previous one's output.", lanes: [["Read"], ["Plan"], ["Price"], ["Reply"]] },
  { k: "Parallel fan-out", e: "🍽️", an: "Like a Rajasthani thali kitchen: dal, baati and churma are all cooked at once, then served together.", use: "Independent jobs (stock, price, shipping). Much faster.", lanes: [["Plan"], ["Stock", "Price", "Shipping", "Policy"], ["Combine"]] },
  { k: "Supervisor / router", e: "🎭", an: "Like the kathputli master who pulls only the strings the scene needs.", use: "An LLM decides which specialists to call for each request.", lanes: [["Sutradhar"], ["Gyani?", "Munim?", "Saarthi?"], ["Reply"]] },
  { k: "Human-in-the-loop", e: "✋", an: "Like a cheque above ₹5 lakh: the founder must sign it.", use: "Big money, legal risk, or anything you can't undo.", lanes: [["Agents"], ["Rules"], ["⏸ Founder OK?"], ["Send"]] },
];

const SECTIONS = [["vocab", "AI words"], ["rag", "RAG"], ["mcp", "MCP"], ["orch", "Orchestration"], ["why", "Why multi-agent"]];

export default function Concepts() {
  return (
    <>
      <div className="hero-bg">
        <Section className="pb-6">
          <Title eyebrow="Chapter 02 · The building blocks" title={<>Three ideas that make AI <span className="text-rainbow">actually useful</span> for business</>}
            sub="RAG gives AI your knowledge. MCP gives AI your tools. Orchestration makes many agents work as one team. No coding background needed." />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["📚", "RAG", "Knowledge", "It answers from YOUR documents, not from memory.", "from-indigo-500 to-blue-500"],
              ["🔌", "MCP", "Hands", "It safely uses YOUR systems: ERP, CRM, email.", "from-kesar to-haldi"],
              ["🎭", "Orchestration", "Teamwork", "Many small agents, one reliable workflow.", "from-rani to-fuchsia-500"],
            ].map(([e, k, s, d, c]) => (
              <div key={k} className={`rounded-3xl p-6 text-white bg-gradient-to-br ${c} shadow-lg`}>
                <div className="text-5xl">{e}</div>
                <div className="font-display text-3xl font-extrabold mt-2">{k}</div>
                <div className="font-semibold opacity-90">= the AI&apos;s {s}</div>
                <p className="mt-2 opacity-90">{d}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
      <div className="sticky top-[70px] z-30 bg-white/85 backdrop-blur border-y border-pink-100">
        <div className="mx-auto max-w-7xl px-4 py-2 flex gap-2 overflow-x-auto">
          {SECTIONS.map(([id, l]) => <a key={id} href={`#${id}`} className="shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold bg-pink-50 text-rani hover:bg-rani hover:text-white">{l}</a>)}
        </div>
      </div>

      <Section id="vocab">
        <Title eyebrow="2.1 · Vocabulary" title="AI words in 60 seconds" sub="Eight words you will hear in every AI meeting, explained with everyday examples." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GLOSSARY.map((g) => (
            <div key={g.k} className="card p-5">
              <div className="flex items-center gap-3"><span className={`text-2xl w-11 h-11 rounded-xl grid place-items-center ${g.c}`}>{g.e}</span>
                <div><div className="font-display text-xl font-bold leading-none">{g.k}</div><div className="text-xs text-ink/50">{g.s}</div></div></div>
              <p className="text-sm text-ink/75 mt-3">{g.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <RagSection />
      <McpSection />
      <OrchSection />

      <Section id="why">
        <Title eyebrow="2.5 · Why many agents?" title={<>One big bot vs <span className="text-rani">a team of specialists</span></>} />
        <div className="overflow-x-auto card">
          <table className="w-full text-sm">
            <thead><tr className="bg-gradient-to-r from-pink-50 to-amber-50 text-left">
              <th className="p-3">Question a CXO asks</th><th className="p-3">🐘 One giant agent</th><th className="p-3">🐝 Multi-agent team</th></tr></thead>
            <tbody className="divide-y divide-pink-100">
              {[
                ["Can I trust the numbers?", "It may compute prices in its head and get them wrong", "Prices come from your pricing system through MCP, exactly"],
                ["What happens when it fails?", "Hard to know which part went wrong", "You can see which agent failed and fix only that one"],
                ["Is it fast?", "Does every step one after another", "Stock, price and shipping run in parallel"],
                ["What does it cost?", "Large model for every step", "Code for tools and rules; LLM only where language is needed"],
                ["Who is accountable?", "Black box", "Every step is logged with sources, and a human approves big decisions"],
              ].map((r) => <tr key={r[0]}><td className="p-3 font-semibold">{r[0]}</td><td className="p-3 text-rose-700">{r[1]}</td><td className="p-3 text-emerald-700">{r[2]}</td></tr>)}
            </tbody>
          </table>
        </div>
        <div className="mt-5"><PlainWords title="The key idea for leaders">Use the <b>LLM for language and judgement</b>. Use <b>plain code for maths, rules and data</b>. Keep a <b>human for decisions that matter</b>. This app does all three, and you can watch each one happen on the Live AI Desk.</PlainWords></div>
      </Section>
    </>
  );
}

function RagSection() {
  const [q, setQ] = useState(SAMPLE_Q[0]);
  const { terms, hits } = useMemo(() => retrieve(q, 3), [q]);
  return (
    <div id="rag" className="bg-gradient-to-br from-indigo-50 via-white to-sky-50 border-y border-indigo-100">
      <Section>
        <Title eyebrow="2.2 · RAG = Retrieval-Augmented Generation" title={<>Give the AI <span className="text-neel">your bahi-khata</span></>}
          sub="Ask a new munim a question without the ledger and he will guess. Hand him the ledger and he will find the right page and read it out. RAG hands the AI your ledger." />
        <div className="grid md:grid-cols-5 gap-3 mb-8">
          {[
            ["1", "📄", "Collect", "Policies, price lists, SOPs, contracts"],
            ["2", "✂️", "Chunk", "Split into small paragraphs"],
            ["3", "🔍", "Retrieve", "Find the 3 most relevant pieces"],
            ["4", "📎", "Augment", "Attach them to the question"],
            ["5", "✍️", "Generate", "LLM answers only from them, with citations"],
          ].map(([n, e, k, d], i) => (
            <div key={k} className="card p-4 relative">
              <div className="absolute -top-3 -left-2 w-8 h-8 rounded-full text-white grid place-items-center font-bold text-sm" style={{ background: ["#4f46e5", "#7c3aed", "#c026d3", "#db2777", "#ea580c"][i] }}>{n}</div>
              <div className="text-3xl">{e}</div><div className="font-display text-lg font-bold">{k}</div><div className="text-xs text-ink/60">{d}</div>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <div className="font-display text-xl font-bold mb-1">🔬 Try it: search Rangrez Crafts&apos; 16 documents</div>
          <p className="text-sm text-ink/60 mb-3">This runs the same retrieval step the Gyani agent uses. Notice that it finds the right policy even when your words differ.</p>
          <div className="flex gap-2 items-center rounded-full border-2 border-indigo-200 bg-white px-4 py-2">
            <Search size={18} className="text-indigo-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 outline-none bg-transparent" placeholder="Ask anything about the business…" />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {SAMPLE_Q.map((s) => <button key={s} onClick={() => setQ(s)} className="text-xs rounded-full px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100">{s}</button>)}
          </div>
          <div className="mt-4 text-xs text-ink/60">Search words (after removing filler words and adding synonyms): {terms.map((t) => <code key={t} className="mx-0.5 bg-amber-100 rounded px-1">{t}</code>)}</div>
          <div className="grid lg:grid-cols-2 gap-5 mt-4">
            <div className="space-y-3">
              {hits.length === 0 && <div className="text-sm text-rose-600">No document matched. A good RAG system then says &ldquo;I don&apos;t know&rdquo; instead of guessing.</div>}
              {hits.map((h, i) => (
                <div key={h.doc.id} className="rounded-2xl border border-indigo-100 bg-white p-4 pop">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Pill className="bg-neel text-white">#{i + 1} · {h.doc.id}</Pill>
                    <span className="font-semibold">{h.doc.title}</span>
                    <span className="ml-auto text-xs font-mono text-indigo-600">score {h.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-indigo-50 mt-2"><div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-rani" style={{ width: `${Math.min(100, (h.score / (hits[0]?.score || 1)) * 100)}%` }} /></div>
                  <p className="text-sm text-ink/70 mt-2">{h.doc.text}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">What the LLM actually receives (augmented prompt)</div>
              <pre className="code whitespace-pre-wrap">{`SYSTEM: Answer ONLY from the documents below.
Cite IDs like [KB-05]. If they don't answer, say so.

DOCUMENTS:
${hits.map((h) => `[${h.doc.id}] ${h.doc.title}: ${h.doc.text.slice(0, 140)}…`).join("\n\n") || "(none found)"}

QUESTION: ${q}`}</pre>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          <PlainWords>RAG is like an <b>open-book exam</b>. The AI doesn&apos;t need to memorise your business; it looks it up every time. Change a policy document today and the AI uses the new rule today. No retraining needed.</PlainWords>
          <PlainWords title="Behind the scenes">Production systems turn text into <b>embeddings</b> (numbers that capture meaning) and store them in a <b>vector database</b> such as pgvector, Pinecone or Chroma. This demo uses <b>BM25 keyword search</b> so it runs with no extra keys. The steps are the same.</PlainWords>
        </div>
      </Section>
    </div>
  );
}

function McpSection() {
  const [tool, setTool] = useState(TOOLS[1].name);
  const def = TOOLS.find((t) => t.name === tool)!;
  const defaults: Record<string, Record<string, unknown>> = {
    search_catalog: { query: "blue pottery" },
    check_inventory: { sku: "SNG-QLT-01", quantity: 600 },
    get_price_quote: { sku: "SNG-QLT-01", quantity: 300 },
    convert_currency: { amount_inr: 883200, currency: "EUR" },
    estimate_shipping: { sku: "SNG-QLT-01", quantity: 300, country: "Germany", mode: "sea" },
  };
  const [args, setArgs] = useState(JSON.stringify(defaults[tool], null, 2));
  const [resp, setResp] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const pick = (name: string) => { setTool(name); setArgs(JSON.stringify(defaults[name], null, 2)); setResp(""); };
  let parsed: unknown = null; try { parsed = JSON.parse(args); } catch {}
  const request = { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: tool, arguments: parsed ?? "⚠ invalid JSON" } };
  async function run() {
    setBusy(true);
    try {
      const r = await fetch("/api/mcp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(request) });
      setResp(JSON.stringify(await r.json(), null, 2));
    } catch (e) { setResp(String(e)); }
    setBusy(false);
  }
  return (
    <Section id="mcp">
      <Title eyebrow="2.3 · MCP = Model Context Protocol" title={<>MCP is the <span className="text-kesar">UPI of AI tools</span></>}
        sub="Before UPI, every bank needed its own deal with every app. UPI gave everyone one standard, and now any app talks to any bank. MCP does the same for AI: build a connector to your ERP once, and any AI model or agent can use it." />
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <NxM title="Without MCP: 3 AI apps × 4 systems = 12 custom integrations" mesh />
        <NxM title="With MCP: 3 + 4 = 7 plugs into one standard" />
      </div>
      <div className="card p-5">
        <div className="font-display text-xl font-bold">🔌 Live MCP playground: Rangrez ERP server</div>
        <p className="text-sm text-ink/60">Pick a tool and press Call. You&apos;ll see the exact JSON-RPC message an agent sends, and what the server sends back.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {TOOLS.map((t) => (
            <button key={t.name} onClick={() => pick(t.name)} className={`rounded-full px-3 py-1.5 text-sm font-semibold border ${tool === t.name ? "bg-gradient-to-r from-kesar to-haldi text-ink border-transparent" : "bg-white border-amber-200 text-amber-800"}`}>{t.title}</button>
          ))}
        </div>
        <div className="mt-3 text-sm"><b>{def.name}</b>: {def.description} <Pill className="bg-amber-100 text-amber-800 ml-1">connects to: {def.system}</Pill></div>
        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <div>
            <div className="text-xs font-bold uppercase text-kesar mb-1">1 · Arguments (edit me)</div>
            <textarea value={args} onChange={(e) => setArgs(e.target.value)} rows={8} className="w-full font-mono text-xs rounded-xl border-2 border-amber-200 p-3 bg-amber-50/40 outline-none" />
            <button onClick={run} disabled={busy || !parsed} className="mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2 font-semibold text-white bg-gradient-to-r from-kesar to-rani disabled:opacity-50"><Play size={16} /> {busy ? "Calling…" : "Call tool"}</button>
          </div>
          <div><div className="text-xs font-bold uppercase text-kesar mb-1">2 · Request (agent → server)</div><pre className="code h-[260px]">{JSON.stringify(request, null, 2)}</pre></div>
          <div><div className="text-xs font-bold uppercase text-kesar mb-1">3 · Response (server → agent)</div><pre className="code h-[260px]">{resp || "// press 'Call tool'"}</pre></div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-5">
        <PlainWords title="Why CXOs should care">Write each integration <b>once</b> and reuse it with every AI vendor. No lock-in to one model.</PlainWords>
        <PlainWords title="Safety">The server decides what the AI may do. Here the agents can <b>read</b> stock and prices but cannot change them.</PlainWords>
        <PlainWords title="Where it comes from">MCP is an open standard introduced by Anthropic in 2024 and now supported by most AI platforms and IDEs. See modelcontextprotocol.io.</PlainWords>
      </div>
    </Section>
  );
}

function NxM({ title, mesh }: { title: string; mesh?: boolean }) {
  const L = ["🤖", "💬", "🧑‍💻"], R = ["🏭 ERP", "📇 CRM", "📧 Email", "🚚 Freight"];
  return (
    <div className="card p-4">
      <div className={`text-sm font-semibold mb-2 ${mesh ? "text-rose-600" : "text-emerald-600"}`}>{title}</div>
      <svg viewBox="0 0 320 170" className="w-full">
        {L.map((_, i) => R.map((__, j) => mesh
          ? <line key={`${i}${j}`} x1="40" y1={30 + i * 55} x2="270" y2={20 + j * 42} stroke="#e11d48" strokeOpacity=".45" strokeWidth="1.5" />
          : null))}
        {!mesh && <>
          {L.map((_, i) => <line key={i} x1="40" y1={30 + i * 55} x2="160" y2="85" stroke="#16a34a" strokeWidth="2" className="flow" />)}
          {R.map((_, j) => <line key={j} x1="160" y1="85" x2="270" y2={20 + j * 42} stroke="#16a34a" strokeWidth="2" className="flow" />)}
          <rect x="128" y="66" width="64" height="38" rx="10" fill="#ff7a00" /><text x="160" y="90" textAnchor="middle" fill="white" fontWeight="700" fontSize="14">MCP</text>
        </>}
        {L.map((e, i) => <g key={e}><circle cx="30" cy={30 + i * 55} r="18" fill="#fde7f3" /><text x="30" y={36 + i * 55} textAnchor="middle" fontSize="16">{e}</text></g>)}
        {R.map((e, j) => <g key={e}><rect x="252" y={8 + j * 42} width="66" height="26" rx="8" fill="#e0f7f7" /><text x="285" y={25 + j * 42} textAnchor="middle" fontSize="10">{e}</text></g>)}
      </svg>
    </div>
  );
}

function OrchSection() {
  const [pi, setPi] = useState(1);
  const [step, setStep] = useState(-1);
  const p = PATTERNS[pi];
  useEffect(() => {
    let s = -1;
    const id = setInterval(() => { s = s + 1 > p.lanes.length ? -1 : s + 1; setStep(s); }, 900);
    return () => clearInterval(id);
  }, [pi, p.lanes.length]);
  return (
    <div id="orch" className="bg-gradient-to-br from-fuchsia-50 via-pink-50 to-amber-50 border-y border-pink-100">
      <Section>
        <Title eyebrow="2.4 · Orchestration with LangGraph" title={<>The <span className="text-rani">kathputli master</span> behind the agents</>}
          sub="Orchestration decides which agent works, in what order, with what information, and when to stop and ask a human. LangGraph draws this as a graph: boxes (agents) connected by arrows (rules)." />
        <div className="flex flex-wrap gap-2 mb-5">
          {PATTERNS.map((x, i) => <button key={x.k} onClick={() => { setPi(i); setStep(-1); }} className={`rounded-full px-4 py-2 font-semibold text-sm ${pi === i ? "bg-gradient-to-r from-rani to-fuchsia-600 text-white shadow" : "bg-white text-rani border border-pink-200"}`}>{x.e} {x.k}</button>)}
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card p-6">
            <div className="font-display text-2xl font-bold">{p.e} {p.k}</div>
            <p className="italic text-ink/70 mt-1">{p.an}</p>
            <p className="mt-2 text-sm"><b>Use it when:</b> {p.use}</p>
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
              {p.lanes.map((lane, li) => (
                <div key={li} className="flex items-center gap-2">
                  <div className="flex flex-col gap-2">
                    {lane.map((n) => (
                      <div key={n} className={`rounded-xl px-3 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${step === li ? "bg-gradient-to-r from-rani to-kesar text-white scale-110 pulse-ring" : step > li ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-ink/50"}`}>{step > li ? "✓ " : ""}{n}</div>
                    ))}
                  </div>
                  {li < p.lanes.length - 1 && <span className="text-2xl text-rani/60">→</span>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-rani mb-1">What this looks like in LangGraph (from this app)</div>
            <pre className="code">{`const graph = new StateGraph(State)
  .addNode("dwarpal",   guardrails)   // 🛡️ check input
  .addNode("sutradhar", planner)      // 🎭 LLM decides
  .addNode("gyani",     ragAgent)     // 📚 RAG
  .addNode("bhandari",  stockAgent)   // 📦 MCP
  .addNode("munim",     priceAgent)   // 💰 MCP
  .addNode("saarthi",   shipAgent)    // 🐪 MCP
  .addNode("niti",      rules)        // ⚖️ code rules
  .addNode("malik",     approval)     // ✋ human gate
  .addNode("sandesh",   writer)       // ✉️ final reply
  .addEdge(START, "dwarpal")
  // Router: returning several names = run in PARALLEL
  .addConditionalEdges("sutradhar",
     (s) => s.plan.agents)            // e.g. ["munim","saarthi"]
  .addEdge("munim", "niti")           // fan-in
  .addEdge("niti", "malik")
  .addEdge("malik", "sandesh")
  .compile();`}</pre>
          </div>
        </div>
        <div className="mt-5"><PlainWords>Think of <b>state</b> as a shared file that travels from desk to desk. Every agent reads it, adds its findings and passes it on. LangGraph manages the file, the order and the pauses. You can restart from any point, which matters when a human approval takes a day.</PlainWords></div>
      </Section>
    </div>
  );
}

