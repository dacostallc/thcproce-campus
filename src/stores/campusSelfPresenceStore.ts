import { create } from "zustand";

import type { PctPos } from "@/stores/campusStore";
import type { CampusSelfPresenceStatus } from "@/lib/campusWalkEstimate";

export type CampusSelfPresenceSnapshot = {
  /** Tab visível e em contexto de utilizador activo. */
  online: boolean;
  lastAvatarPct: PctPos;
  status: CampusSelfPresenceStatus;
  /** Epoch ms — última actividade relevante (movimento, painel, etc.). */
  lastActivityAt: number;
};

type CampusSelfPresenceState = CampusSelfPresenceSnapshot & {
  bumpActivity: () => void;
  setOnline: (online: boolean) => void;
  setAvatarPct: (p: PctPos) => void;
  setStatus: (s: CampusSelfPresenceStatus) => void;
  /** Actualização em lote (evita renders intermédios). */
  patch: (partial: Partial<Pick<CampusSelfPresenceSnapshot, "online" | "lastAvatarPct" | "status">>) => void;
};

const defaultPct: PctPos = { x: 42, y: 82 };

export const useCampusSelfPresenceStore = create<CampusSelfPresenceState>((set) => ({
  online: typeof document !== "undefined" ? document.visibilityState === "visible" : true,
  lastAvatarPct: defaultPct,
  status: "idle",
  lastActivityAt: typeof Date !== "undefined" ? Date.now() : 0,

  bumpActivity: () => set({ lastActivityAt: Date.now() }),

  setOnline: (online) => set({ online, lastActivityAt: Date.now() }),

  setAvatarPct: (lastAvatarPct) => set({ lastAvatarPct, lastActivityAt: Date.now() }),

  setStatus: (status) => set({ status, lastActivityAt: Date.now() }),

  patch: (partial) =>
    set((s) => ({
      ...s,
      ...partial,
      lastActivityAt: Date.now()
    }))
}));
