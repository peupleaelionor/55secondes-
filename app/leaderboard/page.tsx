"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Rocket, UserPlus, ShieldCheck } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Podium } from "@/components/leaderboard/Podium";
import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";
import { Avatar } from "@/components/leaderboard/Avatar";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { useProfileStore } from "@/store/profileStore";
import { useToastStore } from "@/store/toastStore";
import {
  generateMockLeaderboard,
  type LeaderboardScope,
} from "@/lib/game/mockLeaderboard";
import { getDailyPulse, timeUntilReset } from "@/lib/game/daily";
import { createChallengeSeed, buildChallengeUrl } from "@/lib/game/seed";
import { shareText } from "@/lib/share";
import { formatNumber } from "@/lib/format";

const TABS: { id: LeaderboardScope; label: string }[] = [
  { id: "global", label: "Global" },
  { id: "friends", label: "Amis" },
  { id: "week", label: "Cette semaine" },
];

export default function LeaderboardPage() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const push = useToastStore((s) => s.push);
  const [scope, setScope] = useState<LeaderboardScope>("global");

  const entries = useMemo(
    () =>
      generateMockLeaderboard(scope, {
        pseudo: profile.pseudo,
        amount: profile.bestFlow,
        confidence: profile.bestConfidence || 50,
      }),
    [scope, profile.pseudo, profile.bestFlow, profile.bestConfidence],
  );

  const top3 = entries.slice(0, 3);
  const player = entries.find((e) => e.isPlayer) ?? null;
  const list = entries.filter((e) => e.rank > 3 && !e.isPlayer).slice(0, 7);

  const pulse = getDailyPulse();
  const reset = timeUntilReset();

  const invite = async () => {
    const url = buildChallengeUrl(createChallengeSeed());
    const res = await shareText(
      "Je t'ai lancé un défi sur 55 Seconds. Même chrono, mêmes décisions. Tu fais mieux ?",
      url,
    );
    if (res.ok) push(res.method === "clipboard" ? "Lien copié" : "Invitation envoyée", "win");
  };

  return (
    <div className="space-y-4">
      <TopBar title="Classement" big />

      {/* Tabs */}
      <div className="glass flex rounded-2xl p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setScope(t.id)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
              scope === t.id ? "bg-violet text-white shadow-glow" : "text-ink-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Podium top3={top3} />

      {/* Player standing */}
      {player && (
        <GlassCard className="flex items-center gap-3 p-4 ring-1 ring-violet/40">
          <Avatar seed={player.avatarSeed} size={48} isPlayer />
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-ink-muted">Votre position</p>
            <p className="text-2xl font-extrabold italic">#{player.rank}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold text-violet-light">
              {formatNumber(player.amount)} €
            </p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-ink-muted">
              <ShieldCheck className="h-3 w-3 text-violet-light" />
              Confiance {player.confidence}%
            </span>
          </div>
        </GlassCard>
      )}

      <LeaderboardList entries={list} />

      <p className="text-center text-[11px] text-ink-muted/70">
        Classement fictif (V1). Le classement en ligne arrive bientôt.
      </p>

      {/* Daily challenge call-out */}
      <GlassCard className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet/15 ring-1 ring-violet/30">
            <Target className="h-6 w-6 text-violet-light" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-light">
              Défi du jour
            </p>
            <p className="font-bold">{pulse.mainChallenge.title}</p>
            <p className="text-sm text-ink-muted">{pulse.mainChallenge.description}</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-ink-muted">Récompense</p>
            <p className="text-sm font-bold text-violet-light">+{pulse.mainChallenge.rewardXp} XP</p>
            <p className="text-[10px] text-ink-muted">
              {reset.hours}h {reset.minutes}m restantes
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <GlowButton onClick={() => router.push("/play")} className="py-3 text-sm">
            <Rocket className="h-4 w-4" />
            Lancer le défi
          </GlowButton>
          <GlowButton variant="secondary" onClick={invite} className="py-3 text-sm">
            <UserPlus className="h-4 w-4 text-violet-light" />
            Inviter un ami
          </GlowButton>
        </div>
      </GlassCard>

      <Disclaimer />
    </div>
  );
}
