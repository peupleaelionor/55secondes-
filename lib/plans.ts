/**
 * Monetization architecture — NOT activated in V1. No payment, no random paid
 * rewards, no loot boxes. The free plan is fully playable; Pro/Founder only
 * add depth (analysis, content, cosmetics) and are surfaced as a waitlist.
 */

export type PlanId = "free" | "pro" | "founder";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Le jeu complet, sans friction.",
    features: [
      "Parties illimitées",
      "Score, badges de base et partage",
      "Classement (fictif V1)",
      "Défis du jour",
      "Profil & ADN business essentiel",
    ],
    cta: "Tu y es déjà",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Analyse tes décisions. Va plus loin.",
    features: [
      "Decision DNA détaillé + historique",
      "Archétypes rares",
      "Packs de scénarios avancés",
      "Mode entraînement",
      "Cartes de partage premium",
      "Statistiques approfondies",
    ],
    cta: "Passe Pro bientôt",
    highlight: true,
  },
  {
    id: "founder",
    name: "Founder",
    tagline: "Construis le jeu avec nous.",
    features: [
      "Badge Founder",
      "Accès anticipé aux nouveautés",
      "Thèmes exclusifs",
      "Tournois privés",
      "Vote sur les prochains packs",
    ],
    cta: "Rejoindre la liste Founder",
  },
];

export const PRO_PITCH = {
  title: "Passe Pro bientôt",
  body: "Analyse tes décisions. Débloque les scénarios avancés. Construis ton profil business.",
  cta: "Rejoindre la liste Founder",
};
