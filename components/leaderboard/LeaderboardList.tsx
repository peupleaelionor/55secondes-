"use client";

import { ShieldCheck } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/game/types";
import { Avatar } from "./Avatar";
import { formatNumber } from "@/lib/format";

interface Props {
  entries: LeaderboardEntry[];
}

/** Ranks 4..N as a clean list. */
export function LeaderboardList({ entries }: Props) {
  if (entries.length === 0) return null;
  return (
    <div className="glass divide-y divide-white/5 rounded-2xl">
      {entries.map((e) => (
        <div
          key={`${e.rank}-${e.name}`}
          className={`flex items-center gap-3 px-3 py-2.5 ${e.isPlayer ? "rounded-2xl bg-violet/10" : ""}`}
        >
          <span className="w-5 text-center text-sm font-bold text-ink-muted">{e.rank}</span>
          <Avatar seed={e.avatarSeed} size={34} isPlayer={e.isPlayer} />
          <span className="min-w-0 flex-1 truncate font-semibold">
            {e.name}
            {e.isPlayer && <span className="ml-1 text-xs text-violet-light">· vous</span>}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-ink-muted">
            <ShieldCheck className="h-3 w-3 text-violet-light" />
            {e.confidence}%
          </span>
          <span className="w-20 text-right font-bold text-violet-light tabular-nums">
            {formatNumber(e.amount)} €
          </span>
        </div>
      ))}
    </div>
  );
}
