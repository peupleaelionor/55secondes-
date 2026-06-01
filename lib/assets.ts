/**
 * Central, typed asset mapping.
 *
 * Images live under /public/assets/** and are loaded via <AssetImage>, which
 * falls back to a CSS/SVG placeholder when a file is missing. A missing asset
 * therefore never breaks the build or the UI — drop the PNGs in later.
 *
 * Structure:
 *   public/assets/app-icon.png   app/PWA/favicon
 *   public/assets/badges/        achievement badges (transparent, square)
 *   public/assets/avatars/       leaderboard avatars (transparent, square)
 *   public/assets/story/         9:16 share / story visuals
 *   public/assets/og/            OpenGraph + ambient hero backgrounds
 *   public/assets/ui/            in-app UI art (timer ring, rocket, textures)
 */

const ASSET_ROOT = "/assets";

/** App icon, used for favicon / Apple touch / PWA. */
export const appIcon = `${ASSET_ROOT}/app-icon.png`;

/** In-app UI artwork. */
export const uiAssets = {
  timerRing: `${ASSET_ROOT}/ui/timer-ring.png`,
  rocket: `${ASSET_ROOT}/ui/rocket.png`,
  texture: `${ASSET_ROOT}/ui/texture.png`,
} as const;

/** Backwards-compatible alias kept for components importing iconAssets. */
export const iconAssets = {
  appIcon,
  rocket: uiAssets.rocket,
  timerRing: uiAssets.timerRing,
} as const;

/** OpenGraph + ambient backgrounds. */
export const ogAssets = {
  default: `${ASSET_ROOT}/og/og-default.png`,
  /** 9:16 hero/ambient background for the home screen. */
  hero: `${ASSET_ROOT}/og/hero.png`,
} as const;

/** Vertical 9:16 share / story visuals. */
export const storyAssets = {
  teaser: `${ASSET_ROOT}/story/story-teaser.png`,
} as const;

const badge = (name: string) => `${ASSET_ROOT}/badges/${name}.png`;
const avatar = (name: string) => `${ASSET_ROOT}/avatars/${name}.png`;

/** Badge id → optional illustration. Falls back to a Lucide glyph when absent. */
export const badgeAssets: Record<string, string> = {
  entrepreneur: badge("entrepreneur"),
  banquier: badge("banquier"),
  cashflow: badge("cashflow"),
  roiduflux: badge("roi-du-flux"),
  risquemaitrise: badge("risque-maitrise"),
  momentumroyal: badge("momentum-royal"),
};

/** Leaderboard avatar seed → optional image. Falls back to an initials bubble. */
export const avatarAssets: Record<string, string> = {
  NeoCash: avatar("neocash"),
  MabeleFlow: avatar("mabeleflow"),
  KevinB: avatar("kevinb"),
};

/** Optional sound files; the game synthesizes tones when these are absent. */
export const soundAssets = {
  click: "/sounds/click.mp3",
  success: "/sounds/success.mp3",
  risk: "/sounds/risk.mp3",
  win: "/sounds/win.mp3",
  lose: "/sounds/lose.mp3",
  badge: "/sounds/badge.mp3",
} as const;

/** Safe lookup helpers (never throw on unknown keys). */
export const getBadgeAsset = (id: string): string | undefined => badgeAssets[id];
export const getAvatarAsset = (seed: string): string | undefined => avatarAssets[seed];
