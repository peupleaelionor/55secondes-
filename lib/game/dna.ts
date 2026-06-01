import type { GameState, ScenarioCategory } from "./types";
import { GAME } from "./engine";
import { SCENARIOS } from "./scenarios";

/** Eight measurable dimensions of how the player decided under pressure. */
export interface DecisionDNA {
  speed: number;
  riskControl: number;
  negotiation: number;
  consistency: number;
  opportunityReading: number;
  cashflowSense: number;
  trustBuilding: number;
  execution: number;
}

export const DNA_LABELS: Record<keyof DecisionDNA, string> = {
  speed: "Vitesse",
  riskControl: "Contrôle du risque",
  negotiation: "Négociation",
  consistency: "Régularité",
  opportunityReading: "Lecture d'opportunité",
  cashflowSense: "Cashflow",
  trustBuilding: "Confiance",
  execution: "Exécution",
};

const clamp = (n: number, min = 0, max = 100) =>
  Math.round(Math.min(max, Math.max(min, Number.isFinite(n) ? n : 0)));

const scenarioById = new Map(SCENARIOS.map((s) => [s.id, s]));

/** Business skill implicitly trained by each scenario category. */
export const SKILL_BY_CATEGORY: Record<ScenarioCategory, string> = {
  freelance: "Positionnement",
  commerce: "Exécution",
  immobilier: "Lecture d'opportunité",
  ia: "Lecture d'opportunité",
  marketing: "Positionnement",
  urgence: "Décision sous pression",
  negociation: "Négociation",
  partenariat: "Négociation",
  risque: "Gestion du risque",
  premium: "Négociation",
  reputation: "Confiance",
  cashflow: "Cashflow",
};

/** Compute the 8-axis Decision DNA from a finished game state. */
export function computeDecisionDNA(state: GameState): DecisionDNA {
  const choices = Math.max(1, state.history.length);
  const riskyCount = state.history.filter((h) => h.risky).length;

  // Speed: more decisions in the window = faster instinct.
  const speed = clamp(35 + (choices / 20) * 65);

  // Risk control: low final risk is good.
  const riskControl = clamp(100 - state.risk * 1.05);

  // Negotiation: how much premium/negotiation flow was generated.
  const negShare =
    state.history.filter((h) => {
      const sc = scenarioById.get(h.scenarioId);
      return (
        sc &&
        (sc.category === "negociation" ||
          sc.category === "premium" ||
          sc.category === "partenariat")
      );
    }).length / choices;
  const negotiation = clamp(45 + negShare * 120 + state.bestStreak * 1.5);

  // Consistency: few risky swings relative to total.
  const consistency = clamp(100 - (riskyCount / choices) * 90);

  // Opportunity reading: flow generated per decision.
  const opportunityReading = clamp((state.incomingFlow / GAME.OBJECTIVES.flow) * 95);

  // Cashflow sense: retained balance vs flow.
  const cashflowSense = clamp((state.balance / GAME.OBJECTIVES.balance) * 95);

  // Trust building: confidence axis.
  const trustBuilding = clamp(state.confidence * 1.1);

  // Execution: transactions completed.
  const execution = clamp((state.transactions / GAME.OBJECTIVES.transactions) * 100);

  return {
    speed,
    riskControl,
    negotiation,
    consistency,
    opportunityReading,
    cashflowSense,
    trustBuilding,
    execution,
  };
}

/** A short, premium read on the player's DNA. */
export function dnaInsight(dna: DecisionDNA): string {
  const strong = dna.riskControl >= 70 && dna.opportunityReading >= 70;
  if (strong && dna.execution >= 70) {
    return "Profil rare : rapide, rentable et maîtrisé.";
  }
  if (dna.speed >= 75 && dna.riskControl < 55) {
    return "Tu joues vite, mais tu dois mieux protéger ton risque.";
  }
  if (dna.trustBuilding >= 70 && dna.speed < 55) {
    return "Tu construis proprement, mais tu peux accélérer.";
  }
  if (dna.negotiation >= 70 && dna.consistency < 55) {
    return "Tu as un instinct de closer, mais ton équilibre reste fragile.";
  }
  return "Bon équilibre. Pousse une dimension plus loin au prochain run.";
}

/** Dominant business skill trained this game, from played categories. */
export function dominantSkill(state: GameState): string {
  const counts = new Map<string, number>();
  for (const h of state.history) {
    const sc = scenarioById.get(h.scenarioId);
    if (!sc) continue;
    const skill = SKILL_BY_CATEGORY[sc.category];
    counts.set(skill, (counts.get(skill) ?? 0) + 1);
  }
  let best = "Décision sous pression";
  let bestN = 0;
  for (const [skill, n] of counts) {
    if (n > bestN) {
      best = skill;
      bestN = n;
    }
  }
  return best;
}

/** Top 4 DNA axes for compact display. */
export function topDnaAxes(dna: DecisionDNA): Array<{ key: keyof DecisionDNA; value: number }> {
  return (Object.keys(dna) as Array<keyof DecisionDNA>)
    .map((key) => ({ key, value: dna[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);
}
