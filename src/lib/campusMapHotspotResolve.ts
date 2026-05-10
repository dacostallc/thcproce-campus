import type { Area } from "@/data/courses";
import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";
import { cannabis101StableIdToLessonIndex } from "@/content/courses/cannabis-101/lessons";
import type { CampusMapInteractiveArea } from "@/lib/campusMapAreasInteractive.types";

/** Texto visível: `label` ou `title`. */
export function hotspotDisplayLabel(hit: CampusMapInteractiveArea): string {
  const l = hit.label?.trim();
  if (l) return l;
  return hit.title;
}

/** Título do painel / modais. */
export function hotspotPanelHeading(hit: CampusMapInteractiveArea): string {
  return hit.panelTitle?.trim() || hotspotDisplayLabel(hit);
}

export function hotspotShortDescription(hit: CampusMapInteractiveArea, course: Area | null): string {
  const raw = hit.shortDescription?.trim() || hit.studentSummary?.trim();
  if (raw) return raw;
  return course?.short?.trim() || "Explora este espaço no campus quando estiveres pronto.";
}

/** `courseSlug` do catálogo ou `target.courseId` quando aplicável. */
export function hotspotEffectiveCourseId(hit: CampusMapInteractiveArea): string | null {
  const slug = hit.courseSlug?.trim();
  if (slug) return slug;
  const t = hit.target;
  if (t.kind === "course") return t.courseId;
  return null;
}

/**
 * Índice da aula no modelo `Area` + `LessonPanel` (0-based).
 * Hoje: apenas Cannabis 101 resolve por `lessonSlug` estável.
 */
export function hotspotResolvedLessonIndex(
  hit: CampusMapInteractiveArea,
  course: Area | null
): number | null {
  const slug = hit.lessonSlug?.trim();
  if (!slug || !course) return null;
  if (course.id === CANNABIS101_AREA_ID) {
    return cannabis101StableIdToLessonIndex(slug);
  }
  return null;
}

export function hotspotPrimaryCtaLabel(hit: CampusMapInteractiveArea): string {
  return hit.ctaLabel?.trim() || "Entrar";
}

export function hotspotSecondaryCtaLabel(hit: CampusMapInteractiveArea): string {
  return hit.secondaryCtaLabel?.trim() || "Ver aulas";
}
