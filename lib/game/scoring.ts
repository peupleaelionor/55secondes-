import type { GameState } from "./types";
import { GAME, checkWinCondition } from "./engine";

export interface ResultAnalysis {
  headline: string;
  detail: string;
}

/**
 * Short, premium post-game analysis. Framed entirely as game feedback —
 * never financial advice.
 */
export function getResultAnalysis(state: GameState): ResultAnalysis {
  const score = state.finalScore;

  if (state.risk >= GAME.RISK_BLOCK) {
    return {
      headline: "Profil bloqué.",
      detail:
        "Tu as poussé trop fort. Dans le jeu, une croissance sans contrôle finit par tout figer.",
    };
  }

  if (state.risk > 80) {
    return {
      headline: "Tu as poussé trop fort.",
      detail:
        "La croissance rapide sans contrôle coûte cher. Vise plus de régularité au prochain run.",
    };
  }

  if (state.confidence < 50) {
    return {
      headline: "Ton profil manque de confiance.",
      detail: "Privilégie les choix plus propres pour rassurer ton profil de jeu.",
    };
  }

  if (score > 90) {
    return {
      headline: "Profil très propre.",
      detail:
        "Tu as combiné vitesse, confiance et risque maîtrisé. Run quasi parfait.",
    };
  }

  if (score >= 70) {
    return {
      headline: "Solide.",
      detail:
        "Tu as créé du flux crédible, mais tu peux encore optimiser le risque.",
    };
  }

  if (score >= 40) {
    return {
      headline: "Du mouvement, mais pas d'équilibre.",
      detail:
        "Tu as généré de l'activité ; ton profil manque encore de cohérence.",
    };
  }

  return {
    headline: "Trop de dispersion.",
    detail: "Rejoue avec moins de risque et plus de régularité dans tes choix.",
  };
}

/** Headline + subline shown at the top of the result screen. */
export function getResultTitle(state: GameState): { title: string; subtitle: string } {
  if (checkWinCondition(state)) {
    return {
      title: "Entrepreneur validé",
      subtitle: "Profil finançable débloqué — dans le jeu.",
    };
  }
  return {
    title: "Profil encore fragile",
    subtitle: "Tu étais proche. Rejoue avec une meilleure stratégie.",
  };
}

/** Live game-state mood used to drive ambient UI states. */
export type GameMood = "royal" | "hot" | "unstable" | "critical" | "neutral";

export function getGameMood(state: GameState): GameMood {
  if (state.risk >= GAME.RISK_CRITICAL) return "critical";
  if (state.confidence > 90 && state.risk < 30) return "royal";
  if (state.risk > 70) return "unstable";
  if (state.streak >= 3) return "hot";
  return "neutral";
}

export const MOOD_LABEL: Record<GameMood, string | null> = {
  royal: "Profil royal",
  hot: "Momentum chaud",
  unstable: "Profil instable",
  critical: "Risque critique",
  neutral: null,
};
