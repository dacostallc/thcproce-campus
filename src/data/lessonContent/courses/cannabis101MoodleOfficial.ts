import type { LessonStreamContent, LessonQuizItem } from "../types";

/**
 * Cannabis 101 no campus: **só** estrutura de navegação + ligação ao curso real no Moodle.
 * Não há cópia estática do texto/PDF/vídeo — evita divergência e “conteúdo errado” gerado no repo.
 */

const MEDIA = {
  needsVideo: false,
  needsImage: false,
  needsInfographic: false,
  needsSupportMaterial: true
} as const;

function moodleBase(): string {
  const u =
    typeof process.env.NEXT_PUBLIC_MOODLE_BASE_URL === "string"
      ? process.env.NEXT_PUBLIC_MOODLE_BASE_URL.trim().replace(/\/$/, "")
      : "";
  return u || "https://thcproce.com.br/escola";
}

/** URL da página principal do curso Cannabis 101 no Moodle (requer id na env). */
export function cannabis101MoodleCourseUrl(): string {
  const base = moodleBase();
  const id =
    typeof process.env.NEXT_PUBLIC_MOODLE_CANNABIS101_COURSE_ID === "string"
      ? process.env.NEXT_PUBLIC_MOODLE_CANNABIS101_COURSE_ID.trim()
      : "";
  if (id && base) return `${base}/course/view.php?id=${encodeURIComponent(id)}`;
  return base;
}

function q(
  question: string,
  correctIndex: 0 | 1 | 2 | 3,
  a: string,
  b: string,
  c: string,
  d: string
): LessonQuizItem {
  return { question, correctIndex, options: [a, b, c, d] as const };
}

/** Mesma árvore de secções/actividades que no Moodle (29 itens). */
const MOODLE_SPEC = [
  ["Introdução", ["Página 1", "Página 2"]],
  ["Aulas ao Vivo", ["Recursos, links e calendário"]],
  [
    "Introdução ao Cultivo de Cannabis",
    ["Página 1", "Página 2", "Questionário do módulo"]
  ],
  [
    "Compreensão das variedades de Cannabis",
    ["Página 1", "Página 2", "Questionário do módulo"]
  ],
  [
    "Preparativos para o Cultivo de Cannabis",
    ["Página 1", "Página 2", "Página 3", "Questionário do módulo"]
  ],
  [
    "Processo de Cultivo de Cannabis",
    ["Página 1", "Página 2", "Página 3", "Questionário do módulo"]
  ],
  [
    "Manutenção e cuidado da planta de Cannabis",
    ["Página 1", "Página 2", "Página 3", "Questionário do módulo"]
  ],
  [
    "Pós-colheita e Processamento de Cannabis",
    ["Página 1", "Página 2", "Questionário do módulo"]
  ],
  ["Avaliação do curso", ["Prova final integrada"]],
  ["Considerações Finais", ["Página 1", "Página 2"]],
  ["Certificado", ["Requisitos e emissão", "Encerramento do curso"]]
] as const;

const TOTAL_ITEMS = MOODLE_SPEC.reduce((acc, [, acts]) => acc + acts.length, 0);

function bodyFor(section: string, label: string): string {
  const url = cannabis101MoodleCourseUrl();
  return `Este item corresponde à mesma parte do curso **Cannabis 101** na escola Moodle THCProce.

**Todo o texto oficial, vídeos, PDF e avaliações ficam no Moodle.** Este painel não replica esse material para não ficar desatualizado nem contradizer o que a equipa publica.

**O que fazer agora**
1. Abra o curso no Moodle: ${url}
2. No índice do curso, localize a secção «${section}» e a actividade «${label}».

Se o link não abrir directamente o Cannabis 101, defina nas variáveis de ambiente do campus (ex.: Vercel) \`NEXT_PUBLIC_MOODLE_CANNABIS101_COURSE_ID\` com o ID numérico do curso no Moodle (o mesmo que aparece em \`course/view.php?id=...\`).

«Marcar como vista» no campus é apenas registo de ritmo aqui — não substitui conclusão nem notas no Moodle até existir integração oficial.`;
}

/** Mensagem única em todos os itens — foco em literacia de plataforma. */
function quizzesFor(): readonly LessonQuizItem[] {
  return [
    q(
      "Onde está o conteúdo didático completo deste item do Cannabis 101?",
      0,
      "No Moodle, na secção e actividade equivalentes",
      "Apenas neste texto curto do campus",
      "Num ficheiro local não ligado ao Moodle",
      "Substituído por mensagens automáticas sem revisão pedagógica"
    ),
    q(
      "O campus THCProce substitui certificado, nota final e obrigatoriedades do Moodle neste curso?",
      3,
      "Sim, se marcar todas as vistas aqui",
      "Sim para avaliação final",
      "Sim para PDFs oficiais",
      "Não — o Moodle mantém o registo oficial até haver sincronização técnica"
    ),
    q(
      "Questionários e prova final integrada deste curso, quando aplicável, devem ser realizados:",
      0,
      "No Moodle, segundo as regras publicadas pela equipa pedagógica",
      "Apenas neste painel do campus, substituindo totalmente o Moodle",
      "Somente por correio eletrónico sem registo",
      "Sem qualquer plataforma oficial"
    )
  ] as const;
}

function buildLesson(
  section: string,
  label: string,
  globalIdx: number
): LessonStreamContent {
  const title = `${section} · ${label}`;
  const url = cannabis101MoodleCourseUrl();

  return {
    title,
    introduction: `Item ${globalIdx + 1} de ${TOTAL_ITEMS}. Secção Moodle «${section}», actividade «${label}». Lista espelhada; estudo no Moodle.`,
    body: bodyFor(section, label),
    objectives: [
      "Abrir no Moodle a secção e a actividade com o mesmo nome que este item.",
      "Concluir leituras e avaliações no Moodle conforme regras da equipa.",
      "Usar o campus só como mapa de progresso complementar até haver import automático."
    ],
    closingSummary: `No Moodle: «${section}» → «${label}».`,
    quiz: quizzesFor(),
    media: MEDIA,
    materials: ["Curso Cannabis 101 — plataforma Moodle THCProce", url],
    references: [url],
    professorNotes:
      "Prefira MBZ export ou WS core_course_get_contents no futuro para preencher texto aqui sem drift."
  };
}

export const CANNABIS101_LESSONS: readonly LessonStreamContent[] = (() => {
  const list: LessonStreamContent[] = [];
  let idx = 0;
  for (const [section, acts] of MOODLE_SPEC) {
    for (const label of acts) {
      list.push(buildLesson(section, label, idx));
      idx += 1;
    }
  }
  if (list.length !== TOTAL_ITEMS || TOTAL_ITEMS !== 29) {
    throw new Error(`Cannabis 101 Moodle oficial: esperado 29 itens, tem ${list.length}`);
  }
  return list;
})();

export const CANNABIS101_OUTLINE_TITLES: readonly string[] =
  CANNABIS101_LESSONS.map((l) => l.title);
