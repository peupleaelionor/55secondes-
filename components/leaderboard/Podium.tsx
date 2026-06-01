"use client";

import { motion } from "framer-motion";
import { Crown, ShieldCheck } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/game/types";
import { Avatar } from "./Avatar";
import { formatNumber } from "@/lib/format";

interface Props {
  top3: LeaderboardEntry[];
}

const ORDER = [1, 0, 2]; // visual: 2nd, 1st, 3rd
const MEDAL = ["#FBBF24", "#CBD5E1", "#D9A066"];

/** Cinematic top-3 podium with crown on #1. */
export function Podium({ top3 }: Props) {
  const slots = ORDER.map((i) => top3[i]).filter(Boolean) as LeaderboardEntry[];

  return (
    <div className="flex items-end justify-center gap-3 pb-2 pt-4">
      {slots.map((entry) => {
        const first = entry.rank === 1;
        const medal = MEDAL[entry.rank - 1] ?? "#CBD5E1";
        return (
          <motion.div
            key={entry.name}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: entry.rank * 0.05 }}
            className={`flex flex-1 flex-col items-center ${first ? "-mt-4" : "mt-2"}`}
          >
            {first && <Crown className="mb-1 h-6 w-6 text-gold" fill="#FBBF24" />}
            <div className="relative">
              <Avatar
                seed={entry.avatarSeed}
                size={first ? 76 : 60}
                isPlayer={entry.isPlayer}
              />
              <span
                className="absolute -bottom-1 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full text-xs font-bold text-black ring-2 ring-bg"
                style={{ backgroundColor: medal }}
              >
                {entry.rank}
              </span>
            </div>
            <p className="mt-3 max-w-full truncate text-sm font-bold">{entry.name}</p>
            <p className={`text-base font-extrabold ${first ? "text-violet-light" : "text-violet"}`}>
              {formatNumber(entry.amount)} €
            </p>
            <span className="mt-1 flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-ink-muted">
              <ShieldCheck className="h-3 w-3 text-violet-light" />
              Confiance {entry.confidence}%
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
