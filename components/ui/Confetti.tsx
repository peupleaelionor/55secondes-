"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#A855F7", "#C084FC", "#8B5CF6", "#FBBF24", "#22C55E"];

/** Subtle, lightweight confetti burst (CSS/transform only). */
export function Confetti({ count = 24 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 320,
        delay: Math.random() * 0.25,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 6,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center overflow-visible" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{ width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 420, x: p.x, opacity: 0, rotate: p.rotate }}
          transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
