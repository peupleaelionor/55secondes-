/** Formatting helpers. All defensive against NaN / Infinity. */

const safe = (n: number): number =>
  Number.isFinite(n) ? n : 0;

/** Format a game-currency amount as French euros, e.g. "5 420 €". */
export function formatEuro(n: number, opts?: { decimals?: number }): string {
  const value = safe(n);
  const decimals = opts?.decimals ?? (Math.abs(value) < 10 && value % 1 !== 0 ? 2 : 0);
  return (
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value) + " €"
  );
}

/** Compact integer with French spacing, e.g. "11 850". */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(safe(n)));
}

/** Signed delta string for live feedback, e.g. "+1 200 €" / "-2". */
export function formatDelta(n: number, unit = ""): string {
  const value = Math.round(safe(n));
  if (value === 0) return `0${unit ? " " + unit : ""}`;
  const sign = value > 0 ? "+" : "−";
  return `${sign}${formatNumber(Math.abs(value))}${unit ? " " + unit : ""}`;
}

/** mm:ss timer label. */
export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(safe(seconds)));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

/** Initials for an avatar bubble. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
