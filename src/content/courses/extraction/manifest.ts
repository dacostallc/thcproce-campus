import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

/** Sala «Extração de Óleo» no mapa. */
export const EXTRACTION_AREA_ID = "extracao-oleo" as const;

export const EXTRACTION_MANIFEST: CourseManifest = {
  areaId: EXTRACTION_AREA_ID,
  displayName: "Extração de Óleo",
  marketing: {
    short: "Óleo medicinal e tinturas",
    category: "Extrações",
    level: "Avançado",
    color: "canna",
    description:
      "RSO, FECO, tinturas alcoólicas, óleo full spectrum. Extrações com solvente para uso terapêutico, com foco em segurança, dosagem e padronização.",
    highlights: [
      "Decarboxilação correta",
      "RSO e FECO passo-a-passo",
      "Cálculo de dosagem (mg/ml)",
      "Filtragem, winterização e clareamento"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(EXTRACTION_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(EXTRACTION_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(EXTRACTION_AREA_ID),
    hoursLabel: "11h"
  }
};
