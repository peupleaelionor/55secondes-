"use client";

import * as Lucide from "lucide-react";
import { Circle, type LucideIcon } from "lucide-react";

interface Props {
  name: string;
  className?: string;
  strokeWidth?: number;
}

const registry = Lucide as unknown as Record<string, LucideIcon>;

/** Resolve a Lucide icon by name, with a safe fallback. Never crashes. */
export function resolveIcon(name: string): LucideIcon {
  return registry[name] ?? Circle;
}

/** Render a Lucide icon referenced by string name. */
export function Icon({ name, className, strokeWidth = 2 }: Props) {
  const Cmp = registry[name] ?? Circle;
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}
