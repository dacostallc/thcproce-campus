"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SkyMode = "day" | "night";

type SkyState = {
  sky: SkyMode;
  setSky: (sky: SkyMode) => void;
  toggleSky: () => void;
};

export const useCampusSkyStore = create<SkyState>()(
  persist(
    (set, get) => ({
      sky: "night",
      setSky: (sky) => set({ sky }),
      toggleSky: () =>
        set({ sky: get().sky === "night" ? "day" : "night" })
    }),
    {
      name: "thcproce-campus-sky",
      partialize: (state) => ({ sky: state.sky })
    }
  )
);
