import Link from "next/link";
import { notFound } from "next/navigation";

import { adminQuizEditPath, adminLessonEditPath } from "@/lib/admin/adminRevalidate";
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
  return { title: lesson ? `Quizzes — ${lesson.title}` : "Quizzes — Admin" };
}

export default async function AdminLessonQuizzesPage({ params }: Props) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: params.lessonId,
      moduleId: params.moduleId,
      module: { courseId: params.courseId },
    },
    include: {
      module: { select: { id: true, title: true, course: { select: { title: true } } } },
      quizzes: { orderBy: { title: "asc" }, select: { id: true, title: true, passingPercent: true } },
    },
  });
  if (!lesson) notFound();

  const base = `/admin/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Quizzes da aula</h1>
        <p className="mt-1 text-sm text-white/55">
          {lesson.module.course.title} → {lesson.module.title} → {lesson.title}
        </p>
      </div>

      <p>
        <Link
          href={`${base}/quizzes/new`}
          className="rounded-xl bg-canna-600 px-4 py-2 text-sm font-semibold text-white hover:bg-canna-500"
        >
          Novo quiz
        </Link>
      </p>

      {lesson.quizzes.length === 0 ? (
        <p className="text-sm text-white/50">Ainda não há quizzes nesta aula.</p>
      ) : (
        <ul className="space-y-2">
          {lesson.quizzes.map((q) => (
            <li key={q.id}>
              <Link
                href={adminQuizEditPath(params.courseId, params.moduleId, params.lessonId, q.id)}
                className="block rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/90 hover:border-white/20"
              >
                <span className="font-medium">{q.title}</span>
                <span className="mt-0.5 block font-mono text-[10px] text-white/40">{q.id}</span>
                <span className="mt-1 block text-xs text-white/45">
                  Aprovação:{" "}
                  {q.passingPercent == null ? "todas as respostas corretas" : `${q.passingPercent}%`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-white/40">
        <Link
          href={adminLessonEditPath(params.courseId, params.moduleId, params.lessonId)}
          className="text-canna-400/90 hover:underline"
        >
          ← Voltar à edição da aula
        </Link>
      </p>
    </div>
  );
}
