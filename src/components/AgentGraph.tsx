"use client";
import { AGENT_BY_ID, type AgentId } from "@/lib/agents/meta";

export type NodeState = "idle" | "running" | "done" | "skipped";

const POS: Record<AgentId, [number, number]> = {
  dwarpal: [180, 34], sutradhar: [180, 108], gyani: [45, 192], bhandari: [135, 192], munim: [225, 192], saarthi: [315, 192],
  niti: [180, 276], malik: [180, 350], sandesh: [180, 428],
};
const EDGES: [AgentId, AgentId][] = [
  ["dwarpal", "sutradhar"], ["sutradhar", "gyani"], ["sutradhar", "bhandari"], ["sutradhar", "munim"], ["sutradhar", "saarthi"],
  ["gyani", "niti"], ["bhandari", "niti"], ["munim", "niti"], ["saarthi", "niti"], ["sutradhar", "niti"], ["niti", "malik"], ["malik", "sandesh"],
];

export default function AgentGraph({ states, onPick }: { states: Partial<Record<AgentId, NodeState>>; onPick?: (id: AgentId) => void }) {
  const st = (id: AgentId) => states[id] ?? "idle";
  const edgeOn = (a: AgentId, b: AgentId) => st(a) === "done" && (st(b) === "done" || st(b) === "running");
  return (
    <svg viewBox="0 0 360 470" className="w-full h-auto select-none">
      <defs>
        <linearGradient id="eg" x1="0" x2="1"><stop offset="0" stopColor="#e6007e" /><stop offset="1" stopColor="#ff7a00" /></linearGradient>
      </defs>
      {EDGES.map(([a, b]) => {
        const [x1, y1] = POS[a], [x2, y2] = POS[b];
        if (a === "sutradhar" && b === "niti") {
          const on = edgeOn(a, b) && ["gyani", "bhandari", "munim", "saarthi"].every((s) => st(s as AgentId) !== "done");
          return <path key={a + b} d={`M${x1 - 30},${y1 + 10} C 0,190 0,250 ${x2 - 30},${y2 - 8}`} fill="none" stroke={on ? "url(#eg)" : "#e9d5e5"} strokeWidth={on ? 3 : 1.5} strokeDasharray="4 5" />;
        }
        const on = edgeOn(a, b);
        return <line key={a + b} x1={x1} y1={y1 + 18} x2={x2} y2={y2 - 18} stroke={on ? "url(#eg)" : "#f1dbe9"} strokeWidth={on ? 3.5 : 2} className={on ? "flow" : ""} />;
      })}
      {/* blocked path */}
      <path d="M192,15 C 385,-15 385,485 192,447" fill="none" stroke={st("dwarpal") === "done" && st("sutradhar") === "skipped" ? "#e11d48" : "#f8e3ee"} strokeWidth="2" strokeDasharray="3 6" />
      <text x="352" y="290" fontSize="9" fill="#e11d48" opacity=".6" transform="rotate(90 352 290)">blocked → refuse</text>
      <text x="180" y="236" textAnchor="middle" fontSize="9" fill="#a21caf" opacity=".7">⚡ run in parallel</text>

      {(Object.keys(POS) as AgentId[]).map((id) => {
        const [x, y] = POS[id];
        const a = AGENT_BY_ID[id];
        const s = st(id);
        const fill = s === "running" ? a.hex : s === "done" ? a.hex : s === "skipped" ? "#f3f4f6" : "#ffffff";
        return (
          <g key={id} transform={`translate(${x},${y})`} onClick={() => onPick?.(id)} className="cursor-pointer">
            {s === "running" && <circle r="30" fill={a.hex} opacity=".25"><animate attributeName="r" values="22;34;22" dur="1.2s" repeatCount="indefinite" /><animate attributeName="opacity" values=".35;0;.35" dur="1.2s" repeatCount="indefinite" /></circle>}
            <circle r="21" fill={fill} stroke={a.hex} strokeWidth={s === "idle" ? 2 : 3} opacity={s === "skipped" ? 0.45 : 1} />
            <text y="7" textAnchor="middle" fontSize="19" opacity={s === "skipped" ? 0.4 : 1}>{a.emoji}</text>
            {s === "done" && <g transform="translate(15,-15)"><circle r="7" fill="#16a34a" stroke="white" strokeWidth="1.5" /><text y="3.5" textAnchor="middle" fontSize="9" fill="white">✓</text></g>}
            <text y={id === "gyani" || id === "bhandari" || id === "munim" || id === "saarthi" ? 35 : 5} x={["gyani", "bhandari", "munim", "saarthi"].includes(id) ? 0 : 30}
              textAnchor={["gyani", "bhandari", "munim", "saarthi"].includes(id) ? "middle" : "start"} fontSize="11" fontWeight="700" fill={s === "skipped" ? "#9ca3af" : "#2a1238"}>{a.name}</text>
            {!["gyani", "bhandari", "munim", "saarthi"].includes(id) && <text x="30" y="18" fontSize="9" fill="#6b7280">{a.role} · {a.uses}</text>}
            {["gyani", "bhandari", "munim", "saarthi"].includes(id) && <text y="46" textAnchor="middle" fontSize="8.5" fill="#6b7280">{a.uses}</text>}
          </g>
        );
      })}
    </svg>
  );
}
