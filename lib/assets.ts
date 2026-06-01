/**
 * Central asset mapping — the single source of truth for every asset path.
 * Never hardcode an "/assets/..." path in a component; import from here.
 *
 * Images live under /public/assets/** and are loaded via <AssetImage>, which
 * falls back to a clean CSS/SVG placeholder when a file is missing. A missing
 * asset therefore never breaks the build or the UI.
 */

export const ASSETS = {
  appIcon: "/assets/app-icon.png",
  badges: {
    frame: "/assets/ui/badge-frame.png",
    rocketBoost: "/assets/badges/rocket-boost.png",
    shieldVerified: "/assets/badges/shield-verified.png",
    shieldLock: "/assets/badges/shield-lock.png",
    shieldEnergy: "/assets/badges/shield-energy.png",
    crownUpgrade: "/assets/badges/crown-upgrade.png",
    flameCore: "/assets/badges/flame-core.png",
  },
  avatars: {
    mysteryGentleman: "/assets/avatars/mystery-gentleman.png",
  },
  story: {
    teaser: "/assets/story/story-teaser.png",
  },
  og: {
    main: "/assets/og/og-main.png",
  },
  ui: {
    badgeFrame: "/assets/ui/badge-frame.png",
    /** Optional — falls back to the animated SVG ring when absent. */
    timerRing: "/assets/ui/timer-ring.png",
    /** Rocket art reused on the share card. */
    rocket: "/assets/badges/rocket-boost.png",
  },
  sounds: {
    click: "/sounds/click.mp3",
    success: "/sounds/success.mp3",
    risk: "/sounds/risk.mp3",
    win: "/sounds/win.mp3",
    lose: "/sounds/lose.mp3",
    badge: "/sounds/badge.mp3",
  },
} as const;

/**
 * Badge id (see lib/game/badges.ts) → illustration path. Unmapped ids fall
 * back to their Lucide glyph in <BadgeCard>.
 */
export const BADGE_ART: Record<string, string> = {
  entrepreneur: ASSETS.badges.shieldVerified,
  banquier: ASSETS.avatars.mysteryGentleman,
  cashflow: ASSETS.badges.shieldEnergy,
  roiduflux: ASSETS.badges.crownUpgrade,
  risquemaitrise: ASSETS.badges.shieldLock,
  momentumroyal: ASSETS.badges.rocketBoost,
  seriechaude: ASSETS.badges.flameCore,
};

export function getBadgeArt(id: string): string | undefined {
  return BADGE_ART[id];
}

/** Normalize/guard an asset path; falls back to the app icon by default. */
export function asset(path?: string | null, fallback: string = ASSETS.appIcon): string {
  if (!path || typeof path !== "string") return fallback;
  return path.startsWith("/") ? path : `/${path}`;
}

export default ASSETS;
