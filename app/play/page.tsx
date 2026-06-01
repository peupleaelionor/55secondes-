"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Flame,
  Wallet,
  TrendingUp,
  ArrowLeftRight,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { useToastStore } from "@/store/toastStore";
import { TimerRing } from "@/components/game/TimerRing";
import { StatCard } from "@/components/game/StatCard";
import { RiskBar } from "@/components/game/RiskBar";
import { ScenarioCard } from "@/components/game/ScenarioCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { GAME } from "@/lib/game/engine";
import { getGameMood, MOOD_LABEL } from "@/lib/game/scoring";
import { parseChallengeFromUrl } from "@/lib/game/seed";
import { formatEuro, formatNumber, formatDelta } from "@/lib/format";
import type { Choice } from "@/lib/game/types";

export default function PlayPage() {
  const router = useRouter();
  const state = useGameStore((s) => s.state);
  const start = useGameStore((s) => s.start);
  const choose = useGameStore((s) => s.choose);
  const finishNow = useGameStore((s) => s.finishNow);
  const push = useToastStore((s) => s.push);

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const startedRef = useRef(false);
  const prevHistory = useRef(0);
  const prevUnlocked = useRef(false);

  // Start a fresh game on mount (challenge mode, optional seed from URL).
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const seed = parseChallengeFromUrl();
    start({ mode: "challenge", seed });
    // On unmount, stop the countdown if the game is still running and we're not
    // navigating to the result (which finishes the game and clears the timer).
    return () => {
      if (useGameStore.getState().state.status === "playing") {
        useGameStore.getState().pause();
      }
    };
  }, [start]);

  // Navigate to results when the game ends.
  useEffect(() => {
    if (state.status === "won" || state.status === "lost") {
      const id = setTimeout(() => router.replace("/result"), 280);
      return () => clearTimeout(id);
    }
  }, [state.status, router]);

  // Emit a single salient toast per decision.
  useEffect(() => {
    if (state.history.length === 0 || state.history.length === prevHistory.current) {
      prevHistory.current = state.history.length;
      return;
    }
    prevHistory.current = state.history.length;
    const d = state.lastDeltas;
    const unlockedNow = state.objectivesReachedAt !== null;

    if (state.risk >= GAME.RISK_CRITICAL) {
      push("Attention : risque critique", "risk");
    } else if (unlockedNow && !prevUnlocked.current) {
      push("Profil débloqué", "win");
    } else if (state.streak > 0 && state.streak % 3 === 0) {
      push(`Série x${state.streak}`, "streak");
    } else if (d && d.riskDelta >= 6) {
      push("Risque en hausse", "risk");
    } else if (d && d.flowDelta > 0) {
      push(`Flux propre ${formatDelta(d.flowDelta, "€")}`, "gain");
    } else if (d && d.confidenceDelta > 0) {
      push("Confiance renforcée", "gain");
    }
    prevUnlocked.current = unlockedNow;
  }, [state.history.length, state.lastDeltas, state.risk, state.streak, state.objectivesReachedAt, push]);

  const onSelect = useCallback(
    (choice: Choice) => {
      if (busy || state.status !== "playing") return;
      setBusy(true);
      setSelectedChoiceId(choice.id);
      // Brief feedback window before advancing to the next scenario.
      setTimeout(() => {
        choose(choice);
        setSelectedChoiceId(null);
        setBusy(false);
      }, 160);
    },
    [busy, choose, state.status],
  );

  const d = state.lastDeltas;
  const mult = state.multiplier;
  const mood = getGameMood(state);
  const moodLabel = MOOD_LABEL[mood];
  const unlocked = state.objectivesReachedAt !== null;
  const histKey = state.history.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => router.push("/")}
          aria-label="Retour à l'accueil"
          className="glass flex h-9 w-9 items-center justify-center rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold">Partie en cours</h1>
        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 ring-1 ${
            mult >= 3 ? "bg-violet/20 ring-violet-light/60" : "glass"
          }`}
          aria-label={`Multiplicateur x${mult}`}
        >
          <Zap className={`h-4 w-4 ${mult >= 2 ? "text-violet-light" : "text-ink-muted"}`} />
          <span className="text-sm font-bold">x{mult}</span>
        </div>
      </div>

      {/* Timer */}
      <div className="flex justify-center">
        <TimerRing timeLeft={state.timeLeft} size={188} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard
          key={`bal-${histKey}`}
          icon={Wallet}
          label="Solde"
          value={formatEuro(state.balance)}
          delta={d && d.balanceDelta !== 0 ? formatDelta(d.balanceDelta, "€") : null}
          deltaTone={d && d.balanceDelta < 0 ? "loss" : "gain"}
          pulse={d && d.balanceDelta > 0 ? "ok" : null}
        />
        <StatCard
          key={`flow-${histKey}`}
          icon={TrendingUp}
          label="Flux entrants"
          value={formatEuro(state.incomingFlow)}
          delta={d && d.flowDelta !== 0 ? formatDelta(d.flowDelta, "€") : null}
          pulse={d && d.flowDelta > 0 ? "ok" : null}
        />
        <StatCard
          key={`tx-${histKey}`}
          icon={ArrowLeftRight}
          label="Transactions"
          value={formatNumber(state.transactions)}
          delta={d && d.transactionsDelta !== 0 ? formatDelta(d.transactionsDelta) : null}
        />
        <StatCard
          key={`conf-${histKey}`}
          icon={ShieldCheck}
          label="Confiance"
          value={String(Math.round(state.confidence))}
          suffix="/ 100"
          delta={d && d.confidenceDelta !== 0 ? formatDelta(d.confidenceDelta) : null}
          deltaTone={d && d.confidenceDelta < 0 ? "loss" : "gain"}
          pulse={d && d.confidenceDelta > 0 ? "ok" : null}
        />
      </div>

      <RiskBar risk={state.risk} />

      {/* Choix header */}
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold">Choix rapide</h2>
        <div className="flex items-center gap-1.5 text-right">
          <Flame className="h-4 w-4 text-warn" />
          <div className="leading-tight">
            <p className="text-xs font-bold uppercase tracking-wider">
              Série x{state.streak}
            </p>
            <p className="text-[10px] text-ink-muted">Meilleure : x{state.bestStreak}</p>
          </div>
        </div>
      </div>

      {/* Mood banner */}
      <AnimatePresence>
        {moodLabel && (
          <motion.div
            key={moodLabel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden rounded-xl px-3 py-2 text-center text-sm font-bold ${
              mood === "critical"
                ? "bg-danger/15 text-danger"
                : mood === "unstable"
                  ? "bg-warn/15 text-warn"
                  : mood === "royal"
                    ? "bg-gold/15 text-gold"
                    : "bg-violet/15 text-violet-light"
            }`}
          >
            {moodLabel}
          </motion.div>
        )}
      </AnimatePresence>

      {state.selectedScenario && (
        <ScenarioCard
          scenario={state.selectedScenario}
          selectedChoiceId={selectedChoiceId}
          disabled={busy || state.status !== "playing"}
          onSelect={onSelect}
        />
      )}

      {/* Profile unlocked banner + finish-now */}
      <AnimatePresence>
        {unlocked && state.status === "playing" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-strong flex items-center gap-3 rounded-2xl p-3"
          >
            <BadgeCheck className="h-6 w-6 shrink-0 text-ok" />
            <div className="min-w-0 flex-1">
              <p className="font-bold">Profil débloqué</p>
              <p className="text-xs text-ink-muted">
                Continue pour optimiser ton score, ou termine maintenant.
              </p>
            </div>
            <GlowButton variant="secondary" onClick={finishNow} className="px-4 py-2 text-sm">
              Terminer
            </GlowButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
