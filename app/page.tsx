"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  ArrowLeftRight,
  Rocket,
  Trophy,
  Target,
  Users,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { TimerRing } from "@/components/game/TimerRing";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { AssetImage } from "@/components/AssetImage";
import { ASSETS } from "@/lib/assets";
import { GAME } from "@/lib/game/engine";
import { formatEuro } from "@/lib/format";

const OBJECTIVES = [
  { icon: Wallet, label: "Solde initial", value: formatEuro(GAME.INITIAL.balance, { decimals: 2 }) },
  { icon: TrendingUp, label: "Objectif flux", value: formatEuro(GAME.OBJECTIVES.flow) },
  { icon: ShieldCheck, label: "Solde cible", value: formatEuro(GAME.OBJECTIVES.balance) },
  { icon: ArrowLeftRight, label: "Transactions", value: String(GAME.OBJECTIVES.transactions) },
];

const STEPS = [
  { icon: Wallet, title: "Démarre", text: "Tu commences avec 0,18 € sur ton compte virtuel." },
  { icon: TrendingUp, title: "Génère du flux", text: "Enchaîne des décisions malines pour créer du flux fictif." },
  { icon: ShieldCheck, title: "Atteins les objectifs", text: "Solde, flux, transactions : remplis les conditions avant 55 secondes." },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="space-y-5">
      {/* Ambient hero background (renders only if the asset is present) */}
      <AssetImage
        src={ASSETS.story.teaser}
        alt=""
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 mx-auto h-[55vh] w-full max-w-md object-cover opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        fallback={null}
      />
      <TopBar left={<Logo />} />

      <p className="text-lg text-ink-muted">
        55 secondes pour tester ton instinct business.{" "}
        <span className="font-semibold text-violet-light">Simulation fictive, stratégie réelle.</span>
      </p>

      {/* Objective card */}
      <GlassCard className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-light">
              Objectif
            </p>
            <h2 className="mt-1 text-2xl font-extrabold italic leading-tight tracking-tight">
              Deviens finançable en <span className="text-violet-light">55 secondes.</span>
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Atteins les 4 objectifs avant la fin du chrono pour débloquer ton profil
              finançable — dans le jeu.
            </p>
          </div>
          <div className="hidden shrink-0 sm:block">
            <TimerRing timeLeft={GAME.START_TIME} hero size={132} />
          </div>
        </div>

        <div className="mt-4 flex justify-center sm:hidden">
          <TimerRing timeLeft={GAME.START_TIME} hero size={150} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {OBJECTIVES.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-white/[0.03] p-3 text-center">
              <Icon className="mx-auto h-5 w-5 text-violet-light" />
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                {label}
              </p>
              <p className="text-sm font-bold">{value}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlowButton onClick={() => router.push("/play")} className="w-full">
        <Rocket className="h-5 w-5" />
        Jouer maintenant
      </GlowButton>

      <div className="grid grid-cols-2 gap-3">
        <GlowButton variant="secondary" onClick={() => router.push("/leaderboard")}>
          <Trophy className="h-5 w-5 text-violet-light" />
          Classement
        </GlowButton>
        <GlowButton variant="secondary" onClick={() => router.push("/daily")}>
          <Target className="h-5 w-5 text-violet-light" />
          Défis du jour
        </GlowButton>
      </div>

      {/* How it works */}
      <section>
        <h3 className="mb-2 text-lg font-bold">Comment ça marche</h3>
        <div className="space-y-2">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard className="flex items-center gap-3 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet text-xs font-bold text-white">
                  {i + 1}
                </span>
                <Icon className="h-5 w-5 shrink-0 text-violet-light" />
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-ink-muted">{text}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <GlassCard className="flex items-center gap-2 p-3 text-sm text-ink-muted">
        <Users className="h-4 w-4 shrink-0 text-violet-light" />
        Rejoins des milliers de joueurs et tente le défi{" "}
        <span className="font-semibold text-ink">chaque jour.</span>
      </GlassCard>

      {/* Below the fold — investor / partner framing */}
      <section className="space-y-3 pt-2">
        <InfoBlock
          title="Pourquoi ça marche"
          text="Une partie courte, une boucle virale, une progression infinie. On rejoue pour battre son score, on partage pour défier ses amis."
        />
        <InfoBlock
          title="Pour qui"
          text="Freelances, créateurs, étudiants, entrepreneurs et incubateurs qui veulent aiguiser leurs réflexes de décision."
        />
        <InfoBlock
          title="Ce que le jeu mesure"
          text="Vitesse, risque, confiance, négociation et régularité. Le score n'est pas qu'un chiffre : c'est un miroir de tes réflexes business."
        />
        <Link
          href="/skills"
          className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3 text-sm font-semibold text-violet-light"
        >
          Les réflexes que tu entraînes
          <ChevronRight className="h-4 w-4" />
        </Link>
      </section>

      <Disclaimer />
    </div>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-violet-light">{title}</p>
      <p className="mt-1 text-sm text-ink-muted">{text}</p>
    </div>
  );
}
