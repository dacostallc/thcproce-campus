"use client";

import { create } from "zustand";

/** Estado compartilhado entre HUD, mapa, chat e presença */
type HudState = {
  onlineApprox: number;
  setOnlineApprox: (n: number) => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  chatChannel: string;
  setChatChannel: (c: string) => void;
  muralOpen: boolean;
  setMuralOpen: (v: boolean) => void;
  eventsOpen: boolean;
  setEventsOpen: (v: boolean) => void;
  adminBroadcastComposerOpen: boolean;
  setAdminBroadcastComposerOpen: (v: boolean) => void;
};

export const useCampusHudStore = create<HudState>((set) => ({
  onlineApprox: 128,
  setOnlineApprox: (onlineApprox) => set({ onlineApprox }),
  chatOpen: false,
  setChatOpen: (chatOpen) => set({ chatOpen }),
  chatChannel: "global",
  setChatChannel: (chatChannel) => set({ chatChannel }),
  muralOpen: false,
  setMuralOpen: (muralOpen) => set({ muralOpen }),
  eventsOpen: false,
  setEventsOpen: (eventsOpen) => set({ eventsOpen }),
  adminBroadcastComposerOpen: false,
  setAdminBroadcastComposerOpen: (adminBroadcastComposerOpen) =>
    set({ adminBroadcastComposerOpen })
}));
