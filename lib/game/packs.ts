import type { ScenarioCategory } from "./types";

/**
 * Scenario packs — architecture for future premium content. In V1 every
 * scenario is playable; packs are presentational + a hook for monetization.
 */
export interface ScenarioPack {
  id: string;
  name: string;
  description: string;
  categories: ScenarioCategory[];
  difficulty: "facile" | "intermédiaire" | "avancé";
  premium: boolean;
  icon: string;
}

export const SCENARIO_PACKS: ScenarioPack[] = [
  {
    id: "freelance-sprint",
    name: "Freelance Sprint",
    description: "Missions express, acomptes fictifs, offres claires. Le réflexe du solo qui livre vite.",
    categories: ["freelance", "urgence"],
    difficulty: "facile",
    premium: false,
    icon: "Zap",
  },
  {
    id: "ai-agency",
    name: "AI Agency",
    description: "Automatisations, audits et agents IA. Crée du flux sans perdre la confiance.",
    categories: ["ia", "premium"],
    difficulty: "avancé",
    premium: true,
    icon: "Cpu",
  },
  {
    id: "local-business",
    name: "Local Business",
    description: "Commerces, artisans, réservations. Le terrain qui convertit.",
    categories: ["commerce", "marketing"],
    difficulty: "facile",
    premium: false,
    icon: "Store",
  },
  {
    id: "creator-economy",
    name: "Creator Economy",
    description: "Créateurs, sponsors, précommandes. Monétise une audience proprement.",
    categories: ["marketing", "commerce"],
    difficulty: "intermédiaire",
    premium: true,
    icon: "Megaphone",
  },
  {
    id: "real-estate-flow",
    name: "Real Estate Flow",
    description: "Leads immobiliers et tunnels qualifiés. Volume contre maîtrise.",
    categories: ["immobilier"],
    difficulty: "intermédiaire",
    premium: true,
    icon: "Home",
  },
  {
    id: "premium-consulting",
    name: "Premium Consulting",
    description: "Offres signature, clients corporate, done-for-you. Vends la valeur.",
    categories: ["premium"],
    difficulty: "avancé",
    premium: true,
    icon: "Crown",
  },
  {
    id: "emergency-deals",
    name: "Emergency Deals",
    description: "Urgences clients et deadlines serrées. Décide sous pression.",
    categories: ["urgence", "risque"],
    difficulty: "avancé",
    premium: true,
    icon: "AlertTriangle",
  },
  {
    id: "negotiation-master",
    name: "Negotiation Master",
    description: "Remises, paliers, commissions. L'art de ne pas dire oui trop vite.",
    categories: ["negociation", "partenariat"],
    difficulty: "intermédiaire",
    premium: true,
    icon: "Handshake",
  },
  {
    id: "cashflow-clean",
    name: "Cashflow Clean",
    description: "Acomptes, récurrence, maintenance. Un flux propre et prévisible.",
    categories: ["cashflow"],
    difficulty: "intermédiaire",
    premium: true,
    icon: "Waves",
  },
  {
    id: "risk-control",
    name: "Risk Control",
    description: "Projets trop beaux, clients toxiques. Apprends à protéger ton profil.",
    categories: ["risque", "reputation"],
    difficulty: "avancé",
    premium: true,
    icon: "ShieldCheck",
  },
];
