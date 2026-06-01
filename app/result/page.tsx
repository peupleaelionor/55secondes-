"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  ArrowLeftRight,
  ShieldCheck,
  BadgeCheck,
  RotateCw,
  Trophy,
  Share2,
  Copy,
  Swords,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { useProfileStore } from "@/store/profileStore";
import { useToastStore } from "@/store/toastStore";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { ScoreCircle } from "@/components/game/ScoreCircle";
import { DnaPanel } from "@/components/result/DnaPanel";
import { ArchetypeCard } from "@/components/result/ArchetypeCard";
import { ResultShareCard } from "@/components/result/ResultShareCard";
import { NextBestAction } from "@/components/result/NextBestAction";
import { Confetti } from "@/components/ui/Confetti";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { RARITY_STYLE } from "@/components/game/BadgeCard";
import { Icon } from "@/components/Icon";
import { getResultAnalysis, getResultTitle } from "@/lib/game/scoring";
import { computeDecisionDNA, dominantSkill } from "@/lib/game/dna";
import { computeArchetype } from "@/lib/game/archetypes";
import { getBadge } from "@/lib/game/badges";
import { getShareText, shareText, type ShareVariant, SHARE_LABELS } from "@/lib/share";
import { createChallengeSeed, buildChallengeUrl } from "@/lib/game/seed";
import { xpForGame, XP_REWARDS } from "@/lib/game/levels";
import { formatEuro, formatNumber } from "@/lib/format";
import { track } from "@/lib/analytics";

export default function ResultPage() {
  const router = useRouter();
  const state = useGameStore((s) => s.state);
  const newBadges = useGameStore((s) => s.newBadges);
  const addXp = useProfileStore((s) => s.addXp);
  const push = useToastStore((s) => s.push);

  const [variant, setVariant] = useState<ShareVariant>(1);
  const sharedRef = useRef(false);

  const won = state.status === "won";

  const { dna, archetype, analysis, skill } = useMemo(() => {
    const d = computeDecisionDNA(state);
    return {
      dna: d,
      archetype: computeArchetype(d),
      analysis: getResultAnalysis(state),
      skill: dominantSkill(state),
    };
  }, [state]);

  const titleInfo = getResultTitle(state);
  const topNewBadge = newBadges
    .map((id) => getBadge(id))
    .filter(Boolean)
    .sort((a, b) => rarityRank(b!.rarity) - rarityRank(a!.rarity))[0];

  // Guard against direct navigation / refresh with no game.
  useEffect(() => {
    if (state.status === "idle") router.replace("/");
  }, [state.status, router]);

  const shareData = {
    score: state.finalScore,
    flow: state.incomingFlow,
    badgeName: topNewBadge?.name ?? null,
    archetype: archetype.name,
  };

  const grantShareXpOnce = () => {
    if (sharedRef.current) return;
    sharedRef.current = true;
    addXp(XP_REWARDS.share);
  };

  const doShare = async (v: ShareVariant = variant) => {
    const res = await shareText(getShareText(shareData, v));
    track("score_shared", { variant: v, method: res.method });
    if (res.ok) {
      grantShareXpOnce();
      push(res.method === "clipboard" ? "Copié dans le presse-papiers" : "Partagé", "gain");
    }
  };

  const doCopy = async () => {
    const text = getShareText(shareData, variant);
    try {
      await navigator.clipboard.writeText(text);
      grantShareXpOnce();
      push("Texte copié", "gain");
    } catch {
      push("Copie indisponible", "risk");
    }
  };

  const doDuel = async () => {
    const seed = createChallengeSeed();
    const url = buildChallengeUrl(seed);
    track("friend_challenge_created", { seed });
    const res = await shareText(getShareText(shareData, 5), url);
    if (res.ok) push(res.method === "clipboard" ? "Défi copié" : "Défi envoyé", "win");
  };

  if (state.status === "idle") return null;

  const xpGained = xpForGame(state);

  return (
    <div className="relative space-y-4">
      {won && <Confetti />}
      <TopBar title="Résultat" big />
      <p className="text-sm text-ink-muted">
        Partie terminée en <span className="font-semibold text-violet-light">55 secondes.</span>
      </p>

      {/* Verdict */}
      <div className="flex flex-col items-center py-1 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 16 }}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${won ? "bg-violet/20 shadow-glow" : "bg-white/5"}`}
        >
          <BadgeCheck className={`h-7 w-7 ${won ? "text-violet-light" : "text-ink-muted"}`} />
        </motion.div>
        <h2 className="mt-2 text-3xl font-extrabold italic tracking-tight">
          {won ? <span className="text-gradient-violet">{titleInfo.title}</span> : titleInfo.title}
        </h2>
        <p className="text-sm text-ink-muted">{titleInfo.subtitle}</p>
      </div>

      {/* Score + stats */}
      <GlassCard className="flex items-center gap-4 p-4">
        <ScoreCircle score={state.finalScore} size={150} />
        <div className="flex-1 space-y-2">
          <StatRow icon={Wallet} label="Solde final" value={formatEuro(state.balance)} />
          <div className="divider" />
          <StatRow icon={TrendingUp} label="Flux entrants" value={formatEuro(state.incomingFlow)} />
          <div className="divider" />
          <StatRow icon={ArrowLeftRight} label="Transactions" value={formatNumber(state.transactions)} />
          <div className="divider" />
          <StatRow icon={ShieldCheck} label="Confiance" value={`${Math.round(state.confidence)}/100`} />
        </div>
      </GlassCard>

      {/* Analysis + skill */}
      <GlassCard className="space-y-2 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-light" />
          <div>
            <p className="font-bold">{analysis.headline}</p>
            <p className="text-sm text-ink-muted">{analysis.detail}</p>
          </div>
        </div>
        <div className="rounded-xl bg-white/[0.03] px-3 py-2 text-sm">
          <span className="text-ink-muted">Compétence dominante entraînée : </span>
          <span className="font-semibold text-violet-light">{skill}</span>
        </div>
        <p className="text-right text-xs font-semibold text-ok">+{xpGained} XP</p>
      </GlassCard>

      {/* Decision DNA + archetype */}
      <DnaPanel dna={dna} />
      <ArchetypeCard archetype={archetype} />

      {/* Share */}
      <GlassCard strong className="space-y-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(SHARE_LABELS) as unknown as string[]).map((k) => {
            const v = Number(k) as ShareVariant;
            return (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  variant === v
                    ? "bg-violet text-white"
                    : "bg-white/[0.04] text-ink-muted hover:text-ink"
                }`}
              >
                {SHARE_LABELS[v]}
              </button>
            );
          })}
        </div>
        <p className="whitespace-pre-line rounded-xl bg-white/[0.03] p-3 text-sm font-medium leading-relaxed">
          {getShareText(shareData, variant)}
        </p>
        <GlowButton onClick={() => doShare()} className="w-full">
          <Share2 className="h-5 w-5" />
          Partager mon score
        </GlowButton>
        <div className="grid grid-cols-2 gap-2">
          <GlowButton variant="secondary" onClick={doCopy} className="py-3 text-sm">
            <Copy className="h-4 w-4" />
            Copier le texte
          </GlowButton>
          <GlowButton variant="secondary" onClick={doDuel} className="py-3 text-sm">
            <Swords className="h-4 w-4 text-violet-light" />
            Défier un ami
          </GlowButton>
        </div>
      </GlassCard>

      {/* Screenshot-ready visual */}
      <ResultShareCard
        score={state.finalScore}
        flow={state.incomingFlow}
        archetype={archetype}
        badgeName={topNewBadge?.name ?? null}
      />

      {/* Next best action */}
      <NextBestAction
        score={state.finalScore}
        onReplay={() => router.push("/play")}
        onDuel={doDuel}
        onShare={() => doShare()}
      />

      <div className="grid grid-cols-2 gap-3">
        <GlowButton variant="secondary" onClick={() => router.push("/play")}>
          <RotateCw className="h-5 w-5" />
          Rejouer
        </GlowButton>
        <GlowButton variant="secondary" onClick={() => router.push("/leaderboard")}>
          <Trophy className="h-5 w-5 text-violet-light" />
          Classement
        </GlowButton>
      </div>

      {/* New badge */}
      {topNewBadge && (
        <button
          onClick={() => router.push("/profile")}
          className="w-full text-left"
          aria-label={`Badge débloqué : ${topNewBadge.name}`}
        >
          <GlassCard className="flex items-center gap-3 p-3 ring-1 ring-violet/40">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-violet/12 ring-1 ${RARITY_STYLE[topNewBadge.rarity].ring} shadow-glow`}
            >
              <Icon name={topNewBadge.icon} className={`h-6 w-6 ${RARITY_STYLE[topNewBadge.rarity].text}`} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-light">
                Nouveau badge débloqué
              </p>
              <p className="font-bold italic">{topNewBadge.name}</p>
              <p className="text-xs text-ink-muted">{topNewBadge.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-ink-muted" />
          </GlassCard>
        </button>
      )}

      <Disclaimer />
    </div>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-violet-light" />
      <span className="flex-1 text-sm text-ink-muted">{label}</span>
      <span className="font-bold tabular-nums">{value}</span>
    </div>
  );
}

function rarityRank(r: string): number {
  return { common: 0, rare: 1, epic: 2, legendary: 3 }[r] ?? 0;
}
