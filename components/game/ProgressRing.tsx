"use client";

import { motion } from "framer-motion";
import { useId, type ReactNode } from "react";

interface Props {
  /** 0..1 fraction filled. */
  progress: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  /** Gradient stops for the active arc. */
  from?: string;
  to?: string;
  /** Dashed track behind the arc, like the mockups. */
  dashed?: boolean;
  glow?: boolean;
  className?: string;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));

/** Premium circular progress ring with a glowing arc and dashed track. */
export function ProgressRing({
  progress,
  size = 200,
  stroke = 12,
  children,
  from = "#C084FC",
  to = "#8B5CF6",
  dashed = true,
  glow = true,
  className,
}: Props) {
  const p = clamp01(progress);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = `r${useId().replace(/:/g, "")}`;

  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(160,110,255,0.16)"
          strokeWidth={dashed ? 3 : stroke}
          strokeDasharray={dashed ? "2 7" : undefined}
          strokeLinecap="round"
        />

        {/* Active arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - p) }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          style={glow ? { filter: "drop-shadow(0 0 8px rgba(168,85,247,0.7))" } : undefined}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
