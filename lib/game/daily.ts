import type { DailyChallenge, GameState } from "./types";
import { GAME, checkWinCondition } from "./engine";
import { safeGet, safeSet, STORAGE_KEYS } from "../storage";

/** A challenge definition with a pure measure() returning 0..1 progress. */
interface ChallengeDef {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  rewardStreak: number;
  icon: string;
  measure: (s: GameState) => number;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));

const POOL: ChallengeDef[] = [
  {
    id: "flow3k_lowrisk",
    title: "Flux propre",
    description: "Atteins 3 000 € de flux avec moins de 20 % de risque.",
    rewardXp: 250,
    rewardStreak: 1,
    icon: "Target",
    measure: (s) => (s.risk <= 20 ? clamp01(s.incomingFlow / 3000) : 0),
  },
  {
    id: "tx80",
    title: "Machine à transactions",
    description: "Réalise 80 transactions en une seule partie.",
    rewardXp: 200,
    rewardStreak: 1,
    icon: "Repeat",
    measure: (s) => clamp01(s.transactions / 80),
  },
  {
    id: "conf85",
    title: "Profil rassurant",
    description: "Termine avec une confiance d'au moins 85.",
    rewardXp: 220,
    rewardStreak: 1,
    icon: "ShieldCheck",
    measure: (s) => clamp01(s.confidence / 85),
  },
  {
    id: "win_lowrisk",
    title: "Sang-froid",
    description: "Gagne en finissant avec un risque sous 40.",
    rewardXp: 300,
    rewardStreak: 2,
    icon: "Lock",
    measure: (s) => (checkWinCondition(s) && s.risk < 40 ? 1 : 0),
  },
  {
    id: "streak5",
    title: "Série x5",
    description: "Enchaîne une série d'au moins 5 bons choix.",
    rewardXp: 180,
    rewardStreak: 1,
    icon: "Flame",
    measure: (s) => clamp01(s.bestStreak / 5),
  },
  {
    id: "flow12k",
    title: "Gros volume",
    description: "Atteins 12 000 € de flux entrant.",
    rewardXp: 260,
    rewardStreak: 1,
    icon: "TrendingUp",
    measure: (s) => clamp01(s.incomingFlow / 12000),
  },
  {
    id: "tx100",
    title: "Centurion",
    description: "Réalise 100 transactions dans une partie.",
    rewardXp: 320,
    rewardStreak: 2,
    icon: "Layers",
    measure: (s) => clamp01(s.transactions / 100),
  },
  {
    id: "no_critical",
    title: "Sans panique",
    description: "Gagne sans jamais atteindre le risque critique.",
    rewardXp: 240,
    rewardStreak: 1,
    icon: "HeartPulse",
    measure: (s) => (checkWinCondition(s) && s.risk < GAME.RISK_CRITICAL ? 1 : 0),
  },
];

const POOL_MAP = new Map(POOL.map((c) => [c.id, c]));

/** YYYY-MM-DD key in local time. */
export function dayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministically pick 5 challenge ids for a given day. */
function pickIds(key: string): string[] {
  const rand = mulberry32(hash(key));
  const ids = POOL.map((c) => c.id);
  // Fisher–Yates with seeded RNG.
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, 5);
}

type ProgressStore = Record<string, Record<string, number>>; // dayKey -> id -> 0..1

function loadProgress(): ProgressStore {
  return safeGet<ProgressStore>(STORAGE_KEYS.daily, {});
}

/** Returns the 5 challenges of the day with persisted progress + status. */
export function getDailyChallenges(date = new Date()): DailyChallenge[] {
  const key = dayKey(date);
  const ids = pickIds(key);
  const store = loadProgress();
  const dayProgress = store[key] ?? {};

  return ids.map((id, index) => {
    const def = POOL_MAP.get(id)!;
    const progress = clamp01(dayProgress[id] ?? 0);
    const status: DailyChallenge["status"] =
      progress >= 1 ? "done" : index === 0 || progress > 0 ? "active" : "active";
    return {
      id: def.id,
      title: def.title,
      description: def.description,
      rewardXp: def.rewardXp,
      rewardStreak: def.rewardStreak,
      progress,
      status,
      icon: def.icon,
    };
  });
}

/**
 * Update today's challenge progress from a finished game (keeps the best).
 * Returns the ids of challenges newly completed by this game.
 */
export function updateChallengeProgress(state: GameState, date = new Date()): string[] {
  const key = dayKey(date);
  const ids = pickIds(key);
  const store = loadProgress();
  const dayProgress = { ...(store[key] ?? {}) };
  const newlyCompleted: string[] = [];

  for (const id of ids) {
    const def = POOL_MAP.get(id);
    if (!def) continue;
    const prev = clamp01(dayProgress[id] ?? 0);
    const next = Math.max(prev, clamp01(def.measure(state)));
    if (prev < 1 && next >= 1) newlyCompleted.push(id);
    dayProgress[id] = next;
  }

  store[key] = dayProgress;
  safeSet(STORAGE_KEYS.daily, store);
  return newlyCompleted;
}

const PULSE_LINES = [
  "Jour propre. Flux propre.",
  "Le risque se maîtrise avant la vitesse.",
  "Le meilleur score du jour se joue maintenant.",
  "Une décision suffit à changer la partie.",
  "Vitesse sans contrôle ne vaut rien.",
  "Aujourd'hui, vise la régularité.",
  "Le momentum se construit, il ne s'attend pas.",
];

export interface DailyPulse {
  date: string;
  line: string;
  mainChallenge: DailyChallenge;
  miniChallenges: DailyChallenge[];
}

/** The day's impulsion: one phrase, one main challenge, three minis. */
export function getDailyPulse(date = new Date()): DailyPulse {
  const key = dayKey(date);
  const challenges = getDailyChallenges(date);
  const line = PULSE_LINES[hash(key) % PULSE_LINES.length];
  return {
    date: key,
    line,
    mainChallenge: challenges[0],
    miniChallenges: challenges.slice(1, 4),
  };
}

/** Hours/minutes until the daily reset (local midnight), for the UI. */
export function timeUntilReset(now = new Date()): { hours: number; minutes: number } {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const diff = Math.max(0, next.getTime() - now.getTime());
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  return { hours, minutes };
}
