import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteQuizAction } from "@/actions/admin/quizAdmin";
import { AdminQuizMetaForm } from "@/components/admin/quiz/AdminQuizCreateForm";
import { AdminQuestionCard } from "@/components/admin/quiz/AdminQuestionCard";
import { AdminNewQuestionForm } from "@/components/admin/quiz/AdminQuestionForms";
import { adminLessonQuizzesPath, adminLessonEditPath } from "@/lib/admin/adminRevalidate";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { courseId: string; moduleId: string; lessonId: string; quizId: string };
};

export async function generateMetadata({ params }: Props) {
  const quiz = await prisma.quiz.findFirst({
    where: {
      id: params.quizId,
      lessonId: params.lessonId,
      lesson: { moduleId: params.moduleId, module: { courseId: params.courseId } },
    },
    select: { title: true },
  });
  return { title: quiz ? `Editar — ${quiz.title}` : "Editar quiz — Admin" };
}

export default async function AdminEditQuizPage({ params }: Props) {
  const quiz = await prisma.quiz.findFirst({
    where: {
      id: params.quizId,
      lessonId: params.lessonId,
      lesson: { moduleId: params.moduleId, module: { courseId: params.courseId } },
    },
    include: {
      lesson: {
        include: { module: { select: { title: true, course: { select: { title: true } } } } },
      },
      questions: {
        orderBy: { sortOrder: "asc" },
        include: { options: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });
  if (!quiz) notFound();

  const { courseId, moduleId, lessonId, quizId } = params;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar quiz</h1>
        <p className="mt-1 text-sm text-white/55">
          {quiz.lesson.module.course.title} → {quiz.lesson.module.title} → {quiz.lesson.title}
        </p>
        <p className="mt-2 font-mono text-[10px] text-white/35">{quiz.id}</p>
      </div>

      <AdminQuizMetaForm
        courseId={courseId}
        moduleId={moduleId}
        lessonId={lessonId}
        quizId={quizId}
        title={quiz.title}
        passingPercent={quiz.passingPercent}
      />

      <section className="space-y-4 border-t border-white/10 pt-8">
        <h2 className="text-lg font-semibold text-white">Perguntas</h2>
        <div className="space-y-6">
          {quiz.questions.map((q) => (
            <AdminQuestionCard
              key={q.id}
              courseId={courseId}
              moduleId={moduleId}
              lessonId={lessonId}
              quizId={quizId}
              question={{
                id: q.id,
                prompt: q.prompt,
                type: q.type,
                sortOrder: q.sortOrder,
                explanation: q.explanation,
                options: q.options.map((o) => ({
                  id: o.id,
                  label: o.label,
                  sortOrder: o.sortOrder,
                  isCorrect: o.isCorrect,
                })),
              }}
            />
          ))}
        </div>
        <AdminNewQuestionForm
          courseId={courseId}
          moduleId={moduleId}
          lessonId={lessonId}
          quizId={quizId}
        />
      </section>

      <form action={deleteQuizAction.bind(null, courseId, moduleId, lessonId, quizId)}>
        <button
          type="submit"
          className="text-sm font-semibold text-rose-300/90 hover:text-rose-200 hover:underline"
        >
          Apagar quiz
        </button>
      </form>

      <p className="text-xs text-white/40">
        <Link href={adminLessonQuizzesPath(courseId, moduleId, lessonId)} className="text-canna-400/90 hover:underline">
          ← Lista de quizzes
        </Link>
        {" · "}
        <Link href={adminLessonEditPath(courseId, moduleId, lessonId)} className="text-canna-400/90 hover:underline">
          Editar aula
        </Link>
      </p>
    </div>
  );
}
