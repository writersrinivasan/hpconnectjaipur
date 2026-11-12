"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Presentation, Download } from "lucide-react";
import { DECK_PDF } from "@/lib/deck";

export const NAV = [
  { href: "/", label: "The Story", num: "01" },
  { href: "/concepts", label: "RAG · MCP · Orchestration", num: "02" },
  { href: "/assistant", label: "Live AI Desk", num: "03" },
  { href: "/architecture", label: "Architecture & Trust", num: "04" },
  { href: "/learn", label: "Start Your Journey", num: "05" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path.startsWith("/present") || path.startsWith("/deck")) return null;
  return (
    <header className="sticky top-0 z-40">
      <div className="h-1.5 strip-rainbow" />
      <nav className="bg-white/80 backdrop-blur border-b border-pink-100">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-rani via-kesar to-haldi text-white text-lg shadow-md">🪡</span>
            <span className="font-display text-2xl font-extrabold leading-none">
              <span className="text-rani">Rang</span><span className="text-neel">Sutra</span>
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => {
              const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition ${active ? "bg-gradient-to-r from-rani to-kesar text-white shadow" : "text-ink/70 hover:bg-pink-50 hover:text-rani"}`}>
                  <span className="opacity-60 mr-1 font-mono text-xs">{n.num}</span>{n.label}
                </Link>
              );
            })}
            <Link href="/present" className="ml-2 inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold bg-neel text-white hover:opacity-90">
              <Presentation size={16} /> Present
            </Link>
            <a href={DECK_PDF} download className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-haldi to-kesar text-ink hover:opacity-90" title="Download the 10-page deck (PDF)">
              <Download size={16} /> Deck PDF
            </a>
          </div>
          <button className="lg:hidden p-2 rounded-lg hover:bg-pink-50" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="lg:hidden border-t border-pink-100 bg-white px-4 py-2">
            {[...NAV, { href: "/present", label: "Present mode", num: "▶" }].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">
                <span className="text-rani font-mono mr-2">{n.num}</span>{n.label}
              </Link>
            ))}
            <a href={DECK_PDF} download className="block py-2 text-sm font-semibold text-kesar">⬇ Download deck (PDF)</a>
            <Link href="/deck" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium"><span className="text-rani font-mono mr-2">▤</span>View deck online</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
