"use client";

import { initials } from "@/lib/format";

interface Props {
  seed: string;
  size?: number;
  isPlayer?: boolean;
  className?: string;
}

/** Deterministic gradient avatar bubble (CSS placeholder for real art). */
export function Avatar({ seed, size = 44, isPlayer, className }: Props) {
  // Hash the seed into a stable hue pair.
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  const hue2 = (hue + 40) % 360;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-1 ${isPlayer ? "ring-violet-light" : "ring-white/15"} ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        backgroundImage: `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${hue2} 65% 30%))`,
      }}
      aria-hidden
    >
      {initials(seed)}
    </div>
  );
}
