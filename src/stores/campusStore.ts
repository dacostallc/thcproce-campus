import { create } from "zustand";

import {
  clampAdminBroadcastText,
  CAMPUS_ADMIN_BROADCAST_TTL_MS
} from "@/lib/campusAdminBroadcast";
import { clearCinemaSitTimer } from "@/lib/campusCinemaSitTimer";
import { isAllowedCinemaReactionEmoji } from "@/lib/campusCinemaSeats";
import { requestCampusRealtimeFlush } from "@/lib/campusRealtimeFlush";
import { playCampusAdminBroadcastChime } from "@/lib/campusAdminBroadcastSound";
import { clampToWalkZone } from "@/lib/campusWalkable";
import { maybePlayCampusWalkSound } from "@/lib/campusWalkSound";

/** Posição no mapa em % (0–100), igual aos hotspots em `courses.ts`. */
export type PctPos = { x: number; y: number };

export type AvatarPosture = "stand" | "sit";

type CampusState = {
  player: PctPos;
  setPlayer: (p: PctPos) => void;
  /** Modo mapa simples: move sem malha passeável (só limites 1–99 %). */
  setPlayerLoose: (p: PctPos) => void;

  /** Drive-in cinematográfico aberto sobre o campus. */
  isCineOpen: boolean;
  setIsCineOpen: (open: boolean) => void;

  /** Live THCProce no ar — telão pulsante no mapa (inicia opcionalmente via env público). */
  isLiveActive: boolean;
  setLiveActive: (active: boolean) => void;

  /** Visual do avatar no auditório (caminhada vs sentado). */
  avatarPosture: AvatarPosture;
  setAvatarPosture: (p: AvatarPosture) => void;

  /** Assento atribuído nesta sessão de cinema (índice em `CINEMA_SEATS`), ou null. */
  cinemaSeatIndex: number | null;
  setCinemaSeatIndex: (i: number | null) => void;

  /** True quando não havia assento livre ao entrar (mensagem + stay zone). */
  cinemaAuditoriumFull: boolean;
  setCinemaAuditoriumFull: (v: boolean) => void;

  /** Última reação (1/2/3) — enviada no payload de realtime. */
  cinemaLastEmoji: string | null;
  cinemaLastEmojiAt: number;
  fireCinemaEmoji: (emoji: string) => void;

  /** Aviso em destaque (balão) — só admins devem chamar a partir do UI. */
  adminBroadcast: { text: string; sentAtMs: number } | null;
  fireAdminBroadcast: (body: string) => void;

  /** Fecha o drive-in e limpa estado de presença no cinema. */
  closeCineDriveIn: () => void;

  /**
   * Sincronizado por `CampusMap`: malha passeável / clamp só quando o mapa avançado está activo em `/preview`.
   * No `/campus` público permanece sempre `false`.
   */
  effectiveAdvancedMap: boolean;
  setEffectiveAdvancedMap: (v: boolean) => void;
};

/** Ponto de spawn: praça / chafariz (parte inferior central do mapa). */
const RAW_SPAWN: PctPos = { x: 42, y: 82 };

function looseClampPct(p: PctPos): PctPos {
  return {
    x: Math.min(99, Math.max(1, p.x)),
    y: Math.min(99, Math.max(1, p.y))
  };
}

const initialPlayer = looseClampPct(RAW_SPAWN);

const liveInitially =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_CAMPUS_LIVE_ACTIVE === "true";

export const useCampusStore = create<CampusState>((set) => ({
  player: initialPlayer,
  effectiveAdvancedMap: false,
  setEffectiveAdvancedMap: (v) => set({ effectiveAdvancedMap: v }),

  setPlayer: (p) =>
    set((state) => {
      const next = state.effectiveAdvancedMap ? clampToWalkZone(p) : looseClampPct(p);
      maybePlayCampusWalkSound(state.player, next);
      return { player: next };
    }),

  setPlayerLoose: (p) =>
    set((state) => {
      const next = looseClampPct(p);
      maybePlayCampusWalkSound(state.player, next);
      return { player: next };
    }),

  isCineOpen: false,
  setIsCineOpen: (open) => set({ isCineOpen: open }),

  isLiveActive: liveInitially,
  setLiveActive: (active) => set({ isLiveActive: active }),

  avatarPosture: "stand",
  setAvatarPosture: (p) => set({ avatarPosture: p }),

  cinemaSeatIndex: null,
  setCinemaSeatIndex: (i) => set({ cinemaSeatIndex: i }),

  cinemaAuditoriumFull: false,
  setCinemaAuditoriumFull: (v) => set({ cinemaAuditoriumFull: v }),

  cinemaLastEmoji: null,
  cinemaLastEmojiAt: 0,
  fireCinemaEmoji: (emoji) => {
    if (!isAllowedCinemaReactionEmoji(emoji)) return;
    set({ cinemaLastEmoji: emoji, cinemaLastEmojiAt: Date.now() });
    queueMicrotask(() => requestCampusRealtimeFlush());
  },

  adminBroadcast: null,
  fireAdminBroadcast: (body) => {
    const text = clampAdminBroadcastText(body);
    if (!text) return;
    const sentAtMs = Date.now();
    set({ adminBroadcast: { text, sentAtMs } });
    playCampusAdminBroadcastChime();
    queueMicrotask(() => requestCampusRealtimeFlush());
    window.setTimeout(() => {
      useCampusStore.setState((s) => {
        if (s.adminBroadcast?.sentAtMs !== sentAtMs) return s;
        return { adminBroadcast: null };
      });
      queueMicrotask(() => requestCampusRealtimeFlush());
    }, CAMPUS_ADMIN_BROADCAST_TTL_MS + 280);
  },

  closeCineDriveIn: () => {
    clearCinemaSitTimer();
    set({
      isCineOpen: false,
      cinemaSeatIndex: null,
      avatarPosture: "stand",
      cinemaAuditoriumFull: false,
      cinemaLastEmoji: null,
      cinemaLastEmojiAt: 0,
      adminBroadcast: null
    });
  }
}));
