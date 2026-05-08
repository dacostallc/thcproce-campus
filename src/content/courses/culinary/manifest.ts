import type { CourseManifest } from "@/content/courses/types";

/** Alinhado a `areas[].id === "culinaria"` no mapa. */
export const CULINARY_AREA_ID = "culinaria" as const;

/** Marketing sem `mapPosition` — hotspots vêm sempre do fallback em `data/courses.ts`. */
export const CULINARY_MANIFEST: CourseManifest = {
  areaId: CULINARY_AREA_ID,
  displayName: "Culinária com Cannabis",
  marketing: {
    short: "Edibles, manteiga e óleos",
    category: "Gastronomia",
    level: "Intermediário",
    color: "amber",
    description:
      "Da decarboxilação à dosagem precisa em receitas. Manteiga canábica, óleos infundidos, brownies, doces e pratos salgados — tudo com cálculo de mg por porção.",
    highlights: [
      "Decarbox em forno e banho-maria",
      "Manteiga e óleo infundidos",
      "Cálculo de mg por porção",
      "Receitas doces e salgadas"
    ] as const,
    professor: "Prof THC"
  },
  hud: { nextLessonFallbackLabel: "Culinária · Aula 1" },
  previewLessonTitles: [
    "Da decarboxilação ao mg por porção",
    "Manteiga e óleos infundidos",
    "Receitas doces e salgadas com dosagem segura",
    "Boas práticas de etiquetagem familiar"
  ] as const,
  stats: { lessonCount: 10, hoursLabel: "8h" }
};
