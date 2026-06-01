"use client";

import { useEffect, type ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Onboarding } from "./Onboarding";
import { GameToastLayer } from "@/components/ui/GameToast";
import { useProfileStore } from "@/store/profileStore";
import { setAudioEnabled } from "@/lib/haptics";
import { track } from "@/lib/analytics";

/**
 * Mobile-first app frame: centered max-width column, persistent bottom nav,
 * toast layer and one-time onboarding. Hydrates the local profile on mount.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const hydrate = useProfileStore((s) => s.hydrate);
  const hydrated = useProfileStore((s) => s.hydrated);
  const onboardingSeen = useProfileStore((s) => s.onboardingSeen);
  const soundEnabled = useProfileStore((s) => s.settings.soundEnabled);

  useEffect(() => {
    hydrate();
    track("app_opened");
  }, [hydrate]);

  useEffect(() => {
    setAudioEnabled(soundEnabled);
  }, [soundEnabled]);

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-28 pt-3">
      {children}
      <BottomNav />
      <GameToastLayer />
      {hydrated && !onboardingSeen && <Onboarding />}
    </div>
  );
}
