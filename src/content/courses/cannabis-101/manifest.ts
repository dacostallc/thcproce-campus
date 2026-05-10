import type { AreaColor } from "@/data/areaTokens";

/** Slug canónico no mapa / `Area.id` — não alterar sem migração. */
export const CANNABIS101_AREA_ID = "cannabis-101" as const;

export type Cannabis101LessonLeaf = {
  readonly id: string;
  readonly activityLabel: string;
};

export type Cannabis101Module = {
  readonly id: string;
  readonly title: string;
  readonly lessons: readonly Cannabis101LessonLeaf[];
};

/**
 * Cannabis 101 — trilha introdutória em português: conceitos, corpo, uso responsável,
 * panorama legal de alto nível e encaminhamento às trilhas avançadas do campus.
 */
export const CANNABIS101_MODULES: readonly Cannabis101Module[] = [
  {
    id: "fundamentos",
    title: "Fundamentos",
    lessons: [
      { id: "c101-l01-boas-vindas", activityLabel: "Boas-vindas ao Cannabis 101" },
      { id: "c101-l02-o-que-e-cannabis", activityLabel: "O que é cannabis" },
      {
        id: "c101-l03-canhamo-maconha-medicinal",
        activityLabel: "Cânhamo, maconha e cannabis medicinal"
      }
    ]
  },
  {
    id: "quimica-sensorial",
    title: "Química e aroma",
    lessons: [
      {
        id: "c101-l04-canabinoides",
        activityLabel: "Canabinoides principais: THC, CBD, CBG e CBN"
      },
      { id: "c101-l05-terpenos", activityLabel: "Terpenos e aroma" }
    ]
  },
  {
    id: "corpo-e-uso",
    title: "Corpo, contextos e consumo",
    lessons: [
      {
        id: "c101-l06-sistema-endocanabinoide",
        activityLabel: "Sistema endocanabinoide, em linguagem simples"
      },
      {
        id: "c101-l07-usos-e-reducao-de-danos",
        activityLabel: "Uso medicinal, adulto e redução de danos"
      },
      {
        id: "c101-l08-formas-consumo",
        activityLabel: "Formas de consumo e início de efeito (uso responsável)"
      }
    ]
  },
  {
    id: "legal-e-seguranca",
    title: "Legalidade e responsabilidade",
    lessons: [
      {
        id: "c101-l09-legalidade-br-eua",
        activityLabel: "Legalidade: panoramas Brasil e EUA (visão geral)"
      },
      {
        id: "c101-l10-seguranca-limites",
        activityLabel: "Segurança, responsabilidade e limites deste curso"
      }
    ]
  },
  {
    id: "encerramento",
    title: "Continuando a jornada",
    lessons: [
      {
        id: "c101-l11-proximas-trilhas",
        activityLabel: "Próximos passos: cultivo, extração e medicina canabinoide"
      }
    ]
  }
] as const;

const EXPECTED_LESSON_COUNT = 11;

function countLeaves(mods: readonly Cannabis101Module[]): number {
  return mods.reduce((acc, m) => acc + m.lessons.length, 0);
}

if (countLeaves(CANNABIS101_MODULES) !== EXPECTED_LESSON_COUNT) {
  throw new Error(
    `Cannabis 101 manifest: esperado ${EXPECTED_LESSON_COUNT} aulas, tem ${countLeaves(CANNABIS101_MODULES)}`
  );
}

/**
 * Marketing + estatísticas + metadados de catálogo.
 * Nota: `mapPosition` deve manter-se alinhado a `src/data/courses.ts` até haver sincronização automática.
 */
export const CANNABIS101_MANIFEST = {
  areaId: CANNABIS101_AREA_ID,
  displayName: "Cannabis 101",
  marketing: {
    short:
      "Introdução acolhedora à planta, ao corpo e ao contexto legal — com responsabilidade e método THCProce",
    category: "Anfiteatro" as const,
    level: "Iniciante" as const,
    color: "amber" as AreaColor,
    mapPosition: { x: 86, y: 36 } as const,
    description:
      "O Cannabis 101 é o seu primeiro contato organizado com a cannabis no campus: o que é a planta, como ela conversa com o organismo, que diferenças existem entre cânhamo industrial, uso informal de flores e caminhos medicinais regulados, e como pensar consumo com redução de danos. O tom é didático, sem sensacionalismo, sem prometer curas e sem incentivar condutas ilegais. Aprofundamentos técnicos (cultivo, extrações, medicina avançada) ficam nas trilhas seguintes; materiais oficiais e certificação, quando aplicáveis, continuam na sala digital THCProce.",
    highlights: [
      "Onze aulas em português: fundamentos, canabinoides, terpenos, sistema endocanabinoide, usos, consumo responsável, panorama legal Brasil/EUA e limites do curso",
      "Cada aula traz ideias centrais, reflexão breve e um quiz de três questões para fixar no seu ritmo",
      "Ponte clara para as salas de cultivo, extrações e medicina canabinoide quando você quiser ir além do básico",
      "Conteúdo educativo: não substitui orientação médica, jurídica ou agronómica para o seu caso concreto"
    ] as const,
    professor: "Equipa THCProce"
  },
  stats: {
    lessonCount: EXPECTED_LESSON_COUNT,
    hoursLabel: "≈6h (estimativa de estudo + materiais na sala oficial)"
  },
  /** Ordem canônica da árvore (módulos → aulas). */
  modules: CANNABIS101_MODULES,
  /**
   * Prévia do painel do curso (equivalente ao modelo genérico do CoursePanel para esta área).
   * Etapa futura: CoursePanel lê isto por `areaId`.
   */
  previewLessonTitles: [
    "Fundamentos · Boas-vindas ao Cannabis 101",
    "Fundamentos · O que é cannabis",
    "Fundamentos · Cânhamo, maconha e cannabis medicinal",
    "Química e aroma · Canabinoides principais: THC, CBD, CBG e CBN"
  ] as const,
  /** Textos do HUD até haver cálculo dinâmico por progresso. */
  hud: {
    nextLessonFallbackLabel: "Próxima parada · Boas-vindas ao Cannabis 101"
  },
  moodle: {
    defaultBaseUrl: "https://thcproce.com.br/escola",
    baseUrlEnvVar: "NEXT_PUBLIC_MOODLE_BASE_URL" as const,
    courseIdEnvVar: "NEXT_PUBLIC_MOODLE_CANNABIS101_COURSE_ID" as const
  }
} as const;

export const CANNABIS101_EXPECTED_LESSON_TOTAL = EXPECTED_LESSON_COUNT;

export function cannabis101MoodleBaseUrl(): string {
  const u =
    typeof process.env.NEXT_PUBLIC_MOODLE_BASE_URL === "string"
      ? process.env.NEXT_PUBLIC_MOODLE_BASE_URL.trim().replace(/\/$/, "")
      : "";
  return u || CANNABIS101_MANIFEST.moodle.defaultBaseUrl;
}

/** URL da página principal do curso no Moodle (quando id está na env). */
export function cannabis101MoodleCourseUrl(): string {
  const base = cannabis101MoodleBaseUrl();
  const id =
    typeof process.env.NEXT_PUBLIC_MOODLE_CANNABIS101_COURSE_ID === "string"
      ? process.env.NEXT_PUBLIC_MOODLE_CANNABIS101_COURSE_ID.trim()
      : "";
  if (id && base) return `${base}/course/view.php?id=${encodeURIComponent(id)}`;
  return base;
}

/** Nome exibido do curso (fonte única com `CANNABIS101_MANIFEST.displayName`). */
export function getCannabis101DisplayName(): string {
  return CANNABIS101_MANIFEST.displayName;
}
