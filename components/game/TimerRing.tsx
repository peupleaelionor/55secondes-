"use client";

import { ProgressRing } from "./ProgressRing";
import { GAME } from "@/lib/game/engine";
import { formatTime } from "@/lib/format";

interface Props {
  timeLeft: number;
  size?: number;
  /** Static "55 SECONDES" hero display (home). */
  hero?: boolean;
}

/** Circular countdown. Arc empties as time runs out; turns urgent near zero. */
export function TimerRing({ timeLeft, size = 200, hero }: Props) {
  const progress = hero ? 1 : Math.max(0, timeLeft) / GAME.START_TIME;
  const urgent = !hero && timeLeft <= 10;

  return (
    <ProgressRing
      progress={progress}
      size={size}
      stroke={12}
      from={urgent ? "#F59E0B" : "#C084FC"}
      to={urgent ? "#EF4444" : "#8B5CF6"}
    >
      <span className="text-5xl font-extrabold italic leading-none tracking-tight tabular-nums">
        {hero ? GAME.START_TIME : formatTime(timeLeft)}
      </span>
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-light">
        {hero ? "secondes" : "secondes restantes"}
      </span>
    </ProgressRing>
  );
}
