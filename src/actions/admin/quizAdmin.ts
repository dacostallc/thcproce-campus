"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  adminLessonQuizzesPath,
  adminQuizEditPath,
} from "@/lib/admin/adminRevalidate";
import {
  parseOptionForm,
  parseQuestionForm,
  parseQuizMetaForm,
} from "@/lib/admin/quizSchemas";
import { requireCampusAdmin } from "@/lib/admin/requireCampusAdmin";
import { prisma } from "@/lib/prisma";

import type { CourseActionState } from "@/actions/admin/course";

export type QuizAdminState = CourseActionState;

async function assertLesson(courseId: string, moduleId: string, lessonId: string) {
  return prisma.lesson.findFirst({
    where: { id: lessonId, moduleId, module: { courseId } },
  });
}

async function assertQuizInLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  quizId: string,
) {
  return prisma.quiz.findFirst({
    where: {
      id: quizId,
      lessonId,
      lesson: { id: lessonId, moduleId, module: { courseId } },
    },
  });
}

function revQuiz(courseId: string, moduleId: string, lessonId: string, quizId: string) {
  revalidatePath(adminLessonQuizzesPath(courseId, moduleId, lessonId));
  revalidatePath(adminQuizEditPath(courseId, moduleId, lessonId, quizId));
}

export async function createQuizAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  _prev: QuizAdminState,
  formData: FormData,
): Promise<QuizAdminState> {
  await requireCampusAdmin();
  if (!(await assertLesson(courseId, moduleId, lessonId))) {
    return { ok: false, message: "Aula não encontrada." };
  }
  const parsed = parseQuizMetaForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const q = await prisma.quiz.create({
    data: {
      lessonId,
      title: parsed.data.title,
      passingPercent: parsed.data.passingPercent,
    },
  });
  revQuiz(courseId, moduleId, lessonId, q.id);
  redirect(adminQuizEditPath(courseId, moduleId, lessonId, q.id));
}

export async function updateQuizAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  quizId: string,
  _prev: QuizAdminState,
  formData: FormData,
): Promise<QuizAdminState> {
  await requireCampusAdmin();
  if (!(await assertQuizInLesson(courseId, moduleId, lessonId, quizId))) {
    return { ok: false, message: "Quiz não encontrado." };
  }
  const parsed = parseQuizMetaForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  await prisma.quiz.update({
    where: { id: quizId },
    data: {
      title: parsed.data.title,
      passingPercent: parsed.data.passingPercent,
    },
  });
  revQuiz(courseId, moduleId, lessonId, quizId);
  return { ok: true };
}

export async function deleteQuizAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  quizId: string,
): Promise<void> {
  await requireCampusAdmin();
  if (!(await assertQuizInLesson(courseId, moduleId, lessonId, quizId))) {
    redirect(adminLessonQuizzesPath(courseId, moduleId, lessonId));
  }
  await prisma.quiz.delete({ where: { id: quizId } });
  revalidatePath(adminLessonQuizzesPath(courseId, moduleId, lessonId));
  redirect(adminLessonQuizzesPath(courseId, moduleId, lessonId));
}

export async function createQuestionAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  quizId: string,
  _prev: QuizAdminState,
  formData: FormData,
): Promise<QuizAdminState> {
  await requireCampusAdmin();
  if (!(await assertQuizInLesson(courseId, moduleId, lessonId, quizId))) {
    return { ok: false, message: "Quiz não encontrado." };
  }
  const parsed = parseQuestionForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  await prisma.question.create({
    data: {
      quizId,
      prompt: parsed.data.prompt,
      type: parsed.data.type,
      sortOrder: parsed.data.sortOrder,
      explanation: parsed.data.explanation,
    },
  });
  revQuiz(courseId, moduleId, lessonId, quizId);
  return { ok: true };
}

export async function updateQuestionAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  quizId: string,
  questionId: string,
  _prev: QuizAdminState,
  formData: FormData,
): Promise<QuizAdminState> {
  await requireCampusAdmin();
  if (!(await assertQuizInLesson(courseId, moduleId, lessonId, quizId))) {
    return { ok: false, message: "Quiz não encontrado." };
  }
  const exists = await prisma.question.findFirst({ where: { id: questionId, quizId } });
  if (!exists) return { ok: false, message: "Pergunta não encontrada." };
  const parsed = parseQuestionForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  await prisma.question.update({
    where: { id: questionId },
    data: {
      prompt: parsed.data.prompt,
      type: parsed.data.type,
      sortOrder: parsed.data.sortOrder,
      explanation: parsed.data.explanation,
    },
  });
  revQuiz(courseId, moduleId, lessonId, quizId);
  return { ok: true };
}

export async function deleteQuestionAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  quizId: string,
  questionId: string,
): Promise<void> {
  await requireCampusAdmin();
  if (!(await assertQuizInLesson(courseId, moduleId, lessonId, quizId))) {
    redirect(adminLessonQuizzesPath(courseId, moduleId, lessonId));
  }
  await prisma.question.deleteMany({ where: { id: questionId, quizId } });
  revQuiz(courseId, moduleId, lessonId, quizId);
  redirect(adminQuizEditPath(courseId, moduleId, lessonId, quizId));
}

export async function createOptionAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  quizId: string,
  questionId: string,
  _prev: QuizAdminState,
  formData: FormData,
): Promise<QuizAdminState> {
  await requireCampusAdmin();
  if (!(await assertQuizInLesson(courseId, moduleId, lessonId, quizId))) {
    return { ok: false, message: "Quiz não encontrado." };
  }
  const qn = await prisma.question.findFirst({ where: { id: questionId, quizId } });
  if (!qn) return { ok: false, message: "Pergunta não encontrada." };
  const parsed = parseOptionForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  await prisma.questionOption.create({
    data: {
      questionId,
      label: parsed.data.label,
      isCorrect: parsed.data.isCorrect,
      sortOrder: parsed.data.sortOrder,
    },
  });
  revQuiz(courseId, moduleId, lessonId, quizId);
  return { ok: true };
}

export async function updateOptionAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  quizId: string,
  questionId: string,
  optionId: string,
  _prev: QuizAdminState,
  formData: FormData,
): Promise<QuizAdminState> {
  await requireCampusAdmin();
  if (!(await assertQuizInLesson(courseId, moduleId, lessonId, quizId))) {
    return { ok: false, message: "Quiz não encontrado." };
  }
  const opt = await prisma.questionOption.findFirst({
    where: { id: optionId, questionId, question: { quizId } },
  });
  if (!opt) return { ok: false, message: "Opção não encontrada." };
  const parsed = parseOptionForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  await prisma.questionOption.update({
    where: { id: optionId },
    data: {
      label: parsed.data.label,
      isCorrect: parsed.data.isCorrect,
      sortOrder: parsed.data.sortOrder,
    },
  });
  revQuiz(courseId, moduleId, lessonId, quizId);
  return { ok: true };
}

export async function deleteOptionAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  quizId: string,
  questionId: string,
  optionId: string,
): Promise<void> {
  await requireCampusAdmin();
  if (!(await assertQuizInLesson(courseId, moduleId, lessonId, quizId))) {
    redirect(adminQuizEditPath(courseId, moduleId, lessonId, quizId));
  }
  await prisma.questionOption.deleteMany({
    where: { id: optionId, questionId },
  });
  revQuiz(courseId, moduleId, lessonId, quizId);
  redirect(adminQuizEditPath(courseId, moduleId, lessonId, quizId));
}
