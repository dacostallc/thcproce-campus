import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminQuizCreateForm } from "@/components/admin/quiz/AdminQuizCreateForm";
import { adminLessonQuizzesPath, adminLessonEditPath } from "@/lib/admin/adminRevalidate";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { courseId: string; moduleId: string; lessonId: string };
};

export async function generateMetadata({ params }: Props) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: params.lessonId,
      moduleId: params.moduleId,
      module: { courseId: params.courseId },
    },
    select: { title: true },
  });
  return { title: lesson ? `Novo quiz — ${lesson.title}` : "Novo quiz — Admin" };
}

export default async function AdminNewQuizPage({ params }: Props) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: params.lessonId,
      moduleId: params.moduleId,
      module: { courseId: params.courseId },
    },
    include: { module: { select: { title: true, course: { select: { title: true } } } } },
  });
  if (!lesson) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Criar quiz</h1>
        <p className="mt-1 text-sm text-white/55">
          {lesson.module.course.title} → {lesson.module.title} → {lesson.title}
        </p>
      </div>

      <AdminQuizCreateForm
        courseId={params.courseId}
        moduleId={params.moduleId}
        lessonId={params.lessonId}
      />

      <p className="text-xs text-white/40">
        <Link
          href={adminLessonQuizzesPath(params.courseId, params.moduleId, params.lessonId)}
          className="text-canna-400/90 hover:underline"
        >
          ← Lista de quizzes
        </Link>
        {" · "}
        <Link
          href={adminLessonEditPath(params.courseId, params.moduleId, params.lessonId)}
          className="text-canna-400/90 hover:underline"
        >
          Editar aula
        </Link>
      </p>
    </div>
  );
}
