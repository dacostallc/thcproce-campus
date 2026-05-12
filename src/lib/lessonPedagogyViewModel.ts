import type { LessonRichContent } from "@/data/lessonRichTypes";
import { deriveBriefingTriple, splitIntoBreathingLines } from "@/lib/pedagogyBreathingText";

export type LessonPedagogyProgressMeta = {
  lessonIndex: number;
  totalLessons: number;
  moduleTitle?: string | null;
  nextLessonTitle?: string | null;
};

export type LessonPedagogyViewModel = {
  humanOpening: string;
  objectiveLead: string;
  objectiveLines: string[];
  practicalExplanation: string;
  stepByStep: string[];
  realExample: string;
  commonMistakes: string;
  professionalObservation: string;
  operationalSummary: string;
  exercise: string;
  nextLessonBridge: string;
  xpReward: number;
  difficultyLabel: string;
  estimatedMinutes: number;
  categoryLabel: string;
  evolutionLabel: string;
  /** Bastidor já integrado na experiência — esconder cartão duplicado em baixo. */
  facilitatorNotesIntegrated: boolean;
  /** Topo cinematográfico — briefing, não artigo. */
  briefingImpact: string;
  briefingHumanContext: string;
  briefingDiscovery: string;
  openingContinuationChunks: string[];
  practicalChunks: string[];
  summaryChunks: string[];
  profObservationChunks: string[];
  mistakesChunks: string[];
  exampleChunks: string[];
  exerciseLines: string[];
};

function splitBodyParagraphs(body: string | undefined): string[] {
  if (!body?.trim()) return [];
  return body
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const DEFAULT_EXERCISE =
  "Ainda no painel: escreve uma decisão concreta para os próximos 7 dias — uma linha. No próximo login, verifica se cumpriste.";

/** Mistakes fallback quando não há texto dedicado — tom técnico, não moralismo. */
const MISTAKES_FALLBACK_HINT =
  "Erro típico na prática: saltar o preparo do ambiente (luz, água, substrato) e querer «resolver» só com nutriente. Fixo técnico: isola sempre uma variável — correção vem depois do diagnóstico.";

export function buildLessonPedagogyViewModel(
  content: LessonRichContent,
  meta: LessonPedagogyProgressMeta,
  opts?: { skipHumanOpening?: boolean }
): LessonPedagogyViewModel {
  const p = content.pedagogy;
  const paragraphs = splitBodyParagraphs(content.body);
  const n = paragraphs.length;

  const midStart = Math.max(1, Math.floor(n / 3));
  const midEnd = Math.max(midStart + 1, Math.ceil((n * 2) / 3));

  const fallbackExplanation =
    n >= 1 ? paragraphs.slice(0, Math.min(2, n)).join("\n\n") : content.intro.trim();
  const fallbackSteps = n > 2 ? paragraphs.slice(midStart, midEnd) : n === 2 ? [paragraphs[1]] : [];
  const fallbackExample = p?.realExample ?? (n > 1 ? paragraphs[n - 1] ?? "" : "");

  const humanOpening = opts?.skipHumanOpening ? "" : (p?.humanOpening ?? content.intro).trim();

  const introForBriefing = humanOpening || content.intro.trim();

  const objectiveLead =
    p?.practicalObjectiveLead?.trim() ||
    "Traduzir teoria em decisão de campo — rápido, limpo, aplicável.";

  const practicalExplanation =
    p?.practicalExplanation?.trim() || fallbackExplanation || content.intro.trim();

  const briefing = deriveBriefingTriple({
    intro: introForBriefing,
    practicalOpening: practicalExplanation
  });

  const openingContinuationChunks =
    humanOpening.trim().length > 0 ? splitIntoBreathingLines(humanOpening).slice(3) : [];

  const stepByStep =
    p?.stepByStep?.filter((s) => s.trim().length > 0) ??
    (fallbackSteps.length ? fallbackSteps : paragraphs.slice(1));

  const realExample = (p?.realExample ?? fallbackExample).trim();

  const commonMistakes =
    (p?.commonMistakes ?? "").trim() ||
    (content.professorNotes.trim().length > 40 ? "" : MISTAKES_FALLBACK_HINT);

  const professionalObservation = (p?.professionalObservation ?? content.professorNotes).trim();

  const operationalSummary = (p?.operationalSummary ?? content.summary).trim();

  const exercise = (p?.exercise ?? DEFAULT_EXERCISE).trim();

  const practicalChunks = splitIntoBreathingLines(practicalExplanation);
  const summaryChunks = splitIntoBreathingLines(operationalSummary || "");
  const profObservationChunks = splitIntoBreathingLines(professionalObservation);
  const mistakesChunks = splitIntoBreathingLines(commonMistakes);
  const exampleChunks = splitIntoBreathingLines(realExample);
  const exerciseLines = splitIntoBreathingLines(exercise, 190);

  const nextBridgeExplicit = (p?.nextLessonBridge ?? "").trim();
  const nextBridge =
    nextBridgeExplicit ||
    (meta.nextLessonTitle
      ? `Próxima missão na fila: «${meta.nextLessonTitle}». Fecha este painel com a sensação de dever cumprido — o campus mantém o teu lugar na jornada.`
      : meta.lessonIndex + 1 < meta.totalLessons
        ? "Segue para a próxima aula no painel — cada episódio fecha um ciclo técnico e abre outro. Ritmo de campo: uma decisão de cada vez."
        : "Última aula deste percurso imediato — revisita materiais, marca como concluída e volta ao mapa para explorar outras zonas.");

  const prog = p?.progression;
  const xpReward =
    prog?.xpReward ?? 48 + meta.lessonIndex * 14 + Math.min(meta.totalLessons, 24);
  const difficultyLabel =
    prog?.difficultyLabel ??
    (meta.lessonIndex < 6 ? "Calibragem" : meta.lessonIndex < 18 ? "Campo" : "Domínio");
  const estimatedMinutes =
    prog?.estimatedMinutes ?? 10 + (meta.lessonIndex % 9) * 2;
  const categoryLabel =
    prog?.category ?? meta.moduleTitle?.trim() ?? "THCProce Campus · formação aplicada";
  const evolutionLabel =
    prog?.evolutionStage ??
    `Missão ${meta.lessonIndex + 1}/${Math.max(1, meta.totalLessons)} · progressão editorial`;

  return {
    humanOpening,
    objectiveLead,
    objectiveLines: content.objectives.length
      ? content.objectives
      : ["Fechar um critério técnico aplicável a esta sessão."],
    practicalExplanation,
    stepByStep,
    realExample,
    commonMistakes,
    professionalObservation,
    operationalSummary,
    exercise,
    nextLessonBridge: nextBridge,
    xpReward,
    difficultyLabel,
    estimatedMinutes,
    categoryLabel,
    evolutionLabel,
    facilitatorNotesIntegrated: professionalObservation.length > 0,
    briefingImpact: briefing.impact,
    briefingHumanContext: briefing.humanContext,
    briefingDiscovery: briefing.discovery,
    openingContinuationChunks,
    practicalChunks,
    summaryChunks,
    profObservationChunks,
    mistakesChunks,
    exampleChunks,
    exerciseLines
  };
}
