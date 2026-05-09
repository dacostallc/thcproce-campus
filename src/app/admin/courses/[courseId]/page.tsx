import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type Props = { params: { courseId: string } };

export async function generateMetadata({ params }: Props) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    select: { title: true },
  });
  return { title: course ? `${course.title} — Módulos — Admin` : "Curso — Admin" };
}

export default async function AdminCourseModulesPage({ params }: Props) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      modules: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
    },
  });
  if (!course) notFound();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{course.title}</h1>
          <p className="mt-1 text-sm text-white/55 font-mono">{course.slug}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/courses/${course.id}/edit`}
            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10"
          >
            Editar curso
          </Link>
          <Link
            href={`/admin/courses/${course.id}/modules/new`}
            className="rounded-xl bg-canna-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-canna-500"
          >
            Novo módulo
          </Link>
        </div>
      </div>

      {course.modules.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-black/30 px-6 py-10 text-center text-sm text-white/55">
          Sem módulos ainda. Use &quot;Novo módulo&quot;.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-lg">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-black/40 text-xs uppercase tracking-wider text-white/45">
              <tr>
                <th className="px-4 py-3 font-semibold">Ordem</th>
                <th className="px-4 py-3 font-semibold">Título</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {course.modules.map((m) => (
                <tr key={m.id} className="text-white/85">
                  <td className="px-4 py-3 tabular-nums text-white/60">{m.sortOrder}</td>
                  <td className="px-4 py-3 font-medium text-white">{m.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-canna-200/90">{m.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        m.status === "PUBLISHED"
                          ? "rounded-md border border-emerald-500/40 bg-emerald-950/40 px-2 py-0.5 text-emerald-200"
                          : "rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-white/55"
                      }
                    >
                      {m.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/courses/${course.id}/modules/${m.id}/edit`}
                      className="font-semibold text-canna-300 hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-white/40">
        <Link href="/admin/courses" className="text-canna-400/90 hover:underline">
          ← Lista de cursos
        </Link>
      </p>
    </div>
  );
}
