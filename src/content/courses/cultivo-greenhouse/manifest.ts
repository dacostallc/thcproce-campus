import type { CourseManifest } from "@/content/courses/types";

export const CultivoGreenhouse_MANIFEST: CourseManifest = {
  areaId: "cultivo-greenhouse",
  displayName: "Cultivo Greenhouse",
  hud: {
    nextLessonFallbackLabel: "Estufa · Sol + controle climático",
  },
  previewLessonTitles: [],
  stats: {
    lessonCount: 10,
    hoursLabel: "≈4h leitura guiada",
  },
  marketing: {
    short: "O melhor do indoor e outdoor combinados — produção em estufa controlada",
    category: "Cultivo",
    level: "Intermediário",
    color: "canna",
    mapPosition: { x: 10, y: 32 },
    description: "Cultivo em estufa: estruturas, coberturas, ventilação, controle de fotoperíodo com blackout, suplementação de luz e produção escalonada com custo reduzido vs indoor puro.",
    highlights: [],
    professor: "Equipa THCProce",
  },
};
