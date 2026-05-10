import { create } from "zustand";

/** Zona pedagógica actual para heartbeat social (definida no mapa ao explorar). */
type State = {
  zoneLabel: string | null;
  setCampusSocialZoneLabel: (zoneLabel: string | null) => void;
};

export const useCampusSocialZoneStore = create<State>((set) => ({
  zoneLabel: null,
  setCampusSocialZoneLabel: (zoneLabel) => set({ zoneLabel })
}));
