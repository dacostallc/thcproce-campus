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

/** Igual a `displayTitle` em `lessons.ts` — única fonte para HUD/previews do catálogo. */
function cannabis101LessonDisplayTitle(mod: Cannabis101Module, leaf: Cannabis101LessonLeaf): string {
  return `${mod.title} · ${leaf.activityLabel}`;
}

function cannabis101PreviewLessonTitles(): readonly string[] {
  const titles: string[] = [];
  for (const mod of CANNABIS101_MODULES) {
    for (const leaf of mod.lessons) {
      titles.push(cannabis101LessonDisplayTitle(mod, leaf));
      if (titles.length >= 4) return titles;
    }
  }
  return titles;
}

function cannabis101FirstLessonDisplayTitle(): string {
  const mod = CANNABIS101_MODULES[0]!;
  const leaf = mod.lessons[0]!;
  return cannabis101LessonDisplayTitle(mod, leaf);
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
      "Fundamentos aplicáveis: botânica útil, leitura de laudos, conservação, corpo, redução de danos e lei — em português BR, tom científico",
    category: "Anfiteatro" as const,
    level: "Iniciante" as const,
    color: "amber" as AreaColor,
    mapPosition: { x: 86, y: 36 } as const,
    description:
      "Cannabis 101 combina ciência com protocolos que você usa na vida real: ler COA e rótulos, pensar colheita e pós-colheita, preservar terpenos, preparar consultas médicas, comparar vias de uso sem improvisos perigosos, pesquisar lei em fonte primária e fechar com segurança doméstica e ética digital. É conteúdo educativo em PT-BR — não substitui prescritor, farmacêutico ou advogado e não ensina evadir fiscalização. Cultivo solvente e medicina avançada ficam nas salas especializadas; vídeos longos e certificações institucionais continuam na sala digital THCProce.",
    highlights: [
      "Onze aulas densas com objetivos, passo a passo, exemplos, erros comuns, glossário embutido e quiz coerente — foco em aplicação responsável",
      "Temas práticos: leitura de laudos, conservação volátil, checklists de redução de danos, higiene de pesquisa jurídica e limites explícitos",
      "Ponte para salas de cultivo (onde permitido), solventless e medicina canabinoide avançada com pré-requisitos de segurança",
      "Aviso permanente: não é consultório, escritório jurídico nem manual de condutas ilegais"
    ] as const,
    professor: "Equipa THCProce"
  },
  stats: {
    lessonCount: EXPECTED_LESSON_COUNT,
    hoursLabel: "≈4h leitura guiada + materiais na sala oficial (variável por aluno)"
  },
  /** Ordem canônica da árvore (módulos → aulas). */
  modules: CANNABIS101_MODULES,
  /**
   * Prévia do painel do curso (equivalente ao modelo genérico do CoursePanel para esta área).
   * Etapa futura: CoursePanel lê isto por `areaId`.
   */
  previewLessonTitles: cannabis101PreviewLessonTitles(),
  /** Textos do HUD até haver cálculo dinâmico por progresso. */
  hud: {
    nextLessonFallbackLabel: cannabis101FirstLessonDisplayTitle()
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
