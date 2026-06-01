"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Rocket, Check, Clock, Sparkles, GraduationCap } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Icon } from "@/components/Icon";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { getDailyChallenges, getDailyPulse, timeUntilReset } from "@/lib/game/daily";
import type { DailyChallenge } from "@/lib/game/types";

export default function DailyPage() {
  const router = useRouter();
  const challenges = useMemo(() => getDailyChallenges(), []);
  const pulse = useMemo(() => getDailyPulse(), []);
  const reset = timeUntilReset();
  const completed = challenges.filter((c) => c.progress >= 1).length;

  return (
    <div className="space-y-4">
      <TopBar title="Défis du jour" big />

      <GlassCard className="flex items-center gap-3 p-4">
        <Sparkles className="h-5 w-5 shrink-0 text-violet-light" />
        <div className="flex-1">
          <p className="font-bold italic">{pulse.line}</p>
          <p className="text-xs text-ink-muted">
            {completed}/{challenges.length} validés · réinitialisation dans {reset.hours}h {reset.minutes}m
          </p>
        </div>
        <Clock className="h-5 w-5 text-ink-muted" />
      </GlassCard>

      <div className="space-y-2">
        {challenges.map((c, i) => (
          <ChallengeRow key={c.id} challenge={c} main={i === 0} />
        ))}
      </div>

      <GlowButton onClick={() => router.push("/play")} className="w-full">
        <Rocket className="h-5 w-5" />
        Lancer une partie
      </GlowButton>

      {/* Training mode teaser (architecture ready) */}
      <GlassCard className="flex items-center gap-3 p-4 opacity-90">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet/15 ring-1 ring-violet/30">
          <GraduationCap className="h-6 w-6 text-violet-light" />
        </div>
        <div className="flex-1">
          <p className="font-bold">Mode entraînement</p>
          <p className="text-sm text-ink-muted">
            Sans chrono, avec explications après chaque choix. Plus utile, moins viral.
          </p>
        </div>
        <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-ink-muted">
          Bientôt
        </span>
      </GlassCard>

      <Disclaimer />
    </div>
  );
}

function ChallengeRow({ challenge, main }: { challenge: DailyChallenge; main?: boolean }) {
  const done = challenge.progress >= 1;
  const pct = Math.round(challenge.progress * 100);
  return (
    <GlassCard className={`p-4 ${main ? "ring-1 ring-violet/40" : ""}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${
            done ? "bg-ok/15 ring-ok/40" : "bg-violet/12 ring-violet/30"
          }`}
        >
          {done ? (
            <Check className="h-6 w-6 text-ok" strokeWidth={3} />
          ) : (
            <Icon name={challenge.icon} className="h-6 w-6 text-violet-light" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold">{challenge.title}</p>
            <span className="shrink-0 text-xs font-semibold text-violet-light">
              +{challenge.rewardXp} XP
            </span>
          </div>
          <p className="text-sm text-ink-muted">{challenge.description}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className={`h-full rounded-full ${done ? "bg-ok" : "bg-gradient-to-r from-violet-light to-violet"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
