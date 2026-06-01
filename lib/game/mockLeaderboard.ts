import type { LeaderboardEntry } from "./types";

/**
 * Fictional leaderboard (clearly labelled "classement fictif V1" in the UI).
 * Deterministic bot roster; the player is injected by their best flow score.
 */
interface Bot {
  name: string;
  amount: number;
  confidence: number;
}

const GLOBAL_BOTS: Bot[] = [
  { name: "NeoCash", amount: 55000, confidence: 98 },
  { name: "MabeleFlow", amount: 48250, confidence: 94 },
  { name: "KevinB", amount: 41750, confidence: 91 },
  { name: "LuxeStack", amount: 37890, confidence: 90 },
  { name: "CashPilot", amount: 35660, confidence: 89 },
  { name: "AlphaMove", amount: 33120, confidence: 88 },
  { name: "ZedTrader", amount: 29340, confidence: 87 },
  { name: "FlowMaker", amount: 27880, confidence: 86 },
  { name: "RiskMaster", amount: 25410, confidence: 85 },
  { name: "CoinSurfer", amount: 23750, confidence: 84 },
  { name: "YNKLV", amount: 21300, confidence: 82 },
  { name: "MayeleBoss", amount: 19480, confidence: 80 },
];

const WEEK_BOTS: Bot[] = [
  { name: "FlowMaker", amount: 18900, confidence: 88 },
  { name: "CoinSurfer", amount: 17240, confidence: 86 },
  { name: "NeoCash", amount: 16800, confidence: 92 },
  { name: "MayeleBoss", amount: 15600, confidence: 84 },
  { name: "AlphaMove", amount: 14300, confidence: 83 },
  { name: "YNKLV", amount: 13100, confidence: 81 },
  { name: "KevinB", amount: 12450, confidence: 80 },
  { name: "RiskMaster", amount: 11200, confidence: 79 },
];

const FRIEND_BOTS: Bot[] = [
  { name: "MabeleFlow", amount: 24800, confidence: 90 },
  { name: "KevinB", amount: 18650, confidence: 86 },
  { name: "CashPilot", amount: 14200, confidence: 83 },
  { name: "ZedTrader", amount: 9800, confidence: 78 },
];

export type LeaderboardScope = "global" | "friends" | "week";

const ROSTERS: Record<LeaderboardScope, Bot[]> = {
  global: GLOBAL_BOTS,
  friends: FRIEND_BOTS,
  week: WEEK_BOTS,
};

export interface PlayerStanding {
  pseudo: string;
  amount: number;
  confidence: number;
}

/**
 * Build a ranked leaderboard for a scope, injecting the player by their
 * best flow amount. Returns entries sorted desc with computed ranks.
 */
export function generateMockLeaderboard(
  scope: LeaderboardScope,
  player: PlayerStanding,
): LeaderboardEntry[] {
  const bots = ROSTERS[scope];
  const combined: Array<Bot & { isPlayer?: boolean }> = [
    ...bots.map((b) => ({ ...b })),
    {
      name: player.pseudo || "Vous",
      amount: Math.max(0, Math.round(player.amount)),
      confidence: Math.round(player.confidence),
      isPlayer: true,
    },
  ];

  combined.sort((a, b) => b.amount - a.amount);

  return combined.map((entry, i) => ({
    rank: i + 1,
    name: entry.name,
    amount: entry.amount,
    confidence: entry.confidence,
    isPlayer: entry.isPlayer,
    avatarSeed: entry.name,
  }));
}

export function findPlayerRank(entries: LeaderboardEntry[]): LeaderboardEntry | null {
  return entries.find((e) => e.isPlayer) ?? null;
}
