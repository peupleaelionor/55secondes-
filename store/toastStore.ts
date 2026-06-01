"use client";

import { create } from "zustand";

export type ToastTone = "neutral" | "gain" | "risk" | "streak" | "win";

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastStore {
  toasts: Toast[];
  push: (message: string, tone?: ToastTone) => void;
  dismiss: (id: number) => void;
}

let seq = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, tone = "neutral") => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }].slice(-3) }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 1900);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
