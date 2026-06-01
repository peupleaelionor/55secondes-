"use client";

import { motion } from "framer-motion";
import { Fingerprint } from "lucide-react";
import type { Archetype } from "@/lib/game/archetypes";

interface Props {
  archetype: Archetype;
  compact?: boolean;
}

/** Premium archetype card with a soft aura in the archetype's gradient. */
export function ArchetypeCard({ archetype, compact }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass relative overflow-hidden rounded-2xl p-4"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl"
        style={{
          backgroundImage: `linear-gradient(135deg, ${archetype.gradient[0]}, ${archetype.gradient[1]})`,
        }}
        aria-hidden
      />
      <div className="relative">
        <div className="flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-violet-light" />
          <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-light">
            Ton profil business
          </p>
        </div>
        <h3
          className="mt-1 bg-clip-text text-2xl font-extrabold italic tracking-tight text-transparent"
          style={{
            backgroundImage: `linear-gradient(100deg, ${archetype.gradient[0]}, ${archetype.gradient[1]})`,
          }}
        >
          {archetype.name}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">{archetype.description}</p>

        {!compact && (
          <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
            <Row label="Force" value={archetype.strength} tone="text-ok" />
            <Row label="Faiblesse" value={archetype.weakness} tone="text-warn" />
            <Row label="Conseil" value={archetype.nextAdvice} tone="text-violet-light" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex gap-2">
      <span className={`w-20 shrink-0 text-xs font-bold uppercase tracking-wide ${tone}`}>
        {label}
      </span>
      <span className="text-ink-muted">{value}</span>
    </div>
  );
}
