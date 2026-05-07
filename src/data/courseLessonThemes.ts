/**
 * Identidade visual por curso — hero cinematográfico quando ainda não há vídeo hospedado (Mux/Bunny).
 * Amplie com imagens em /public/campus/themes/<id>.webp quando existirem.
 */
export type CourseLessonTheme = {
  /** Slug do curso (Area.id) */
  areaId: string;
  tagline: string;
  mood: string;
  /** Classes Tailwind para mesh / gradiente animado */
  heroClass: string;
  /** Orbes / partículas leves (CSS) */
  orbClass: string;
};

const mesh = (from: string, via: string, to: string) =>
  `bg-gradient-to-br ${from} ${via} ${to}`;

export const DEFAULT_COURSE_THEME: CourseLessonTheme = {
  areaId: "_default",
  tagline: "Universidade digital cannabis",
  mood: "Campus THCProce — conteúdo em preparação para esta aula.",
  heroClass: mesh("from-ink-950", "via-emerald-950/90", "to-black"),
  orbClass: "from-canna-400/20 to-transparent"
};

/** Temas alinhados aos 14 cursos do campus */
export const COURSE_LESSON_THEMES: Record<string, CourseLessonTheme> = {
  "cannabis-101": {
    areaId: "cannabis-101",
    tagline: "Ciência · medicina · moléculas",
    mood: "Laboratório conceitual — canabinoides, terpenos e sistema endocanabinoide.",
    heroClass: mesh("from-slate-950", "via-indigo-950/95", "to-emerald-950"),
    orbClass: "from-cyan-400/25 to-transparent"
  },
  "cultivo-greenhouse": {
    areaId: "cultivo-greenhouse",
    tagline: "Estufa · clima · yield",
    mood: "Greenhouse cinematográfica — luz suplementar, CO₂ e controlo ambiental.",
    heroClass: mesh("from-emerald-950", "via-lime-950/80", "to-sky-950"),
    orbClass: "from-amber-300/20 to-transparent"
  },
  "cultivo-outdoor": {
    areaId: "cultivo-outdoor",
    tagline: "Sol · fazenda · ciclo natural",
    mood: "Céu aberto — solo, calendário e colheita em escala.",
    heroClass: mesh("from-amber-950", "via-yellow-950/70", "to-emerald-950"),
    orbClass: "from-orange-300/25 to-transparent"
  },
  "cultivo-indoor": {
    areaId: "cultivo-indoor",
    tagline: "Indoor premium · LED · ambiente fechado",
    mood: "Sala de cultivo controlada — ventilação, odor e fotoperíodo.",
    heroClass: mesh("from-zinc-950", "via-violet-950/85", "to-emerald-950"),
    orbClass: "from-purple-400/20 to-transparent"
  },
  genetica: {
    areaId: "genetica",
    tagline: "Breeding · estabilização",
    mood: "Bancos de genética — cruzamentos e seleção fenotípica.",
    heroClass: mesh("from-fuchsia-950", "via-purple-950/80", "to-slate-950"),
    orbClass: "from-pink-400/20 to-transparent"
  },
  "secagem-cura": {
    areaId: "secagem-cura",
    tagline: "Pós-colheita · cura · aroma",
    mood: "Zona de secagem limpa — tempo, umidade e frascos.",
    heroClass: mesh("from-stone-900", "via-amber-950/90", "to-zinc-950"),
    orbClass: "from-amber-200/15 to-transparent"
  },
  "extracoes-solventless": {
    areaId: "extracoes-solventless",
    tagline: "Rosin · ice water · sem solvente",
    mood: "Bancada inox — pressão, micronagem e extração limpa.",
    heroClass: mesh("from-slate-950", "via-cyan-950/85", "to-zinc-950"),
    orbClass: "from-cyan-300/20 to-transparent"
  },
  "extracao-oleo": {
    areaId: "extracao-oleo",
    tagline: "Óleos · CO₂ · laboratório",
    mood: "Processo industrial — segurança, purificação e padronização.",
    heroClass: mesh("from-blue-950", "via-slate-900", "to-emerald-950"),
    orbClass: "from-blue-300/15 to-transparent"
  },
  medicina: {
    areaId: "medicina",
    tagline: "Clínica · prescrição · ciência",
    mood: "Medicina baseada em evidência — vias de administração e dosagem.",
    heroClass: mesh("from-teal-950", "via-emerald-950", "to-slate-950"),
    orbClass: "from-teal-300/20 to-transparent"
  },
  culinaria: {
    areaId: "culinaria",
    tagline: "Chef · infusion · gastronomia",
    mood: "Cozinha canábica — manteigas, óleos e dose por porção.",
    heroClass: mesh("from-orange-950", "via-rose-950/75", "to-amber-950"),
    orbClass: "from-orange-200/20 to-transparent"
  },
  laboratorio: {
    areaId: "laboratorio",
    tagline: "Analítica · HPLC · QC",
    mood: "Laboratório de análises — pureza, contaminantes e laudos.",
    heroClass: mesh("from-slate-950", "via-blue-950/90", "to-zinc-900"),
    orbClass: "from-sky-400/20 to-transparent"
  },
  legislacao: {
    areaId: "legislacao",
    tagline: "Marco legal · compliance",
    mood: "Regulação nacional — cultivo, associações e rastreio.",
    heroClass: mesh("from-zinc-950", "via-neutral-900", "to-stone-950"),
    orbClass: "from-yellow-200/15 to-transparent"
  },
  cooperativismo: {
    areaId: "cooperativismo",
    tagline: "Cooperativas · pacientes · escala",
    mood: "Modelos colaborativos — governança e produção associativa.",
    heroClass: mesh("from-green-950", "via-lime-900/80", "to-emerald-950"),
    orbClass: "from-lime-300/18 to-transparent"
  },
  industria: {
    areaId: "industria",
    tagline: "Indúria 4.0 · GMP · escala",
    mood: "Planta piloto — automação, lotes e exportação.",
    heroClass: mesh("from-neutral-950", "via-stone-900", "to-amber-950/70"),
    orbClass: "from-amber-400/15 to-transparent"
  }
};

export function getCourseLessonTheme(areaId: string): CourseLessonTheme {
  return COURSE_LESSON_THEMES[areaId] ?? DEFAULT_COURSE_THEME;
}
