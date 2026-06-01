"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastStore, type ToastTone } from "@/store/toastStore";

const toneClass: Record<ToastTone, string> = {
  neutral: "border-violet/30 text-ink",
  gain: "border-ok/40 text-ok",
  risk: "border-warn/50 text-warn",
  streak: "border-violet-light/60 text-violet-light",
  win: "border-gold/50 text-gold",
};

/** Non-intrusive, short-lived feedback toasts stacked above the bottom nav. */
export function GameToastLayer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className={`glass-strong rounded-full border px-4 py-2 text-sm font-semibold shadow-glow ${toneClass[t.tone]}`}
            role="status"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
