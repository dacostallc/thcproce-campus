import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminModuleForm } from "@/components/admin/AdminModuleForm";
import { prisma } from "@/lib/prisma";

type Props = { params: { courseId: string; moduleId: string } };

export async function generateMetadata({ params }: Props) {
  const mod = await prisma.module.findFirst({
    where: { id: params.moduleId, courseId: params.courseId },
    select: { title: true },
  });
  return { title: mod ? `${mod.title} — Editar módulo` : "Módulo — Admin" };
}

export default async function AdminEditModulePage({ params }: Props) {
  const mod = await prisma.module.findFirst({
    where: { id: params.moduleId, courseId: params.courseId },
    include: {
      lessons: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
      course: { select: { id: true, title: true } },
    },
  });
  if (!mod) notFound();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar módulo</h1>
        <p className="mt-1 text-sm text-white/55">
          Curso: {mod.course.title} · {mod.title}
        </p>
      </div>

      <AdminModuleForm
        mode="edit"
        courseId={mod.courseId}
        moduleId={mod.id}
        defaultValues={{
          title: mod.title,
          slug: mod.slug,
          description: mod.description,
          status: mod.status,
          sortOrder: mod.sortOrder,
        }}
      />

      <section className="border-t border-white/10 pt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Aulas</h2>
          <Link
            href={`/admin/courses/${mod.courseId}/modules/${mod.id}/lessons/new`}
            className="rounded-lg bg-canna-600 px-3 py-2 text-sm font-semibold text-white hover:bg-canna-500"
          >
            Nova aula
          </Link>
        </div>

        {mod.lessons.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-6 text-sm text-white/50">
            Nenhuma aula neste módulo.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/25">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-black/40 text-xs uppercase tracking-wider text-white/45">
                <tr>
                  <th className="px-3 py-2 font-semibold">Ordem</th>
                  <th className="px-3 py-2 font-semibold">Título</th>
                  <th className="px-3 py-2 font-semibold">Slug</th>
                  <th className="px-3 py-2 font-semibold">Estado</th>
                  <th className="px-3 py-2 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {mod.lessons.map((l) => (
                  <tr key={l.id}>
                    <td className="px-3 py-2 text-white/60">{l.sortOrder}</td>
                    <td className="px-3 py-2 font-medium text-white">{l.title}</td>
                    <td className="px-3 py-2 font-mono text-xs text-canna-200/90">{l.slug}</td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          l.status === "PUBLISHED"
                            ? "text-emerald-200"
                            : "text-white/50"
                        }
                      >
                        {l.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Link
                        href={`/admin/courses/${mod.courseId}/modules/${mod.id}/lessons/${l.id}/edit`}
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
      </section>

      <p className="text-xs text-white/40">
        <Link href={`/admin/courses/${mod.courseId}`} className="text-canna-400/90 hover:underline">
          ← Módulos do curso
        </Link>
      </p>
    </div>
  );
}
