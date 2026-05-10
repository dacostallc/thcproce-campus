import type { CampusMapMemory } from "@/types/campusMapMemory";
import type { PctPos } from "@/stores/campusStore";

export const CAMPUS_MAP_MEMORY_LS_KEY = "thcproce.campus.mapMemory.v1";

function sanitizeIdArray(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const id = item.trim().slice(0, 160);
    if (id.length) out.push(id);
  }
  return out.length ? [...new Set(out)] : undefined;
}

function mergeStringLists(
  prev: string[] | undefined,
  patch: string[] | undefined,
  patchProvided: boolean
): string[] | undefined {
  if (!patchProvided) return prev;
  if (!patch?.length) return prev;
  return [...new Set([...(prev ?? []), ...patch])];
}

function coerceMemory(raw: unknown): CampusMapMemory | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.version !== 1) return null;
  const lap = o.lastAvatarPct;
  const lastAvatarPct =
    lap && typeof lap === "object"
      ? (() => {
          const p = lap as Record<string, unknown>;
          const x = Number(p.x);
          const y = Number(p.y);
          return Number.isFinite(x) && Number.isFinite(y) ? ({ x, y } satisfies PctPos) : null;
        })()
      : null;

  const lsp = o.lastSpawnPosition;
  const lastSpawnPosition =
    lsp && typeof lsp === "object"
      ? (() => {
          const p = lsp as Record<string, unknown>;
          const xPercent = Number(p.xPercent);
          const yPercent = Number(p.yPercent);
          return Number.isFinite(xPercent) && Number.isFinite(yPercent)
            ? { xPercent, yPercent }
            : null;
        })()
      : lsp === null
        ? null
        : undefined;

  const cinemaDriveInOpen =
    typeof o.cinemaDriveInOpen === "boolean"
      ? o.cinemaDriveInOpen
      : o.cinemaDriveInOpen === null
        ? null
        : undefined;

  return {
    version: 1,
    lastPanelKind:
      o.lastPanelKind === "course" ||
      o.lastPanelKind === "hotspot" ||
      o.lastPanelKind === "lesson" ||
      o.lastPanelKind === null ||
      o.lastPanelKind === undefined
        ? (o.lastPanelKind as CampusMapMemory["lastPanelKind"])
        : undefined,
    lastLegacyHitId:
      typeof o.lastLegacyHitId === "string" ? o.lastLegacyHitId : o.lastLegacyHitId === null ? null : undefined,
    lastBuildingCourseId:
      typeof o.lastBuildingCourseId === "string"
        ? o.lastBuildingCourseId
        : o.lastBuildingCourseId === null
          ? null
          : undefined,
    lastZoneLabel:
      typeof o.lastZoneLabel === "string" ? o.lastZoneLabel : o.lastZoneLabel === null ? null : undefined,
    lastAvatarPct,
    lastActivityAt: typeof o.lastActivityAt === "number" ? o.lastActivityAt : undefined,
    visitedZoneIds: sanitizeIdArray(o.visitedZoneIds),
    discoveredHotspotIds: sanitizeIdArray(o.discoveredHotspotIds),
    completedLessonIds: sanitizeIdArray(o.completedLessonIds),
    lastSpawnPosition,
    cinemaDriveInOpen
  };
}

/** Lê memória persistida (localStorage). Futuro: mesclar resposta do backend. */
export function readCampusMapMemory(): CampusMapMemory | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CAMPUS_MAP_MEMORY_LS_KEY);
    if (!raw?.trim()) return null;
    return coerceMemory(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Escreve campos parciais sobre o blob existente (merge). */
export function mergeCampusMapMemory(patch: Partial<Omit<CampusMapMemory, "version">>): CampusMapMemory {
  const prev = readCampusMapMemory();
  const visitedTouched = Object.prototype.hasOwnProperty.call(patch, "visitedZoneIds");
  const discoveredTouched = Object.prototype.hasOwnProperty.call(patch, "discoveredHotspotIds");
  const completedTouched = Object.prototype.hasOwnProperty.call(patch, "completedLessonIds");

  const restPatch = { ...patch };
  delete restPatch.visitedZoneIds;
  delete restPatch.discoveredHotspotIds;
  delete restPatch.completedLessonIds;

  const next: CampusMapMemory = {
    version: 1,
    ...(prev ?? {}),
    ...restPatch,
    visitedZoneIds: mergeStringLists(prev?.visitedZoneIds, patch.visitedZoneIds, visitedTouched),
    discoveredHotspotIds: mergeStringLists(
      prev?.discoveredHotspotIds,
      patch.discoveredHotspotIds,
      discoveredTouched
    ),
    completedLessonIds: mergeStringLists(
      prev?.completedLessonIds,
      patch.completedLessonIds,
      completedTouched
    )
  };

  try {
    window.localStorage.setItem(CAMPUS_MAP_MEMORY_LS_KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
  return next;
}

/** Regista conclusão de lição/microaula (merge incremental). */
export function recordCampusLessonCompletedInMemory(lessonStableId: string): void {
  const id = lessonStableId.trim().slice(0, 160);
  if (!id.length) return;
  mergeCampusMapMemory({ completedLessonIds: [id] });
}
