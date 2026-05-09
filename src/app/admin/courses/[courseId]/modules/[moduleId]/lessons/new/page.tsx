import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminLessonForm } from "@/components/admin/AdminLessonForm";
import { prisma } from "@/lib/prisma";

type Props = { params: { courseId: string; moduleId: string } };

export async function generateMetadata({ params }: Props) {
  const mod = await prisma.module.findFirst({
    where: { id: params.moduleId, courseId: params.courseId },
    select: { title: true },
  });
  return { title: mod ? `Nova aula — ${mod.title}` : "Nova aula — Admin" };
}

export default async function AdminNewLessonPage({ params }: Props) {
  const mod = await prisma.module.findFirst({
    where: { id: params.moduleId, courseId: params.courseId },
    include: { course: { select: { title: true } } },
  });
  if (!mod) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Nova aula</h1>
        <p className="mt-1 text-sm text-white/55">
          {mod.course.title} → {mod.title}
        </p>
      </div>
      <AdminLessonForm mode="create" courseId={mod.courseId} moduleId={mod.id} />
      <p className="text-xs text-white/40">
        <Link
          href={`/admin/courses/${mod.courseId}/modules/${mod.id}/edit`}
          className="text-canna-400/90 hover:underline"
        >
          ← Voltar ao módulo
        </Link>
      </p>
    </div>
  );
}
