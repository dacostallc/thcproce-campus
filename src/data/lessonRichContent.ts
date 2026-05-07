import type { Area } from "@/data/courses";
import type { LessonRichContent } from "./lessonRichTypes";
import { getLessonStreamContent, lessonStreamToRich } from "@/data/lessonContent";

export type { LessonRichContent };

/**
 * Conteúdo textual por aula — modelo canónico em `lessonContent/` (manual + substituição fácil por curso).
 */
export function getLessonRichContent(
  area: Area,
  lessonIndex: number,
  _lessonTitle: string
): LessonRichContent {
  void _lessonTitle;
  const stream = getLessonStreamContent(area, lessonIndex);
  return lessonStreamToRich(stream);
}
