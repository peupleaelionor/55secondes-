"use client";

import { ProgressRing } from "./ProgressRing";
import { AssetImage } from "@/components/AssetImage";
import { ASSETS } from "@/lib/assets";
import { GAME } from "@/lib/game/engine";
import { formatTime } from "@/lib/format";

interface Props {
  timeLeft: number;
  size?: number;
  /** Static "55 SECONDES" hero display (home). */
  hero?: boolean;
}

function Center({ hero, timeLeft }: { hero?: boolean; timeLeft: number }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <span className="text-5xl font-extrabold italic leading-none tracking-tight tabular-nums">
        {hero ? GAME.START_TIME : formatTime(timeLeft)}
      </span>
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-light">
        {hero ? "secondes" : "secondes restantes"}
      </span>
    </div>
  );
}

/** Circular countdown. Arc empties as time runs out; turns urgent near zero. */
export function TimerRing({ timeLeft, size = 200, hero }: Props) {
  const progress = hero ? 1 : Math.max(0, timeLeft) / GAME.START_TIME;
  const urgent = !hero && timeLeft <= 10;

  // On the home hero, use the rendered ring artwork when available.
  if (hero) {
    return (
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <AssetImage
          src={ASSETS.ui.timerRing}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          fallback={
            <div className="absolute inset-0">
              <ProgressRing progress={1} size={size} stroke={12} />
            </div>
          }
        />
        <div className="relative">
          <Center hero timeLeft={timeLeft} />
        </div>
      </div>
    );
  }

  return (
    <ProgressRing
      progress={progress}
      size={size}
      stroke={12}
      from={urgent ? "#F59E0B" : "#C084FC"}
      to={urgent ? "#EF4444" : "#8B5CF6"}
    >
      <Center timeLeft={timeLeft} />
    </ProgressRing>
  );
}
