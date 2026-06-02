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
        "Trop de pression, trop vite. Dans le jeu, une croissance sans garde-fou finit par tout figer.",
    };
  }

  if (state.risk > 80) {
    return {
      headline: "Tu as poussé trop fort.",
      detail:
        "Le flux était là, mais ton risque a flambé. Garde la même intensité avec plus de sang-froid.",
    };
  }

  if (state.confidence < 50) {
    return {
      headline: "Profil pas encore crédible.",
      detail: "Privilégie des choix plus propres : la confiance, c'est ce qui débloque ton profil.",
    };
  }

  if (score > 90) {
    return {
      headline: "Partie quasi parfaite.",
      detail:
        "Vitesse, confiance et risque maîtrisé : tu as tout aligné. Peu de joueurs y arrivent.",
    };
  }

  if (score >= 70) {
    return {
      headline: "Solide.",
      detail:
        "Du flux crédible et un profil sain. Serre le risque d'un cran et le score s'envole.",
    };
  }

  if (score >= 40) {
    return {
      headline: "Du mouvement, pas encore l'équilibre.",
      detail:
        "Tu crées de l'activité, mais ton profil manque de cohérence. Vise une dimension à la fois.",
    };
  }

  return {
    headline: "Trop dispersé.",
    detail: "Moins de risque, plus de régularité. Une partie propre vaut mieux qu'une partie agressive.",
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
    subtitle: "Tu y étais presque. Affine ta stratégie et retente.",
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
