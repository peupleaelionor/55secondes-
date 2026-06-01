import type { Scenario } from "./types";
import { SCENARIOS } from "./scenarios";

/**
 * Challenge seeds: a friend can replay the exact same scenario order, same
 * chrono. Everything is local in V1 — the seed is just encoded in a URL param.
 */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A short, shareable, URL-safe seed. */
export function createChallengeSeed(): string {
  const n = Math.floor(Math.random() * 0xffffffff);
  return n.toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
}

/** Deterministic, repeat-aware scenario order for a given seed. */
export function getScenariosFromSeed(seed: string): Scenario[] {
  const rand = mulberry32(hash(seed));
  const pool = [...SCENARIOS];
  // Seeded Fisher–Yates.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  // Long enough queue to outlast the 55s timer; cycle if needed.
  const queue: Scenario[] = [];
  while (queue.length < 60) {
    queue.push(...pool);
  }
  return queue.slice(0, 60);
}

/** Read a challenge seed from the current URL (?c=SEED). */
export function parseChallengeFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("c");
    return c && /^[A-Z0-9]{4,8}$/.test(c) ? c : null;
  } catch {
    return null;
  }
}

/** Build a shareable challenge URL. */
export function buildChallengeUrl(seed: string): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://55seconds.app";
  return `${origin}/play?c=${encodeURIComponent(seed)}`;
}
