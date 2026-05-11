import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

export const SECAGEM_CURA_AREA_ID = "secagem-cura" as const;

export const SECAGEM_CURA_MANIFEST: CourseManifest = {
  areaId: SECAGEM_CURA_AREA_ID,
  displayName: "Secagem & Cura",
  marketing: {
    short: "Onde o aroma e a potência se preservam",
    category: "Pós-colheita",
    level: "Intermediário",
    color: "amber",
    description:
      "Secagem e cura: umidade, temperatura, escuridão e tempo. Diferença entre flor mediana e flor premium — protocolos THCProce sem prometer resultados mágicos.",
    highlights: [
      "Curva de secagem ideal",
      "Cura em vidro com Boveda",
      "Erros que destroem terpenos",
      "Armazenamento de longo prazo"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(SECAGEM_CURA_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(SECAGEM_CURA_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(SECAGEM_CURA_AREA_ID),
    hoursLabel: "5h"
  }
};
