/**
 * Game modes — architecture + copy. Only "Classic 55" is live in V1; the
 * others are defined here (types, copy, availability) so the UI can tease them
 * and future work can flip `available` without a refactor.
 */

export type GameModeId =
  | "classic"
  | "daily"
  | "reflex"
  | "precision"
  | "zen"
  | "duel";

export interface GameModeDef {
  id: GameModeId;
  name: string;
  tagline: string;
  icon: string; // Lucide icon name
  available: boolean;
}

export const GAME_MODES: GameModeDef[] = [
  { id: "classic", name: "Classic 55", tagline: "55 secondes. Un score. Zéro excuse.", icon: "Timer", available: true },
  { id: "daily", name: "Daily Challenge", tagline: "Même partie pour tout le monde, chaque jour.", icon: "CalendarDays", available: true },
  { id: "duel", name: "Duel Code", tagline: "Un lien, un défi. Même chrono, mêmes décisions.", icon: "Swords", available: true },
  { id: "reflex", name: "Reflex Rush", tagline: "Rythme accéléré. Pour les nerfs solides.", icon: "Zap", available: false },
  { id: "precision", name: "Precision", tagline: "L'erreur coûte cher. Vise juste.", icon: "Crosshair", available: false },
  { id: "zen", name: "Zen Run", tagline: "Sans pression. Juste pour progresser.", icon: "Wind", available: false },
];

/**
 * Themed "arenas" for future seasonal events. Identity layer only — kept light
 * so it fuels replay without complicating the core UX.
 */
export interface ArenaDef {
  id: string;
  name: string;
  tagline: string;
  available: boolean;
}

export const ARENAS: ArenaDef[] = [
  { id: "neon-mars", name: "Neon Mars", tagline: "Vitesse et danger.", available: false },
  { id: "saturn-loop", name: "Saturn Loop", tagline: "Combos en boucle.", available: false },
  { id: "jupiter-crown", name: "Jupiter Crown", tagline: "Multiplicateurs lourds.", available: false },
  { id: "eclipse-arena", name: "Eclipse Arena", tagline: "Événement rare.", available: false },
];

export const AVAILABLE_MODES = GAME_MODES.filter((m) => m.available);
