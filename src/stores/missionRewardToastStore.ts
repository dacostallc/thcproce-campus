"use client";

import { create } from "zustand";

export type MissionRewardToastPayload = {
  missionTitle: string;
  xp: number;
  credits: number;
  itemLabel?: string;
};

type State = {
  toast: MissionRewardToastPayload | null;
  showMissionRewardToast: (p: MissionRewardToastPayload) => void;
  dismissMissionRewardToast: () => void;
};

export const useMissionRewardToastStore = create<State>((set) => ({
  toast: null,
  showMissionRewardToast: (toast) => set({ toast }),
  dismissMissionRewardToast: () => set({ toast: null })
}));
