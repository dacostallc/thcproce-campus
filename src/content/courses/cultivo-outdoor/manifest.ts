import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

export const CULTIVO_OUTDOOR_AREA_ID = "cultivo-outdoor" as const;

export const CULTIVO_OUTDOOR_MANIFEST: CourseManifest = {
  areaId: CULTIVO_OUTDOOR_AREA_ID,
  displayName: "Cultivo Outdoor",
  marketing: {
    short: "A céu aberto, do plantio à colheita",
    category: "Cultivo",
    level: "Iniciante",
    color: "canna",
    description:
      "Cultivo a céu aberto, ciclo natural com o sol. Preparo do terreno, genéticas adequadas, calendário estacional e proteção contra pragas e clima.",
    highlights: [
      "Análise de solo e preparação",
      "Genéticas adequadas para outdoor",
      "Calendário de plantio (BR)",
      "Proteção contra pragas e clima"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(CULTIVO_OUTDOOR_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(CULTIVO_OUTDOOR_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(CULTIVO_OUTDOOR_AREA_ID),
    hoursLabel: "13h"
  }
};
