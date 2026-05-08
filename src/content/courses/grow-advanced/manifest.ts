import type { CourseManifest } from "@/content/courses/types";

/** Placeholder até existir hotspot no mapa — mesmo `Area.id` a usar quando ativarem a sala. */
export const GROW_ADVANCED_AREA_ID = "grow-advanced" as const;

export const GROW_ADVANCED_MANIFEST: CourseManifest = {
  areaId: GROW_ADVANCED_AREA_ID,
  displayName: "Cultivo avançado",
  hud: { nextLessonFallbackLabel: "Cultivo avançado · Aula 1" },
  previewLessonTitles: [
    "Planeamento fenológico profundo",
    "Ambiente fechado de alta eficiência",
    "Gestão nutricional e stress controlado",
    "Pós-colheita orientada a terpenos"
  ] as const,
  stats: { lessonCount: 12, hoursLabel: "≈28h (referência)" }
};
