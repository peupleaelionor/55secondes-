"use client";

import { create } from "zustand";
import type { Choice, GameMode, GameState, Scenario } from "@/lib/game/types";
import {
  applyChoice,
  createInitialGameState,
  finishGame,
  startGame,
  tick as tickState,
} from "@/lib/game/engine";
import { checkBadges } from "@/lib/game/badges";
import { getScenariosFromSeed } from "@/lib/game/seed";
import { playSound, triggerHaptic } from "@/lib/haptics";
import { useProfileStore } from "./profileStore";
import { track } from "@/lib/analytics";

/**
 * Single source of truth for the live game. The countdown interval lives at
 * module scope and is always cleared before a new one starts, so it is
 * impossible to run two timers at once (anti-bug requirement).
 */
let intervalId: ReturnType<typeof setInterval> | null = null;

function clearTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

interface GameStore {
  state: GameState;
  mode: GameMode;
  seed: string | null;
  /** Badges unlocked in THIS game that the player didn't already own. */
  newBadges: string[];
  start: (opts?: { mode?: GameMode; seed?: string | null }) => void;
  choose: (choice: Choice) => void;
  finishNow: () => void;
  /** Stop the countdown without finishing (e.g. when leaving the screen). */
  pause: () => void;
  reset: () => void;
}

function fx(sound: Parameters<typeof playSound>[0], haptic?: Parameters<typeof triggerHaptic>[0]) {
  const settings = useProfileStore.getState().settings;
  if (settings.soundEnabled) playSound(sound);
  if (haptic && settings.hapticsEnabled) triggerHaptic(haptic);
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: createInitialGameState(),
  mode: "challenge",
  seed: null,
  newBadges: [],

  start: (opts) => {
    clearTimer();
    const mode = opts?.mode ?? "challenge";
    const seed = opts?.seed ?? null;

    let initial = startGame();
    if (seed) {
      const queue: Scenario[] = getScenariosFromSeed(seed);
      initial = { ...initial, selectedScenario: queue[0] ?? initial.selectedScenario };
    }

    set({ state: initial, mode, seed, newBadges: [] });
    track("game_started", { mode, seeded: !!seed });

    // Training mode has no countdown.
    if (mode === "training") return;

    intervalId = setInterval(() => {
      const current = get().state;
      const next = tickState(current);
      if (next.status !== "playing") {
        clearTimer();
        get().finishNow();
        return;
      }
      // Subtle tick in the final stretch.
      if (next.timeLeft <= 5) fx("tick");
      set({ state: next });
    }, 1000);
  },

  choose: (choice) => {
    const current = get().state;
    if (current.status !== "playing" || !current.selectedScenario) return;

    const prevRisk = current.risk;
    let next = applyChoice(current, choice);

    // Seed mode: replace the random next scenario with the deterministic one.
    const seed = get().seed;
    if (seed && next.status === "playing") {
      const queue = getScenariosFromSeed(seed);
      const idx = next.history.length;
      const forced = queue[idx % queue.length];
      if (forced) next = { ...next, selectedScenario: forced };
    }

    track("choice_selected", { choiceId: choice.id, tone: choice.tone ?? "safe" });

    if (next.risk >= 85 && prevRisk < 85) fx("risk", "warning");
    else if (choice.effects.confidenceDelta > 0 || choice.effects.flowDelta > 0)
      fx("tap", "light");
    else fx("tap");

    set({ state: next });

    if (next.status !== "playing") {
      clearTimer();
      get().finishNow();
    }
  },

  finishNow: () => {
    clearTimer();
    const current = get().state;
    if (current.status === "idle") return;

    const finished =
      current.status === "playing" ? finishGame(current) : current;
    const unlocked = checkBadges(finished);
    const withBadges: GameState = { ...finished, badgesUnlocked: unlocked };

    const ownedBefore = new Set(useProfileStore.getState().profile.badges);
    const newBadges = unlocked.filter((id) => !ownedBefore.has(id));

    set({ state: withBadges, newBadges });

    // Persist progression.
    useProfileStore.getState().recordGame(withBadges);

    track("game_finished", {
      score: withBadges.finalScore,
      won: withBadges.status === "won",
    });

    fx(withBadges.status === "won" ? "success" : "fail", "success");
  },

  pause: () => {
    clearTimer();
  },

  reset: () => {
    clearTimer();
    set({ state: createInitialGameState(), seed: null, newBadges: [] });
  },
}));
