import type { LessonStreamContent, LessonQuizItem } from "@/data/lessonContent/types";
import {
  cannabis101MoodleCourseUrl,
  CANNABIS101_EXPECTED_LESSON_TOTAL,
  CANNABIS101_MODULES,
  getCannabis101DisplayName,
  type Cannabis101Module
} from "./manifest";
import { CANNABIS101_LESSON_MEDIA_HINTS } from "./media";

export type Cannabis101LessonNode = {
  readonly stableId: string;
  readonly moduleId: string;
  readonly sectionTitle: string;
  readonly activityLabel: string;
  readonly displayTitle: string;
};

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

function bodyFor(sectionTitle: string, activityLabel: string, courseName: string): string {
  const url = cannabis101MoodleCourseUrl();

  return `## O cenário desta sala

Este capítulo faz parte da unidade **«${sectionTitle}»**. O foco aqui é **«${activityLabel}»**: um bloco onde a língua muda da divulgação solta para método — vocabulário de laboratório, escala técnica, tom de relatório institucional e respeito explícito à diferença entre educação técnica e orientação individualizada fechada (quando aplicável ao seu trabalho futuro).

O campus THCProce trata cada passo como **uma cena montada**. Este painel entrega ritmo emocional, roteiros de perguntas e sensação premium; ele não deve competir em volume com o dossier oficial, mas faz o que um bom cold open faz no streaming: aquece o público antes do mergulho.

## Ritual sugerido (Masterclass THCProce)

Antes de abrir materiais externos, vale **cinquenta segundos** no espelho profissional: *que decisão você toma diferente nas próximas 48 horas porque dominou bem este tema?* Anote verbalmente uma frase só. Este é o tipo de perguntinha que faz curso soar escola técnica e não tutorial solto.

Daí, trabalhe nesta sequência discreta:

1. **Ouvir/escrever** — capturar o argumento mestre sem correção imediata;
2. **Interrogar** — três dúvidas técnicas concretas;
3. **Conectar risco/safety/compliance BR** sempre que aparecer técnica de processo sério — inclusive como literacia de cultivo doméstico ou laboratório, sem prometer automação legal onde ela não existe.

## Sala oficial THCProce (aprofundamento institucional)

Vídeo long-form, arquivo completo das leituras, rubricas, provas e registo válido para certificação vive na **mesma sala digital já usada pela escola oficial THCProce** — aquele espaço onde a equipa publica atualização semanal e fecha critérios de avaliação. Use o caminho oficial:

${url}

## Progresso aqui vs registo válido para certificado

**Marcar como vista** aqui conta como disciplina cognitiva: ritmo na jornada, sensação Netflix de continuidade, mapa vivo. Porém obrigações de nota oficial, arquivo assinável e obrigações de curso ficam apenas na sala oficial até existir sincronização automática bilateral — estamos sendo transparentes porque confiança é parte premium.`;
}

function quizzesFor(courseName: string): readonly LessonQuizItem[] {
  return [
    q(
      `Para ${courseName}, onde você encontra o **dossier completo institucional** (vídeos longos, leituras oficiais, rubricas, provas, certificado) com validade técnico-pedagógica?`,
      0,
      "Na sala digital oficial THCProce — o espaço institucional de formação já operado pela escola",
      "Apenas nestas notas cinematográficas resumidas do campus",
      "Exclusivamente em ficheiros pessoais desligados da escola",
      "Substituído por automatismos externos sem revisão pedagógica humana"
    ),
    q(
      "Este campus substitui hoje todas as obrigações formais da escola oficial (certificação integral, arquivo assinável, provas obrigatórias só aqui dentro)?",
      3,
      "Sim — o campus duplica integralmente todos os artefactos formais sem exceção",
      "Sim — as provas com validade escolar ficam apenas nestas abas",
      "Sim — o certificado passa a ser emitido automaticamente só por progresso visual aqui",
      "Não — a escola oficial continua a ser o espaço válido até existir integração automatizada entre plataformas"
    ),
    q(
      "Quando o curso exige questionários obrigatórios / provas integradas, para onde esse fluxo continua sendo roteado hoje?",
      0,
      "Para a sala digital oficial onde a THCProce publicou a regra de avaliação",
      "Para o repositório deste guia do campus como substituto integral do processo de exame",
      "Para um canal informal sem rastreio pedagógico por parte da escola",
      "Para uma plataforma externa escolhida unilateralmente pelo aluno, sem coordenação THCProce"
    )
  ] as const;
}

function flattenModules(mods: readonly Cannabis101Module[]): Cannabis101LessonNode[] {
  const nodes: Cannabis101LessonNode[] = [];
  for (const mod of mods) {
    for (const leaf of mod.lessons) {
      nodes.push({
        stableId: leaf.id,
        moduleId: mod.id,
        sectionTitle: mod.title,
        activityLabel: leaf.activityLabel,
        displayTitle: `${mod.title} · ${leaf.activityLabel}`
      });
    }
  }
  return nodes;
}

export const CANNABIS101_LESSON_NODES: readonly Cannabis101LessonNode[] =
  flattenModules(CANNABIS101_MODULES);

function buildLesson(node: Cannabis101LessonNode): LessonStreamContent {
  const { sectionTitle, activityLabel } = node;
  const title = node.displayTitle;
  const url = cannabis101MoodleCourseUrl();
  const courseName = getCannabis101DisplayName();

  return {
    title,
    introduction: `Bem-vindo a mais um trecho vivo da formação **${courseName}** — menos contador técnico, mais **sessão estudada**, no ritmo de quem faz curso pensado como streaming + escola técnica.

Nestes minutos trabalhamos **«${activityLabel}»**, dentro da unidade narrativa **«${sectionTitle}»**. A sensação deve lembrar sala escura de masterclass bem iluminada: preâmbulo emocional, depois dossier institucional. Você fecha este painel já com perguntas de laboratório prontas, não só com marcação técnica vazia.`,
    body: bodyFor(sectionTitle, activityLabel, courseName),
    objectives: [
      `Enquadrar **«${activityLabel}»** dentro da urgência atual da unidade **«${sectionTitle}»** — que decisões profissionais ou de cultivo metódico exigiriam domínio vivo destes conceitos.`,
      `Produzir **três perguntas técnicas concretas** que você leva à sala oficial antes de clicar apenas “próximo” sem pensar.`,
      `Usar o campus como ritual de espaçamento cinematográfico: respirar método, só depois abrir dossier válido institucionalmente através do link oficial.`
    ],
    closingSummary: `Quando esta cena fecha, você não coleciona apenas “mais um recorte”: acumula **linha editorial** dentro de um curso que mistura storytelling premium + escola técnica séria sobre cannabis. Nos materiais há atalhos para sala oficial onde a profundidade vive sob validade institucional — esse é o ato dois da mesma história, não arquivo paralelo.`,
    quiz: quizzesFor(courseName),
    media: CANNABIS101_LESSON_MEDIA_HINTS,
    materials: [
      `${courseName} — retomada oficial da formação THCProce (deep dive + arquivo validado pela escola)`,
      url
    ],
    references: [url],
    professorNotes:
      "Orientação ao facilitador THCProce: trabalhe primeiro o 'por que agora?', depois deixe 4–7 minutos de trabalho autónomo para cruzarem leituras oficiais. Reforce sempre fronteira entre educação ampla institucional e recomendações clínicas caso-a-caso. Use este momento como mise-en-scène emocional — o campus é palco vivo, sala oficial mantém papel de backstage credencial."
  };
}

export const CANNABIS101_LESSONS: readonly LessonStreamContent[] = (() => {
  const total = CANNABIS101_LESSON_NODES.length;
  if (total !== CANNABIS101_EXPECTED_LESSON_TOTAL) {
    throw new Error(`Cannabis 101: esperado ${CANNABIS101_EXPECTED_LESSON_TOTAL} itens, tem ${total}`);
  }
  return CANNABIS101_LESSON_NODES.map((node) => buildLesson(node));
})();

export const CANNABIS101_OUTLINE_TITLES: readonly string[] = CANNABIS101_LESSONS.map((l) => l.title);

export function getCannabis101LessonStableId(lessonIndex: number): string | undefined {
  return CANNABIS101_LESSON_NODES[lessonIndex]?.stableId;
}
