import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

export const LEGISLACAO_AREA_ID = "legislacao" as const;

export const LEGISLACAO_MANIFEST: CourseManifest = {
  areaId: LEGISLACAO_AREA_ID,
  displayName: "Legislação Cannabis",
  marketing: {
    short: "Habeas corpus, RDC 660 e Anvisa",
    category: "Direito",
    level: "Todos os níveis",
    color: "rose",
    description:
      "Panorama regulatório no Brasil: canais legais, importação, associações e direitos de pacientes — educação jurídica básica; parecer concreto fica com advogado habilitado.",
    highlights: [
      "Habeas corpus passo-a-passo",
      "RDC 660 e RDC 327",
      "Importação de produtos via Anvisa",
      "Direito de pacientes e cuidadores"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(LEGISLACAO_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(LEGISLACAO_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(LEGISLACAO_AREA_ID),
    hoursLabel: "6h"
  }
};
