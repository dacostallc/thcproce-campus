"use client";

import { create } from "zustand";

type CampusGuidedTourState = {
  /** Glow + overlay + cartão bloqueante do tour. */
  tourActive: boolean;
  setTourActive: (v: boolean) => void;
};

export const useCampusGuidedTourStore = create<CampusGuidedTourState>((set) => ({
  tourActive: false,
  setTourActive: (tourActive) => set({ tourActive })
}));
