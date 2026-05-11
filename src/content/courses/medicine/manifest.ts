import type { CourseManifest } from "@/content/courses/types";
import {
  courseFirstLessonTitle,
  courseOutlineLessonCount,
  coursePreviewLessonTitles
} from "@/data/courseOutlines";

export const MEDICINE_AREA_ID = "medicina" as const;

export const MEDICINE_MANIFEST: CourseManifest = {
  areaId: MEDICINE_AREA_ID,
  displayName: "Medicina Canabinoide",
  marketing: {
    short: "Aplicações terapêuticas",
    category: "Saúde",
    level: "Todos os níveis",
    color: "cyan",
    description:
      "Uso medicinal da cannabis: dor crônica, ansiedade, epilepsia, oncologia, autismo. Indicações, contra-indicações, interações medicamentosas e protocolos.",
    highlights: [
      "Sistema endocanabinoide aplicado",
      "Protocolos por condição",
      "Titulação e ajuste de dose",
      "Interações com outros medicamentos"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: courseFirstLessonTitle(MEDICINE_AREA_ID) },
  previewLessonTitles: coursePreviewLessonTitles(MEDICINE_AREA_ID),
  stats: {
    lessonCount: courseOutlineLessonCount(MEDICINE_AREA_ID),
    hoursLabel: "14h"
  }
};
