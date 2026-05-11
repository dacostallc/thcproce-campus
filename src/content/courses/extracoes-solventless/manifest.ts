import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

export const EXTRACOES_SOLVENTLESS_AREA_ID = "extracoes-solventless" as const;

export const EXTRACOES_SOLVENTLESS_MANIFEST: CourseManifest = {
  areaId: EXTRACOES_SOLVENTLESS_AREA_ID,
  displayName: "Extrações Solventless",
  marketing: {
    short: "Bubble Hash, Rosin, Piatella",
    category: "Extrações",
    level: "Avançado",
    color: "amber",
    description:
      "Bubble Hash com malhas, Rosin sob pressão, Piatella curado: extração sem solventes voláteis, com foco em segurança de bancada e fluxo reprodutível.",
    highlights: [
      "Bubble Hash em 6 telas",
      "Rosin: pressão, temperatura e papel",
      "Piatella: cura e fermentação do hash",
      "Limpeza e armazenamento"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(EXTRACOES_SOLVENTLESS_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(EXTRACOES_SOLVENTLESS_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(EXTRACOES_SOLVENTLESS_AREA_ID),
    hoursLabel: "12h"
  }
};
