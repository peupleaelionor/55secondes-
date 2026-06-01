"use client";

import { create } from "zustand";
import type { GameState, PlayerProfile, PlayerSettings } from "@/lib/game/types";
import { safeGet, safeSet, safeRemove, STORAGE_KEYS } from "@/lib/storage";
import { levelFromXp, xpForGame, XP_REWARDS } from "@/lib/game/levels";
import { computeDecisionDNA } from "@/lib/game/dna";
import { computeArchetype } from "@/lib/game/archetypes";
import { dayKey } from "@/lib/game/daily";
import { checkWinCondition } from "@/lib/game/engine";
import { track } from "@/lib/analytics";

const DEFAULT_PROFILE: PlayerProfile = {
  pseudo: "Toi",
  level: 1,
  xp: 0,
  gamesPlayed: 0,
  wins: 0,
  streak: 0,
  lastPlayedDate: null,
  bestScore: 0,
  bestBalance: 0,
  bestFlow: 0,
  bestConfidence: 0,
  bestRiskControl: 0,
  badges: [],
  topArchetype: null,
};

const DEFAULT_SETTINGS: PlayerSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
};

interface RecordResult {
  xpGained: number;
  leveledUp: boolean;
  newLevel: number;
}

interface ProfileStore {
  profile: PlayerProfile;
  settings: PlayerSettings;
  onboardingSeen: boolean;
  hydrated: boolean;
  hydrate: () => void;
  recordGame: (state: GameState, opts?: { shared?: boolean }) => RecordResult;
  addXp: (amount: number) => void;
  setPseudo: (pseudo: string) => void;
  completeOnboarding: () => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  resetData: () => void;
}

function persist(profile: PlayerProfile) {
  safeSet(STORAGE_KEYS.profile, profile);
}

function nextStreak(profile: PlayerProfile, today: string): number {
  if (profile.lastPlayedDate === today) return profile.streak || 1;
  const yesterday = dayKey(new Date(Date.now() - 86_400_000));
  if (profile.lastPlayedDate === yesterday) return (profile.streak || 0) + 1;
  return 1;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: DEFAULT_PROFILE,
  settings: DEFAULT_SETTINGS,
  onboardingSeen: false,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const profile = { ...DEFAULT_PROFILE, ...safeGet(STORAGE_KEYS.profile, {}) };
    const settings = { ...DEFAULT_SETTINGS, ...safeGet(STORAGE_KEYS.settings, {}) };
    const onboardingSeen = safeGet<boolean>(STORAGE_KEYS.onboarding, false);
    // Keep derived level in sync with stored XP.
    profile.level = levelFromXp(profile.xp).level;
    set({ profile, settings, onboardingSeen, hydrated: true });
  },

  recordGame: (state, opts) => {
    const prev = get().profile;
    const today = dayKey();
    const won = checkWinCondition(state) && state.status === "won";

    let xpGained = xpForGame(state);
    if (opts?.shared) xpGained += XP_REWARDS.share;

    const dna = computeDecisionDNA(state);
    const archetype = computeArchetype(dna);

    const riskControl = Math.round(100 - state.risk);

    const updated: PlayerProfile = {
      ...prev,
      xp: prev.xp + xpGained,
      gamesPlayed: prev.gamesPlayed + 1,
      wins: prev.wins + (won ? 1 : 0),
      streak: nextStreak(prev, today),
      lastPlayedDate: today,
      bestScore: Math.max(prev.bestScore, state.finalScore),
      bestBalance: Math.max(prev.bestBalance, Math.round(state.balance)),
      bestFlow: Math.max(prev.bestFlow, Math.round(state.incomingFlow)),
      bestConfidence: Math.max(prev.bestConfidence, Math.round(state.confidence)),
      bestRiskControl: Math.max(prev.bestRiskControl, riskControl),
      badges: Array.from(new Set([...prev.badges, ...state.badgesUnlocked])),
      topArchetype:
        state.finalScore >= prev.bestScore ? archetype.id : prev.topArchetype,
    };

    const prevLevel = levelFromXp(prev.xp).level;
    const newLevel = levelFromXp(updated.xp).level;
    updated.level = newLevel;

    persist(updated);
    set({ profile: updated });
    track("profile_updated", { level: newLevel, xp: updated.xp });

    return {
      xpGained,
      leveledUp: newLevel > prevLevel,
      newLevel,
    };
  },

  addXp: (amount) => {
    const prev = get().profile;
    const xp = prev.xp + Math.max(0, Math.round(amount));
    const updated = { ...prev, xp, level: levelFromXp(xp).level };
    persist(updated);
    set({ profile: updated });
  },

  setPseudo: (pseudo) => {
    const clean = pseudo.trim().slice(0, 18) || "Toi";
    const updated = { ...get().profile, pseudo: clean };
    persist(updated);
    set({ profile: updated });
  },

  completeOnboarding: () => {
    safeSet(STORAGE_KEYS.onboarding, true);
    set({ onboardingSeen: true });
    track("onboarding_completed");
  },

  toggleSound: () => {
    const settings = { ...get().settings, soundEnabled: !get().settings.soundEnabled };
    safeSet(STORAGE_KEYS.settings, settings);
    set({ settings });
  },

  toggleHaptics: () => {
    const settings = {
      ...get().settings,
      hapticsEnabled: !get().settings.hapticsEnabled,
    };
    safeSet(STORAGE_KEYS.settings, settings);
    set({ settings });
  },

  resetData: () => {
    safeRemove(STORAGE_KEYS.profile);
    safeRemove(STORAGE_KEYS.settings);
    safeRemove(STORAGE_KEYS.daily);
    safeRemove(STORAGE_KEYS.onboarding);
    set({
      profile: { ...DEFAULT_PROFILE },
      settings: { ...DEFAULT_SETTINGS },
      onboardingSeen: false,
    });
  },
}));
