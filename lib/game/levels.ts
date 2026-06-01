import type { GameState } from "./types";
import { checkWinCondition } from "./engine";

/** Level titles (1-indexed). Beyond the list, the last title is reused. */
export const LEVEL_TITLES = [
  "Décideur",
  "Opportuniste",
  "Closer",
  "Builder",
  "Négociateur",
  "Stratège",
  "Architecte du flux",
  "Profil premium",
  "Operator",
  "Visionnaire",
] as const;

/** XP required to reach the NEXT level grows smoothly (never frustrating). */
export function xpForLevel(level: number): number {
  // Level 1→2 costs 300, then +180 per level.
  return 300 + Math.max(0, level - 1) * 180;
}

export interface LevelInfo {
  level: number;
  title: string;
  xpIntoLevel: number;
  xpToNext: number;
  progress: number; // 0..1
}

export function levelFromXp(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(Number.isFinite(totalXp) ? totalXp : 0));
  // Cap iterations defensively.
  while (remaining >= xpForLevel(level) && level < 999) {
    remaining -= xpForLevel(level);
    level += 1;
  }
  const xpToNext = xpForLevel(level);
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  return {
    level,
    title,
    xpIntoLevel: remaining,
    xpToNext,
    progress: xpToNext > 0 ? remaining / xpToNext : 0,
  };
}

/** XP earned from a finished game — always rewarding, never punishing. */
export function xpForGame(state: GameState): number {
  let xp = 40; // base for playing
  xp += Math.round(state.finalScore * 1.2); // score contribution
  if (checkWinCondition(state)) xp += 60; // victory
  if (state.risk <= 40) xp += 25; // controlled risk
  xp += state.badgesUnlocked.length * 20; // badges
  return Math.max(40, xp);
}

export const XP_REWARDS = {
  share: 30,
  dailyChallenge: 80,
} as const;
