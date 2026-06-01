import type { Badge, GameState } from "./types";
import { GAME, checkWinCondition } from "./engine";

/** Achievement badges. Conditions are pure predicates on a finished state. */
export const BADGES: Badge[] = [
  {
    id: "entrepreneur",
    name: "Entrepreneur validé",
    description: "Atteins les 4 objectifs et débloque ton profil.",
    rarity: "common",
    icon: "BadgeCheck",
    condition: (s) => checkWinCondition(s),
  },
  {
    id: "banquier",
    name: "Banquier impressionné",
    description: "Termine avec un score d'au moins 90/100.",
    rarity: "legendary",
    icon: "Landmark",
    condition: (s) => s.finalScore >= 90,
  },
  {
    id: "cashflow",
    name: "Cashflow propre",
    description: "Génère 10 000 € de flux avec un risque sous 35.",
    rarity: "rare",
    icon: "Waves",
    condition: (s) => s.incomingFlow >= GAME.OBJECTIVES.flow && s.risk <= 35,
  },
  {
    id: "negociateur",
    name: "Négociateur premium",
    description: "Finis avec un solde d'au moins 6 500 €.",
    rarity: "rare",
    icon: "Handshake",
    condition: (s) => s.balance >= 6500,
  },
  {
    id: "zeropanique",
    name: "Zéro panique",
    description: "Gagne sans jamais dépasser un risque de 45.",
    rarity: "epic",
    icon: "ShieldCheck",
    condition: (s) => checkWinCondition(s) && s.risk <= 45,
  },
  {
    id: "seriechaude",
    name: "Série chaude",
    description: "Enchaîne une série d'au moins 6 bons choix.",
    rarity: "rare",
    icon: "Flame",
    condition: (s) => s.bestStreak >= 6,
  },
  {
    id: "profilsolide",
    name: "Profil solide",
    description: "Termine avec une confiance d'au moins 85.",
    rarity: "epic",
    icon: "Shield",
    condition: (s) => s.confidence >= 85,
  },
  {
    id: "roiduflux",
    name: "Roi du flux",
    description: "Dépasse 16 000 € de flux entrant.",
    rarity: "legendary",
    icon: "Crown",
    condition: (s) => s.incomingFlow >= 16000,
  },
  {
    id: "risquemaitrise",
    name: "Risque maîtrisé",
    description: "Gagne en finissant avec un risque sous 25.",
    rarity: "epic",
    icon: "Lock",
    condition: (s) => checkWinCondition(s) && s.risk <= 25,
  },
  {
    id: "closer",
    name: "Closer express",
    description: "Débloque ton profil avec au moins 10 secondes restantes.",
    rarity: "epic",
    icon: "Timer",
    condition: (s) =>
      s.objectivesReachedAt !== null && s.objectivesReachedAt >= 10,
  },
  {
    id: "architecte",
    name: "Architecte de revenus",
    description: "Réalise au moins 110 transactions.",
    rarity: "rare",
    icon: "Building2",
    condition: (s) => s.transactions >= 110,
  },
  {
    id: "momentumroyal",
    name: "Momentum royal",
    description: "Atteins le multiplicateur maximum x4.",
    rarity: "legendary",
    icon: "Rocket",
    condition: (s) => s.multiplier >= GAME.MAX_MULTIPLIER || s.bestStreak >= 9,
  },
];

const BADGE_MAP = new Map(BADGES.map((b) => [b.id, b]));

export function getBadge(id: string): Badge | undefined {
  return BADGE_MAP.get(id);
}

/** Evaluate all badges against a finished game state. */
export function checkBadges(state: GameState): string[] {
  return BADGES.filter((b) => {
    try {
      return b.condition(state);
    } catch {
      return false;
    }
  }).map((b) => b.id);
}
