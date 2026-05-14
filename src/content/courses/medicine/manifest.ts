import type { CourseManifest } from "@/content/courses/types";

export const Medicine_MANIFEST: CourseManifest = {
  areaId: "medicine",
  displayName: "Medicina Canabinoide",
  hud: {
    nextLessonFallbackLabel: "Medicina · Protocolos e posologia",
  },
  previewLessonTitles: [],
  stats: {
    lessonCount: 32,
    hoursLabel: "≈12.8h leitura guiada",
  },
  marketing: {
    short: "Aplicações terapêuticas, protocolos por condição e titulação responsável",
    category: "Saúde",
    level: "Todos os níveis",
    color: "cyan",
    mapPosition: { x: 87, y: 26 },
    description: "Cannabis medicinal com base científica: sistema endocanabinoide aprofundado, protocolos por condição (dor, ansiedade, epilepsia, oncologia), titulação 'start low go slow' e interações medicamentosas.",
    highlights: [],
    professor: "Equipa THCProce",
  },
};
