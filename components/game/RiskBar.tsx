"use client";

import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { computeRiskLabel } from "@/lib/game/engine";
import type { RiskLabel } from "@/lib/game/types";

interface Props {
  risk: number;
}

const LABEL_COLOR: Record<RiskLabel, string> = {
  faible: "text-ok",
  modéré: "text-warn",
  élevé: "text-warn",
  critique: "text-danger",
};

const SEGMENTS = 7;

/**
 * Segmented "risque de blocage" bar. Uses both colour AND label/segments so
 * risk is never communicated by colour alone (accessibility).
 */
export function RiskBar({ risk }: Props) {
  const value = Math.min(100, Math.max(0, Number.isFinite(risk) ? risk : 0));
  const label = computeRiskLabel(value);
  const filled = Math.round((value / 100) * SEGMENTS);
  const critical = value >= 85;

  return (
    <motion.div
      className="glass rounded-2xl px-4 py-3"
      animate={critical ? { x: [0, -2, 2, -1, 0] } : undefined}
      transition={{ duration: 0.4, repeat: critical ? Infinity : 0, repeatDelay: 1.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`h-4 w-4 ${LABEL_COLOR[label]}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Risque de blocage
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold tabular-nums">{Math.round(value)} / 100</span>
          <span className={`font-bold capitalize ${LABEL_COLOR[label]}`}>{label}</span>
        </div>
      </div>
      <div className="mt-2 flex gap-1.5" role="meter" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={`Risque ${label}`}>
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const on = i < filled;
          const color =
            value >= 85
              ? "bg-danger"
              : value >= 50
                ? "bg-warn"
                : "bg-violet";
          return (
            <span
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${on ? color : "bg-white/8"}`}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
