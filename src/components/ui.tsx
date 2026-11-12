import type { ReactNode } from "react";

export function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`mx-auto max-w-7xl px-4 py-14 ${className}`}>{children}</section>;
}

export function Eyebrow({ children, color = "text-rani" }: { children: ReactNode; color?: string }) {
  return <div className={`uppercase tracking-[0.2em] text-xs font-bold ${color}`}>{children}</div>;
}

export function Title({ eyebrow, title, sub, center }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; center?: boolean }) {
  return (
    <div className={`mb-8 ${center ? "text-center mx-auto" : ""} max-w-3xl`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight mt-2">{title}</h2>
      {sub && <p className="mt-3 text-lg text-ink/70">{sub}</p>}
    </div>
  );
}

export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

/** "In plain words" explainer box — used everywhere for non-technical audiences. */
export function PlainWords({ children, title = "In plain words" }: { children: ReactNode; title?: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-kesar/50 bg-gradient-to-br from-amber-50 to-pink-50 p-4">
      <div className="text-xs font-bold uppercase tracking-wider text-kesar mb-1">💡 {title}</div>
      <div className="text-ink/80">{children}</div>
    </div>
  );
}

export function Mandala({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 16 });
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden>
      {petals.map((_, i) => (
        <ellipse key={i} cx="0" cy="-58" rx="13" ry="34" transform={`rotate(${i * 22.5})`}
          fill={["#e6007e", "#ff7a00", "#ffc20e", "#00b3b3"][i % 4]} opacity="0.75" />
      ))}
      {petals.map((_, i) => (
        <circle key={"c" + i} cx="0" cy="-90" r="5" transform={`rotate(${i * 22.5 + 11})`} fill="#2e3192" opacity=".6" />
      ))}
      <circle r="34" fill="#fff8ef" />
      <circle r="26" fill="none" stroke="#e6007e" strokeWidth="3" strokeDasharray="4 4" />
      <circle r="14" fill="#ff7a00" />
      <circle r="6" fill="#ffc20e" />
    </svg>
  );
}
