"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Choice } from "@/lib/game/types";
import { effectSegments } from "@/lib/game/describe";

interface Props {
  choice: Choice;
  index: number;
  selected: boolean;
  disabled: boolean;
  onSelect: (choice: Choice) => void;
}

const segTone: Record<"gain" | "loss" | "neutral", string> = {
  gain: "text-ok",
  loss: "text-danger",
  neutral: "text-ink-muted",
};

/** A single tappable choice with colour-coded effect chips. */
export function ChoiceButton({ choice, index, selected, disabled, onSelect }: Props) {
  const segs = effectSegments(choice.effects);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.985 }}
      disabled={disabled}
      onClick={() => onSelect(choice)}
      aria-label={`${choice.label}. ${choice.effectDescription}`}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
        selected
          ? "border-violet-light bg-violet/10 shadow-glow"
          : "border-white/8 bg-white/[0.03] hover:border-violet/40"
      } disabled:opacity-60`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet text-sm font-bold text-white">
        {index + 1}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{choice.label}</span>
        <span className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-xs font-semibold">
          {segs.map((s, i) => (
            <span key={i} className={segTone[s.tone]}>
              {s.text}
            </span>
          ))}
        </span>
      </span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-violet-light bg-violet" : "border-white/20"
        }`}
        aria-hidden
      >
        {selected && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
      </span>
    </motion.button>
  );
}
