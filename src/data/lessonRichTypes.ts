import type { LessonMediaHints, LessonQuizItem } from "@/data/lessonContent/types";

export type { LessonMediaHints, LessonQuizItem } from "@/data/lessonContent/types";
import type { LessonPedagogyExtras } from "@/data/lessonPedagogy.types";

export type { LessonPedagogyExtras };

/**
 * Conteúdo renderizado na sala (abas + modo stream).
 * Campos base sempre presentes; extensões opcionais ativam blocos extra na UI.
 */
export type LessonRichContent = {
  intro: string;
  /** Resumo final / fecho da aula (equivalente a `closingSummary` no modelo canónico). */
  summary: string;
  objectives: string[];
  materials: string[];
  references: string[];
  professorNotes: string;
  /** Cor principal da aula (parágrafos; use `\\n\\n` para separar). */
  body?: string;
  quiz?: LessonQuizItem[];
  media?: LessonMediaHints;
  /** Título editorial explícito (opcional; o painel já usa o outline). */
  displayTitle?: string;
  /** Blocos estruturados opcionais (map-points / futuras migrações por curso). */
  pedagogy?: LessonPedagogyExtras;
};
