"use client";

import { motion } from "framer-motion";
import { Dna } from "lucide-react";
import { DNA_LABELS, dnaInsight, topDnaAxes, type DecisionDNA } from "@/lib/game/dna";

interface Props {
  dna: DecisionDNA;
}

/** "ADN Business" — top decision dimensions with animated bars. */
export function DnaPanel({ dna }: Props) {
  const axes = topDnaAxes(dna);
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <Dna className="h-4 w-4 text-violet-light" />
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-light">
          Ton ADN business
        </p>
      </div>

      <div className="mt-3 space-y-2.5">
        {axes.map((axis, i) => (
          <div key={axis.key}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{DNA_LABELS[axis.key]}</span>
              <span className="font-bold tabular-nums">{axis.value}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-light to-violet"
                initial={{ width: 0 }}
                animate={{ width: `${axis.value}%` }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08 }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-sm text-ink-muted">{dnaInsight(dna)}</p>
    </div>
  );
}
