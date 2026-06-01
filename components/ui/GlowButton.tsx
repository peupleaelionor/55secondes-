"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cx } from "./GlassCard";

type Variant = "primary" | "secondary" | "ghost";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-2xl font-semibold tracking-tight transition-colors select-none disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "btn-glow text-white px-6 py-4 text-lg",
  secondary:
    "glass text-ink px-5 py-4 hover:border-violet-light/40 active:bg-white/5",
  ghost: "text-ink-muted px-4 py-2 hover:text-ink",
};

/** Large, tappable, glowing button with a subtle press animation. */
export function GlowButton({
  children,
  onClick,
  variant = "primary",
  className,
  type = "button",
  disabled,
  ...rest
}: Props) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      whileHover={variant === "primary" ? { scale: 1.01 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cx(base, variants[variant], className)}
      aria-label={rest["aria-label"]}
    >
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 rounded-2xl animate-pulse-glow" />
      )}
      <span className="relative inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
