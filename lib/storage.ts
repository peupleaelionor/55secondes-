/**
 * Crash-proof storage. Wraps localStorage with try/catch and an in-memory
 * fallback so the app never throws when storage is unavailable (private mode,
 * SSR, quota exceeded, disabled cookies, etc.).
 */

const memory = new Map<string, string>();

function ls(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    const s = window.localStorage;
    // Probe — some browsers expose localStorage but throw on access.
    const k = "__55s_probe__";
    s.setItem(k, "1");
    s.removeItem(k);
    return s;
  } catch {
    return null;
  }
}

export function safeGet<T>(key: string, fallback: T): T {
  try {
    const store = ls();
    const raw = store ? store.getItem(key) : memory.get(key) ?? null;
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeSet<T>(key: string, value: T): void {
  let raw: string;
  try {
    raw = JSON.stringify(value);
  } catch {
    return;
  }
  try {
    const store = ls();
    if (store) store.setItem(key, raw);
    else memory.set(key, raw);
  } catch {
    memory.set(key, raw);
  }
}

export function safeRemove(key: string): void {
  try {
    const store = ls();
    if (store) store.removeItem(key);
    memory.delete(key);
  } catch {
    memory.delete(key);
  }
}

export const STORAGE_KEYS = {
  profile: "55s.profile.v1",
  settings: "55s.settings.v1",
  onboarding: "55s.onboarding.v1",
  daily: "55s.daily.v1",
} as const;
