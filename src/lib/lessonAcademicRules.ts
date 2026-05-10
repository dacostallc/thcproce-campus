import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";
import { getCannabis101LessonEstimatedMinutes } from "@/content/courses/cannabis-101/estimatedMinutes";

/** Fallback quando não há `estimatedMinutes` — tempo mínimo local padrão (spec). */
const FALLBACK_DWELL_MS = 3 * 60 * 1000;

/**
 * Tempo mínimo de permanência antes de permitir marcar aula como concluída.
 * TODO backend: `LessonProgress.requiredDwellMs` derivado de política + CMS.
 */
export function computeLessonMinimumDwellMs(estimatedMinutes: number | null | undefined): number {
  if (
    estimatedMinutes != null &&
    Number.isFinite(estimatedMinutes) &&
    estimatedMinutes > 0
  ) {
    return Math.round(estimatedMinutes * 60 * 1000 * 0.7);
  }
  return FALLBACK_DWELL_MS;
}

/** Resolve estimativa por área — expandir quando outros cursos tiverem metadados. */
export function getLessonEstimatedMinutesForArea(areaId: string, lessonIndex: number): number | null {
  if (areaId === CANNABIS101_AREA_ID) return getCannabis101LessonEstimatedMinutes(lessonIndex);
  return null;
}
