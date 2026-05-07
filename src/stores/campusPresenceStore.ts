import { create } from "zustand";
import type { CampusRealtimePayload } from "@/lib/campusCinemaSeats";

type CampusPresenceState = {
  othersByUid: Record<string, CampusRealtimePayload>;
  setOthersFromRealtime: (m: Record<string, CampusRealtimePayload>) => void;
};

export const useCampusPresenceStore = create<CampusPresenceState>((set) => ({
  othersByUid: {},
  setOthersFromRealtime: (m) => set({ othersByUid: m })
}));
