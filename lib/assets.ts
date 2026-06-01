/**
 * Central asset mapping. Images are NOT committed yet — these point at the
 * intended locations under /public/assets so generated art (see README →
 * "Assets à générer") can be dropped in without touching components.
 *
 * Until an image exists, components fall back to CSS/SVG placeholders, so a
 * missing file never breaks the UI.
 */

export const ogAssets = {
  default: "/assets/og/og-default.png",
  story: "/assets/og/story-teaser.png",
} as const;

export const textureAssets = {
  overlay: "/assets/textures/overlay.png",
} as const;

export const iconAssets = {
  appIcon: "/assets/icons/app-icon.png",
  rocket: "/assets/icons/rocket.png",
  timerRing: "/assets/icons/timer-ring.png",
} as const;

/** Badge id → optional illustration. Falls back to a Lucide glyph when absent. */
export const badgeAssets: Record<string, string> = {
  entrepreneur: "/assets/badges/entrepreneur.png",
  banquier: "/assets/badges/banquier.png",
  cashflow: "/assets/badges/cashflow.png",
  roiduflux: "/assets/badges/roi-du-flux.png",
};

/** Leaderboard avatar seed → optional image. Falls back to initials bubble. */
export const avatarAssets: Record<string, string> = {
  NeoCash: "/assets/avatars/neocash.png",
  MabeleFlow: "/assets/avatars/mabeleflow.png",
  KevinB: "/assets/avatars/kevinb.png",
};

export const soundAssets = {
  click: "/sounds/click.mp3",
  success: "/sounds/success.mp3",
  risk: "/sounds/risk.mp3",
  win: "/sounds/win.mp3",
  lose: "/sounds/lose.mp3",
  badge: "/sounds/badge.mp3",
} as const;
