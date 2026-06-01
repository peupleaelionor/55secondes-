import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  strong?: boolean;
};

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Dark glassmorphism surface used across the app. */
export const GlassCard = forwardRef<HTMLDivElement, Props>(
  ({ className, strong, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx(
        strong ? "glass-strong" : "glass",
        "rounded-2xl shadow-card",
        className,
      )}
      {...rest}
    />
  ),
);
GlassCard.displayName = "GlassCard";

export { cx };
