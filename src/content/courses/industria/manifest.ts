import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

export const INDUSTRIA_AREA_ID = "industria" as const;

export const INDUSTRIA_MANIFEST: CourseManifest = {
  areaId: INDUSTRIA_AREA_ID,
  displayName: "Indústria Cannabis",
  marketing: {
    short: "Mercado, marcas e produção em escala",
    category: "Negócio",
    level: "Avançado",
    color: "rose",
    description:
      "Mercado regulado, branding, claims permitidos, cadeia de suprimentos e carreiras — quadro conceitual; decisões de licenciamento exigem assessoria especializada.",
    highlights: [
      "Mercado BR vs LATAM vs EUA/EU",
      "Branding e produto",
      "Cadeia de suprimentos",
      "Carreiras e oportunidades"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(INDUSTRIA_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(INDUSTRIA_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(INDUSTRIA_AREA_ID),
    hoursLabel: "8h"
  }
};
