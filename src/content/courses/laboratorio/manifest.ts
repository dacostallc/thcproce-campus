import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

export const LABORATORIO_AREA_ID = "laboratorio" as const;

export const LABORATORIO_MANIFEST: CourseManifest = {
  areaId: LABORATORIO_AREA_ID,
  displayName: "Laboratório de Análise",
  marketing: {
    short: "Cromatografia, potência e segurança",
    category: "Pesquisa",
    level: "Avançado",
    color: "cyan",
    description:
      "Alfabetização em COA, nociones de cromatografia, contaminantes e padronização de lotes — sempre como formação, não substituindo laboratório credenciado.",
    highlights: [
      "TLC (cromatografia em camada fina)",
      "Leitura de COA profissional",
      "Detecção de pesticidas e mofo",
      "Padronização de lotes"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(LABORATORIO_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(LABORATORIO_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(LABORATORIO_AREA_ID),
    hoursLabel: "8h"
  }
};
