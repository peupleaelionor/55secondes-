"use client";

import { motion } from "framer-motion";
import type { Badge, Rarity } from "@/lib/game/types";
import { Icon } from "@/components/Icon";
import { AssetImage } from "@/components/AssetImage";
import { badgeAssets } from "@/lib/assets";

interface Props {
  badge: Badge;
  unlocked?: boolean;
  reveal?: boolean;
}

export const RARITY_STYLE: Record<Rarity, { ring: string; text: string; glow: string }> = {
  common: { ring: "ring-violet/40", text: "text-violet-light", glow: "" },
  rare: { ring: "ring-violet-light/60", text: "text-violet-light", glow: "shadow-glow" },
  epic: { ring: "ring-fuchsia-400/60", text: "text-fuchsia-300", glow: "shadow-glow" },
  legendary: { ring: "ring-gold/70", text: "text-gold", glow: "shadow-glow-lg" },
};

export function BadgeCard({ badge, unlocked = true, reveal }: Props) {
  const style = RARITY_STYLE[badge.rarity];
  const art = badgeAssets[badge.id];
  return (
    <motion.div
      initial={reveal ? { scale: 0.85, opacity: 0 } : false}
      animate={reveal ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className={`glass flex flex-col items-center gap-2 rounded-2xl p-3 text-center ${unlocked ? "" : "opacity-40 grayscale"}`}
    >
      {art ? (
        <AssetImage
          src={art}
          alt={badge.name}
          className={`h-12 w-12 object-contain ${unlocked ? "" : ""}`}
          fallback={
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-violet/12 ring-1 ${style.ring} ${unlocked ? style.glow : ""}`}
            >
              <Icon name={badge.icon} className={`h-6 w-6 ${style.text}`} />
            </div>
          }
        />
      ) : (
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-violet/12 ring-1 ${style.ring} ${unlocked ? style.glow : ""}`}
        >
          <Icon name={badge.icon} className={`h-6 w-6 ${style.text}`} />
        </div>
      )}
      <p className="text-xs font-bold leading-tight">{badge.name}</p>
      <p className="text-[10px] uppercase tracking-wider text-ink-muted">{badge.rarity}</p>
    </motion.div>
  );
}
