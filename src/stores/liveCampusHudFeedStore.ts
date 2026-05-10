"use client";

import { create } from "zustand";

const MAX_ITEMS = 5;
const DEFAULT_TTL_MS = 4_800;

export type LiveHudFeedItem = {
  id: string;
  message: string;
  createdAt: number;
};

type State = {
  items: LiveHudFeedItem[];
  push: (message: string, ttlMs?: number) => string;
  remove: (id: string) => void;
};

/** Short-lived discreet toast queue — consumed by `LiveHudNotifications`. */
export const useLiveCampusHudFeedStore = create<State>((set, get) => ({
  items: [],
  push: (message: string, ttlMs = DEFAULT_TTL_MS) => {
    if (typeof window === "undefined") return "";
    const trimmed = message.trim().slice(0, 220);
    if (!trimmed) return "";
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `hud-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    set((s) => ({
      items: [...s.items, { id, message: trimmed, createdAt: Date.now() }].slice(-MAX_ITEMS)
    }));
    window.setTimeout(() => {
      get().remove(id);
    }, Math.max(1_200, ttlMs));
    return id;
  },
  remove: (id: string) =>
    set((s) => ({
      items: s.items.filter((x) => x.id !== id)
    }))
}));

export function pushLiveCampusHudNotification(message: string, ttlMs?: number): string {
  if (typeof window === "undefined") return "";
  return useLiveCampusHudFeedStore.getState().push(message, ttlMs);
}
