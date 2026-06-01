"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Choice, Scenario } from "@/lib/game/types";
import { Icon } from "@/components/Icon";
import { ChoiceButton } from "./ChoiceButton";
import { formatEuro } from "@/lib/format";

interface Props {
  scenario: Scenario;
  selectedChoiceId: string | null;
  disabled: boolean;
  onSelect: (choice: Choice) => void;
}

const RARITY_RING: Record<string, string> = {
  common: "ring-violet/30",
  rare: "ring-violet-light/50",
  epic: "ring-violet-light/70",
  legendary: "ring-gold/60",
};

/** The quick-decision scenario card; animates on scenario change. */
export function ScenarioCard({ scenario, selectedChoiceId, disabled, onSelect }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scenario.id}
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.99 }}
        transition={{ duration: 0.22 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet/12 ring-1 ${RARITY_RING[scenario.rarity] ?? "ring-violet/30"}`}
          >
            <Icon name={scenario.icon} className="h-7 w-7 text-violet-light" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold leading-snug">{scenario.description}</p>
            <p className="mt-1 text-sm text-ink-muted">
              Montant du projet : {formatEuro(scenario.projectAmount)}
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {scenario.choices.map((choice, i) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              index={i}
              selected={selectedChoiceId === choice.id}
              disabled={disabled}
              onSelect={onSelect}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
