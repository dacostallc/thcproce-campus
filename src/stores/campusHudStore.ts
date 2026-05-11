"use client";

import { create } from "zustand";

/** Estado compartilhado entre HUD, mapa, chat e presença */
type HudState = {
  /**
   * Visitantes únicos em `/campus` via canal Realtime `campus-presence` (`useCampusPresence`).
   * Separado da presença de avatares (`campus-map`).
   * `null` = não ligado / erro — HUD sem número (não usar 0 placeholder).
   */
  campusVisitorCount: number | null;
  setCampusVisitorCount: (n: number | null) => void;
  visitorPresenceStatus: "connected" | "connecting" | "offline";
  setVisitorPresenceStatus: (s: "connected" | "connecting" | "offline") => void;
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
  /** Percentual de zonas desbloqueadas no mapa (sincronizado pelo `CampusMap`). */
  campusMapUnlockPct: number | null;
  setCampusMapUnlockPct: (v: number | null) => void;
  /** Incrementado pelo HUD para pedir abertura do tour (consumido por `CampusMapTour`). */
  campusTourOpenNonce: number;
  requestCampusTourOpen: () => void;
  /** Incrementado para abrir o modal «Meu perfil» desde filhos externos (ex. cartão Comece aqui). */
  campusProfileOpenNonce: number;
  requestCampusProfileOpen: () => void;
  campusStoreOpen: boolean;
  setCampusStoreOpen: (v: boolean) => void;
  /** Painéis do mapa interactivo simples — Programação do dia (slide-over). */
  campusMapScheduleDayOpen: boolean;
  setCampusMapScheduleDayOpen: (v: boolean) => void;
  /** Doc direito cinema / ao vivo. */
  campusMapCinemaLiveOpen: boolean;
  setCampusMapCinemaLiveOpen: (v: boolean) => void;
  campusMapCinemaLiveExpanded: boolean;
  setCampusMapCinemaLiveExpanded: (v: boolean) => void;
  /** Mural mock (só cliente) ao toque na área do mapa. */
  campusMapMuralFeedOpen: boolean;
  setCampusMapMuralFeedOpen: (v: boolean) => void;
  /** Painel lateral com ficha do hotspot (curso/aula) — mapa interactivo simples. */
  campusMapHotspotPanelHitId: string | null;
  setCampusMapHotspotPanelHitId: (id: string | null) => void;
  campusMissionsOpen: boolean;
  setCampusMissionsOpen: (v: boolean) => void;
  /** Pedido vindo do HUD móvel para retomar a última aula (consumido por `CampusMap`). */
  campusResumeLessonNonce: number;
  requestCampusResumeLesson: () => void;
  /** Painel de aula aberto no mapa — sincronizado por `CampusMap` para presença realtime. */
  campusLessonPanelOpen: boolean;
  setCampusLessonPanelOpen: (v: boolean) => void;
  /** Pedido para voltar a reproduzir a intro cinematográfica (`CampusCinematicIntro`). */
  campusCinematicIntroReplayNonce: number;
  requestCampusCinematicIntroReplay: () => void;
};

export const useCampusHudStore = create<HudState>((set) => ({
  campusVisitorCount: null,
  setCampusVisitorCount: (campusVisitorCount) => set({ campusVisitorCount }),
  visitorPresenceStatus: "offline",
  setVisitorPresenceStatus: (visitorPresenceStatus) => set({ visitorPresenceStatus }),
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
  campusMapUnlockPct: null,
  setCampusMapUnlockPct: (campusMapUnlockPct) => set({ campusMapUnlockPct }),
  campusTourOpenNonce: 0,
  requestCampusTourOpen: () =>
    set((s) => ({ campusTourOpenNonce: s.campusTourOpenNonce + 1 })),
  campusProfileOpenNonce: 0,
  requestCampusProfileOpen: () =>
    set((s) => ({
      campusProfileOpenNonce: s.campusProfileOpenNonce + 1
    })),
  campusStoreOpen: false,
  setCampusStoreOpen: (campusStoreOpen) => set({ campusStoreOpen }),
  campusMapScheduleDayOpen: false,
  setCampusMapScheduleDayOpen: (campusMapScheduleDayOpen) =>
    set({ campusMapScheduleDayOpen }),
  campusMapCinemaLiveOpen: false,
  setCampusMapCinemaLiveOpen: (campusMapCinemaLiveOpen) =>
    set({ campusMapCinemaLiveOpen }),
  campusMapCinemaLiveExpanded: true,
  setCampusMapCinemaLiveExpanded: (campusMapCinemaLiveExpanded) =>
    set({ campusMapCinemaLiveExpanded }),
  campusMapMuralFeedOpen: false,
  setCampusMapMuralFeedOpen: (campusMapMuralFeedOpen) =>
    set({ campusMapMuralFeedOpen }),
  campusMapHotspotPanelHitId: null,
  setCampusMapHotspotPanelHitId: (campusMapHotspotPanelHitId) =>
    set({ campusMapHotspotPanelHitId }),
  campusMissionsOpen: false,
  setCampusMissionsOpen: (campusMissionsOpen) => set({ campusMissionsOpen }),
  campusResumeLessonNonce: 0,
  requestCampusResumeLesson: () =>
    set((s) => ({ campusResumeLessonNonce: s.campusResumeLessonNonce + 1 })),
  campusLessonPanelOpen: false,
  setCampusLessonPanelOpen: (campusLessonPanelOpen) => set({ campusLessonPanelOpen }),
  campusCinematicIntroReplayNonce: 0,
  requestCampusCinematicIntroReplay: () =>
    set((s) => ({
      campusCinematicIntroReplayNonce: s.campusCinematicIntroReplayNonce + 1
    }))
}));
