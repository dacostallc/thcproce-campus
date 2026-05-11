import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

export const CULTIVO_INDOOR_AREA_ID = "cultivo-indoor" as const;

export const CULTIVO_INDOOR_MANIFEST: CourseManifest = {
  areaId: CULTIVO_INDOOR_AREA_ID,
  displayName: "Cultivo Indoor",
  marketing: {
    short: "Floração, fotoperíodo e LED",
    category: "Cultivo",
    level: "Intermediário",
    color: "purple",
    description:
      "Cultivo em ambiente fechado: floração, manejo de luz LED, clima e técnicas de poda (LST, SCROG, defoliação).",
    highlights: [
      "Fotoperíodo 18/6 e 12/12",
      "Tipos de LED e PPFD",
      "Técnicas de poda e treinamento",
      "Cronograma de floração e colheita"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(CULTIVO_INDOOR_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(CULTIVO_INDOOR_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(CULTIVO_INDOOR_AREA_ID),
    hoursLabel: "21h"
  }
};
