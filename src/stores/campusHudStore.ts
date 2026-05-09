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
  campusLiveComposerOpen: boolean;
  setCampusLiveComposerOpen: (v: boolean) => void;
  /** Limites / preenchimentos suaves das zonas do mapa (persiste em localStorage). */
  campusZoneBordersVisible: boolean;
  setCampusZoneBordersVisible: (v: boolean) => void;
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
    set({ adminBroadcastComposerOpen }),
  campusLiveComposerOpen: false,
  setCampusLiveComposerOpen: (campusLiveComposerOpen) =>
    set({ campusLiveComposerOpen }),
  campusZoneBordersVisible: true,
  setCampusZoneBordersVisible: (campusZoneBordersVisible) =>
    set({ campusZoneBordersVisible })
}));
