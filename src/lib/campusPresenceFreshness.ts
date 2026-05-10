import { CAMPUS_PRESENCE_TTL_MS } from "@/config/campusPresence";
import type { CampusRealtimePayload } from "@/lib/campusCinemaSeats";

/** Peer «vivo» para contagens HUD — alinhado ao TTL do mapa. */
export function isCampusRealtimePayloadFresh(p: CampusRealtimePayload, nowMs: number): boolean {
  const at = typeof p.at === "number" ? p.at : Number(p.at);
  return Number.isFinite(at) && nowMs - at <= CAMPUS_PRESENCE_TTL_MS;
}
