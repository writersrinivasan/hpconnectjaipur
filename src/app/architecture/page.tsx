import Link from "next/link";
import { Section, Title, PlainWords, Pill } from "@/components/ui";

const LAYERS = [
  { k: "Experience layer", e: "🖥️", d: "Next.js web app: chat, live graph, trace viewer", tech: "Next.js 16 · React 19 · Tailwind", c: "from-rani to-gulabi" },
  { k: "API layer", e: "🚪", d: "Receives the message and streams each agent's progress back live", tech: "Route Handler /api/chat · NDJSON streaming", c: "from-fuchsia-500 to-purple-500" },
  { k: "Orchestration layer", e: "🎭", d: "Decides order, parallelism, shared state and approval pauses", tech: "LangGraph StateGraph · conditional edges · fan-out/fan-in", c: "from-indigo-500 to-blue-500" },
  { k: "Agent layer", e: "👥", d: "9 focused agents, each doing one job well", tech: "Guardrail · Planner · RAG · 3 tool agents · Rules · Human gate · Writer", c: "from-sky-500 to-cyan-500" },
  { k: "Knowledge (RAG) + Tools (MCP)", e: "📚🔌", d: "Company documents for facts; ERP, pricing, FX and freight systems for live data", tech: "BM25 retriever · JSON-RPC MCP server (tools/list, tools/call)", c: "from-teal-500 to-emerald-500" },
  { k: "Model layer", e: "🧠", d: "The LLM that understands and writes language. Swappable.", tech: "Groq · Llama 3.3 70B / GPT-OSS (BYOK)", c: "from-amber-500 to-orange-500" },
];

const LIFECYCLE = [
  ["🧑", "Buyer sends a message", "Browser → /api/chat with the Groq key in a header"],
  ["🛡️", "Dwarpal checks it", "Masks PII, blocks prompt injection. Plain code, ~1 ms"],
  ["🎭", "Sutradhar plans", "LLM returns JSON: intent, product, quantity, country, which agents"],
  ["⚡", "Fan-out", "LangGraph runs the chosen specialists at the same time"],
  ["📚", "Gyani (RAG)", "Finds the top 3 documents and writes a summary with citations"],
  ["🔌", "Bhandari · Munim · Saarthi (MCP)", "tools/call to inventory, pricing, FX and freight. Exact numbers, no AI maths"],
  ["⚖️", "Niti checks rules", "MOQ, discount ≤ 15%, order ≤ ₹5 lakh, lead time, documents"],
  ["✋", "Malik-ji gate", "If a rule needs a human, the reply becomes a DRAFT for the founder"],
  ["✉️", "Sandesh writes", "LLM composes the reply in the buyer's language from the findings only"],
  ["📡", "Streamed back", "Each step appears live in the trace panel, so everything is auditable"],
];

const TRUST = [
  { e: "🛡️", k: "Input guardrails", d: "PII masking (card, Aadhaar, phone, email) and prompt-injection blocking before the LLM sees anything.", who: "Dwarpal" },
  { e: "🎯", k: "Scope control", d: "The planner labels off-topic requests, and the assistant politely stays on business topics.", who: "Sutradhar" },
  { e: "📎", k: "Grounding & citations", d: "Facts come only from retrieved documents and tool results, and every claim cites its source.", who: "Gyani · Sandesh" },
  { e: "🧮", k: "No AI arithmetic", d: "Prices, discounts, FX and freight are computed by code through MCP, never 'estimated' by the LLM.", who: "Munim · Saarthi" },
  { e: "⚖️", k: "Deterministic rules", d: "Business policies run as code, so they give the same result every time and can be tested.", who: "Niti" },
  { e: "✋", k: "Human-in-the-loop", d: "High-value or unusual decisions pause for the founder. AI drafts, a human decides.", who: "Malik-ji" },
  { e: "📜", k: "Full audit trail", d: "Every step is logged: plan, documents, tool requests and responses, rule results.", who: "All agents" },
  { e: "🔑", k: "BYOK & least privilege", d: "Your key stays in your browser. The MCP tools are read-only and cannot change stock or prices.", who: "Platform" },
];

const RISKS = [
  ["Hallucinated price or policy", "RAG citations + MCP tools for numbers + writer told to use findings only"],
  ["Prompt injection ('ignore your rules…')", "Input guardrail blocks it before any LLM call"],
  ["Leaking customer data", "PII masking + minimum data sent to the model + no key/data storage"],
  ["Agent gives away too much discount", "Hard-coded 15% limit + founder approval above it"],
  ["Model provider outage or price change", "Model layer is swappable; MCP and RAG don't depend on one vendor"],
  ["'Why did the AI say that?'", "Step-by-step trace with sources for every reply"],
];

const PROD = [
  ["Vector database", "pgvector, Pinecone, Qdrant or Chroma with embeddings for semantic search over thousands of docs"],
  ["Durable checkpointer", "LangGraph Postgres checkpointer so interrupt() can pause for hours and resume"],
  ["Observability", "LangSmith or Langfuse for traces, cost and latency per agent"],
  ["Evaluations", "A test set of 50–100 real buyer emails, scored on every change"],
  ["Auth & roles", "Who can approve, who can see prices: SSO + role-based access"],
  ["Data protection", "Align with India's DPDP Act 2023: consent, purpose limitation, data residency"],
  ["Real MCP servers", "Connect Tally / Zoho / SAP / Shopify via official or custom MCP servers"],
  ["Cost controls", "Small models for routing, large ones for writing; caching; rate limits"],
];

export default function Architecture() {
  return (
    <>
      <div className="hero-bg">
        <Section className="pb-8">
          <Title eyebrow="Chapter 04 · Architecture & Trust" title={<>How it&apos;s <span className="text-neel">wired</span>, and why you can <span className="text-rani">trust it</span></>}
            sub="An Agentic AI system is a stack of layers, like a Jaipur haveli: a strong foundation (models), rooms with a purpose (agents), corridors that connect them (orchestration) and guards at every door (guardrails)." />
        </Section>
      </div>

      <Section className="pt-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-2">
            {LAYERS.map((l, i) => (
              <div key={l.k} className="flex items-stretch gap-3" style={{ marginLeft: `${i * 10}px`, marginRight: `${i * 10}px` }}>
                <div className={`w-14 shrink-0 rounded-2xl bg-gradient-to-br ${l.c} grid place-items-center text-2xl text-white shadow`}>{l.e}</div>
                <div className="card flex-1 p-4">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-display text-lg font-bold">{l.k}</span><Pill className="bg-slate-100 text-ink/70 font-mono">{l.tech}</Pill></div>
                  <div className="text-sm text-ink/70">{l.d}</div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 text-white text-center font-semibold py-2.5 shadow">🛡️ Guardrails · 📜 Audit trail · ✋ Human approval: across every layer</div>
          </div>
          <div className="space-y-4">
            <PlainWords title="Why layers matter to a CEO">Each layer can be <b>replaced independently</b>. Change the model from Llama to Claude or GPT without touching your agents. Add a new MCP tool without retraining anything. That keeps you flexible and avoids vendor lock-in.</PlainWords>
            <div className="card p-4">
              <div className="font-display text-lg font-bold mb-2">🔑 How BYOK works</div>
              <div className="flex items-center justify-between text-center text-xs gap-1">
                {[["💻", "Your browser", "key in localStorage"], ["→", "", ""], ["⚙️", "App server", "uses it for 1 request"], ["→", "", ""], ["⚡", "Groq", "bills your account"]].map(([e, k, d], i) =>
                  k ? <div key={i} className="flex-1 rounded-xl bg-amber-50 p-2"><div className="text-2xl">{e}</div><div className="font-semibold">{k}</div><div className="text-ink/50">{d}</div></div> : <div key={i} className="text-rani text-xl font-bold">{e}</div>)}
              </div>
              <p className="text-xs text-ink/60 mt-2">Bring Your Own Key means each participant uses their own free Groq account. The app owner pays nothing and stores no secrets.</p>
            </div>
          </div>
        </div>
      </Section>

      <div className="bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50 border-y border-pink-100">
        <Section>
          <Title eyebrow="Request lifecycle" title="One message, ten steps, about five seconds" />
          <ol className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
            {LIFECYCLE.map(([e, k, d], i) => (
              <li key={k} className="card p-4 relative">
                <span className="absolute top-2 right-3 font-display text-3xl font-extrabold text-pink-100">{i + 1}</span>
                <div className="text-2xl">{e}</div>
                <div className="font-semibold mt-1">{k}</div>
                <div className="text-xs text-ink/60 mt-1">{d}</div>
              </li>
            ))}
          </ol>
          <div className="mt-6 text-center"><Link href="/assistant" className="inline-flex rounded-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-rani to-kesar shadow">See it happen live →</Link></div>
        </Section>
      </div>

      <Section>
        <Title eyebrow="Trust & safety" title={<>Eight locks on the <span className="text-hara">treasury door</span></>} sub="Leaders don't need AI that is clever. They need AI that is predictable, explainable and safe. Here is how each risk is handled." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST.map((t) => (
            <div key={t.k} className="card p-5">
              <div className="text-3xl">{t.e}</div>
              <div className="font-display text-lg font-bold mt-1">{t.k}</div>
              <p className="text-sm text-ink/70 mt-1">{t.d}</p>
              <Pill className="mt-3 bg-emerald-50 text-emerald-700">{t.who}</Pill>
            </div>
          ))}
        </div>
        <div className="card mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gradient-to-r from-rose-50 to-emerald-50 text-left"><th className="p-3">⚠️ What could go wrong</th><th className="p-3">✅ How this design prevents it</th></tr></thead>
            <tbody className="divide-y divide-pink-50">{RISKS.map(([r, m]) => <tr key={r}><td className="p-3 font-medium text-rose-700">{r}</td><td className="p-3 text-emerald-800">{m}</td></tr>)}</tbody>
          </table>
        </div>
      </Section>

      <div className="bg-ink text-white">
        <Section>
          <div className="mb-6"><div className="uppercase tracking-[0.2em] text-xs font-bold text-haldi">For CTOs</div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-1">From demo to production: <span className="text-gulabi">what to add</span></h2></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROD.map(([k, d], i) => (
              <div key={k} className="rounded-2xl border border-white/10 p-4" style={{ background: `linear-gradient(135deg, ${["#e6007e", "#ff7a00", "#00b3b3", "#2e3192"][i % 4]}40, transparent)` }}>
                <div className="font-semibold text-haldi">{k}</div><div className="text-sm text-pink-50/80 mt-1">{d}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid lg:grid-cols-2 gap-5">
            <div>
              <div className="text-xs font-bold uppercase text-haldi mb-1">Code map of this app</div>
              <pre className="code">{`src/
├─ app/
│  ├─ api/chat/route.ts     ← streams LangGraph events (NDJSON)
│  ├─ api/mcp/route.ts      ← MCP JSON-RPC endpoint
│  ├─ api/models/route.ts   ← validates BYOK key
│  └─ assistant/page.tsx    ← chat + live graph + trace
└─ lib/
   ├─ agents/graph.ts       ← 9-node LangGraph StateGraph
   ├─ agents/meta.ts        ← agent cast & event types
   ├─ knowledge.ts          ← 16 docs + BM25 retriever (RAG)
   ├─ mcp/server.ts         ← 5 MCP tools + client
   ├─ catalog.ts            ← demo ERP data
   └─ groq.ts               ← Groq chat client (BYOK)`}</pre>
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-haldi mb-1">Shared state: the &ldquo;file&rdquo; that travels desk to desk</div>
              <pre className="code">{`const State = Annotation.Root({
  question:  Annotation<string>,
  plan:      Annotation<Plan | null>,
  // parallel agents MERGE their findings
  findings:  Annotation<Record<string, unknown>>({
    reducer: (a, b) => ({ ...a, ...b }),
  }),
  citations: Annotation<string[]>({ reducer: concat }),
  checks:    Annotation<Check[]>,
  status:    Annotation<"ok" | "blocked" | "draft">,
  answer:    Annotation<string>,
  trace:     Annotation<TraceEntry[]>({ reducer: concat }),
});`}</pre>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
