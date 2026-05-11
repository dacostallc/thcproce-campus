import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

export const CULTIVO_GREENHOUSE_AREA_ID = "cultivo-greenhouse" as const;

export const CULTIVO_GREENHOUSE_MANIFEST: CourseManifest = {
  areaId: CULTIVO_GREENHOUSE_AREA_ID,
  displayName: "Cultivo Greenhouse",
  marketing: {
    short: "Estufa: o equilíbrio entre indoor e outdoor",
    category: "Cultivo",
    level: "Intermediário",
    color: "canna",
    description:
      "Cultivo em estufa controlada: aproveita o sol, mas com proteção e suplementação. Controle climático, ventilação, suplementação de luz e produção em escala.",
    highlights: [
      "Estruturas e tipos de greenhouse",
      "Controle de temperatura e umidade",
      "Suplementação de CO₂ e LED",
      "Manejo integrado de pragas"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(CULTIVO_GREENHOUSE_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(CULTIVO_GREENHOUSE_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(CULTIVO_GREENHOUSE_AREA_ID),
    hoursLabel: "16h"
  }
};
