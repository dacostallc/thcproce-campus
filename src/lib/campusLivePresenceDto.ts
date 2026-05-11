import { CAMPUS_MAP_INTERACTIVE_AREAS } from "@/lib/campusMapAreasCatalog";

/** Registo devolvido pela API HTTP de presença (sem importar módulos `server/` no cliente). */
export type CampusLivePresenceOnlineDto = {
  visitorId: string;
  displayName: string;
  avatarVariant: string;
  currentHotspot: string | null;
  currentArea: string | null;
  xPct: number;
  yPct: number;
  lastSeenAt: number;
  zoneTitlePt: string;
};

function zoneTitleFromHotspot(id: string | null): string {
  if (!id) return "Campus THCProce";
  const hit = CAMPUS_MAP_INTERACTIVE_AREAS.find((a) => a.id === id);
  return (hit?.panelTitle ?? hit?.title ?? id).trim().slice(0, 80);
}

export function enrichCampusLivePresenceDto(rec: {
  visitorId: string;
  displayName: string;
  avatarVariant: string;
  currentHotspot: string | null;
  currentArea: string | null;
  xPct: number;
  yPct: number;
  lastSeenAt: number;
}): CampusLivePresenceOnlineDto {
  return {
    ...rec,
    zoneTitlePt: zoneTitleFromHotspot(rec.currentHotspot)
  };
}
