import { PublishStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const pub = PublishStatus.PUBLISHED;

/**
 * Quiz com perguntas e opções (incl. `isCorrect`) — só uso para servidor.
 * Devolve `null` se o quiz não existir ou a cadeia curso→módulo→aula não estiver publicada.
 */
export async function getPublishedQuizWithAnswers(quizId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      lesson: { include: { module: { include: { course: true } } } },
      questions: {
        orderBy: { sortOrder: "asc" },
        include: { options: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });
  if (!quiz) return null;
  const { lesson } = quiz;
  if (
    lesson.status !== pub ||
    lesson.module.status !== pub ||
    lesson.module.course.status !== pub
  ) {
    return null;
  }
  return quiz;
}
