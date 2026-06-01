import type { Rarity } from "./types";
import type { DecisionDNA } from "./dna";

export interface Archetype {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  strength: string;
  weakness: string;
  nextAdvice: string;
  rarity: Rarity;
  /** Tailwind-friendly gradient stops for the aura. */
  gradient: [string, string];
}

export const ARCHETYPES: Record<string, Archetype> = {
  closer: {
    id: "closer",
    name: "The Closer",
    shortLabel: "Closer",
    description: "Tu transformes une hésitation en décision. Rien ne traîne.",
    strength: "Conclure vite et bien.",
    weakness: "Tu peux accepter trop tôt.",
    nextAdvice: "Structure l'offre avant de signer.",
    rarity: "epic",
    gradient: ["#A855F7", "#EF4444"],
  },
  strategist: {
    id: "strategist",
    name: "The Strategist",
    shortLabel: "Stratège",
    description: "Tu lis la partie avant de jouer le coup.",
    strength: "Vision d'ensemble.",
    weakness: "Parfois trop prudent.",
    nextAdvice: "Ose accélérer quand le momentum est là.",
    rarity: "epic",
    gradient: ["#8B5CF6", "#22D3EE"],
  },
  operator: {
    id: "operator",
    name: "The Operator",
    shortLabel: "Operator",
    description: "Tu exécutes proprement, transaction après transaction.",
    strength: "Régularité d'exécution.",
    weakness: "Tu sous-utilises les gros coups.",
    nextAdvice: "Place une offre premium par run.",
    rarity: "rare",
    gradient: ["#8B5CF6", "#22C55E"],
  },
  visionary: {
    id: "visionary",
    name: "The Visionary",
    shortLabel: "Visionnaire",
    description: "Tu repères les opportunités avant les autres.",
    strength: "Lecture d'opportunité.",
    weakness: "Tu peux négliger le risque.",
    nextAdvice: "Verrouille la confiance avant d'élargir.",
    rarity: "legendary",
    gradient: ["#C084FC", "#FBBF24"],
  },
  negotiator: {
    id: "negotiator",
    name: "The Negotiator",
    shortLabel: "Négociateur",
    description: "Tu ne prends jamais la première offre pour argent comptant.",
    strength: "Création de valeur par la négociation.",
    weakness: "Le temps file pendant que tu négocies.",
    nextAdvice: "Sache quand fermer le deal.",
    rarity: "epic",
    gradient: ["#A855F7", "#F59E0B"],
  },
  builder: {
    id: "builder",
    name: "The Builder",
    shortLabel: "Builder",
    description: "Tu poses des fondations solides avant de monter.",
    strength: "Confiance et structure.",
    weakness: "Démarrage parfois lent.",
    nextAdvice: "Capitalise plus tôt sur ta confiance.",
    rarity: "rare",
    gradient: ["#8B5CF6", "#38BDF8"],
  },
  riskController: {
    id: "riskController",
    name: "The Risk Controller",
    shortLabel: "Contrôleur",
    description: "Tu gardes la main même quand ça chauffe.",
    strength: "Sang-froid sous pression.",
    weakness: "Tu laisses passer des coups rentables.",
    nextAdvice: "Prends un risque calculé de plus.",
    rarity: "epic",
    gradient: ["#22C55E", "#8B5CF6"],
  },
  cashflowArchitect: {
    id: "cashflowArchitect",
    name: "The Cashflow Architect",
    shortLabel: "Architecte du flux",
    description: "Tu transformes les opportunités en flux sans perdre la structure.",
    strength: "Création de valeur rapide.",
    weakness: "Peut chercher trop vite l'optimisation.",
    nextAdvice: "Verrouille d'abord la confiance, puis accélère.",
    rarity: "legendary",
    gradient: ["#A855F7", "#22C55E"],
  },
  momentumMaker: {
    id: "momentumMaker",
    name: "The Momentum Maker",
    shortLabel: "Momentum",
    description: "Une fois lancé, tu deviens impossible à arrêter.",
    strength: "Séries longues et multiplicateur.",
    weakness: "Une cassure te coûte cher.",
    nextAdvice: "Protège ta série avec un choix sûr.",
    rarity: "rare",
    gradient: ["#F59E0B", "#A855F7"],
  },
  silentKiller: {
    id: "silentKiller",
    name: "The Silent Killer",
    shortLabel: "Silencieux",
    description: "Discret, efficace, redoutablement régulier.",
    strength: "Constance et propreté.",
    weakness: "Tu manques parfois d'audace.",
    nextAdvice: "Tente un gros coup quand le risque est bas.",
    rarity: "epic",
    gradient: ["#64748B", "#8B5CF6"],
  },
  premiumSeller: {
    id: "premiumSeller",
    name: "The Premium Seller",
    shortLabel: "Premium",
    description: "Tu vends de la valeur, pas du prix.",
    strength: "Marges élevées.",
    weakness: "Volume parfois faible.",
    nextAdvice: "Ajoute du volume sans casser tes prix.",
    rarity: "legendary",
    gradient: ["#C084FC", "#A855F7"],
  },
  systemBuilder: {
    id: "systemBuilder",
    name: "The System Builder",
    shortLabel: "Systèmes",
    description: "Tu construis des revenus qui tournent presque seuls.",
    strength: "Récurrence et exécution.",
    weakness: "Tu peux rater l'urgence.",
    nextAdvice: "Réagis plus vite aux opportunités chaudes.",
    rarity: "epic",
    gradient: ["#22D3EE", "#8B5CF6"],
  },
};

/** Map the DNA to the most fitting archetype. */
export function computeArchetype(dna: DecisionDNA): Archetype {
  const entries: Array<[string, number]> = [
    ["cashflowArchitect", (dna.cashflowSense + dna.opportunityReading + dna.riskControl) / 3],
    ["visionary", (dna.opportunityReading * 1.3 + dna.speed) / 2],
    ["negotiator", dna.negotiation * 1.25],
    ["closer", (dna.speed + dna.negotiation) / 2 + (dna.consistency < 55 ? 8 : 0)],
    ["riskController", dna.riskControl * 1.2],
    ["operator", (dna.execution + dna.consistency) / 2],
    ["builder", (dna.trustBuilding + dna.consistency) / 2],
    ["momentumMaker", (dna.speed + dna.execution) / 2 + (dna.negotiation > 60 ? 6 : 0)],
    ["silentKiller", (dna.consistency * 1.2 + dna.riskControl) / 2],
    ["premiumSeller", (dna.negotiation + dna.cashflowSense) / 2 + (dna.execution < 55 ? 6 : 0)],
    ["systemBuilder", (dna.execution + dna.cashflowSense + dna.trustBuilding) / 3],
    ["strategist", (dna.riskControl + dna.opportunityReading + dna.consistency) / 3],
  ];

  entries.sort((a, b) => b[1] - a[1]);
  const winner = entries[0][0];
  return ARCHETYPES[winner] ?? ARCHETYPES.strategist;
}
