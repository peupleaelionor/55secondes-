import type { PlanId } from "./plans";

/**
 * Feature flags. V1 ships everything that's built on the free plan; gated
 * features below are presentational placeholders ("Bientôt") with the
 * architecture ready to flip on.
 */
export const FEATURES = {
  trainingMode: false, // "Bientôt"
  imageExport: false, // shareable image generation (V2)
  realLeaderboard: false, // backend (V2)
  proAnalysis: false, // detailed DNA history (Pro)
} as const;

export type FeatureKey = keyof typeof FEATURES;

export function isFeatureEnabled(key: FeatureKey): boolean {
  return FEATURES[key];
}

/** Minimum plan required for a feature (for future gating). */
export const FEATURE_PLAN: Record<string, PlanId> = {
  dnaDetailed: "pro",
  advancedPacks: "pro",
  trainingMode: "pro",
  premiumShareCards: "pro",
  founderBadge: "founder",
};
