"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Play, Trophy, User } from "lucide-react";
import { motion } from "framer-motion";

const ITEMS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/play", label: "Jouer", icon: Play },
  { href: "/leaderboard", label: "Classement", icon: Trophy },
  { href: "/profile", label: "Profil", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
      aria-label="Navigation principale"
    >
      <div className="glass-strong flex items-center justify-around rounded-3xl px-2 py-2">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl bg-violet/15 ring-1 ring-violet/40"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon
                className={`relative h-5 w-5 ${active ? "text-violet-light" : "text-ink-muted"}`}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className={`relative text-[11px] font-medium ${active ? "text-violet-light" : "text-ink-muted"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
