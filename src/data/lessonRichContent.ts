import type { Area } from "@/data/courses";
import { getCannabis101LessonRichContent } from "@/data/cannabis101LessonRich";
import { getCampusCourseLessonRich } from "@/data/campusCourseRich";
import type { LessonRichContent } from "./lessonRichTypes";

export type { LessonRichContent } from "./lessonRichTypes";

/**
 * Conteúdo textual por aula — gerado a partir do curso + índice (sem Moodle).
 * Substitui ou enriquece quando houver integração com LMS.
 */
export function getLessonRichContent(
  area: Area,
  lessonIndex: number,
  lessonTitle: string
): LessonRichContent {
  if (area.id === "cannabis-101") {
    return getCannabis101LessonRichContent(lessonIndex, lessonTitle);
  }
  return getCampusCourseLessonRich(area, lessonIndex, lessonTitle);
}
