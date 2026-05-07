/**
 * Modelo editorial completo por aula — substitua textos aqui ou nos ficheiros por curso
 * (`courses/*.ts`) sem alterar o componente de interface.
 */

export type LessonQuizItem = {
  question: string;
  /** Quatro alternativas; `correctIndex` aponta para a correta. */
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

/** Indicação pedagógica: o que produzir/complementar depois em vídeo, arte ou PDF. */
export type LessonMediaHints = {
  /** Aula ganha com demonstração ou explainer em vídeo. */
  needsVideo: boolean;
  /** Figuras, fotos de bancada, planta, equipamento. */
  needsImage: boolean;
  /** Esquemas, fluxos ECS, legislação, processo. */
  needsInfographic: boolean;
  /** PDF, checklists, fichas — fora do texto base. */
  needsSupportMaterial: boolean;
};

/**
 * Conteúdo canónico de uma aula (alinhado ao outline em `courseOutlines.ts`).
 * Campos obrigatórios — evite strings vazias; use no mínimo 2–3 parágrafos em `body`.
 */
export type LessonStreamContent = {
  /** Deve coincidir com o título na posição correspondente do outline. */
  title: string;
  introduction: string;
  /** Parágrafos separados por linha dupla (`\\n\\n`). */
  body: string;
  objectives: readonly string[];
  /** Resumo fechamento — síntese do que o aluno leva. */
  closingSummary: string;
  /** 2 ou 3 perguntas objetivas, nível conferência. */
  quiz: readonly LessonQuizItem[];
  media: LessonMediaHints;
  materials: readonly string[];
  references: readonly string[];
  professorNotes: string;
};
