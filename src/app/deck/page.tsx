/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import Link from "next/link";
import { AGENTS } from "@/lib/agents/meta";
import { Mandala } from "@/components/ui";
import { DECK_PDF } from "@/lib/deck";

export const metadata = { title: "RangSutra Deck · HP Connect Jaipur · Srinivasan Ramanujam" };

const TOTAL = 10;

function Logo({ className = "h-8" }: { className?: string }) {
  return <span className="inline-flex items-center rounded-xl bg-white px-2.5 py-1 shadow-sm"><img src="/brand/oneyoto-logo.png" alt="One Yoto" className={className} /></span>;
}

function Frame({ n, kicker, title, children, sub }: { n: number; kicker: string; title: ReactNode; sub?: ReactNode; children: ReactNode }) {
  return (
    <section className="slide">
      <div className="dots" />
      <div className="absolute inset-x-0 top-0 h-2 strip-rainbow" />
      <div className="relative h-full flex flex-col px-14 pt-10 pb-0">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="uppercase tracking-[0.25em] text-[11px] font-bold text-rani">{kicker}</div>
            <h2 className="font-display text-[40px] leading-[1.05] font-extrabold mt-1">{title}</h2>
            {sub && <p className="text-[15px] text-ink/65 mt-1.5 max-w-4xl">{sub}</p>}
          </div>
          <Logo className="h-7" />
        </div>
        <div className="flex-1 mt-5 min-h-0">{children}</div>
        <div className="h-11 -mx-14 px-14 mt-3 flex items-center justify-between text-[11px] bg-ink text-pink-100">
          <span><b className="text-white">RangSutra</b> · Agentic AI for Founders &amp; CXOs · HP Connect Jaipur · November 2026</span>
          <span className="flex items-center gap-4"><span>Srinivasan Ramanujam · One Yoto · <span className="text-haldi">Ideas move faster</span></span><span className="font-mono text-white">{String(n).padStart(2, "0")} / {TOTAL}</span></span>
        </div>
      </div>
    </section>
  );
}

const Chip = ({ children, c = "bg-pink-100 text-pink-800" }: { children: ReactNode; c?: string }) => <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${c}`}>{children}</span>;

export default function Deck() {
  return (
    <div className="deck-wrap">
      <div className="deck-toolbar sticky top-0 z-50 mb-6 flex items-center justify-center gap-3 py-3 bg-ink/90 backdrop-blur">
        <Link href="/" className="rounded-full px-4 py-2 text-sm font-semibold text-white border border-white/20 hover:bg-white/10">← Back to app</Link>
        <a href={DECK_PDF} download className="rounded-full px-5 py-2 text-sm font-bold text-ink bg-gradient-to-r from-haldi to-kesar shadow">⬇ Download PDF (10 pages)</a>
        <Link href="/present" className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-rani hover:opacity-90">▶ Present mode</Link>
      </div>

      {/* 1 · COVER */}
      <section className="slide hero-bg">
        <div className="dots" />
        <div className="absolute inset-x-0 top-0 h-2.5 strip-rainbow" />
        <Mandala className="absolute -right-36 -top-40 w-[640px] h-[640px] opacity-35" />
        <Mandala className="absolute -left-40 -bottom-56 w-[420px] h-[420px] opacity-20" />
        <div className="relative h-full px-16 pt-14 pb-10 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/85 border border-pink-200 px-4 py-1.5 text-sm font-semibold text-rani">🌸 HP Connect · Jaipur Edition · November 2026</span>
          </div>
          <div className="mt-8 max-w-[760px]">
            <div className="font-display text-[26px] font-extrabold"><span className="text-rani">Rang</span><span className="text-neel">Sutra</span> 🪡</div>
            <h1 className="font-display text-[66px] leading-[1.02] font-extrabold mt-1">Agentic AI, explained in the <span className="text-rainbow">colours of Jaipur</span></h1>
            <p className="text-[19px] text-ink/75 mt-4">A hands-on multi-agent app that shows <b>LangGraph orchestration</b>, <b>RAG</b> and <b>MCP</b> at work in a Jaipur handicraft export house. Built for founders, CEOs, CTOs and CXOs.</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {[["9 AI agents", "bg-rani text-white"], ["5 MCP tools", "bg-kesar text-white"], ["16 docs via RAG", "bg-firozi text-white"], ["1 founder in charge", "bg-neel text-white"], ["Bring your own Groq key", "bg-haldi text-ink"]].map(([t, c]) => <span key={t} className={`rounded-full px-3.5 py-1 text-sm font-bold ${c}`}>{t}</span>)}
            </div>
          </div>
          <div className="mt-auto flex items-end justify-between">
            <div className="flex items-center gap-5 rounded-3xl bg-white/90 pr-7 pl-3 py-3 shadow-lg border border-pink-100">
              <div className="rounded-full p-1 bg-gradient-to-br from-rani via-kesar to-haldi"><img src="/brand/srinivasan.jpg" alt="Srinivasan Ramanujam" className="w-24 h-24 rounded-full object-cover border-4 border-white" /></div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-kesar">Speaker · Trainer · Consultant</div>
                <div className="font-display text-[28px] font-extrabold leading-tight">Srinivasan Ramanujam</div>
                <div className="text-[14px] text-ink/70">Founder, One Yoto: An Agentic AI Product Development Company</div>
              </div>
            </div>
            <div className="text-right">
              <Logo className="h-14" />
              <div className="text-[12px] tracking-[0.3em] font-bold text-ink/60 mt-2">IDEAS MOVE FASTER</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · PRESENTER */}
      <Frame n={2} kicker="Your presenter" title={<>Meet <span className="text-rani">Srinivasan Ramanujam</span></>}>
        <div className="grid grid-cols-12 gap-6 h-full">
          <div className="col-span-4 deck-card overflow-hidden flex flex-col">
            <div className="relative h-[230px] bg-gradient-to-br from-rani via-kesar to-haldi">
              <img src="/brand/srinivasan.jpg" alt="Srinivasan Ramanujam" className="absolute inset-0 w-full h-full object-cover object-top mix-blend-normal" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white"><div className="font-display text-2xl font-extrabold leading-none">Srinivasan Ramanujam</div><div className="text-[12px] opacity-90">GenAI &amp; Agentic AI Consultant · Corporate &amp; Academic Trainer</div></div>
            </div>
            <div className="p-4 text-[13px] space-y-1.5">
              <div className="font-semibold text-rani">Founder, One Yoto: An Agentic AI Product Development Company</div>
              <div>✉️ srinivasan@oneyoto.in</div>
              <div>📞 +91 80560 10125</div>
              <div>🌐 www.oneyoto.in</div>
              <div>💼 linkedin.com/in/writersrinivasan</div>
              <div>📍 Chennai, India · English, Tamil</div>
            </div>
            <div className="mt-auto mx-4 mb-4 rounded-2xl bg-haldi/90 px-4 py-3 flex items-center justify-between"><span className="text-[11px] font-extrabold tracking-[0.25em]">IDEAS MOVE FASTER</span><img src="/brand/oneyoto-logo.png" alt="One Yoto" className="h-7 rounded bg-white px-1" /></div>
          </div>
          <div className="col-span-8 flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-3">
              {[["25+", "Years in software engineering", "from-rani to-gulabi"], ["40,000+", "Professionals trained globally", "from-kesar to-haldi"], ["1,000+", "Educators & faculty trained", "from-firozi to-teal-600"], ["5", "Published books (Tamil)", "from-neel to-indigo-400"]].map(([n, l, c]) => (
                <div key={l} className={`rounded-2xl p-3 text-white bg-gradient-to-br ${c}`}><div className="font-display text-[34px] font-extrabold leading-none">{n}</div><div className="text-[12px] mt-1 opacity-95">{l}</div></div>
              ))}
            </div>
            <p className="text-[13.5px] text-ink/80 leading-relaxed">A software engineer turned AI product builder and educator, working where <b>deep technical expertise meets instructional design</b>. After 25 years in software, including leadership roles at IBM, Thomson Reuters, Infosys, Accenture and TCS, he founded <b>One Yoto</b> to design and ship production-grade Agentic AI systems and to train the people who build and run them.</p>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="deck-card p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rani mb-2">Career journey</div>
                {[["Founder, One Yoto", "2021 – present · Agentic AI products & enterprise AI training"], ["Founder, Career Mudhra", "2017 – 2021 · Ed-tech & career development"], ["IBM / Truven Health (IBM Watson Health)", "2013 – 2017 · Deputy Manager · Above & Beyond Award"], ["Lead & Technology Lead", "2006 – 2012 · Thomson Reuters, Infosys, Accenture, TCS"]].map(([k, d], i) => (
                  <div key={k} className="flex gap-2 mb-1.5"><span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${i === 0 ? "bg-rani" : "border-2 border-ink/40"}`} /><div><div className="text-[12.5px] font-semibold leading-tight">{k}</div><div className="text-[11px] text-ink/55">{d}</div></div></div>
                ))}
                <div className="mt-3 rounded-xl bg-gradient-to-r from-pink-50 to-amber-50 p-2.5 text-[11.5px] leading-snug">
                  <div><b className="text-rani">📚 Author:</b> five Tamil books on careers, entrepreneurship &amp; teaching, including <i>The Power of Teaching</i></div>
                  <div className="mt-1"><b className="text-kesar">🎓 Academia:</b> designer of a 40-hour GenAI &amp; Agentic AI programme · FDPs for faculty · B.E., Production Engineering</div>
                </div>
              </div>
              <div className="deck-card p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rani mb-2">Organisations trained</div>
                <div className="flex flex-wrap gap-1.5">
                  {["HP", "Hexaware", "AstraZeneca", "John Deere", "Amdocs", "Timken", "People Inc.", "Fichtner Consulting", "GLA University"].map((o) => <Chip key={o} c={o === "HP" ? "bg-neel text-white" : "bg-indigo-50 text-indigo-800"}>{o}</Chip>)}
                </div>
                <div className="text-[11px] text-ink/55 mt-1.5">Including 5,000+ Hexaware employees, plus colleges across India</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-kesar mt-3 mb-1.5">Expertise</div>
                <div className="flex flex-wrap gap-1">
                  {["Agentic AI", "RAG", "LangGraph", "LangChain", "CrewAI", "MCP", "Claude Code", "n8n", "Azure AI Foundry", "Vector DBs"].map((e) => <Chip key={e} c="bg-amber-100 text-amber-900">{e}</Chip>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Frame>

      {/* 3 · WHY NOW */}
      <Frame n={3} kicker="Why this session" title={<>From <span className="text-neel">clicking</span> to <span className="text-rani">delegating</span></>}
        sub="Every step hands the computer more of the work. Agentic AI is the first step where you hand over a goal, not a task.">
        <div className="grid grid-cols-4 gap-4">
          {[["🖱️", "Software", "You click every button.", "Tally, Excel, ERP", "from-slate-400 to-slate-600"], ["💬", "Chatbot", "You ask, it answers.", "Doesn't know your stock or rules", "from-sky-400 to-indigo-500"], ["🧑‍✈️", "Copilot", "It suggests, you do.", "Drafts, but you still check everything", "from-fuchsia-500 to-pink-500"], ["🤖", "Agentic AI", "You give a goal, it does the steps.", "Looks up, acts, checks, asks you for big calls", "from-rani via-kesar to-haldi"]].map(([e, k, l, d, c], i) => (
            <div key={k} className="deck-card overflow-hidden"><div className={`h-2 bg-gradient-to-r ${c}`} /><div className="p-4"><div className="text-4xl">{e}</div><div className="font-mono text-[10px] text-ink/45 mt-1">LEVEL {i}</div><div className="font-display text-2xl font-bold">{k}</div><div className="font-semibold text-rani text-[14px]">{l}</div><div className="text-[12.5px] text-ink/60 mt-1">{d}</div></div></div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5">
          <div className="col-span-2 rounded-2xl border-2 border-dashed border-kesar/50 bg-gradient-to-br from-amber-50 to-pink-50 p-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-kesar">💡 In plain words</div>
            <p className="text-[16px] mt-1">An <b>AI agent</b> = an LLM + <b>tools</b> (it can look things up and act) + <b>knowledge</b> (your documents) + <b>rules</b> (what it may and may not do), working in a loop until the goal is met.</p>
            <div className="text-[11px] font-bold uppercase tracking-wider text-rani mt-4">What leaders take away</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-[13.5px]">
              {["What RAG, MCP & orchestration really mean", "A live multi-agent system they can try", "How to keep AI safe, auditable and human-led", "Where, how and what to start, with a 90-day plan"].map((t) => <div key={t}>✦ {t}</div>)}
            </div>
          </div>
          <div className="deck-card p-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neel">The HP Connect series</div>
            <div className="mt-3 space-y-3">
              <div className="rounded-xl bg-sky-50 p-3"><div className="text-[12px] font-bold text-sky-800">October · Chennai</div><div className="text-[13px]">CareAgents: Agentic AI for a healthcare clinic</div></div>
              <div className="rounded-xl bg-gradient-to-r from-pink-100 to-amber-100 p-3 ring-2 ring-rani/40"><div className="text-[12px] font-bold text-rani">November · Jaipur</div><div className="text-[13px]"><b>RangSutra</b>: Agentic AI for a handicraft export house</div></div>
              <div className="text-[12px] text-ink/60">Same proven architecture, a new local business story each city.</div>
            </div>
          </div>
        </div>
      </Frame>

      {/* 4 · USE CASE */}
      <Frame n={4} kicker="The use case" title={<>One email. <span className="text-kesar">Nine jobs.</span> Six seconds.</>}
        sub="Rangrez Crafts (fictional) works with 140 artisan families in Sanganer, exporting hand-block textiles, blue pottery, leheriya, kundan, mojaris and dhurries.">
        <div className="grid grid-cols-12 gap-5 h-full">
          <div className="col-span-5 flex flex-col gap-4">
            <div className="deck-card p-5">
              <div className="flex items-center gap-3 border-b border-pink-100 pb-2.5"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-firozi to-neel grid place-items-center text-white font-bold">L</div><div><div className="font-semibold text-[14px]">Lena · Boutique, Berlin 🇩🇪</div><div className="text-[11px] text-ink/50">to: export desk, Rangrez Crafts</div></div></div>
              <p className="text-[14.5px] mt-3 leading-relaxed">&ldquo;We&apos;d like <b>300 Sanganeri quilts</b>, shipped to Germany <b>by sea</b>. What&apos;s the <b>price in EUR</b>, when can you <b>deliver</b>, and can you do <b>18% off</b>?&rdquo;</p>
              <div className="flex flex-wrap gap-1.5 mt-3">{["Product?", "Stock?", "Price in EUR?", "Shipping?", "Lead time?", "18% allowed?"].map((q) => <Chip key={q} c="bg-amber-100 text-amber-800">{q}</Chip>)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4 bg-gradient-to-br from-rose-500 to-pink-600 text-white"><div className="text-[12px] opacity-90">😓 Today</div><div className="font-display text-[34px] font-extrabold leading-none mt-1">~1.5 days</div><div className="text-[12px] mt-1 opacity-90">phone calls, Excel, waiting for the founder</div></div>
              <div className="rounded-2xl p-4 bg-gradient-to-br from-hara to-emerald-500 text-white"><div className="text-[12px] opacity-90">🤖 With agents</div><div className="font-display text-[34px] font-extrabold leading-none mt-1">~6 sec</div><div className="text-[12px] mt-1 opacity-90">+ one approval tap from the founder</div></div>
            </div>
            <div className="text-[12px] text-ink/60">Result: a cited quote of ₹8.83 lakh ≈ €9,684 (8% volume discount), stock confirmed, sea freight 26 days, and the 18% request <b>flagged for founder approval</b>.</div>
          </div>
          <div className="col-span-7 deck-card p-4">
            <table className="w-full text-[13px]">
              <thead><tr className="text-left text-[11px] uppercase tracking-wider text-ink/50"><th className="pb-2">Job</th><th className="pb-2">Today (by hand)</th><th className="pb-2">Agent</th><th className="pb-2 text-right">With agents</th></tr></thead>
              <tbody className="divide-y divide-pink-50">
                {[["Read & understand the email", "15 min", "dwarpal", "0.01 s"], ["Work out what's needed", "10 min", "sutradhar", "0.8 s"], ["Look up payment terms, lead time, export rules", "30 min", "gyani", "1.1 s"], ["Phone the godown for stock", "45 min", "bhandari", "0.02 s"], ["Price, discount & EUR in Excel", "30 min", "munim", "0.02 s"], ["Call the freight forwarder", "4 hrs", "saarthi", "0.02 s"], ["Check MOQ, discount authority, documents", "20 min", "niti", "0.01 s"], ["Founder's OK on 18% discount", "1 day", "malik", "1 tap"], ["Write a polite reply", "20 min", "sandesh", "1.5 s"]].map(([t, d, id, w]) => {
                  const a = AGENTS.find((x) => x.id === id)!;
                  return <tr key={t}><td className="py-[10px] font-medium">{t}</td><td className="py-[10px] text-rose-600 font-mono">{d}</td><td className="py-[10px]"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-bold text-white bg-gradient-to-r ${a.color}`}>{a.emoji} {a.name}</span></td><td className="py-[10px] text-right text-hara font-mono font-semibold">{w}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Frame>

      {/* 5 · THE TEAM */}
      <Frame n={5} kicker="Meet the team" title={<>Nine agents, each with <span className="text-rainbow">one job</span></>}
        sub="Like a well-run haveli: small, focused agents are easier to test, trust and improve than one giant do-everything bot.">
        <div className="grid grid-cols-3 gap-3">
          {AGENTS.map((a) => (
            <div key={a.id} className="deck-card overflow-hidden flex">
              <div className={`w-[86px] shrink-0 bg-gradient-to-br ${a.color} grid place-items-center text-[40px]`}>{a.emoji}</div>
              <div className="p-3 min-w-0">
                <div className="flex items-center gap-2"><span className="font-display text-[20px] font-extrabold leading-none">{a.name}</span><Chip c="bg-slate-100 text-ink/70">{a.uses}</Chip></div>
                <div className="text-[12px] font-semibold text-rani">{a.role}</div>
                <div className="text-[11.5px] text-ink/70 mt-1 leading-snug">{a.does}</div>
                <div className="text-[11px] italic text-ink/50 mt-1 leading-snug">{a.analogy}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>

      {/* 6 · BUILDING BLOCKS */}
      <Frame n={6} kicker="The three building blocks" title={<>RAG gives AI <span className="text-neel">knowledge</span>. MCP gives it <span className="text-kesar">hands</span>. Orchestration builds a <span className="text-rani">team</span>.</>}>
        <div className="grid grid-cols-3 gap-5 h-full pb-1">
          {[
            { e: "📚", k: "RAG", full: "Retrieval-Augmented Generation", an: "Give the AI your bahi-khata (ledger)", c: "from-indigo-500 to-blue-500", pts: ["Collect → chunk → retrieve top 3 → attach to the question → answer with citations", "Like an open-book exam: no guessing, no retraining", "Change a policy today and the AI uses it today"], demo: "Live: search Rangrez's 16 policy documents and see the exact prompt the LLM receives", flow: ["❓ Question", "🔍 Search docs", "📄 Top 3 [KB-05]", "🧠 LLM", "✅ Cited answer"] },
            { e: "🔌", k: "MCP", full: "Model Context Protocol", an: "MCP is the UPI of AI tools", c: "from-kesar to-haldi", pts: ["One standard plug between any AI and any system: ERP, CRM, email, freight", "3 AI apps × 4 systems: 12 custom integrations → 7 plugs", "The server decides what the AI may do (read-only here)"], demo: "Live: call check_inventory, get_price_quote, estimate_shipping and see the JSON-RPC request and response", flow: ["🤖 Agent", "📨 tools/call", "🔌 MCP server", "🏭 ERP · 💱 FX · 🚚 Freight", "📦 exact data"] },
            { e: "🎭", k: "Orchestration", full: "LangGraph state graph", an: "The kathputli master pulls the strings", c: "from-rani to-fuchsia-600", pts: ["🚂 Sequential · 🍽️ Parallel fan-out · 🎭 Supervisor · ✋ Human-in-the-loop", "Shared state travels from desk to desk; every agent adds its findings", "Pause, resume and audit any step"], demo: "Live: watch the graph light up as agents run in parallel and then fan back in", flow: ["🛡️ Check", "🎭 Plan", "⚡ 4 agents in parallel", "⚖️ Rules", "✋ Approve", "✉️ Reply"] },
          ].map((b) => (
            <div key={b.k} className="deck-card overflow-hidden flex flex-col">
              <div className={`bg-gradient-to-br ${b.c} text-white p-5`}><div className="flex items-center gap-3"><span className="text-[44px]">{b.e}</span><div><div className="font-display text-[30px] font-extrabold leading-none">{b.k}</div><div className="text-[12px] opacity-90">{b.full}</div></div></div><div className="font-display text-[18px] font-bold mt-3 leading-tight">&ldquo;{b.an}&rdquo;</div></div>
              <ul className="p-5 pb-3 space-y-2.5 text-[13.5px]">{b.pts.map((p) => <li key={p} className="flex gap-2"><span className="text-rani">✦</span><span>{p}</span></li>)}</ul>
              <div className="flex-1 mx-4 mb-3 rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center justify-center">
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11.5px] font-semibold">
                  {b.flow.map((f, i) => <span key={f} className="contents"><span className="rounded-lg bg-white border border-slate-200 px-2 py-1 shadow-sm">{f}</span>{i < b.flow.length - 1 && <span className="text-rani">→</span>}</span>)}
                </div>
              </div>
              <div className="mx-4 mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-[12px] text-amber-900"><b>In the app:</b> {b.demo}</div>
            </div>
          ))}
        </div>
      </Frame>

      {/* 7 · ARCHITECTURE */}
      <Frame n={7} kicker="Architecture" title={<>How RangSutra is <span className="text-neel">wired</span></>} sub="Each layer can be replaced on its own: swap the model, add a tool, change a rule. No vendor lock-in.">
        <div className="deck-card p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rani mb-3">The LangGraph flow: one buyer message, end to end</div>
          <div className="flex items-center justify-between gap-2">
            {(["dwarpal", "sutradhar"] as const).map((id) => <Node key={id} id={id} />)}
            <Arrow label="fan-out" />
            <div className="rounded-2xl border-2 border-dashed border-fuchsia-300 bg-fuchsia-50/60 p-2 grid grid-cols-2 gap-2">{(["gyani", "bhandari", "munim", "saarthi"] as const).map((id) => <Node key={id} id={id} small />)}<div className="col-span-2 text-center text-[10px] font-bold text-fuchsia-700">⚡ run in parallel</div></div>
            <Arrow label="fan-in" />
            {(["niti", "malik", "sandesh"] as const).map((id, i) => <span key={id} className="contents"><Node id={id} />{i < 2 && <Arrow />}</span>)}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-5 mt-4">
          <div className="col-span-7 space-y-1.5">
            {[["🖥️", "Experience", "Next.js 16 · React 19 · Tailwind: chat, live graph, trace viewer", "from-rani to-gulabi"], ["🚪", "API", "Route handlers · live NDJSON streaming of every agent step", "from-fuchsia-500 to-purple-500"], ["🎭", "Orchestration", "LangGraph StateGraph · conditional edges · parallel fan-out / fan-in", "from-indigo-500 to-blue-500"], ["📚🔌", "Knowledge + Tools", "BM25 retriever over 16 docs · MCP JSON-RPC server with 5 tools", "from-teal-500 to-emerald-500"], ["🧠", "Model", "Groq LPU · Llama 3.3 70B / GPT-OSS · Bring Your Own Key", "from-amber-500 to-orange-500"]].map(([e, k, d, c]) => (
              <div key={k} className="flex items-center gap-3"><span className={`w-11 h-9 rounded-xl grid place-items-center text-white text-lg bg-gradient-to-br ${c}`}>{e}</span><div className="deck-card flex-1 px-3 py-1.5 text-[13px]"><b>{k}:</b> <span className="text-ink/70">{d}</span></div></div>
            ))}
          </div>
          <div className="col-span-5 rounded-2xl bg-ink text-pink-50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-haldi">Design principles</div>
            <ul className="mt-2 space-y-1.5 text-[13px]">
              <li>🧠 <b>LLM</b> only for language &amp; judgement (planning, writing)</li>
              <li>🧮 <b>Code</b> for maths, data &amp; rules (prices, FX, freight, policy)</li>
              <li>✋ <b>Human</b> for decisions that matter (₹5 lakh+, discount &gt; 15%)</li>
              <li>📜 <b>Every step traced</b>: plan, sources, tool calls, rule results</li>
              <li>🔑 <b>BYOK</b>: the key stays in the browser and is never stored on the server</li>
            </ul>
          </div>
        </div>
      </Frame>

      {/* 8 · TRUST */}
      <Frame n={8} kicker="Trust & safety" title={<>AI drafts. Code calculates. <span className="text-hara">Humans decide.</span></>} sub="Leaders don't need AI that is clever. They need AI that is predictable, explainable and safe.">
        <div className="grid grid-cols-4 gap-3">
          {[["🛡️", "Input guardrails", "Masks card, Aadhaar, phone and email numbers. Blocks prompt injection before the LLM sees anything."], ["🎯", "Scope control", "Off-topic requests are politely declined. The assistant stays on business."], ["📎", "Grounding & citations", "Facts come only from documents and tool results, each with a source."], ["🧮", "No AI arithmetic", "Prices, discounts, FX and freight are computed by code via MCP."], ["⚖️", "Rules as code", "Same result every time, and testable: MOQ, 15% discount limit, ₹5 lakh rule."], ["✋", "Human-in-the-loop", "Big or unusual deals become a DRAFT until the founder approves."], ["📜", "Full audit trail", "Every plan, retrieval, tool call and rule check is visible."], ["🔑", "BYOK & least privilege", "Your own key; tools are read-only and cannot change data."]].map(([e, k, d], i) => (
            <div key={k} className="deck-card p-4"><div className="flex items-center gap-2"><span className="w-9 h-9 rounded-xl grid place-items-center text-lg" style={{ background: ["#fde7f3", "#fff1d6", "#dcf7f7", "#e0e7ff"][i % 4] }}>{e}</span><span className="font-display text-[17px] font-bold leading-tight">{k}</span></div><p className="text-[12.5px] text-ink/70 mt-2 leading-snug">{d}</p></div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="deck-card p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-1.5">Risk → how it is handled</div>
            {[["Hallucinated price or policy", "RAG citations + MCP for numbers"], ["'Ignore your rules…' attacks", "Blocked by Dwarpal, with no LLM call"], ["Leaking customer data", "PII masked; nothing stored"], ["Too much discount given", "Hard 15% cap + founder approval"]].map(([r, m]) => <div key={r} className="flex justify-between gap-3 text-[12.5px] py-1 border-b border-pink-50 last:border-0"><span className="text-rose-700 font-medium">{r}</span><span className="text-emerald-700 text-right">{m}</span></div>)}
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-neel to-firozi text-white p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-haldi">Demo to production: what to add</div>
            <div className="flex flex-wrap gap-1.5 mt-2">{["Vector DB (pgvector / Qdrant)", "Postgres checkpointer + interrupt()", "LangSmith / Langfuse tracing", "Eval set of 50–100 real emails", "SSO & role-based approvals", "DPDP Act 2023 alignment", "MCP for Tally / Zoho / SAP", "Cost & rate controls"].map((x) => <span key={x} className="rounded-full bg-white/20 px-2.5 py-0.5 text-[12px] font-semibold">{x}</span>)}</div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 text-white px-6 py-3.5 flex items-center justify-between">
          <span className="font-display text-[20px] font-bold">🔍 Every reply shows its sources, tool calls and rule checks.</span>
          <span className="text-[14px] font-semibold opacity-95">So &ldquo;why did the AI say that?&rdquo; always has an answer.</span>
        </div>
      </Frame>

      {/* 9 · JOURNEY */}
      <Frame n={9} kicker="Take home" title={<>Your journey: <span className="text-rainbow">where, how and what</span> to start</>}>
        <div className="grid grid-cols-3 gap-4">
          <div className="deck-card overflow-hidden"><div className="bg-gradient-to-r from-rani to-gulabi text-white px-4 py-2.5 font-display text-[20px] font-bold">📍 Where: the sweet-spot test</div>
            <ul className="p-4 space-y-1 text-[12.5px]">{["Happens daily or weekly (high volume)", "Mostly reading, writing, looking up", "Rules can be written down", "Data already exists digitally", "Mistakes are cheap to catch", "Waits on one busy person today"].map((x) => <li key={x}>☑️ {x}</li>)}<li className="text-[11.5px] text-rani font-semibold pt-1">5–6 ticks = a perfect first agent</li></ul></div>
          <div className="deck-card overflow-hidden"><div className="bg-gradient-to-r from-kesar to-haldi text-ink px-4 py-2.5 font-display text-[20px] font-bold">🧭 How: 5 steps up</div>
            <div className="p-4 space-y-1.5">{[["📖", "Learn", "Wk 1–2", "the 8 key words + 1 course"], ["🎨", "Play", "Wk 3–4", "ChatGPT/Claude daily · 1 n8n flow"], ["🧪", "Prototype", "Month 2", "1 agent + RAG on real docs"], ["🚦", "Pilot", "Month 3", "human approves every output"], ["🚀", "Scale", "Month 4+", "multi-agent + MCP + guardrails"]].map(([e, k, t, d]) => <div key={k} className="flex items-center gap-2 text-[12.5px]"><span className="text-lg">{e}</span><b className="w-[72px]">{k}</b><span className="text-[10.5px] font-mono text-ink/45 w-[58px]">{t}</span><span className="text-ink/70">{d}</span></div>)}</div></div>
          <div className="deck-card overflow-hidden"><div className="bg-gradient-to-r from-firozi to-neel text-white px-4 py-2.5 font-display text-[20px] font-bold">🎯 What: by role</div>
            <div className="p-4 space-y-1 text-[12.5px]">{[["👑 CEO", "Inquiry & lead desk"], ["🛠️ CTO", "Docs Q&A + 1 MCP server"], ["⚙️ COO", "PO-invoice matching"], ["📊 CFO", "GST notice drafter"], ["📣 CMO", "Quote / proposal agent"], ["🤝 CHRO", "HR policy assistant"]].map(([r, u]) => <div key={r} className="flex justify-between border-b border-pink-50 last:border-0 py-0.5"><b>{r}</b><span className="text-ink/70">{u}</span></div>)}</div></div>
        </div>
        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-5 grid grid-cols-3 gap-2">
            {[["Days 1–30", "Discover", "Pick 1 task · collect docs & 30 examples · name an owner", "from-rani to-gulabi"], ["Days 31–60", "Pilot", "Build with RAG · human approves all · guardrails & logs", "from-kesar to-haldi"], ["Days 61–90", "Measure & scale", "Compare to baseline · add MCP · scale, fix or stop", "from-firozi to-neel"]].map(([d, k, t, c]) => <div key={d} className={`rounded-2xl p-3 text-white bg-gradient-to-br ${c}`}><div className="text-[10.5px] opacity-90">{d}</div><div className="font-display text-[17px] font-bold leading-tight">{k}</div><div className="text-[11px] mt-1 opacity-95 leading-snug">{t}</div></div>)}
          </div>
          <div className="col-span-7 deck-card p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neel mb-1.5">Start learning: free resources (22 more in the app)</div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-[12px]">
              {[["👔", "AI For Everyone & GenAI for Everyone (Coursera)"], ["👔", "Building effective agents (Anthropic)"], ["👔", "A practical guide to building agents (OpenAI)"], ["👔", "Intro to LLMs (Karpathy, YouTube)"], ["🛠️", "Intro to LangGraph (LangChain Academy)"], ["🛠️", "modelcontextprotocol.io"], ["🛠️", "Hugging Face AI Agents Course"], ["🛠️", "Free API key: console.groq.com"]].map(([l, t]) => <div key={t}>{l} {t}</div>)}
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-ink text-white px-6 py-3.5 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-haldi">The one thing to remember</span>
          <span className="font-display text-[21px] font-bold">Start <span className="text-gulabi">small</span> · keep a <span className="text-haldi">human in the loop</span> · <span className="text-firozi">measure</span> everything · then <span className="text-gulabi">scale</span></span>
        </div>
      </Frame>

      {/* 10 · APP + CONTACT */}
      <section className="slide text-white" style={{ background: "#2a1238", color: "#fff" }}>
        <div className="absolute inset-x-0 top-0 h-2.5 strip-rainbow" />
        <Mandala className="absolute -right-48 -bottom-56 w-[620px] h-[620px] opacity-20" />
        <div className="relative h-full px-14 pt-10 pb-8 flex flex-col">
          <div className="uppercase tracking-[0.25em] text-[11px] font-bold text-haldi">Explore the app · Next steps</div>
          <h2 className="font-display text-[44px] leading-[1.05] font-extrabold mt-1">Try it yourself. <span className="text-gulabi">Then build yours.</span></h2>
          <div className="grid grid-cols-12 gap-5 mt-5 flex-1">
            <div className="col-span-4 rounded-2xl bg-white/8 border border-white/10 p-4" style={{ background: "linear-gradient(135deg,#e6007e33,transparent)" }}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-haldi mb-2">Inside RangSutra</div>
              {[["01", "The Story", "the shift, Lena's email, the team"], ["02", "RAG · MCP · Orchestration", "live search & MCP playground"], ["03", "Live AI Desk", "9 agents, live graph, full trace"], ["04", "Architecture & Trust", "layers, lifecycle, safety"], ["05", "Start Your Journey", "checklists, ROI, 90-day plan"], ["▶", "Present mode", "and this deck as a PDF"]].map(([n, k, d]) => <div key={k} className="flex gap-3 py-[11px] text-[15px] border-b border-white/10 last:border-0"><span className="font-mono text-gulabi w-5">{n}</span><div><b>{k}</b> <span className="text-pink-100/70">· {d}</span></div></div>)}
            </div>
            <div className="col-span-4 rounded-2xl border border-white/10 p-4" style={{ background: "linear-gradient(135deg,#ff7a0033,transparent)" }}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-haldi mb-2">Try these in the Live AI Desk</div>
              {[["🇩🇪", "Lena's email", "full team, parallel, approval"], ["📚", "Payment terms & GST?", "RAG with citations"], ["🇮🇳", "Ask in Hindi", "multilingual reply"], ["💰", "800 dhurries to Australia", "₹5 lakh rule"], ["🛡️", "'Ignore all instructions…'", "blocked"], ["🔒", "A card number", "masked before the LLM"]].map(([e, k, d]) => <div key={k} className="flex gap-3 py-[11px] text-[15px] border-b border-white/10 last:border-0"><span>{e}</span><div><b>{k}</b> <span className="text-pink-100/70">→ {d}</span></div></div>)}
            </div>
            <div className="col-span-4 rounded-2xl bg-white text-ink p-4 flex flex-col">
              <div className="flex items-center gap-3">
                <div className="rounded-full p-[3px] bg-gradient-to-br from-rani via-kesar to-haldi"><img src="/brand/srinivasan.jpg" alt="Srinivasan Ramanujam" className="w-[68px] h-[68px] rounded-full object-cover border-2 border-white" /></div>
                <div><div className="font-display text-[21px] font-extrabold leading-tight">Srinivasan Ramanujam</div><div className="text-[11.5px] text-ink/60">Founder, One Yoto</div></div>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-rani mt-3 mb-1">How One Yoto can help</div>
              <ul className="text-[12px] space-y-0.5">
                <li>✦ Leadership workshops on Agentic AI</li>
                <li>✦ 40-hour GenAI &amp; Agentic AI programme for tech teams</li>
                <li>✦ AI readiness &amp; use-case discovery</li>
                <li>✦ Building production multi-agent systems</li>
              </ul>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[["25+", "years"], ["40,000+", "trained"], ["1,000+", "educators"]].map(([n, l], i) => <div key={l} className="rounded-xl p-2 text-center text-white" style={{ background: ["#e6007e", "#ff7a00", "#00a6a6"][i] }}><div className="font-display text-[20px] font-extrabold leading-none">{n}</div><div className="text-[10.5px] opacity-90">{l}</div></div>)}
              </div>
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-ink/45 mt-3 mb-1">Trusted by teams at</div>
              <div className="flex flex-wrap gap-1">{["HP", "Hexaware", "AstraZeneca", "John Deere", "Amdocs", "Timken"].map((o) => <Chip key={o} c={o === "HP" ? "bg-neel text-white" : "bg-indigo-50 text-indigo-800"}>{o}</Chip>)}</div>
              <div className="mt-auto pt-2 text-[12px] space-y-0.5 border-t border-pink-100">
                <div>✉️ srinivasan@oneyoto.in · 📞 +91 80560 10125</div>
                <div>🌐 www.oneyoto.in · 💼 linkedin.com/in/writersrinivasan</div>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-between mt-5">
            <div className="font-display text-[34px] font-extrabold">🙏 Dhanyavaad, Jaipur! <span className="text-[18px] font-semibold text-pink-100/80">Start small · keep a human in the loop · measure · scale</span></div>
            <div className="text-right"><Logo className="h-11" /><div className="text-[11px] tracking-[0.3em] font-bold text-haldi mt-1.5">IDEAS MOVE FASTER</div></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Node({ id, small }: { id: (typeof AGENTS)[number]["id"]; small?: boolean }) {
  const a = AGENTS.find((x) => x.id === id)!;
  return (
    <div className={`flex flex-col items-center text-center ${small ? "w-[78px]" : "w-[92px]"}`}>
      <span className={`${small ? "w-10 h-10 text-xl" : "w-14 h-14 text-2xl"} rounded-full grid place-items-center bg-gradient-to-br ${a.color} shadow`}>{a.emoji}</span>
      <span className={`font-bold mt-1 leading-none ${small ? "text-[11px]" : "text-[13px]"}`}>{a.name}</span>
      <span className="text-[10px] text-ink/50 leading-tight">{a.uses}</span>
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return <div className="flex flex-col items-center text-rani/70"><span className="text-xl leading-none">→</span>{label && <span className="text-[9px] font-bold uppercase">{label}</span>}</div>;
}
