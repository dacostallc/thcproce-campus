import { CAMPUS_MAP_INTERACTIVE_AREAS } from "@/lib/campusMapAreasCatalog";
import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";
import {
  CANNABIS101_LESSON_NODES,
  cannabis101StableIdToLessonIndex
} from "@/content/courses/cannabis-101/lessons";

export type CampusHotspotDebugAction =
  | { kind: "panel_hit"; hitId: string }
  | { kind: "lesson"; courseId: string; lessonIndex: number };

const CANNABIS101_MAP_HIT_ID = "curso-cultivo-101" as const;

function resolveCannabis101LessonIndexFromSlug(slug: string): number | null {
  const trimmed = slug.trim();
  if (!trimmed) return null;
  const exact = cannabis101StableIdToLessonIndex(trimmed);
  if (exact !== null) return exact;
  const norm = trimmed.toLowerCase();
  const idx = CANNABIS101_LESSON_NODES.findIndex((n) => {
    const sid = n.stableId.toLowerCase();
    return sid === norm || sid.startsWith(`${norm}-`);
  });
  return idx >= 0 ? idx : null;
}

/**
 * Interpreta `?hotspot=` apenas em não-produção (bundle ignora em produção).
 */
export function resolveCampusHotspotDebugParam(raw: string): CampusHotspotDebugAction | null {
  if (process.env.NODE_ENV === "production") return null;

  const trimmedRaw = raw.trim();
  if (!trimmedRaw) return null;

  const aulaMatch = trimmedRaw.match(/^aula-(.+)$/i);
  if (aulaMatch) {
    const slug = aulaMatch[1]?.trim() ?? "";
    const idx = resolveCannabis101LessonIndexFromSlug(slug);
    if (idx !== null) {
      return { kind: "lesson", courseId: CANNABIS101_AREA_ID, lessonIndex: idx };
    }
    return null;
  }

  const v = trimmedRaw.toLowerCase();
  if (v === "cannabis-101" || v === CANNABIS101_AREA_ID.toLowerCase()) {
    return { kind: "panel_hit", hitId: CANNABIS101_MAP_HIT_ID };
  }

  const hit = CAMPUS_MAP_INTERACTIVE_AREAS.find((a) => a.id.toLowerCase() === v);
  if (hit) return { kind: "panel_hit", hitId: hit.id };

  return null;
}
