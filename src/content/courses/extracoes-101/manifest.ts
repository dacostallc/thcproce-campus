import type { CourseManifest } from "@/content/courses/types";

export const EXTRACOES_101_MANIFEST: CourseManifest = {
  areaId: "extracoes-101",

  displayName: "Extrações 101",

  hud: {
    nextLessonFallbackLabel: "Fundamentos · O que são extratos de cannabis?",
  },

  previewLessonTitles: [
    "Fundamentos · O que são extratos de cannabis?",
    "Fundamentos · Canabinoides e terpenos — o que preservamos",
    "Sem Solvente · Rosin: prensa manual e hidráulica",
    "Sem Solvente · Bubble hash: água, gelo e agitação",
  ],

  stats: {
    lessonCount: 17,
    hoursLabel: "≈6h leitura guiada",
  },

  marketing: {
    short:
      "Do rosin caseiro ao CO₂ profissional — fundamentos de segurança, técnicas sem e com solvente, leitura de COA e ética do extratista.",
    category: "Extração",
    level: "Iniciante",
    color: "purple",
    mapPosition: { x: 62, y: 58 },
    description:
      "**Extrações 101** cobre o ciclo completo do extratista iniciante: o que são concentrados, como canabinoides e terpenos se comportam no processo, segurança básica de laboratório, técnicas sem solvente (rosin, bubble hash, dry sift, hash artesanal) e com solvente (álcool, CO₂), como ler um COA de extrato, armazenamento correto, marco legal brasileiro e ética profissional. O curso não ensina evasão de legislação nem produção ilegal — foco em educação técnica responsável.",
    highlights: [
      "17 aulas cobrindo desde vocabulário básico até leitura de COA e regulamentação",
      "Técnicas sem solvente (rosin, bubble hash, dry sift) e com solvente (QWET, CO₂) com ênfase em segurança",
      "Módulo de qualidade: textura, cor, consistência e armazenamento correto dos extratos",
      "Marco legal BR e ética do extratista — sem receitas ilegais, com contexto científico sério",
    ],
    professor: "Equipa THCProce",
  },
};
