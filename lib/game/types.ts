/**
 * Core domain types for "55 Seconds".
 *
 * NOTE: This is a fictional entrepreneurship simulation game. All amounts,
 * flows, transactions, scores and "profiles" are game data only. Nothing here
 * represents real money, real banking, or real financial advice.
 */

export type GameStatus = "idle" | "playing" | "won" | "lost";

export type ScenarioCategory =
  | "freelance"
  | "commerce"
  | "immobilier"
  | "ia"
  | "marketing"
  | "urgence"
  | "negociation"
  | "partenariat"
  | "risque"
  | "premium"
  | "reputation"
  | "cashflow";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export type RiskLabel = "faible" | "modéré" | "élevé" | "critique";

/** Lucide icon name used to render a scenario / badge glyph. */
export type IconName = string;

export interface ChoiceEffects {
  balanceDelta: number;
  flowDelta: number;
  transactionsDelta: number;
  confidenceDelta: number;
  riskDelta: number;
  momentumDelta: number;
  /** Optional bump to the live multiplier (clamped 1..4). */
  multiplierDelta?: number;
}

export interface Choice {
  id: string;
  label: string;
  /** Short human-readable summary of the effects, e.g. "+1 200 € flux". */
  effectDescription: string;
  effects: ChoiceEffects;
  /** Tone used for styling the choice (premium = high reward/risk). */
  tone?: "safe" | "premium" | "refuse";
}

export interface Scenario {
  id: string;
  category: ScenarioCategory;
  title: string;
  description: string;
  /** Headline project amount shown in the card (game currency). */
  projectAmount: number;
  icon: IconName;
  rarity: Rarity;
  choices: Choice[];
}

export interface HistoryEntry {
  scenarioId: string;
  choiceId: string;
  /** Whether the chosen option carried meaningful risk (for challenges). */
  risky: boolean;
}

export interface GameState {
  balance: number;
  incomingFlow: number;
  transactions: number;
  confidence: number;
  risk: number;
  momentum: number;
  streak: number;
  bestStreak: number;
  multiplier: number;
  timeLeft: number;
  selectedScenario: Scenario | null;
  history: HistoryEntry[];
  status: GameStatus;
  finalScore: number;
  badgesUnlocked: string[];
  /** Set once the 4 objectives are first reached (profile unlocked banner). */
  objectivesReachedAt: number | null;
  /** Last applied deltas, for live "+X" feedback in the UI. */
  lastDeltas: ChoiceEffects | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  /** Pure predicate evaluated against a finished game state. */
  condition: (state: GameState) => boolean;
  rarity: Rarity;
  icon: IconName;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  rewardStreak: number;
  /** 0..1 progress for the mocked progress bar. */
  progress: number;
  status: "locked" | "active" | "done";
  icon: IconName;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  /** Game-currency "flow" score shown on the board. */
  amount: number;
  confidence: number;
  isPlayer?: boolean;
  avatarSeed: string;
}

export type GameMode = "challenge" | "training";

/** Persisted player profile (LocalStorage). */
export interface PlayerProfile {
  pseudo: string;
  level: number;
  xp: number; // total XP earned
  gamesPlayed: number;
  wins: number;
  streak: number; // daily play streak
  lastPlayedDate: string | null; // YYYY-MM-DD
  bestScore: number;
  bestBalance: number;
  bestFlow: number;
  bestConfidence: number;
  bestRiskControl: number; // best (100 - finalRisk) achieved (higher = better control)
  badges: string[];
  topArchetype: string | null;
}

export interface PlayerSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}
