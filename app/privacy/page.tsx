"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Database, UserX, EyeOff, Trash2 } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { useProfileStore } from "@/store/profileStore";
import { useToastStore } from "@/store/toastStore";

const POINTS = [
  { icon: UserX, title: "Pas de compte", text: "La V1 ne demande aucune inscription ni identité." },
  { icon: Database, title: "Données locales", text: "Ta progression est stockée sur ton appareil (localStorage)." },
  { icon: EyeOff, title: "Pas de tracking réel", text: "Aucun pistage publicitaire ni envoi de données personnelles en V1." },
];

export default function PrivacyPage() {
  const router = useRouter();
  const resetData = useProfileStore((s) => s.resetData);
  const push = useToastStore((s) => s.push);
  const [confirm, setConfirm] = useState(false);

  const onReset = () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    resetData();
    setConfirm(false);
    push("Données locales effacées", "neutral");
  };

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
        <TopBar title="Confidentialité" />
      </div>

      <div className="space-y-2">
        {POINTS.map(({ icon: Icon, title, text }) => (
          <GlassCard key={title} className="flex items-start gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/12 ring-1 ring-violet/30">
              <Icon className="h-5 w-5 text-violet-light" />
            </div>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-ink-muted">{text}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlowButton variant="secondary" onClick={onReset} className="w-full py-3 text-danger">
        <Trash2 className="h-5 w-5" />
        {confirm ? "Confirmer l'effacement" : "Effacer mes données locales"}
      </GlowButton>
    </div>
  );
}
