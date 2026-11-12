"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AskFab() {
  const p = usePathname();
  if (p.startsWith("/assistant") || p.startsWith("/present") || p.startsWith("/deck")) return null;
  return (
    <Link href="/assistant"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full pl-3 pr-5 py-3 text-white font-semibold shadow-xl bg-gradient-to-r from-rani via-kesar to-haldi hover:scale-105 transition">
      <span className="grid place-items-center w-8 h-8 rounded-full bg-white/25 pulse-ring">🐪</span>
      Ask the AI Export Desk
    </Link>
  );
}
