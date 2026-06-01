"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, ShieldCheck } from "lucide-react";
import { useProfileStore } from "@/store/profileStore";
import { GlowButton } from "@/components/ui/GlowButton";

const STEPS = [
  { icon: Zap, title: "Choisis vite.", text: "55 secondes. Chaque décision compte." },
  { icon: TrendingUp, title: "Génère du flux.", text: "Crée du flux fictif et enchaîne les séries." },
  { icon: ShieldCheck, title: "Maîtrise le risque.", text: "Reste crédible pour débloquer ton profil." },
];

/** Ultra-short 3-step intro, shown once. Fully skippable. */
export function Onboarding() {
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-bg/85 backdrop-blur-md sm:items-center"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="glass-strong m-3 w-full max-w-md rounded-3xl p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-light">
          55 Seconds
        </p>
        <h2 className="mt-1 text-2xl font-extrabold italic tracking-tight">
          Teste ton instinct business.
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Simulation fictive. Réflexes réels.
        </p>

        <div className="mt-5 space-y-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/15 ring-1 ring-violet/30">
                <Icon className="h-5 w-5 text-violet-light" />
              </div>
              <div>
                <p className="font-semibold">
                  <span className="mr-2 text-violet-light">{i + 1}</span>
                  {title}
                </p>
                <p className="text-sm text-ink-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <GlowButton onClick={completeOnboarding} className="w-full">
            J&apos;ai compris
          </GlowButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
