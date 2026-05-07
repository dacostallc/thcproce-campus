import type { Area } from "@/data/courses";
import type { LessonStreamContent } from "./types";
import { CANNABIS101_LESSONS } from "./courses/cannabis101";
import { CULTIVO_GREENHOUSE_LESSONS } from "./courses/cultivo-greenhouse";
import { CULTIVO_OUTDOOR_LESSONS } from "./courses/cultivo-outdoor";
import { CULTIVO_INDOOR_LESSONS } from "./courses/cultivo-indoor";
import { SECAGEM_CURA_LESSONS } from "./courses/secagem-cura";
import { EXTRACOES_SOLVENTLESS_LESSONS } from "./courses/extracoes-solventless";
import { EXTRACAO_OLEO_LESSONS } from "./courses/extracao-oleo";
import { generateDeterministicLesson } from "./generateDeterministicLesson";

/**
 * Conteúdo manual por curso. Cursos sem entrada aqui ainda utilizam fallback editorial temporário em `generateDeterministicLesson.ts`.
 */
const MANUAL_BY_COURSE: Partial<Record<string, readonly LessonStreamContent[]>> = {
  "cannabis-101": CANNABIS101_LESSONS,
  "cultivo-greenhouse": CULTIVO_GREENHOUSE_LESSONS,
  "cultivo-outdoor": CULTIVO_OUTDOOR_LESSONS,
  "cultivo-indoor": CULTIVO_INDOOR_LESSONS,
  "secagem-cura": SECAGEM_CURA_LESSONS,
  "extracoes-solventless": EXTRACOES_SOLVENTLESS_LESSONS,
  "extracao-oleo": EXTRACAO_OLEO_LESSONS
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
