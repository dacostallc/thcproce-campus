import type { LessonGateStatus } from "@/content/courses/cannabis-101/gating";
import { getCourseGate } from "@/content/courses";

function parsePublishedMap(): Record<string, number> | null {
  const raw =
    typeof process.env.NEXT_PUBLIC_CAMPUS_LESSON_PUBLISHED_MAP === "string"
      ? process.env.NEXT_PUBLIC_CAMPUS_LESSON_PUBLISHED_MAP.trim()
      : "";
  if (!raw) return null;
  try {
    const j = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(j)) {
      const n = typeof v === "number" ? v : Number(v);
      if (Number.isFinite(n) && n >= 0) out[k.trim()] = Math.floor(n);
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

/** Aulas liberadas no pré-lançamento (fora do mapa JSON). Default: 4 primeiras. */
function defaultPublishedForCourse(areaId: string, total: number): number {
  const explicit =
    typeof process.env.NEXT_PUBLIC_CAMPUS_DEFAULT_PUBLISHED_LESSONS === "string"
      ? Number.parseInt(process.env.NEXT_PUBLIC_CAMPUS_DEFAULT_PUBLISHED_LESSONS.trim(), 10)
      : NaN;
  const n = Number.isFinite(explicit) && explicit >= 0 ? explicit : 4;
  return Math.min(Math.max(0, n), total);
}

/**
 * Quantas aulas do outline têm conteúdo “disponível” (restante = em breve).
 */
export function getPublishedLessonCountForCourse(areaId: string, total: number): number {
  const courseGate = getCourseGate(areaId);
  if (courseGate) return courseGate.getPublishedLessonCount(total);
  const map = parsePublishedMap();
  if (map && map[areaId] != null) return Math.min(map[areaId]!, total);
  return defaultPublishedForCourse(areaId, total);
}

function isSequentialLockGlobal(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_SEQUENTIAL_LOCK === "true";
}

/**
 * Status por aula: visto · disponível · bloqueada (sequência) · em breve (fora do rollout).
 */
export function getCampusLessonGate(
  areaId: string,
  index: number,
  total: number,
  doneSet: Set<number>,
  visitedSet: Set<number> = new Set()
): LessonGateStatus {
  const courseGate = getCourseGate(areaId);
  if (courseGate) {
    return courseGate.getLessonGate(index, total, doneSet, visitedSet);
  }
  const published = getPublishedLessonCountForCourse(areaId, total);
  if (index >= published) return "soon";

  const sequential = isSequentialLockGlobal();

  if (sequential && index > 0 && !doneSet.has(index - 1)) return "locked";
  if (doneSet.has(index)) return "completed";
  if (visitedSet.has(index)) return "visited";
  return "available";
}
