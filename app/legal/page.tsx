"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, XCircle, CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";

const IS_NOT = [
  "un produit financier",
  "un simulateur bancaire réel",
  "un service de financement",
  "un jeu d'argent ou de hasard",
  "une promesse de revenus ou de financement",
  "une méthode pour tromper un organisme",
];

const IS = [
  "un jeu d'entraînement business ultra-rapide",
  "une simulation entièrement fictive",
  "un exercice de décision sous pression",
  "un outil ludique et pédagogique",
];

export default function LegalPage() {
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
        <TopBar title="Mentions & jeu" />
      </div>

      <GlassCard className="space-y-2 p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-violet-light" />
          <p className="font-bold">55 Seconds est un jeu de simulation.</p>
        </div>
        <p className="text-sm text-ink-muted">
          Les montants, scores, flux et profils sont fictifs. L&apos;application ne
          fournit aucun conseil financier, ne garantit aucun financement et
          n&apos;encourage aucune action frauduleuse.
        </p>
      </GlassCard>

      <GlassCard className="space-y-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-light">
          Ce que c&apos;est
        </p>
        {IS.map((t) => (
          <div key={t} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-ok" />
            <span>{t}</span>
          </div>
        ))}
      </GlassCard>

      <GlassCard className="space-y-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-light">
          Ce que ce n&apos;est pas
        </p>
        {IS_NOT.map((t) => (
          <div key={t} className="flex items-center gap-2 text-sm">
            <XCircle className="h-4 w-4 shrink-0 text-danger" />
            <span>{t}</span>
          </div>
        ))}
      </GlassCard>

      <p className="px-1 text-xs leading-relaxed text-ink-muted/80">
        Aucun achat aléatoire, aucune récompense monétisée au hasard. Les futures
        options premium (analyses, packs de scénarios, cosmétiques) n&apos;impliquent
        jamais de hasard payant.
      </p>
    </div>
  );
}
