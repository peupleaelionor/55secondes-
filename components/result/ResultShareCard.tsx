"use client";

import { forwardRef } from "react";
import type { Archetype } from "@/lib/game/archetypes";
import { formatNumber } from "@/lib/format";
import { AssetImage } from "@/components/AssetImage";
import { iconAssets } from "@/lib/assets";

interface Props {
  score: number;
  flow: number;
  archetype: Archetype;
  badgeName?: string | null;
}

/**
 * 9:16 share visual designed for a story screenshot. Isolated component so a
 * future canvas/image export can render it off-screen unchanged.
 */
export const ResultShareCard = forwardRef<HTMLDivElement, Props>(function ResultShareCard(
  { score, flow, archetype, badgeName },
  ref,
) {
  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-3xl border border-violet/30 p-5"
      style={{
        background:
          "radial-gradient(120% 80% at 80% 0%, rgba(168,85,247,0.35), transparent 60%), linear-gradient(160deg, #0B0718, #05030A)",
      }}
    >
      <div
        className="pointer-events-none absolute -left-10 bottom-10 h-48 w-48 rounded-full opacity-40 blur-3xl"
        style={{ backgroundImage: `linear-gradient(135deg, ${archetype.gradient[0]}, ${archetype.gradient[1]})` }}
        aria-hidden
      />
      <AssetImage
        src={iconAssets.rocket}
        alt=""
        className="pointer-events-none absolute right-3 top-10 h-20 w-20 object-contain opacity-90"
        fallback={null}
      />
      <div className="relative flex h-full flex-col">
        <p className="text-sm font-extrabold italic tracking-tight">
          <span className="text-violet-light">55</span> Seconds
        </p>

        <div className="mt-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
            Score
          </p>
          <p className="text-7xl font-extrabold italic leading-none tabular-nums">{score}</p>
          <p className="text-sm font-semibold text-violet-light">/100</p>

          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-ink-muted">
            Profil
          </p>
          <p
            className="bg-clip-text text-xl font-extrabold italic text-transparent"
            style={{ backgroundImage: `linear-gradient(100deg, ${archetype.gradient[0]}, ${archetype.gradient[1]})` }}
          >
            {archetype.name}
          </p>

          {badgeName && (
            <p className="mt-2 inline-block rounded-full bg-violet/15 px-3 py-1 text-xs font-semibold text-violet-light ring-1 ring-violet/30">
              {badgeName}
            </p>
          )}

          <p className="mt-4 text-sm text-ink-muted">
            0,18 € → {formatNumber(flow)} € de flux fictif en 55 s.
          </p>
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-widest text-ink-muted">
          Simulation fictive
        </p>
      </div>
    </div>
  );
});
