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
 * Trilha canónica Cannabis 101 (29 folhas) — ordenação alinhada à sala oficial de formação THCProce.
 * Cada `id` de folha é estável para futuras migrações e integrações.
 */
export const CANNABIS101_MODULES: readonly Cannabis101Module[] = [
  {
    id: "intro",
    title: "Introdução",
    lessons: [
      { id: "c101-intro-p1", activityLabel: "Boas-vindas e estrutura do curso" },
      { id: "c101-intro-p2", activityLabel: "Como estudar no campus e sala oficial" }
    ]
  },
  {
    id: "live",
    title: "Aulas ao Vivo",
    lessons: [{ id: "c101-live-resources", activityLabel: "Recursos, links e calendário" }]
  },
  {
    id: "cultivo-intro",
    title: "Introdução ao Cultivo de Cannabis",
    lessons: [
      { id: "c101-cultivo-intro-p1", activityLabel: "Botânica e ciclo de vida" },
      { id: "c101-cultivo-intro-p2", activityLabel: "Sexagem, fotoperíodo e enquadramento legal" },
      { id: "c101-cultivo-intro-quiz", activityLabel: "Questionário do módulo" }
    ]
  },
  {
    id: "variedades",
    title: "Compreensão das variedades de Cannabis",
    lessons: [
      { id: "c101-variedades-p1", activityLabel: "Morfo-tipos e escolha de genética" },
      { id: "c101-variedades-p2", activityLabel: "Canabinoides, terpenos e laudos" },
      { id: "c101-variedades-quiz", activityLabel: "Questionário do módulo" }
    ]
  },
  {
    id: "preparativos",
    title: "Preparativos para o Cultivo de Cannabis",
    lessons: [
      { id: "c101-preparativos-p1", activityLabel: "Espaço, segurança e checklist" },
      { id: "c101-preparativos-p2", activityLabel: "Iluminação e ventilação" },
      { id: "c101-preparativos-p3", activityLabel: "Substrato, vasos e água" },
      { id: "c101-preparativos-quiz", activityLabel: "Questionário do módulo" }
    ]
  },
  {
    id: "processo",
    title: "Processo de Cultivo de Cannabis",
    lessons: [
      { id: "c101-processo-p1", activityLabel: "Germinação e plântulas" },
      { id: "c101-processo-p2", activityLabel: "Fase vegetativa e dossel" },
      { id: "c101-processo-p3", activityLabel: "Floração e ambiente floral" },
      { id: "c101-processo-quiz", activityLabel: "Questionário do módulo" }
    ]
  },
  {
    id: "manutencao",
    title: "Manutenção e cuidado da planta de Cannabis",
    lessons: [
      { id: "c101-manutencao-p1", activityLabel: "Rega, pH e condutividade (noções)" },
      { id: "c101-manutencao-p2", activityLabel: "Nutrição e diagnóstico visual prudente" },
      { id: "c101-manutencao-p3", activityLabel: "Pragas e técnicas avançadas introdutórias" },
      { id: "c101-manutencao-quiz", activityLabel: "Questionário do módulo" }
    ]
  },
  {
    id: "pos-colheita",
    title: "Pós-colheita e Processamento de Cannabis",
    lessons: [
      { id: "c101-pos-p1", activityLabel: "Colheita e maturação" },
      { id: "c101-pos-p2", activityLabel: "Secagem e cura" },
      { id: "c101-pos-quiz", activityLabel: "Questionário do módulo" }
    ]
  },
  {
    id: "avaliacao",
    title: "Avaliação do curso",
    lessons: [{ id: "c101-avaliacao-final", activityLabel: "Prova final integrada" }]
  },
  {
    id: "consideracoes",
    title: "Considerações Finais",
    lessons: [
      { id: "c101-consideracoes-p1", activityLabel: "Próximos passos e estudo contínuo" },
      { id: "c101-consideracoes-p2", activityLabel: "Mensagem de encerramento" }
    ]
  },
  {
    id: "certificado",
    title: "Certificado",
    lessons: [
      { id: "c101-cert-requisitos", activityLabel: "Requisitos e emissão" },
      { id: "c101-cert-encerramento", activityLabel: "Encerramento do curso" }
    ]
  }
] as const;

const EXPECTED_LESSON_COUNT = 29;

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
    short: "Cultivo com respeito · cultura THCProce · sala oficial com arquivo e certificado",
    category: "Anfiteatro" as const,
    level: "Iniciante" as const,
    color: "amber" as AreaColor,
    mapPosition: { x: 86, y: 36 } as const,
    description:
      "O Cannabis 101 é a porta de entrada THCProce com a vibe certa: cultura da planta, ciência sem arrogância, um toque de lifestyle consciente e cultivo responsável. É pra quem curte a cena mas quer método — sem parecer aula de hospital, sem papo de guru na internet, e com a comunidade junto. A formação séria fica onde a escola publica o oficial; aqui no campus você vive a jornada.",
    highlights: [
      "29 momentos como episódios de uma série: intro, lives, blocos de cultivo, pós-colheita, prova final e encerramento com certificado",
      "Quando o conteúdo pede PDF, texto longo ou prova formal, a ponte leva direto à sala digital oficial THCProce",
      "Quizzes ao longo do caminho pra fixar sem trauma — e fechamento com avaliação que amarra tudo o que você viu",
      "Campus THCProce = vibe gamer/streaming + progressão gostosa; o arquivo chancelado continua na sala onde a equipa manda"
    ] as const,
    professor: "Prof THC"
  },
  stats: {
    lessonCount: EXPECTED_LESSON_COUNT,
    hoursLabel: "≈24h (referência sala oficial THCProce)"
  },
  /** Ordem canónica da árvore (módulos → aulas). */
  modules: CANNABIS101_MODULES,
  /**
   * Prévia do painel do curso (equivalente ao modelo genérico do CoursePanel para esta área).
   * Etapa futura: CoursePanel lê isto por `areaId`.
   */
  previewLessonTitles: [
    "Introdução · Boas-vindas e estrutura do curso",
    "Introdução · Como estudar no campus e sala oficial",
    "Aulas ao Vivo · Recursos, links e calendário",
    "Introdução ao Cultivo de Cannabis · Botânica e ciclo de vida"
  ] as const,
  /** Textos do HUD até haver cálculo dinâmico por progresso. */
  hud: {
    nextLessonFallbackLabel: "Próxima parada · Boas-vindas e estrutura do curso"
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
