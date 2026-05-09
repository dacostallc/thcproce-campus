import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminModuleForm } from "@/components/admin/AdminModuleForm";
import { prisma } from "@/lib/prisma";

type Props = { params: { courseId: string } };

export async function generateMetadata({ params }: Props) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    select: { title: true },
  });
  return { title: course ? `Novo módulo — ${course.title}` : "Novo módulo — Admin" };
}

export default async function AdminNewModulePage({ params }: Props) {
  const course = await prisma.course.findUnique({ where: { id: params.courseId } });
  if (!course) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Novo módulo</h1>
        <p className="mt-1 text-sm text-white/55">Curso: {course.title}</p>
      </div>
      <AdminModuleForm mode="create" courseId={course.id} />
      <p className="text-xs text-white/40">
        <Link href={`/admin/courses/${course.id}`} className="text-canna-400/90 hover:underline">
          ← Módulos do curso
        </Link>
      </p>
    </div>
  );
}
