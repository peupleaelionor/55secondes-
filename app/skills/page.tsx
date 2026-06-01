"use client";

import { useRouter } from "next/navigation";
import {
  Gauge,
  Handshake,
  Eye,
  ShieldAlert,
  Waves,
  ListChecks,
  Repeat,
  Crosshair,
  Flame,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Disclaimer } from "@/components/layout/Disclaimer";

const SKILLS = [
  { icon: Gauge, name: "Décision sous pression", text: "Le chrono t'oblige à trancher vite, sans sur-réfléchir." },
  { icon: Handshake, name: "Négociation", text: "Tu apprends à ne pas accepter trop vite. Les meilleurs scores viennent souvent d'une offre mieux structurée." },
  { icon: Eye, name: "Lecture d'opportunité", text: "Repérer le deal qui crée du flux sans plomber ton profil." },
  { icon: ShieldAlert, name: "Gestion du risque", text: "Pousser la croissance sans rendre ton profil instable." },
  { icon: Waves, name: "Cashflow fictif", text: "Sécuriser des acomptes fictifs et viser la récurrence." },
  { icon: ListChecks, name: "Priorisation", text: "Choisir le bon projet quand tout arrive en même temps." },
  { icon: Repeat, name: "Régularité", text: "Enchaîner des choix cohérents plutôt que des coups isolés." },
  { icon: Crosshair, name: "Positionnement", text: "Vendre une offre claire plutôt qu'une promesse floue." },
  { icon: Flame, name: "Momentum", text: "Construire une série et faire grimper ton multiplicateur." },
  { icon: ShieldCheck, name: "Confiance", text: "Garder un profil crédible pour rester finançable dans le jeu." },
];

export default function SkillsPage() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          className="glass flex h-9 w-9 items-center justify-center rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <TopBar title="Compétences" />
      </div>

      <p className="text-lg font-bold">Les réflexes que tu entraînes</p>
      <p className="text-sm text-ink-muted">
        Chaque partie de 55 Seconds muscle des réflexes business concrets. Simulation
        fictive, réflexes réels.
      </p>

      <div className="space-y-2">
        {SKILLS.map(({ icon: Icon, name, text }) => (
          <GlassCard key={name} className="flex items-start gap-3 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/12 ring-1 ring-violet/30">
              <Icon className="h-5 w-5 text-violet-light" />
            </div>
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-ink-muted">{text}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}
