"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AGENTS } from "@/lib/agents/meta";
import { Mandala } from "@/components/ui";
import { DECK_PDF } from "@/lib/deck";

type Slide = { bg: string; kicker?: string; title: string; body?: React.ReactNode; emoji?: string; demo?: [string, string] };

const SLIDES: Slide[] = [
  { bg: "from-rani via-kesar to-haldi", emoji: "🪡", kicker: "HP Connect · Jaipur", title: "Agentic AI, in the colours of Jaipur", body: <p>Multi-agent orchestration · RAG · MCP, explained for founders and CXOs</p> },
  { bg: "from-neel via-fuchsia-600 to-rani", emoji: "🪜", kicker: "The shift", title: "From clicking → asking → delegating", body: <ul><li>🖱️ Software: you click every button</li><li>💬 Chatbot: you ask, it answers</li><li>🤖 Agent: you give a goal, it does the steps</li></ul> },
  { bg: "from-teal-500 via-firozi to-neel", emoji: "🏺", kicker: "Meet Rangrez Crafts", title: "140 artisan families. One busy founder.", body: <p>A Berlin buyer wants 300 Sanganeri quilts, a price in EUR, delivery dates and 18% off. Today that takes 1.5 days. With agents it takes about 6 seconds plus one tap from the founder.</p>, demo: ["/", "See the story"] },
  { bg: "from-fuchsia-600 via-rani to-kesar", emoji: "👥", kicker: "The team", title: "Nine agents, one job each", body: <div className="flex flex-wrap gap-3 justify-center">{AGENTS.map((a) => <span key={a.id} className="rounded-2xl bg-white/20 px-4 py-2 text-2xl">{a.emoji} <span className="text-lg font-semibold">{a.name}</span></span>)}</div> },
  { bg: "from-indigo-600 via-blue-500 to-firozi", emoji: "📚", kicker: "Building block 1 · RAG", title: "Give the AI your bahi-khata", body: <p>It finds the right page in your documents and answers from it, with citations. An open-book exam, not guesswork.</p>, demo: ["/concepts#rag", "Live RAG demo"] },
  { bg: "from-kesar via-amber-500 to-haldi", emoji: "🔌", kicker: "Building block 2 · MCP", title: "MCP is the UPI of AI tools", body: <p>One standard plug between any AI and any system: ERP, CRM, email, freight. Build a connector once, use it with every model.</p>, demo: ["/concepts#mcp", "Live MCP playground"] },
  { bg: "from-rani via-fuchsia-600 to-purple-700", emoji: "🎭", kicker: "Building block 3 · Orchestration", title: "The kathputli master: LangGraph", body: <ul><li>🚂 Sequential</li><li>🍽️ Parallel fan-out</li><li>🎭 Supervisor / router</li><li>✋ Human-in-the-loop</li></ul>, demo: ["/concepts#orch", "See the patterns"] },
  { bg: "from-hara via-emerald-500 to-firozi", emoji: "⚡", kicker: "Live demo", title: "Watch nine agents work", body: <p>Bring your free Groq key. Try Lena&apos;s email, a Hindi question, a hack attempt and a ₹30 lakh order.</p>, demo: ["/assistant", "Open the AI Export Desk"] },
  { bg: "from-rose-500 via-amber-500 to-emerald-500", emoji: "🛡️", kicker: "Trust", title: "AI drafts. Code calculates. Humans decide.", body: <ul><li>Guardrails on input</li><li>Citations for every fact</li><li>Rules as code, not AI</li><li>Founder approval above ₹5 lakh</li></ul>, demo: ["/architecture", "Architecture & Trust"] },
  { bg: "from-kesar via-rani to-neel", emoji: "🧭", kicker: "Take home", title: "Where · How · What to start", body: <ul><li>📍 Pick one task that passes the sweet-spot test</li><li>🧭 Learn → Play → Prototype → Pilot → Scale</li><li>🎯 One owner, one metric, 90 days</li></ul>, demo: ["/learn", "Your journey + resources"] },
  { bg: "from-rani via-kesar to-haldi", emoji: "🙏", kicker: "Dhanyavaad, Jaipur!", title: "Start small. Keep a human in the loop. Measure. Scale.", body: <p>Questions?</p> },
];

export default function Present() {
  const [i, setI] = useState(0);
  const go = useCallback((d: number) => setI((x) => Math.max(0, Math.min(SLIDES.length - 1, x + d))), []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (["ArrowRight", " ", "PageDown"].includes(e.key)) go(1); if (["ArrowLeft", "PageUp"].includes(e.key)) go(-1); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [go]);
  const s = SLIDES[i];
  return (
    <div className={`fixed inset-0 z-[70] bg-gradient-to-br ${s.bg} text-white overflow-hidden transition-colors duration-700`}>
      <Mandala className="absolute -right-40 -bottom-40 w-[700px] h-[700px] opacity-20 spin-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20px_20px,rgba(255,255,255,.12)_3px,transparent_4px)] bg-[length:56px_56px]" />
      <Link href="/" className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30"><X /></Link>
      <div className="absolute top-4 left-4 z-10 flex gap-2 text-sm font-semibold">
        <a href={DECK_PDF} download className="rounded-full px-4 py-2 bg-white text-ink shadow hover:scale-105 transition">⬇ Deck PDF</a>
        <Link href="/deck" className="rounded-full px-4 py-2 bg-white/20 hover:bg-white/30">▤ Full deck</Link>
      </div>
      <div key={i} className="relative h-full flex flex-col items-center justify-center text-center px-6 pop">
        {s.emoji && <div className="text-7xl md:text-8xl floaty">{s.emoji}</div>}
        {s.kicker && <div className="mt-4 uppercase tracking-[0.3em] text-sm font-bold opacity-90">{s.kicker}</div>}
        <h1 className="font-display text-4xl md:text-7xl font-extrabold max-w-5xl leading-tight mt-2 drop-shadow">{s.title}</h1>
        {s.body && <div className="mt-6 text-xl md:text-2xl max-w-3xl opacity-95 [&_ul]:space-y-2 [&_ul]:text-left [&_ul]:inline-block">{s.body}</div>}
        {s.demo && <Link href={s.demo[0]} className="mt-8 rounded-full bg-white text-ink px-6 py-3 font-bold shadow-xl hover:scale-105 transition">▶ {s.demo[1]}</Link>}
      </div>
      <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between">
        <button onClick={() => go(-1)} className="p-3 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30" disabled={i === 0}><ChevronLeft /></button>
        <div className="flex gap-1.5">{SLIDES.map((_, j) => <button key={j} onClick={() => setI(j)} className={`h-2 rounded-full transition-all ${j === i ? "w-8 bg-white" : "w-2 bg-white/40"}`} />)}</div>
        <button onClick={() => go(1)} className="p-3 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30" disabled={i === SLIDES.length - 1}><ChevronRight /></button>
      </div>
    </div>
  );
}
