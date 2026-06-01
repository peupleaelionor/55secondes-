"use client";

import type { ReactNode } from "react";
import { Flame, Bell } from "lucide-react";
import { useProfileStore } from "@/store/profileStore";

interface Props {
  title?: string;
  big?: boolean;
  /** Custom left content (e.g. the logo) that overrides the title. */
  left?: ReactNode;
}

/** App-style top bar with the daily streak flame. */
export function TopBar({ title, big, left }: Props) {
  const streak = useProfileStore((s) => s.profile.streak);
  const hydrated = useProfileStore((s) => s.hydrated);

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {left ? (
        left
      ) : title ? (
        big ? (
          <h1 className="text-3xl font-extrabold italic tracking-tight">{title}</h1>
        ) : (
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        )
      ) : (
        <span />
      )}
      <div className="flex items-center gap-2">
        <div
          className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5"
          aria-label={`Série de ${hydrated ? streak : 0} jours`}
        >
          <Flame className="h-4 w-4 text-warn" />
          <span className="text-sm font-bold">{hydrated ? streak : 0}</span>
        </div>
        <div className="glass flex h-9 w-9 items-center justify-center rounded-full" aria-hidden>
          <Bell className="h-4 w-4 text-ink-muted" />
        </div>
      </div>
    </div>
  );
}
