import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

export const COOPERATIVISMO_AREA_ID = "cooperativismo" as const;

export const COOPERATIVISMO_MANIFEST: CourseManifest = {
  areaId: COOPERATIVISMO_AREA_ID,
  displayName: "Cooperativismo",
  marketing: {
    short: "Como montar uma associação medicinal",
    category: "Negócio",
    level: "Avançado",
    color: "purple",
    description:
      "Modelos associativos: estatuto, assembleia, transparência, distribuição e relação com prescritores — sempre com orientação jurídica profissional para operações reais.",
    highlights: [
      "Estatuto e regulamento interno",
      "Governança e transparência",
      "Habeas corpus coletivo",
      "Modelo de produção e distribuição"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(COOPERATIVISMO_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(COOPERATIVISMO_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(COOPERATIVISMO_AREA_ID),
    hoursLabel: "6h"
  }
};
