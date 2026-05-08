import type { CourseManifest } from "@/content/courses/types";

/** Sala «Extração de Óleo» no mapa. */
export const EXTRACTION_AREA_ID = "extracao-oleo" as const;

export const EXTRACTION_MANIFEST: CourseManifest = {
  areaId: EXTRACTION_AREA_ID,
  displayName: "Extração de Óleo",
  marketing: {
    short: "Óleo medicinal e tinturas",
    category: "Extrações",
    level: "Avançado",
    color: "canna",
    description:
      "RSO, FECO, tinturas alcoólicas, óleo full spectrum. Extrações com solvente para uso terapêutico, com foco em segurança, dosagem e padronização.",
    highlights: [
      "Decarboxilação correta",
      "RSO e FECO passo-a-passo",
      "Cálculo de dosagem (mg/ml)",
      "Filtragem, winterização e clareamento"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: "Extração · Aula 1" },
  previewLessonTitles: [
    "Decarboxilação e segurança de solventes",
    "RSO / FECO em visão panorâmica",
    "Cálculos de mg/ml e padronização",
    "Winterização e controle simples de qualidade"
  ] as const,
  stats: { lessonCount: 10, hoursLabel: "11h" }
};
