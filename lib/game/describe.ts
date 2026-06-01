import type { ChoiceEffects } from "./types";
import { formatNumber } from "../format";

interface EffectSegment {
  text: string;
  tone: "gain" | "loss" | "neutral";
}

/**
 * Turn raw choice effects into ordered, signed segments for both the
 * structured UI chips and a flat accessible description string.
 */
export function effectSegments(e: ChoiceEffects): EffectSegment[] {
  const segs: EffectSegment[] = [];
  const push = (value: number, unit: string, invert = false) => {
    if (!value) return;
    const positiveIsGain = !invert;
    const isGain = value > 0 ? positiveIsGain : !positiveIsGain;
    const sign = value > 0 ? "+" : "−";
    segs.push({
      text: `${sign}${formatNumber(Math.abs(value))} ${unit}`,
      tone: isGain ? "gain" : "loss",
    });
  };

  push(e.flowDelta, "€ flux");
  push(e.balanceDelta, "€ solde");
  push(e.transactionsDelta, e.transactionsDelta === 1 ? "transaction" : "transactions");
  push(e.confidenceDelta, "confiance");
  // Risk is inverted: a positive risk delta is a loss (bad).
  push(e.riskDelta, "risque", true);
  push(e.momentumDelta, "momentum");

  if (segs.length === 0) segs.push({ text: "Aucun effet", tone: "neutral" });
  return segs;
}

export function describeEffects(e: ChoiceEffects): string {
  return effectSegments(e)
    .map((s) => s.text)
    .join(" · ");
}
