import type { CourseManifest } from "@/content/courses/types";

export const HASH_MAKER_MANIFEST: CourseManifest = {
  areaId: "hash-maker",

  displayName: "Hash Maker",

  hud: {
    nextLessonFallbackLabel: "Definição e História · O que é Hash?",
  },

  previewLessonTitles: [
    "Definição e História · O que é Hash?",
    "Definição e História · Origem e Cultura do Hash",
    "Técnicas Tradicionais · Charas: hash à mão",
    "Técnicas Modernas · Dry Sift avançado",
  ],

  stats: {
    lessonCount: 1,
    hoursLabel: "≈em construção",
  },

  marketing: {
    short:
      "Do charas artesanal ao full-melt premium — técnicas de extração sem solventes, história e qualidade do hash.",
    category: "Extrações",
    level: "Intermediário",
    color: "amber",
    mapPosition: { x: 30, y: 60 },
    description:
      "**Hash Maker** mergulha nas técnicas de produção de hash sem solventes: a história milenar do concentrado, técnicas tradicionais (charas, pollinators), modernas (dry sift, bubble hash full-melt) e a arte da cura e avaliação de qualidade. Foco em execução técnica responsável, com vocabulário preciso e contexto científico.",
    highlights: [
      "História e cultura do hash — do Afeganistão à Espanha canábica",
      "Charas, pollinators, dry sift e bubble hash — técnicas sem solvente detalhadas",
      "Avaliação de qualidade: cor, textura, aroma e ponto de fusão (full-melt)",
      "Armazenamento, cura e apresentação profissional do produto final",
    ],
    professor: "Equipa THCProce",
  },
};
