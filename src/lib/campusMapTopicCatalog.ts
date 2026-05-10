import { areas, type Area } from "@/data/courses";
import catalogJson from "@/lib/campusMapTopic.catalog.json";

/** Polígonos “sala grande” que abrem o painel do curso directamente no mapa interactivo simples. */
/** Áreas correspondentes aos cursos grandes no image‑map atual (abrem painel do curso). */
export const CAMPUS_MAP_PRIMARY_COURSE_AREA_IDS = new Set([
  "curso-cultivo-101",
  "curso-hashmaker",
  "curso-extracao-de-oleo",
  "curso-culinaria-cannabica",
  "curso-cultivo-outdoor",
  "curso-cultivo-greenhouse",
  "curso-cultivo-indoor"
]);

export function isCampusMapPrimaryCourseArea(areaId: string): boolean {
  return CAMPUS_MAP_PRIMARY_COURSE_AREA_IDS.has(areaId);
}

export type CampusMapTopicStatus = "active" | "coming_soon";

export type CampusMapTopicExplicitNavigation =
  | { kind: "route"; href: string }
  | { kind: "hud_store" }
  | { kind: "hud_mural" };

export type CampusMapTopicCatalogRaw = {
  areaId: string;
  topicId: string;
  title: string;
  parentCourseId: string;
  shortDescription: string;
  whatStudentLearns: string[];
  callToActionLabel: string;
  targetLessonId?: number;
  estimatedMinutes: number;
  status: CampusMapTopicStatus;
  explicitNavigation?: CampusMapTopicExplicitNavigation;
};

export type CampusMapTopicCatalogEntry = CampusMapTopicCatalogRaw & {

  /** Curso relacionado sempre resolvido a partir dos dados do campus quando existir. */

  relatedCourse: Area | null;

};

const entriesRaw = catalogJson as CampusMapTopicCatalogRaw[];

const AREA_BY_ID = new Map(areas.map((a) => [a.id, a]));

/** Catálogo com `relatedCourse` carregado. */
export const CAMPUS_MAP_TOPIC_CATALOG: CampusMapTopicCatalogEntry[] =
  entriesRaw.map((row) => ({
    ...row,
    relatedCourse: AREA_BY_ID.get(row.parentCourseId) ?? null
  }));

const TOPIC_BY_AREA_ID = new Map(
  CAMPUS_MAP_TOPIC_CATALOG.map((e) => [e.areaId, e])
);

export function getCampusMapTopicByAreaId(
  areaId: string
): CampusMapTopicCatalogEntry | undefined {
  return TOPIC_BY_AREA_ID.get(areaId);
}

/** Curso pai da entrada de catálogo, ou null se o id não existe em `areas`. */
export function getRelatedCourse(topic: CampusMapTopicCatalogEntry): Area | null {
  return topic.relatedCourse;
}

/**
 * Decide o destino ao premir CTA quando não há `explicitNavigation`:
 * primeiro aula (índice) se configurada, senão o painel do curso pai.
 */
export function resolveTopicPrimaryNavigation(topic: CampusMapTopicCatalogEntry): {
  destination: "lesson" | "course";
  lessonIndex?: number;
} {
  if (typeof topic.targetLessonId === "number" && Number.isFinite(topic.targetLessonId)) {
    return { destination: "lesson", lessonIndex: topic.targetLessonId };
  }
  return { destination: "course" };
}
