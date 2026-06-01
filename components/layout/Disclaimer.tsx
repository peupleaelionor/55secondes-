import Link from "next/link";

/** Compact legal footer present across the app. */
export function Disclaimer({ className }: { className?: string }) {
  return (
    <footer className={`pt-2 text-center ${className ?? ""}`}>
      <p className="text-[11px] leading-relaxed text-ink-muted/80">
        55 Seconds est un jeu de simulation. Les montants, scores, flux et profils
        sont fictifs. L&apos;application ne fournit aucun conseil financier, ne
        garantit aucun financement et n&apos;encourage aucune action frauduleuse.
      </p>
      <div className="mt-2 flex items-center justify-center gap-4 text-[11px] font-medium text-violet-light">
        <Link href="/legal">Mentions & jeu</Link>
        <Link href="/privacy">Confidentialité</Link>
        <Link href="/skills">Compétences</Link>
      </div>
    </footer>
  );
}
