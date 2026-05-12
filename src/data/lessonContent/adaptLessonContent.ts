import type { LessonRichContent } from "@/data/lessonRichTypes";
import type { LessonStreamContent } from "./types";

/** Converte o modelo novo para o formato consumido por `LessonRichTabs` / legacy. */
export function lessonStreamToRich(lc: LessonStreamContent): LessonRichContent {
  return {
    intro: lc.introduction,
    summary: lc.closingSummary,
    objectives: [...lc.objectives],
    materials: [...lc.materials],
    references: [...lc.references],
    professorNotes: lc.professorNotes,
    body: lc.body,
    quiz: lc.quiz.map((q) => ({
      question: q.question,
      options: [...q.options] as [string, string, string, string],
      correctIndex: q.correctIndex
    })),
    media: { ...lc.media },
    displayTitle: lc.title,
    ...(lc.pedagogy ? { pedagogy: { ...lc.pedagogy } } : {})
  };
}
