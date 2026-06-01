/**
 * Rank system — maps a final score (0..100) to a premium, motivating tier.
 * Pure and deterministic. Ranks are a meta-progression layer on top of the
 * per-game score: you climb them by beating your best score.
 */

export interface Rank {
  id: string;
  label: string;
  /** Inclusive lower bound on the 0..100 score scale. */
  minScore: number;
  /** Hex tone, aligned with the UI palette. */
  color: string;
  /** Short, premium one-liner shown on unlock. */
  message: string;
}

/** Ordered ascending by minScore. */
export const RANKS: Rank[] = [
  { id: "bronze", label: "Bronze Pulse", minScore: 0, color: "#D9A066", message: "Le début. Tout se gagne d'ici." },
  { id: "silver", label: "Silver Reflex", minScore: 40, color: "#CBD5E1", message: "Le réflexe est là. Affûte-le." },
  { id: "gold", label: "Gold Strike", minScore: 55, color: "#FBBF24", message: "Tu frappes juste. Continue." },
  { id: "platinum", label: "Platinum Focus", minScore: 68, color: "#67E8F9", message: "Concentration nette. Beau niveau." },
  { id: "diamond", label: "Diamond Rush", minScore: 78, color: "#A855F7", message: "Rapide et précis. Rang d'élite." },
  { id: "mythic", label: "Mythic 55", minScore: 88, color: "#C084FC", message: "Très peu de joueurs arrivent ici." },
  { id: "crown", label: "Crown Protocol", minScore: 95, color: "#F0ABFC", message: "Maîtrise totale. Respect." },
  { id: "eclipse", label: "Eclipse Master", minScore: 100, color: "#F8FAFC", message: "Le sommet. Score parfait." },
];

const clampScore = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? Math.round(n) : 0));

/** Highest rank whose threshold the score reaches. Always returns a rank. */
export function getRank(score: number): Rank {
  const s = clampScore(score);
  let current = RANKS[0];
  for (const r of RANKS) {
    if (s >= r.minScore) current = r;
  }
  return current;
}

/** The next rank above the current score, or null if already at the top. */
export function getNextRank(score: number): Rank | null {
  const s = clampScore(score);
  return RANKS.find((r) => r.minScore > s) ?? null;
}

/** Points still needed to reach the next rank (0 if maxed). */
export function pointsToNextRank(score: number): number {
  const next = getNextRank(score);
  return next ? Math.max(0, next.minScore - clampScore(score)) : 0;
}
