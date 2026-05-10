"use client";

import { create } from "zustand";

export type RewardToastPayload = {
  xp: number;
  credits: number;
  progressPercent: number;
};

type State = {
  toast: RewardToastPayload | null;
  showRewardToast: (p: RewardToastPayload) => void;
  dismissRewardToast: () => void;
};

export const useRewardToastStore = create<State>((set) => ({
  toast: null,
  showRewardToast: (toast) => set({ toast }),
  dismissRewardToast: () => set({ toast: null })
}));
