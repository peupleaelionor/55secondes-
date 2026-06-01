/** Viral share helper: Web Share API with clipboard fallback. */

export interface ShareResult {
  method: "share" | "clipboard" | "none";
  ok: boolean;
}

export type ShareVariant = 1 | 2 | 3 | 4 | 5;

export interface ShareData {
  score: number;
  flow: number;
  badgeName?: string | null;
  archetype?: string | null;
  rank?: string | null;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(Math.round(Number.isFinite(n) ? n : 0));

export const SHARE_LABELS: Record<ShareVariant, string> = {
  1: "Score",
  2: "Provocation",
  3: "Archétype",
  4: "Badge",
  5: "Duel",
};

/** Five share copy variants. All frame the numbers as fictional game data. */
export function getShareText(data: ShareData, variant: ShareVariant = 1): string {
  switch (variant) {
    case 2:
      return `55 secondes. Des décisions sous pression. Un seul score.\nMoi : ${data.score}/100 sur 55 Seconds.\nTu crois avoir l'instinct ? Prouve-le.`;
    case 3:
      return `Mon profil business : ${data.archetype ?? "Décideur"}.\nRévélé en 55 secondes — score ${data.score}/100 sur 55 Seconds.\nEt toi, c'est quoi le tien ?`;
    case 4:
      return `Badge débloqué : ${data.badgeName ?? "secret"} sur 55 Seconds.\nPeu de joueurs l'obtiennent. Score ${data.score}/100.\nÀ toi de jouer.`;
    case 5:
      return `Je te défie sur 55 Seconds : même chrono, mêmes décisions.\nMon score à battre : ${data.score}/100.\nTu fais mieux ?`;
    case 1:
    default:
      return `${data.score}/100 sur 55 Seconds${data.rank ? ` — rang ${data.rank}` : ""}.\n0,18 € → ${fmt(
        data.flow,
      )} € de flux (fictif) en 55 secondes.\nTu fais mieux ?`;
  }
}

export function buildShareText(opts: { score: number; flow: number }): string {
  return getShareText(opts, 1);
}

/** Share an explicit text (with clipboard fallback). */
export async function shareText(text: string, url?: string): Promise<ShareResult> {
  const link = url ?? (typeof window !== "undefined" ? window.location.origin : "");

  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ title: "55 Seconds", text, url: link });
      return { method: "share", ok: true };
    } catch {
      // cancelled — fall through
    }
  }

  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    "writeText" in navigator.clipboard
  ) {
    try {
      await navigator.clipboard.writeText(`${text}\n${link}`.trim());
      return { method: "clipboard", ok: true };
    } catch {
      return { method: "clipboard", ok: false };
    }
  }

  return { method: "none", ok: false };
}

export async function shareScore(opts: {
  score: number;
  flow: number;
  badgeName?: string | null;
  archetype?: string | null;
  variant?: ShareVariant;
  url?: string;
}): Promise<ShareResult> {
  return shareText(getShareText(opts, opts.variant ?? 1), opts.url);
}
