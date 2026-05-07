import { create } from "zustand";
import { clampToWalkZone } from "@/lib/campusWalkable";

/** Posição no mapa em % (0–100), igual aos hotspots em `courses.ts`. */
export type PctPos = { x: number; y: number };

type CampusState = {
  player: PctPos;
  setPlayer: (p: PctPos) => void;
  /** Drive-in cinematográfico aberto sobre o campus. */
  isCineOpen: boolean;
  setIsCineOpen: (open: boolean) => void;
  /** Live THCProce no ar — telão pulsante no mapa (inicia opcionalmente via env público). */
  isLiveActive: boolean;
  setLiveActive: (active: boolean) => void;
};

/** Ponto de spawn: praça / chafariz (parte inferior central do mapa). */
const RAW_SPAWN: PctPos = { x: 42, y: 82 };

const liveInitially =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_CAMPUS_LIVE_ACTIVE === "true";

export const useCampusStore = create<CampusState>((set) => ({
  player: clampToWalkZone(RAW_SPAWN),
  setPlayer: (p) => set({ player: clampToWalkZone(p) }),
  isCineOpen: false,
  setIsCineOpen: (open) => set({ isCineOpen: open }),
  isLiveActive: liveInitially,
  setLiveActive: (active) => set({ isLiveActive: active })
}));
