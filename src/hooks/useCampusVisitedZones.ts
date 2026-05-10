import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  CAMPUS_VISITED_ZONES_LS_KEY,
  hasVisitedCampusZone,
  readVisitedCampusZoneIds,
  recordCampusZoneVisit,
  CAMPUS_ZONE_VISITED_EVENT,
  type CampusVisitedZonesPayload
} from "@/lib/campusVisitedZonesStorage";

const listeners = new Set<() => void>();

function bump() {
  for (const cb of listeners) cb();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === CAMPUS_VISITED_ZONES_LS_KEY) bump();
  });
  window.addEventListener(CAMPUS_ZONE_VISITED_EVENT, () => bump());
}

/**
 * Zonas visitadas no campus (localStorage).
 * Use `recordVisit` em fluxos de clique/hotspot; escute `CAMPUS_ZONE_VISITED_EVENT` para XP futuro.
 */
export function useCampusVisitedZones() {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    () => readVisitedCampusZoneIds(),
    () => ({ zoneIds: [] as string[], updatedAt: 0 } satisfies CampusVisitedZonesPayload)
  );

  const visitedSet = useMemo(() => new Set(snapshot.zoneIds), [snapshot.zoneIds]);

  const recordVisit = useCallback((zoneId: string) => recordCampusZoneVisit(zoneId), []);

  const hasVisited = useCallback((zoneId: string) => hasVisitedCampusZone(zoneId), []);

  return { visitedIds: visitedSet, payload: snapshot, recordVisit, hasVisited };
}
