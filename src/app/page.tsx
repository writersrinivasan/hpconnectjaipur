"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock, Zap } from "lucide-react";
import { AGENTS } from "@/lib/agents/meta";
import { Section, Title, Pill, PlainWords, Mandala } from "@/components/ui";
import { DECK_PDF } from "@/lib/deck";

const SHIFT = [
  { k: "Software", e: "🖱️", c: "from-slate-400 to-slate-600", line: "You click every button.", ex: "Tally, Excel, your ERP: it does exactly what you tell it, one click at a time." },
  { k: "Chatbot", e: "💬", c: "from-sky-400 to-indigo-500", line: "You ask, it answers.", ex: "ChatGPT writes a reply, but it doesn't know your stock, prices or rules." },
  { k: "Copilot", e: "🧑‍✈️", c: "from-fuchsia-500 to-pink-500", line: "It suggests, you do the work.", ex: "It drafts the quote, and you still check the godown and call the forwarder." },
  { k: "Agentic AI", e: "🤖", c: "from-rani via-kesar to-haldi", line: "You give a goal, it does the steps.", ex: "It reads the request, checks stock, prices, shipping and rules, and asks you only for the big decision." },
];

const BUYER_MAIL = `Hi Rangrez team! I run a boutique in Berlin. We'd like 300 Sanganeri quilts, shipped to Germany by sea. What's the price in EUR, and when can you deliver? Can you do 18% off?  — Lena`;

const STEPS = [
  { task: "Read & understand the email", today: "15 min", agent: "dwarpal", withA: "0.01 s" },
  { task: "Work out what's needed and who should do it", today: "10 min", agent: "sutradhar", withA: "0.8 s" },
  { task: "Look up payment terms, lead time, export rules", today: "30 min", agent: "gyani", withA: "1.1 s" },
  { task: "Phone the godown to check stock", today: "45 min", agent: "bhandari", withA: "0.02 s" },
  { task: "Calculate price, discount, EUR conversion in Excel", today: "30 min", agent: "munim", withA: "0.02 s" },
  { task: "Call the freight forwarder for a rate", today: "4 hrs (waiting)", agent: "saarthi", withA: "0.02 s" },
  { task: "Check MOQ, discount authority, documents", today: "20 min", agent: "niti", withA: "0.01 s" },
  { task: "Get the founder's OK on the 18% discount", today: "1 day (she's travelling)", agent: "malik", withA: "1 tap on phone" },
  { task: "Write a polite reply", today: "20 min", agent: "sandesh", withA: "1.5 s" },
];

const INDUSTRIES = [
  { e: "🏨", k: "Hotels & tourism", ex: "A booking agent checks room availability (MCP), house policies (RAG) and asks the GM before big group discounts." },
  { e: "💍", k: "Gems & jewellery", ex: "Agents value stones from rate cards, check hallmarking rules and flag high-value orders for the owner." },
  { e: "🏭", k: "Manufacturing", ex: "A purchase agent reads RFQs, checks raw-material stock, prices from the ERP and gets plant-head approval." },
  { e: "🏦", k: "CA & finance firms", ex: "Agents read GST notices, pull ledgers through MCP and draft replies. The partner signs before anything is filed." },
  { e: "🚀", k: "SaaS start-ups", ex: "Support agents answer from your docs (RAG), check the customer's plan (MCP) and escalate refunds to a human." },
  { e: "🎓", k: "Education", ex: "Admission agents answer fee and eligibility questions from the prospectus and book counselling slots." },
  { e: "🏥", k: "Healthcare", ex: "The same pattern we built for a clinic in Chennai: triage, records, pharmacy, with the doctor in charge." },
  { e: "🏗️", k: "Real estate", ex: "Agents match buyer needs to inventory, explain RERA terms from documents and book site visits." },
];

const JOURNEY = [
  { href: "/concepts", n: "02", t: "RAG · MCP · Orchestration", d: "The three building blocks, with Indian analogies and live demos.", c: "from-indigo-500 to-fuchsia-500" },
  { href: "/assistant", n: "03", t: "Live AI Export Desk", d: "Bring your Groq key and watch 9 agents work, step by step.", c: "from-rani to-kesar" },
  { href: "/architecture", n: "04", t: "Architecture & Trust", d: "How it's wired, and how you keep AI safe and accountable.", c: "from-teal-500 to-emerald-500" },
  { href: "/learn", n: "05", t: "Start Your Journey", d: "Where to start, how to start, what to start with. Free resources included.", c: "from-amber-500 to-rose-500" },
];

export default function Home() {
  const [withAgents, setWithAgents] = useState(true);
  return (
    <>
      {/* HERO */}
      <div className="hero-bg relative overflow-hidden">
        <Mandala className="absolute -right-24 -top-24 w-[520px] h-[520px] opacity-30 spin-slow pointer-events-none" />
        <Mandala className="absolute -left-32 bottom-[-180px] w-[380px] h-[380px] opacity-20 spin-slow pointer-events-none" />
        <Section className="relative pt-16 pb-20">
          <Pill className="bg-white/80 text-rani border border-pink-200">🌸 HP Connect · Jaipur Edition · for Founders, CEOs, CTOs &amp; CXOs</Pill>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.05] mt-5 max-w-4xl">
            Agentic AI, explained in the <span className="text-rainbow">colours of Jaipur</span>
          </h1>
          <p className="mt-5 text-xl text-ink/75 max-w-2xl">
            Meet <b>Rangrez Crafts</b>, a hand-block textile and blue pottery exporter in Sanganer.
            See how a team of AI agents handles a buyer&apos;s request from Berlin in seconds, while the founder stays in charge.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/assistant" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-rani to-kesar shadow-lg hover:scale-105 transition">Try the live agents <ArrowRight size={18} /></Link>
            <Link href="/concepts" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold bg-white border-2 border-neel/20 text-neel hover:bg-indigo-50">Learn the concepts</Link>
            <Link href="/learn" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold bg-haldi/90 text-ink hover:bg-haldi">Where do I start? 🧭</Link>
            <a href={DECK_PDF} download className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold bg-ink text-white hover:opacity-90">⬇ Download the deck (PDF)</a>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
            {[
              ["9", "AI agents", "from-rani to-gulabi"], ["5", "tools via MCP", "from-kesar to-haldi"],
              ["16", "company docs (RAG)", "from-firozi to-teal-600"], ["1", "founder in charge", "from-neel to-indigo-400"],
            ].map(([n, l, c]) => (
              <div key={l} className="card p-4 text-center">
                <div className={`font-display text-5xl font-extrabold bg-gradient-to-r ${c} bg-clip-text text-transparent`}>{n}</div>
                <div className="text-sm font-semibold text-ink/70">{l}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* THE SHIFT */}
      <Section>
        <Title eyebrow="Chapter 01 · The shift" title={<>From <span className="text-neel">clicking</span> to <span className="text-rani">delegating</span></>}
          sub="Each step gives the computer more of the work. Agentic AI is the first step where you hand over a goal instead of a task." />
        <div className="grid md:grid-cols-4 gap-4">
          {SHIFT.map((s, i) => (
            <div key={s.k} className="card p-5 relative overflow-hidden pop" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${s.c}`} />
              <div className="text-4xl">{s.e}</div>
              <div className="font-mono text-xs text-ink/50 mt-2">LEVEL {i}</div>
              <div className="font-display text-2xl font-bold">{s.k}</div>
              <div className="font-semibold text-rani">{s.line}</div>
              <p className="text-sm text-ink/70 mt-2">{s.ex}</p>
            </div>
          ))}
        </div>
        <div className="mt-6"><PlainWords>An <b>AI agent</b> is an LLM (like ChatGPT) that has been given <b>tools</b> (it can look things up and take actions), <b>knowledge</b> (your company&apos;s documents) and <b>rules</b> (what it may and may not do). It works in a loop: think, act, check, until the goal is done.</PlainWords></div>
      </Section>

      {/* A MORNING AT RANGREZ */}
      <div className="bg-gradient-to-br from-pink-100 via-amber-50 to-teal-50 border-y border-pink-100">
        <Section>
          <Title eyebrow="The story" title={<>One email. <span className="text-kesar">Nine jobs.</span></>}
            sub="Meera Rathore runs Rangrez Crafts with 140 artisan families. Every day, emails like this one take her team hours." />
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 card p-5">
              <div className="flex items-center gap-3 border-b border-pink-100 pb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-firozi to-neel grid place-items-center text-white font-bold">L</div>
                <div><div className="font-semibold">Lena · Boutique, Berlin 🇩🇪</div><div className="text-xs text-ink/50">to: export@rangrez.example</div></div>
              </div>
              <p className="mt-4 text-ink/80 leading-relaxed">{BUYER_MAIL}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {["Product?", "Stock?", "Price in EUR?", "Shipping?", "Lead time?", "18% discount allowed?"].map((q) => <Pill key={q} className="bg-amber-100 text-amber-800">{q}</Pill>)}
              </div>
              <Link href="/assistant?q=lena" className="mt-5 inline-flex items-center gap-2 text-rani font-semibold">Send this email to the live agents <ArrowRight size={16} /></Link>
            </div>
            <div className="lg:col-span-3 card p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="inline-flex rounded-full bg-pink-50 p-1">
                  <button onClick={() => setWithAgents(false)} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${!withAgents ? "bg-ink text-white" : "text-ink/60"}`}>😓 Today</button>
                  <button onClick={() => setWithAgents(true)} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${withAgents ? "bg-gradient-to-r from-rani to-kesar text-white" : "text-ink/60"}`}>🤖 With agents</button>
                </div>
                <div className={`font-display text-2xl font-bold ${withAgents ? "text-hara" : "text-rose-600"}`}>
                  {withAgents ? <><Zap className="inline" size={20} /> ~6 seconds + 1 tap</> : <><Clock className="inline" size={20} /> ~1.5 working days</>}
                </div>
              </div>
              <ul className="mt-4 divide-y divide-pink-100">
                {STEPS.map((s) => {
                  const a = AGENTS.find((x) => x.id === s.agent)!;
                  return (
                    <li key={s.task} className="py-2.5 flex items-center gap-3">
                      <span className={`w-9 h-9 shrink-0 rounded-xl grid place-items-center text-lg ${withAgents ? `bg-gradient-to-br ${a.color} text-white` : "bg-slate-100 grayscale"}`}>{withAgents ? a.emoji : "🧑‍💼"}</span>
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{s.task}</div>
                        <div className="text-xs text-ink/50">{withAgents ? `${a.name} · ${a.uses}` : "Done by hand"}</div>
                      </div>
                      <span className={`text-sm font-mono font-semibold ${withAgents ? "text-hara" : "text-rose-600"}`}>{withAgents ? s.withA : s.today}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Section>
      </div>

      {/* MEET THE TEAM */}
      <Section id="team">
        <Title eyebrow="Meet the team" title={<>Nine agents, each with <span className="text-rainbow">one job</span></>}
          sub="Like a well-run haveli, every member has one clear role. Small, focused agents are easier to test, trust and improve than one giant 'do-everything' bot." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENTS.map((a, i) => (
            <div key={a.id} className="card overflow-hidden pop" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`bg-gradient-to-br ${a.color} p-5 text-white flex items-center gap-4`}>
                <div className="text-5xl floaty" style={{ animationDelay: `${i * 300}ms` }}>{a.emoji}</div>
                <div>
                  <div className="font-display text-3xl font-extrabold leading-none">{a.name}</div>
                  <div className="text-white/90 font-semibold">{a.role}</div>
                </div>
                <span className="ml-auto rounded-full bg-white/25 px-3 py-1 text-xs font-bold">{a.uses}</span>
              </div>
              <div className="p-5 space-y-3">
                <p className="italic text-ink/70">&ldquo;{a.analogy}&rdquo;</p>
                <p className="text-sm"><b>What it does:</b> {a.does}</p>
                <p className="text-xs font-mono text-ink/50 bg-slate-50 rounded-lg p-2">⚙️ {a.tech}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* NOT JUST HANDICRAFTS */}
      <div className="bg-ink text-white">
        <Section>
          <div className="mb-8 max-w-3xl">
            <div className="uppercase tracking-[0.2em] text-xs font-bold text-haldi">Your business</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-2">Not just handicrafts. <span className="text-gulabi">Same pattern, your industry.</span></h2>
            <p className="mt-3 text-lg text-pink-100/80">Gatekeeper → Planner → Specialists (knowledge + tools) → Rules → Human approval → Messenger. Swap the specialists and it fits almost any business.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INDUSTRIES.map((x, i) => (
              <div key={x.k} className="rounded-2xl p-5 border border-white/10" style={{ background: `linear-gradient(135deg, ${["#e6007e", "#ff7a00", "#00b3b3", "#2e3192"][i % 4]}33, transparent)` }}>
                <div className="text-4xl">{x.e}</div>
                <div className="font-display text-xl font-bold mt-2">{x.k}</div>
                <p className="text-sm text-pink-50/80 mt-1">{x.ex}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* JOURNEY */}
      <Section>
        <Title eyebrow="Today's journey" title="Where we go next" center />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {JOURNEY.map((j) => (
            <Link key={j.href} href={j.href} className="group card p-0 overflow-hidden hover:-translate-y-1 transition">
              <div className={`arch h-28 mx-4 mt-4 bg-gradient-to-br ${j.c} grid place-items-center font-display text-5xl font-extrabold text-white/90`}>{j.n}</div>
              <div className="p-5">
                <div className="font-display text-xl font-bold group-hover:text-rani">{j.t}</div>
                <p className="text-sm text-ink/70 mt-1">{j.d}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
