"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Trophy,
  Gamepad2,
  Crown,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Lock,
  Volume2,
  VolumeX,
  Vibrate,
  Trash2,
  Sparkles,
  RotateCw,
  Pencil,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Avatar } from "@/components/leaderboard/Avatar";
import { BadgeCard } from "@/components/game/BadgeCard";
import { ArchetypeCard } from "@/components/result/ArchetypeCard";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { useProfileStore } from "@/store/profileStore";
import { useToastStore } from "@/store/toastStore";
import { BADGES } from "@/lib/game/badges";
import { ARCHETYPES } from "@/lib/game/archetypes";
import { levelFromXp } from "@/lib/game/levels";
import { getRank } from "@/lib/game/ranks";
import { PRO_PITCH } from "@/lib/plans";
import { formatEuro, formatNumber } from "@/lib/format";
import { track } from "@/lib/analytics";

export default function ProfilePage() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const settings = useProfileStore((s) => s.settings);
  const setPseudo = useProfileStore((s) => s.setPseudo);
  const toggleSound = useProfileStore((s) => s.toggleSound);
  const toggleHaptics = useProfileStore((s) => s.toggleHaptics);
  const resetData = useProfileStore((s) => s.resetData);
  const push = useToastStore((s) => s.push);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile.pseudo);
  const [confirmReset, setConfirmReset] = useState(false);

  const level = levelFromXp(profile.xp);
  const bestRank = getRank(profile.bestScore);
  const ownedBadges = new Set(profile.badges);
  const archetype = profile.topArchetype ? ARCHETYPES[profile.topArchetype] : null;

  const savePseudo = () => {
    setPseudo(draft);
    setEditing(false);
  };

  const onReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetData();
    setConfirmReset(false);
    push("Données réinitialisées", "neutral");
  };

  return (
    <div className="space-y-4">
      <TopBar title="Profil" big />

      {/* Identity */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-4">
          <Avatar seed={profile.pseudo} size={64} isPlayer />
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={18}
                  autoFocus
                  className="w-full rounded-lg bg-white/5 px-2 py-1 text-lg font-bold outline-none ring-1 ring-violet/40"
                  aria-label="Pseudo"
                />
                <GlowButton variant="secondary" onClick={savePseudo} className="px-3 py-1 text-sm">
                  OK
                </GlowButton>
              </div>
            ) : (
              <button
                onClick={() => {
                  setDraft(profile.pseudo);
                  setEditing(true);
                }}
                className="flex items-center gap-2"
              >
                <span className="text-xl font-extrabold italic">{profile.pseudo}</span>
                <Pencil className="h-4 w-4 text-ink-muted" />
              </button>
            )}
            <p className="text-sm text-violet-light">
              Niveau {level.level} · {level.title}
            </p>
            {profile.bestScore > 0 && (
              <span
                className="mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1"
                style={{ color: bestRank.color, borderColor: `${bestRank.color}55` }}
              >
                <Crown className="h-3 w-3" style={{ color: bestRank.color }} />
                {bestRank.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/[0.04] px-3 py-1.5">
            <Flame className="h-4 w-4 text-warn" />
            <span className="text-sm font-bold">{profile.streak}</span>
          </div>
        </div>

        {/* XP progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-ink-muted">
            <span>XP {formatNumber(level.xpIntoLevel)} / {formatNumber(level.xpToNext)}</span>
            <span>Niveau {level.level + 1}</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-light to-violet"
              style={{ width: `${Math.round(level.progress * 100)}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Headline stats */}
      <div className="grid grid-cols-3 gap-2">
        <MiniStat icon={Trophy} label="Meilleur score" value={`${profile.bestScore}`} />
        <MiniStat icon={Gamepad2} label="Parties" value={`${profile.gamesPlayed}`} />
        <MiniStat icon={Crown} label="Victoires" value={`${profile.wins}`} />
      </div>

      {archetype && <ArchetypeCard archetype={archetype} />}

      {/* Records */}
      <GlassCard className="space-y-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-light">
          Statistiques
        </p>
        <Record icon={Wallet} label="Meilleur solde" value={formatEuro(profile.bestBalance)} />
        <Record icon={TrendingUp} label="Meilleur flux" value={formatEuro(profile.bestFlow)} />
        <Record icon={ShieldCheck} label="Meilleure confiance" value={`${profile.bestConfidence}/100`} />
        <Record icon={Lock} label="Risque maîtrisé" value={`${profile.bestRiskControl}/100`} />
      </GlassCard>

      {/* Badges */}
      <section>
        <h3 className="mb-2 text-lg font-bold">
          Badges{" "}
          <span className="text-sm font-medium text-ink-muted">
            {ownedBadges.size}/{BADGES.length}
          </span>
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {BADGES.map((b) => (
            <BadgeCard key={b.id} badge={b} unlocked={ownedBadges.has(b.id)} />
          ))}
        </div>
      </section>

      {/* Pro pitch */}
      <GlassCard strong className="space-y-2 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-light" />
          <p className="font-bold">{PRO_PITCH.title}</p>
        </div>
        <p className="text-sm text-ink-muted">{PRO_PITCH.body}</p>
        <GlowButton
          variant="secondary"
          className="w-full py-3 text-sm"
          onClick={() => {
            track("founder_waitlist_clicked");
            push("Tu es sur la liste Founder. Merci.", "win");
          }}
        >
          {PRO_PITCH.cta}
        </GlowButton>
      </GlassCard>

      {/* Settings */}
      <GlassCard className="divide-y divide-white/5 p-1">
        <Toggle
          icon={settings.soundEnabled ? Volume2 : VolumeX}
          label="Sons"
          on={settings.soundEnabled}
          onToggle={toggleSound}
        />
        <Toggle
          icon={Vibrate}
          label="Vibrations"
          on={settings.hapticsEnabled}
          onToggle={toggleHaptics}
        />
        <button
          onClick={onReset}
          className="flex w-full items-center gap-3 px-3 py-3 text-left"
        >
          <Trash2 className="h-5 w-5 text-danger" />
          <span className="flex-1 font-medium text-danger">
            {confirmReset ? "Confirmer la réinitialisation ?" : "Réinitialiser mes données"}
          </span>
        </button>
      </GlassCard>

      <GlowButton onClick={() => router.push("/play")} className="w-full">
        <RotateCw className="h-5 w-5" />
        Rejouer
      </GlowButton>

      <Disclaimer />
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: string }) {
  return (
    <GlassCard className="flex flex-col items-center gap-1 p-3 text-center">
      <Icon className="h-5 w-5 text-violet-light" />
      <p className="text-lg font-extrabold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-ink-muted">{label}</p>
    </GlassCard>
  );
}

function Record({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-violet-light" />
      <span className="flex-1 text-sm text-ink-muted">{label}</span>
      <span className="font-bold tabular-nums">{value}</span>
    </div>
  );
}

function Toggle({
  icon: Icon,
  label,
  on,
  onToggle,
}: {
  icon: typeof Volume2;
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className="flex w-full items-center gap-3 px-3 py-3 text-left">
      <Icon className="h-5 w-5 text-violet-light" />
      <span className="flex-1 font-medium">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-violet" : "bg-white/10"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}
