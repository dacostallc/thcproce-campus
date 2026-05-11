import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

export const GENETICA_AREA_ID = "genetica" as const;

export const GENETICA_MANIFEST: CourseManifest = {
  areaId: GENETICA_AREA_ID,
  displayName: "Genética & Sementes",
  marketing: {
    short: "Sementes feminizadas e cruzamentos",
    category: "Pesquisa",
    level: "Avançado",
    color: "canna",
    description:
      "Produção de sementes feminizadas, cruzamentos, estabilização de fenótipos e seleção de mães. Técnicas educativas com referência a STS e boas práticas.",
    highlights: [
      "Polinização controlada",
      "Sementes feminizadas com STS",
      "Seleção de fenótipos",
      "Banco de mães e clones"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(GENETICA_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(GENETICA_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(GENETICA_AREA_ID),
    hoursLabel: "10h"
  }
};
