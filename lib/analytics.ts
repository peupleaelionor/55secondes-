/**
 * Analytics wrapper — future-proofed for PostHog/Plausible.
 * Currently a no-op in production and a dev-only console logger.
 * No real tracking, no network calls, no PII.
 */

export type AnalyticsEvent =
  | "app_opened"
  | "onboarding_seen"
  | "onboarding_completed"
  | "game_started"
  | "scenario_seen"
  | "choice_selected"
  | "stat_threshold_reached"
  | "risk_critical"
  | "profile_unlocked"
  | "game_finished"
  | "score_shared"
  | "badge_unlocked"
  | "archetype_generated"
  | "share_clicked"
  | "friend_challenge_created"
  | "founder_waitlist_clicked"
  | "daily_challenge_completed"
  | "profile_updated";

type Payload = Record<string, string | number | boolean | null | undefined>;

export function track(event: AnalyticsEvent, payload: Payload = {}): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug(`[track] ${event}`, payload);
  }
  // Future: forward to a provider here.
}
