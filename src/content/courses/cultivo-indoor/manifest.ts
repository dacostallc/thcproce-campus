import type { CourseManifest } from "@/content/courses/types";

export const CultivoIndoor_MANIFEST: CourseManifest = {
  areaId: "cultivo-indoor",
  displayName: "Cultivo Indoor",
  hud: {
    nextLessonFallbackLabel: "Fase Vegetativa · Como controlar luz e clima",
  },
  previewLessonTitles: [],
  stats: {
    lessonCount: 19,
    hoursLabel: "≈7.6h leitura guiada",
  },
  marketing: {
    short: "Fotoperíodo, LED, clima e técnicas de poda em ambiente fechado",
    category: "Cultivo",
    level: "Intermediário",
    color: "purple",
    mapPosition: { x: 72, y: 16 },
    description: "O cultivo indoor com controle total de luz, clima e nutrição. Da fase vegetativa à colheita, dominando técnicas como LST, SCROG, defoliação e o manejo de VPD para maximizar produtividade.",
    highlights: [],
    professor: "Equipa THCProce",
  },
};
