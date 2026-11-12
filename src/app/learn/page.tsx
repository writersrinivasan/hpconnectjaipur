"use client";
import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Section, Title, PlainWords, Pill } from "@/components/ui";

const SWEET = [
  "It happens every day or every week (high volume)",
  "Mostly reading, writing, looking up or copying information",
  "The rules can be written down (even if there are exceptions)",
  "The information already exists somewhere (email, Excel, ERP, PDFs)",
  "A mistake is cheap to catch and fix (a human can review)",
  "Today it waits on one busy person (a bottleneck)",
];

const ROADMAP = [
  { n: "1", k: "Learn", t: "Week 1–2", e: "📖", c: "from-rani to-gulabi", todo: ["Take 'Generative AI for Everyone' (6 hrs, free to audit)", "Read Anthropic's 'Building effective agents'", "Learn 8 words: LLM, prompt, token, RAG, tool, agent, MCP, orchestration"] },
  { n: "2", k: "Play", t: "Week 3–4", e: "🎨", c: "from-kesar to-haldi", todo: ["Use ChatGPT / Claude / Gemini every day for real work", "Upload your SOP PDF and ask questions about it (that's RAG)", "Build one no-code automation in n8n or Zapier"] },
  { n: "3", k: "Prototype", t: "Month 2", e: "🧪", c: "from-firozi to-teal-600", todo: ["Pick ONE use case from the sweet-spot test", "Build one agent with RAG over your real documents", "Test it with 30 real past examples and score it"] },
  { n: "4", k: "Pilot", t: "Month 3", e: "🚦", c: "from-neel to-indigo-500", todo: ["Run it alongside humans, with approval on every output", "Measure time saved, error rate and user happiness", "Add guardrails and logging before giving it more freedom"] },
  { n: "5", k: "Scale", t: "Month 4+", e: "🚀", c: "from-hara to-emerald-500", todo: ["Split into specialist agents with LangGraph", "Connect systems via MCP (ERP, CRM, email)", "Relax approvals only where the data proves it is safe"] },
];

const ROLES: Record<string, { e: string; uses: string[]; first: string; metric: string }> = {
  "Founder / CEO": { e: "👑", uses: ["Inbound lead & inquiry desk (like Rangrez!)", "Board / investor update drafts from your MIS", "Competitor & market news digest every morning"], first: "Write down the 5 tasks that eat most of your team's hours. Run the sweet-spot test on each.", metric: "Hours saved per week · response time to customers" },
  CTO: { e: "🛠️", uses: ["Internal docs Q&A bot (RAG over Confluence / Notion / Drive)", "Support ticket triage + suggested replies", "Expose one internal API as an MCP server"], first: "Clone a LangGraph starter, connect one MCP server, add tracing (LangSmith / Langfuse).", metric: "Eval accuracy · cost per task · latency p95" },
  "COO / Operations": { e: "⚙️", uses: ["Purchase-order and invoice matching", "Vendor follow-up emails for delayed shipments", "Daily production / stock summary on WhatsApp"], first: "Map one process end-to-end on paper: every step, system and decision.", metric: "Cycle time · exceptions per 100 orders" },
  "CFO / Finance": { e: "📊", uses: ["GST notice reader and reply drafter", "Expense policy checker", "Receivables reminder agent with tone control"], first: "List which decisions must ALWAYS stay human. Those become your approval gates.", metric: "Days sales outstanding · hours on reconciliation" },
  "CMO / Sales": { e: "📣", uses: ["Quote / proposal generator from price list", "Lead qualification from website chats", "Multilingual product content (Hindi, Tamil, global)"], first: "Collect your 50 best past proposals. That's your RAG knowledge base.", metric: "Lead response time · proposal turnaround" },
  "CHRO / People": { e: "🤝", uses: ["HR policy Q&A for employees", "Resume screening with fairness checks", "Onboarding buddy agent"], first: "Gather your HR policy PDFs and test a RAG bot with 20 real employee questions.", metric: "HR tickets deflected · time-to-onboard" },
};

type Res = { t: string; by: string; url: string; type: "Course" | "Video" | "Reading" | "Docs" | "Tool"; level: "Leader" | "Builder"; free: boolean; why: string };
const RESOURCES: Res[] = [
  { t: "AI For Everyone", by: "Andrew Ng · Coursera", url: "https://www.coursera.org/learn/ai-for-everyone", type: "Course", level: "Leader", free: true, why: "The best non-technical start. What AI can and can't do for a business." },
  { t: "Generative AI for Everyone", by: "Andrew Ng · Coursera", url: "https://www.coursera.org/learn/generative-ai-for-everyone", type: "Course", level: "Leader", free: true, why: "LLMs, RAG and use-case selection in plain language." },
  { t: "Building effective agents", by: "Anthropic", url: "https://www.anthropic.com/engineering/building-effective-agents", type: "Reading", level: "Leader", free: true, why: "When to use agents vs simple workflows. Short and practical." },
  { t: "A practical guide to building agents", by: "OpenAI (PDF)", url: "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf", type: "Reading", level: "Leader", free: true, why: "Use-case selection, guardrails and human intervention." },
  { t: "Intro to Large Language Models", by: "Andrej Karpathy · YouTube", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", type: "Video", level: "Leader", free: true, why: "One hour that explains how ChatGPT-style models really work." },
  { t: "Neural networks & LLMs, visually", by: "3Blue1Brown", url: "https://www.3blue1brown.com/topics/neural-networks", type: "Video", level: "Leader", free: true, why: "Beautiful animations that build intuition. No maths needed." },
  { t: "Google Prompting Essentials", by: "Google", url: "https://grow.google/prompting-essentials/", type: "Course", level: "Leader", free: false, why: "Get better results from any AI tool in under 10 hours." },
  { t: "The State of AI", by: "McKinsey", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai", type: "Reading", level: "Leader", free: true, why: "How companies are adopting AI, with data to share with your board." },
  { t: "IndiaAI Mission", by: "Government of India", url: "https://indiaai.gov.in", type: "Reading", level: "Leader", free: true, why: "Indian AI programmes, compute access, datasets and start-up support." },
  { t: "Introduction to LangGraph", by: "LangChain Academy", url: "https://academy.langchain.com/courses/intro-to-langgraph", type: "Course", level: "Builder", free: true, why: "The official free course for the orchestration framework used in this app." },
  { t: "LangGraph", by: "LangChain", url: "https://www.langchain.com/langgraph", type: "Docs", level: "Builder", free: true, why: "Docs and examples for Python and JavaScript." },
  { t: "Model Context Protocol", by: "modelcontextprotocol.io", url: "https://modelcontextprotocol.io", type: "Docs", level: "Builder", free: true, why: "The MCP spec, SDKs and a directory of ready-made servers." },
  { t: "AI Agents Course", by: "Hugging Face", url: "https://huggingface.co/learn/agents-course", type: "Course", level: "Builder", free: true, why: "Hands-on, free, with a certificate. Covers several frameworks." },
  { t: "AI Agents for Beginners", by: "Microsoft · GitHub", url: "https://github.com/microsoft/ai-agents-for-beginners", type: "Course", level: "Builder", free: true, why: "A series of lessons with code, from basics to multi-agent." },
  { t: "Short courses on agents, RAG & MCP", by: "DeepLearning.AI", url: "https://www.deeplearning.ai/short-courses/", type: "Course", level: "Builder", free: true, why: "1–2 hour focused courses taught with the tool makers." },
  { t: "Prompt Engineering Guide", by: "DAIR.AI", url: "https://www.promptingguide.ai", type: "Reading", level: "Builder", free: true, why: "Every prompting technique, explained with examples." },
  { t: "Anthropic courses", by: "Anthropic · GitHub", url: "https://github.com/anthropics/courses", type: "Course", level: "Builder", free: true, why: "Prompting, tool use and RAG as notebooks." },
  { t: "Groq Console & Docs", by: "Groq", url: "https://console.groq.com/docs", type: "Tool", level: "Builder", free: true, why: "Get the free API key used in this workshop." },
  { t: "n8n", by: "n8n.io", url: "https://n8n.io", type: "Tool", level: "Leader", free: true, why: "No-code / low-code workflows and AI agents. Good for your first automation." },
  { t: "Agent Development Kit", by: "Google", url: "https://google.github.io/adk-docs/", type: "Docs", level: "Builder", free: true, why: "Google's open-source agent framework, another option to compare." },
  { t: "Langfuse", by: "Langfuse (open source)", url: "https://langfuse.com", type: "Tool", level: "Builder", free: true, why: "Tracing, cost tracking and evaluations for LLM apps." },
  { t: "Next.js Learn", by: "Vercel", url: "https://nextjs.org/learn", type: "Course", level: "Builder", free: true, why: "Build the web front-end for your agents (this app uses it)." },
];

const LANDSCAPE = [
  { k: "No-code builders", e: "🧩", items: ["n8n", "Zapier", "Make", "Flowise", "Langflow"], c: "bg-pink-100 text-pink-800" },
  { k: "Agent frameworks", e: "🎭", items: ["LangGraph", "CrewAI", "Microsoft Agent Framework", "OpenAI Agents SDK", "Claude Agent SDK", "Google ADK", "LlamaIndex"], c: "bg-fuchsia-100 text-fuchsia-800" },
  { k: "LLM providers", e: "🧠", items: ["Groq", "OpenAI", "Anthropic Claude", "Google Gemini", "Meta Llama (open)", "Sarvam AI (Indic)"], c: "bg-amber-100 text-amber-800" },
  { k: "Vector databases (RAG)", e: "🗄️", items: ["pgvector", "Pinecone", "Qdrant", "Chroma", "Weaviate"], c: "bg-indigo-100 text-indigo-800" },
  { k: "Tools & MCP", e: "🔌", items: ["MCP servers: Google Drive, Slack, GitHub, Postgres…", "Custom MCP for Tally / Zoho / SAP"], c: "bg-teal-100 text-teal-800" },
  { k: "Observability & evals", e: "📈", items: ["LangSmith", "Langfuse", "Arize Phoenix", "Promptfoo"], c: "bg-emerald-100 text-emerald-800" },
];

const QUIZ = [
  "We have at least one process that is clearly repetitive and painful",
  "Our key knowledge is written down (SOPs, price lists, policies)",
  "Our data is digital: ERP, CRM, Excel, email, not just paper",
  "A senior leader will own the AI pilot (not 'the IT guy' alone)",
  "We can spend 2–4 weeks testing with real examples",
  "We know which decisions must always stay human",
  "We have thought about customer data privacy (DPDP Act)",
  "We will measure results (time, cost, quality) before scaling",
];

const MYTHS = [
  ["AI will replace my team", "Agents take over the busywork. Your people move to judgement, relationships and exceptions. Rangrez still needs Meera."],
  ["We need a big data-science team", "You need a curious owner, clean documents and one builder. Start with no-code."],
  ["We must train our own model", "Almost never. RAG + tools on an existing model covers 90% of business cases."],
  ["AI is too expensive for an MSME", "A quote like Lena's costs well under ₹1 in LLM tokens on Groq. People cost far more."],
  ["Agents can run fully on autopilot", "Start with a human in the loop. Earn autonomy with data."],
];

const VENDOR_Q = [
  "Which parts are AI and which are plain rules? Show me.",
  "Where is our data stored, and is it used to train your models?",
  "Can we switch the underlying LLM later?",
  "How do we see why the AI gave a particular answer (trace, citations)?",
  "What happens when the AI is unsure? Who gets alerted?",
  "What does it cost per task, not per seat?",
];

export default function Learn() {
  const [ticks, setTicks] = useState<boolean[]>(SWEET.map(() => false));
  const [role, setRole] = useState(Object.keys(ROLES)[0]);
  const [lvl, setLvl] = useState<"All" | "Leader" | "Builder">("All");
  const [typ, setTyp] = useState<"All" | Res["type"]>("All");
  const [quiz, setQuiz] = useState<boolean[]>(QUIZ.map(() => false));
  const [roi, setRoi] = useState({ hours: 20, people: 3, cost: 600, pct: 60 });

  const sweetScore = ticks.filter(Boolean).length;
  const quizScore = quiz.filter(Boolean).length;
  const res = useMemo(() => RESOURCES.filter((r) => (lvl === "All" || r.level === lvl) && (typ === "All" || r.type === typ)), [lvl, typ]);
  const monthlyHours = roi.hours * roi.people * 4.33 * (roi.pct / 100);
  const monthlySaving = monthlyHours * roi.cost;
  const r = ROLES[role];

  return (
    <>
      <div className="hero-bg">
        <Section className="pb-8">
          <Title eyebrow="Chapter 05 · Take home" title={<>Your Agentic AI journey: <span className="text-rainbow">where, how and what</span> to start</>}
            sub="You don't need to become an engineer. You need to pick the right first problem, learn the basics and run one small, safe pilot." />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["#where", "📍", "WHERE to start", "Find the one process worth automating first", "from-rani to-gulabi"],
              ["#how", "🧭", "HOW to start", "A 5-step path from learning to scaling", "from-kesar to-haldi"],
              ["#what", "🎯", "WHAT to start with", "First use cases and resources for your role", "from-firozi to-neel"],
            ].map(([h, e, k, d, c]) => (
              <a key={k} href={h} className={`rounded-3xl p-6 text-white bg-gradient-to-br ${c} shadow-lg hover:-translate-y-1 transition`}>
                <div className="text-5xl">{e}</div><div className="font-display text-3xl font-extrabold mt-2">{k}</div><div className="opacity-90">{d}</div>
              </a>
            ))}
          </div>
        </Section>
      </div>

      {/* WHERE */}
      <Section id="where">
        <Title eyebrow="📍 Where to start" title={<>The <span className="text-rani">sweet-spot test</span> for your first agent</>} sub="Think of one task your team does a lot. Tick every statement that is true for it." />
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 card p-5 space-y-2">
            {SWEET.map((s, i) => (
              <label key={s} className={`flex items-center gap-3 rounded-xl p-3 cursor-pointer border-2 transition ${ticks[i] ? "border-rani bg-pink-50" : "border-transparent hover:bg-pink-50/50"}`}>
                <input type="checkbox" checked={ticks[i]} onChange={() => setTicks(ticks.map((t, j) => (j === i ? !t : t)))} className="w-5 h-5 accent-[#e6007e]" />
                <span>{s}</span>
              </label>
            ))}
          </div>
          <div className={`rounded-3xl p-6 text-white shadow-lg bg-gradient-to-br ${sweetScore >= 5 ? "from-hara to-emerald-500" : sweetScore >= 3 ? "from-kesar to-haldi" : "from-slate-400 to-slate-600"}`}>
            <div className="font-display text-7xl font-extrabold">{sweetScore}/6</div>
            <div className="font-display text-2xl font-bold mt-1">{sweetScore >= 5 ? "🎯 Perfect first agent!" : sweetScore >= 3 ? "👍 Good candidate" : "🤔 Pick another task"}</div>
            <p className="mt-2 opacity-90">{sweetScore >= 5 ? "Start a prototype this month. Keep a human approving every output at first." : sweetScore >= 3 ? "Workable. Write down the missing rules or data first, then pilot with close human review." : "This may be too risky or too rare for a first project. Try something more repetitive."}</p>
            <p className="mt-4 text-sm opacity-80">Rangrez&apos;s buyer-inquiry desk scores 6/6.</p>
          </div>
        </div>
      </Section>

      {/* HOW */}
      <div id="how" className="bg-gradient-to-br from-amber-50 via-pink-50 to-teal-50 border-y border-pink-100">
        <Section>
          <Title eyebrow="🧭 How to start" title={<>Five steps, like climbing to <span className="text-kesar">Nahargarh</span></>} sub="Don't jump to the top. Each step builds confidence, skills and proof for the next one." />
          <div className="grid md:grid-cols-5 gap-4 items-end">
            {ROADMAP.map((s, i) => (
              <div key={s.k} className="card overflow-hidden" style={{ marginTop: `${(4 - i) * 18}px` }}>
                <div className={`bg-gradient-to-br ${s.c} text-white p-4`}>
                  <div className="flex items-center justify-between"><span className="text-3xl">{s.e}</span><span className="font-display text-4xl font-extrabold opacity-60">{s.n}</span></div>
                  <div className="font-display text-2xl font-bold">{s.k}</div><div className="text-sm opacity-90">{s.t}</div>
                </div>
                <ul className="p-4 space-y-2 text-sm">{s.todo.map((t) => <li key={t} className="flex gap-2"><span className="text-rani">✦</span><span>{t}</span></li>)}</ul>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* WHAT */}
      <Section id="what">
        <Title eyebrow="🎯 What to start with" title={<>Your first move, <span className="text-neel">by role</span></>} />
        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(ROLES).map(([k, v]) => <button key={k} onClick={() => setRole(k)} className={`rounded-full px-4 py-2 text-sm font-semibold ${role === k ? "bg-gradient-to-r from-neel to-firozi text-white shadow" : "bg-white border border-indigo-100 text-neel"}`}>{v.e} {k}</button>)}
        </div>
        <div className="grid md:grid-cols-3 gap-5 pop" key={role}>
          <div className="card p-5 md:col-span-2">
            <div className="font-display text-xl font-bold mb-3">{r.e} Three starter agents for a {role}</div>
            <div className="grid sm:grid-cols-3 gap-3">{r.uses.map((u, i) => <div key={u} className="rounded-2xl p-4 text-sm font-medium" style={{ background: ["#fde7f3", "#fff1d6", "#dcf7f7"][i] }}>{u}</div>)}</div>
          </div>
          <div className="space-y-3">
            <div className="card p-4"><div className="text-xs font-bold uppercase text-rani">This week</div><div className="text-sm mt-1">{r.first}</div></div>
            <div className="card p-4"><div className="text-xs font-bold uppercase text-hara">Measure</div><div className="text-sm mt-1">{r.metric}</div></div>
          </div>
        </div>
      </Section>

      {/* RESOURCES */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-pink-50 border-y border-indigo-100">
        <Section id="resources">
          <Title eyebrow="📚 Learning library" title={<>Hand-picked <span className="text-rainbow">learning resources</span></>} sub="Mostly free. 'Leader' = no coding needed. 'Builder' = for your tech team." />
          <div className="flex flex-wrap gap-2 mb-2">
            {(["All", "Leader", "Builder"] as const).map((l) => <button key={l} onClick={() => setLvl(l)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${lvl === l ? "bg-rani text-white" : "bg-white border border-pink-200 text-rani"}`}>{l === "Leader" ? "👔 " : l === "Builder" ? "🛠️ " : ""}{l}</button>)}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {(["All", "Course", "Video", "Reading", "Docs", "Tool"] as const).map((l) => <button key={l} onClick={() => setTyp(l)} className={`rounded-full px-3 py-1 text-xs font-semibold ${typ === l ? "bg-neel text-white" : "bg-white border border-indigo-200 text-neel"}`}>{l}</button>)}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {res.map((x) => (
              <a key={x.url} href={x.url} target="_blank" rel="noreferrer" className="card p-5 hover:-translate-y-1 hover:shadow-xl transition group">
                <div className="flex flex-wrap gap-1.5">
                  <Pill className={x.level === "Leader" ? "bg-pink-100 text-pink-700" : "bg-indigo-100 text-indigo-700"}>{x.level === "Leader" ? "👔 Leader" : "🛠️ Builder"}</Pill>
                  <Pill className="bg-amber-100 text-amber-800">{x.type}</Pill>
                  {x.free && <Pill className="bg-emerald-100 text-emerald-700">Free</Pill>}
                </div>
                <div className="font-display text-lg font-bold mt-2 group-hover:text-rani flex items-start gap-1">{x.t} <ExternalLink size={14} className="mt-1.5 shrink-0 opacity-50" /></div>
                <div className="text-xs text-ink/50">{x.by}</div>
                <p className="text-sm text-ink/70 mt-2">{x.why}</p>
              </a>
            ))}
          </div>
          <p className="text-xs text-ink/50 mt-4">&ldquo;Free&rdquo; means free to start or audit. Some certificates are paid. Check each provider&apos;s current terms.</p>
        </Section>
      </div>

      {/* LANDSCAPE */}
      <Section>
        <Title eyebrow="🗺️ The tool landscape" title="Who's who in the Agentic AI bazaar" sub="You don't need all of these. Most teams start with one model, one framework (or no-code tool) and one vector database." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LANDSCAPE.map((l) => (
            <div key={l.k} className="card p-5">
              <div className="font-display text-lg font-bold">{l.e} {l.k}</div>
              <div className="flex flex-wrap gap-1.5 mt-3">{l.items.map((i) => <span key={i} className={`rounded-full px-2.5 py-1 text-xs font-medium ${l.c}`}>{i}</span>)}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* READINESS + ROI */}
      <div className="bg-gradient-to-br from-pink-100 via-amber-50 to-teal-50 border-y border-pink-100">
        <Section>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="font-display text-2xl font-bold">✅ Is my company AI-ready?</div>
              <p className="text-sm text-ink/60 mb-3">Tick what is true today.</p>
              <div className="space-y-1.5">
                {QUIZ.map((q, i) => (
                  <label key={q} className="flex gap-2 items-start text-sm cursor-pointer">
                    <input type="checkbox" checked={quiz[i]} onChange={() => setQuiz(quiz.map((t, j) => (j === i ? !t : t)))} className="mt-0.5 w-4 h-4 accent-[#16a34a]" />{q}
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden"><div className="h-3 strip-rainbow transition-all" style={{ width: `${(quizScore / QUIZ.length) * 100}%` }} /></div>
                <div className="mt-2 font-semibold">{quizScore}/8: {quizScore >= 7 ? "🚀 Ready to pilot now." : quizScore >= 4 ? "🌱 Nearly there. Fix the unticked items during your first month." : "📖 Start with the Learn and Play steps first."}</div>
              </div>
            </div>
            <div className="card p-6">
              <div className="font-display text-2xl font-bold">🧮 Quick ROI calculator</div>
              <p className="text-sm text-ink/60 mb-3">For one repetitive task.</p>
              {([
                ["hours", "Hours per person per week on this task", 1, 40, 1, ""],
                ["people", "People doing it", 1, 50, 1, ""],
                ["cost", "Cost per hour (₹, salary + overhead)", 200, 3000, 50, "₹"],
                ["pct", "Share an agent can take over", 10, 90, 5, "%"],
              ] as const).map(([k, l, min, max, step, u]) => (
                <div key={k} className="mb-3">
                  <div className="flex justify-between text-sm"><span>{l}</span><b>{u === "₹" ? "₹" : ""}{roi[k]}{u === "%" ? "%" : ""}</b></div>
                  <input type="range" min={min} max={max} step={step} value={roi[k]} onChange={(e) => setRoi({ ...roi, [k]: Number(e.target.value) })} className="w-full accent-[#e6007e]" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="rounded-2xl bg-gradient-to-br from-rani to-kesar text-white p-4"><div className="text-xs opacity-80">Hours freed / month</div><div className="font-display text-3xl font-extrabold">{Math.round(monthlyHours).toLocaleString("en-IN")}</div></div>
                <div className="rounded-2xl bg-gradient-to-br from-firozi to-neel text-white p-4"><div className="text-xs opacity-80">Value / year</div><div className="font-display text-3xl font-extrabold">₹{(monthlySaving * 12 / 100000).toFixed(1)}L</div></div>
              </div>
              <p className="text-xs text-ink/50 mt-2">A rough estimate to start a conversation, not a forecast. Freed hours are usually reinvested in sales and quality, not cut.</p>
            </div>
          </div>
        </Section>
      </div>

      {/* 30-60-90 + MYTHS + VENDOR */}
      <Section>
        <Title eyebrow="📅 Your 90-day plan" title="Leave this room with a plan" center />
        <div className="grid md:grid-cols-3 gap-4">
          {[
            ["Days 1–30", "Discover", "from-rani to-gulabi", ["Sweet-spot test on 5 tasks, pick 1", "Leaders finish one Leader course", "Collect documents & 30 real examples", "Name an owner + a success metric"]],
            ["Days 31–60", "Pilot", "from-kesar to-haldi", ["Build an agent with RAG (or no-code)", "Human approves every output", "Add guardrails + logging", "Weekly review: what went wrong?"]],
            ["Days 61–90", "Measure & scale", "from-firozi to-neel", ["Compare against the baseline metric", "Connect a system via MCP", "Split into specialist agents if needed", "Decide: scale, fix or stop"]],
          ].map(([d, k, c, items]) => (
            <div key={d as string} className="card overflow-hidden">
              <div className={`bg-gradient-to-r ${c} text-white p-4`}><div className="text-sm opacity-90">{d}</div><div className="font-display text-2xl font-bold">{k}</div></div>
              <ul className="p-4 space-y-2 text-sm">{(items as string[]).map((i) => <li key={i} className="flex gap-2"><span>☐</span>{i}</li>)}</ul>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-10">
          <div>
            <div className="font-display text-2xl font-bold mb-3">🧞 Myths vs facts</div>
            <div className="space-y-2">{MYTHS.map(([m, f]) => (
              <div key={m} className="card p-4"><div className="text-sm line-through text-rose-500">{m}</div><div className="text-sm mt-1">✅ {f}</div></div>
            ))}</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold mb-3">🙋 6 questions to ask any AI vendor</div>
            <ol className="space-y-2">{VENDOR_Q.map((q, i) => (
              <li key={q} className="card p-4 flex gap-3 items-start"><span className="w-7 h-7 shrink-0 rounded-full grid place-items-center text-white text-sm font-bold bg-gradient-to-br from-neel to-firozi">{i + 1}</span><span className="text-sm">{q}</span></li>
            ))}</ol>
            <div className="mt-4"><PlainWords title="The one thing to remember">Start <b>small</b>, keep a <b>human in the loop</b>, <b>measure</b> everything, then scale what works. That&apos;s Agentic AI done the Jaipur way: bold colours, careful craftsmanship.</PlainWords></div>
          </div>
        </div>
      </Section>
    </>
  );
}
