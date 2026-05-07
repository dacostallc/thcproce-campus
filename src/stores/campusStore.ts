import { create } from "zustand";
import { clampToWalkZone } from "@/lib/campusWalkable";

/** Posição no mapa em % (0–100), igual aos hotspots em `courses.ts`. */
export type PctPos = { x: number; y: number };

type CampusState = {
  player: PctPos;
  setPlayer: (p: PctPos) => void;
};

/** Ponto de spawn: praça / chafariz (parte inferior central do mapa). */
const RAW_SPAWN: PctPos = { x: 42, y: 82 };

export const useCampusStore = create<CampusState>((set) => ({
  player: clampToWalkZone(RAW_SPAWN),
  setPlayer: (p) => set({ player: clampToWalkZone(p) })
}));