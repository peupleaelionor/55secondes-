"use client";

import { useEffect, useState } from "react";
import { ProgressRing } from "./ProgressRing";

interface Props {
  score: number;
  size?: number;
  label?: string;
}

/** Animated final score ring — the number counts up on mount. */
export function ScoreCircle({ score, size = 168, label = "ton score" }: Props) {
  const target = Math.max(0, Math.min(100, Math.round(score)));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <ProgressRing progress={display / 100} size={size} stroke={12}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
        {label}
      </span>
      <span className="text-5xl font-extrabold italic leading-none tabular-nums">
        {display}
      </span>
      <span className="text-sm font-semibold text-violet-light">/100</span>
    </ProgressRing>
  );
}
