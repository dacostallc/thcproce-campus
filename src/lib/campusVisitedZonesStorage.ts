import { mergeCampusMapMemory } from "@/lib/campusMapMemoryStorage";

export const CAMPUS_VISITED_ZONES_LS_KEY = "thcproce.campus.visitedZones.v1";

/** Disparado no cliente quando uma zona é registada pela primeira vez (XP/conquistas depois). */
export const CAMPUS_ZONE_VISITED_EVENT = "thcproce:campus-zone-first-visit";

export type CampusVisitedZonesPayload = {
  zoneIds: string[];
  updatedAt: number;
};

function sanitizeIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const out: string[] = [];
  for (const raw of ids) {
    if (typeof raw !== "string") continue;
    const id = raw.trim().slice(0, 160);
    if (id.length) out.push(id);
  }
  return [...new Set(out)];
}

export function readVisitedCampusZoneIds(): CampusVisitedZonesPayload {
  if (typeof window === "undefined") return { zoneIds: [], updatedAt: 0 };
  try {
    const raw = window.localStorage.getItem(CAMPUS_VISITED_ZONES_LS_KEY);
    if (!raw?.trim()) return { zoneIds: [], updatedAt: 0 };
    const data = JSON.parse(raw) as Partial<CampusVisitedZonesPayload>;
    return {
      zoneIds: sanitizeIds(data.zoneIds),
      updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : 0
    };
  } catch {
    return { zoneIds: [], updatedAt: 0 };
  }
}

/**
 * Regista visita a uma zona (id estável: hotspot SVG ou curso).
 * @returns true se for a primeira vez neste dispositivo.
 */
export function recordCampusZoneVisit(zoneId: string): boolean {
  if (typeof window === "undefined") return false;
  const key = zoneId.trim().slice(0, 160);
  if (!key.length) return false;

  const prev = readVisitedCampusZoneIds();
  if (prev.zoneIds.includes(key)) return false;

  const next: CampusVisitedZonesPayload = {
    zoneIds: [...prev.zoneIds, key],
    updatedAt: Date.now()
  };
  try {
    window.localStorage.setItem(CAMPUS_VISITED_ZONES_LS_KEY, JSON.stringify(next));
  } catch {
    return false;
  }

  try {
    window.dispatchEvent(new CustomEvent(CAMPUS_ZONE_VISITED_EVENT, { detail: { zoneId: key } }));
  } catch {
    /* noop */
  }

  try {
    const payload = readVisitedCampusZoneIds();
    mergeCampusMapMemory({ visitedZoneIds: payload.zoneIds });
  } catch {
    /* noop */
  }
  return true;
}

export function hasVisitedCampusZone(zoneId: string): boolean {
  const key = zoneId.trim();
  if (!key.length) return false;
  return readVisitedCampusZoneIds().zoneIds.includes(key);
}
