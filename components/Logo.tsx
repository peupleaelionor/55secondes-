interface Props {
  className?: string;
}

/** "55 Seconds" wordmark — 55 in electric violet, Seconds white italic. */
export function Logo({ className }: Props) {
  return (
    <span className={`select-none text-3xl font-extrabold italic tracking-tight ${className ?? ""}`}>
      <span className="text-gradient-violet">55</span>{" "}
      <span className="text-ink">Seconds</span>
    </span>
  );
}
