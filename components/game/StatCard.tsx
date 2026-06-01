"use client";

import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  /** Signed delta string for the live "+X" feedback (e.g. "+342 €"). */
  delta?: string | null;
  deltaTone?: "gain" | "loss";
  /** Pulse colour when the value just changed. */
  pulse?: "ok" | "risk" | null;
  suffix?: string;
}

/** Compact live stat tile. Memoized to limit re-renders during the timer. */
export const StatCard = memo(function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaTone = "gain",
  pulse,
  suffix,
}: Props) {
  return (
    <motion.div
      className="glass relative flex flex-col gap-1 rounded-2xl p-3"
      animate={
        pulse === "ok"
          ? { boxShadow: ["0 0 0 rgba(34,197,94,0)", "0 0 20px rgba(34,197,94,0.45)", "0 0 0 rgba(34,197,94,0)"] }
          : pulse === "risk"
            ? { boxShadow: ["0 0 0 rgba(239,68,68,0)", "0 0 20px rgba(239,68,68,0.5)", "0 0 0 rgba(239,68,68,0)"] }
            : undefined
      }
      transition={{ duration: 0.6 }}
    >
      <Icon className="h-5 w-5 text-violet-light" strokeWidth={2} />
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className="text-lg font-bold leading-none tabular-nums">
        {value}
        {suffix && <span className="text-sm text-ink-muted"> {suffix}</span>}
      </p>
      <div className="h-4">
        <AnimatePresence mode="wait">
          {delta && (
            <motion.p
              key={delta}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className={`text-xs font-bold ${deltaTone === "gain" ? "text-ok" : "text-danger"}`}
            >
              {delta}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});
