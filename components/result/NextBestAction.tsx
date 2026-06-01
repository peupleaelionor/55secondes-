"use client";

import { Rocket, Scale, Swords, Share2 } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

interface Props {
  score: number;
  onReplay: () => void;
  onDuel: () => void;
  onShare: () => void;
}

/** One clear recommended action based on the result. */
export function NextBestAction({ score, onReplay, onDuel, onShare }: Props) {
  let label: string;
  let icon = <Rocket className="h-5 w-5" />;
  let action = onReplay;

  if (score < 50) {
    label = "Rejouer avec moins de risque";
    icon = <Rocket className="h-5 w-5" />;
    action = onReplay;
  } else if (score < 80) {
    label = "Optimiser ton équilibre";
    icon = <Scale className="h-5 w-5" />;
    action = onReplay;
  } else if (score < 95) {
    label = "Défier un ami";
    icon = <Swords className="h-5 w-5" />;
    action = onDuel;
  } else {
    label = "Partager ton score légendaire";
    icon = <Share2 className="h-5 w-5" />;
    action = onShare;
  }

  return (
    <GlowButton onClick={action} className="w-full">
      {icon}
      {label}
    </GlowButton>
  );
}
