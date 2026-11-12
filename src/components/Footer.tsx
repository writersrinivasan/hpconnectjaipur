"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DECK_PDF } from "@/lib/deck";

export default function Footer() {
  const p = usePathname();
  if (p.startsWith("/present") || p.startsWith("/deck")) return null;
  return (
    <footer className="mt-16">
      <div className="h-1.5 strip-rainbow" />
      <div className="bg-ink text-pink-100">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row gap-4 md:items-center justify-between text-sm">
          <div>
            <div className="font-display text-xl text-white">RangSutra · HP Connect Jaipur</div>
            <div className="opacity-70">Agentic AI for Founders, CEOs, CTOs &amp; CXOs. Rangrez Crafts is a fictional business; all data is for demonstration.</div>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <div className="flex gap-2">
              <Link href="/deck" className="rounded-full px-4 py-1.5 border border-white/20 text-white hover:bg-white/10">▤ View deck</Link>
              <a href={DECK_PDF} download className="rounded-full px-4 py-1.5 font-semibold text-ink bg-gradient-to-r from-haldi to-kesar">⬇ Download deck PDF</a>
            </div>
            <div className="opacity-80">Presented by Srinivasan Ramanujam · One Yoto · Built with Next.js · LangGraph · Groq (BYOK) · RAG · MCP</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
