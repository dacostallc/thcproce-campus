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
 * Cannabis 101 — trilha introdutória em português: método de estudo, planta→COA, categorias
 * regulatórias, farmacologia introdutória, redução de danos, vias, pesquisa jurídica séria,
 * contrato ético e matriz de encaminhamento às salas do campus.
 */
export const CANNABIS101_MODULES: readonly Cannabis101Module[] = [
  {
    id: "fundamentos",
    title: "Fundamentos",
    lessons: [
      {
        id: "c101-l01-boas-vindas",
        activityLabel: "Abertura: cenário real + checklist para redes (THC/CBD) + glossário vivo"
      },
      {
        id: "c101-l02-o-que-e-cannabis",
        activityLabel: "Cannabis como planta mensurável (ponte para COA)"
      },
      {
        id: "c101-l03-canhamo-maconha-medicinal",
        activityLabel: "Três mundos: industrial, medicinal regulado e informal"
      }
    ]
  },
  {
    id: "quimica-sensorial",
    title: "Química e aroma",
    lessons: [
      {
        id: "c101-l04-canabinoides",
        activityLabel: "Canabinoides e leitura rigorosa de COA"
      },
      { id: "c101-l05-terpenos", activityLabel: "Terpenos: conservação e ciência sem hype" }
    ]
  },
  {
    id: "corpo-e-uso",
    title: "Corpo, contextos e consumo",
    lessons: [
      {
        id: "c101-l06-sistema-endocanabinoide",
        activityLabel: "ECS: consulta preparada, 48 h versus urgência"
      },
      {
        id: "c101-l07-usos-e-reducao-de-danos",
        activityLabel: "Redução de danos e ética ao orientar terceiros"
      },
      {
        id: "c101-l08-formas-consumo",
        activityLabel: "Vias de consumo e linha do tempo oral × ingestão"
      }
    ]
  },
  {
    id: "legal-e-seguranca",
    title: "Legalidade e responsabilidade",
    lessons: [
      {
        id: "c101-l09-legalidade-br-eua",
        activityLabel: "Legalidade BR/EUA: investigação guiada e fichas datadas"
      },
      {
        id: "c101-l10-seguranca-limites",
        activityLabel: "O que o curso entrega, limites duros e segurança"
      }
    ]
  },
  {
    id: "encerramento",
    title: "Continuando a jornada",
    lessons: [
      {
        id: "c101-l11-proximas-trilhas",
        activityLabel: "Matriz de trilhas: ids reais dos cursos no campus"
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
      "Método THCProce no painel: checklist de fontes, planta→COA, três mundos regulatórios, ECS, danos, vias, lei em fonte primária e matriz de próximos cursos — PT-BR, tom técnico",
    category: "Anfiteatro" as const,
    level: "Iniciante" as const,
    color: "amber" as AreaColor,
    mapPosition: { x: 86, y: 36 } as const,
    description:
      "Cannabis 101 combina ciência com protocolos aplicáveis: checklist THCProce para fontes, leitura de COA e rótulos, genótipo versus fenótipo na prática, três mundos regulatórios com perguntas copiáveis para consulta, terpenos sem slogans milagrosos, ECS com sinais para 48 h versus urgência, redução de danos com ética ao ajudar terceiros, linha do tempo de vias, pesquisa jurídica com ficha datada (manchete versus ementa), contrato explícito do que o curso oferece e matriz de ids das salas seguintes. É educação em PT-BR — não substitui prescritor, farmacêutico ou advogado. Vídeos longos e avaliações institucionais ficam na sala digital THCProce; o painel do campus prioriza texto denso.",
    highlights: [
      "Onze aulas com âncoras narrativas (ex.: cenário Ana), checklists copiáveis, exercício de COA fictício, glossário inicial e quizzes alinhados ao texto",
      "Pontes explícitas entre aulas (planta→COA→vias; ECS→danos; lei→limites éticos) para fluxo pedagógico contínuo",
      "Matriz de encaminhamento com slugs reais (cultivo-indoor, extracao-oleo, medicina…) e avisos de segurança antes das salas avançadas",
      "Aviso permanente: não é consultório, escritório jurídico nem guia de condutas ilegais"
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
