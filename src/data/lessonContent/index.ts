import type { Area } from "@/data/courses";
import type { LessonStreamContent } from "./types";
import { CANNABIS101_LESSONS } from "./courses/cannabis101";
import { CULTIVO_GREENHOUSE_LESSONS } from "./courses/cultivo-greenhouse";
import { generateDeterministicLesson } from "./generateDeterministicLesson";

/**
 * Conteúdo manual por curso (prioridade) — acrescente chaves conforme ficheiros editoriais prontos.
 * Demais cursos: `generateDeterministicLesson` com bancos rotativos (substituível depois).
 */
const MANUAL_BY_COURSE: Partial<Record<string, readonly LessonStreamContent[]>> = {
  "cannabis-101": CANNABIS101_LESSONS,
  "cultivo-greenhouse": CULTIVO_GREENHOUSE_LESSONS
};

export type { LessonStreamContent, LessonQuizItem, LessonMediaHints } from "./types";
export { lessonStreamToRich } from "./adaptLessonContent";

export function getLessonStreamContent(area: Area, lessonIndex: number): LessonStreamContent {
  const manual = MANUAL_BY_COURSE[area.id]?.[lessonIndex];
  if (manual) return manual;
  const gen = generateDeterministicLesson(area, lessonIndex);
  if (gen) return gen;
  throw new Error(`Sem outline ou conteúdo para ${area.id} índice ${lessonIndex}`);
}
