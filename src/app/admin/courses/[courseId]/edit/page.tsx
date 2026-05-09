import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminCourseForm } from "@/components/admin/AdminCourseForm";
import { prisma } from "@/lib/prisma";

type Props = { params: { courseId: string } };

export async function generateMetadata({ params }: Props) {
  const { courseId } = params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { title: true },
  });
  return {
    title: course ? `${course.title} — Editar — Admin` : "Editar curso — Admin",
  };
}

export default async function AdminEditCoursePage({ params }: Props) {
  const { courseId } = params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });
  if (!course) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar curso</h1>
        <p className="mt-1 text-sm text-white/55">{course.title}</p>
      </div>
      <AdminCourseForm
        mode="edit"
        courseId={course.id}
        defaultValues={{
          title: course.title,
          slug: course.slug,
          description: course.description,
          status: course.status,
          sortOrder: course.sortOrder,
          thumbnailUrl: course.thumbnailUrl,
        }}
      />
      <p className="text-xs text-white/40">
        <Link href="/admin/courses" className="text-canna-400/90 hover:underline">
          ← Lista de cursos
        </Link>
      </p>
    </div>
  );
}
