import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Cursos — Admin THCProce",
};

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Cursos</h1>
          <p className="mt-1 text-sm text-white/55">
            Gerir cursos do campus (sem impacto no mapa público nesta fase).
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="rounded-xl bg-canna-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-canna-500"
        >
          Novo curso
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-black/30 px-6 py-10 text-center text-sm text-white/55">
          Ainda não há cursos. Crie o primeiro com o botão &quot;Novo curso&quot;.
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
                <th className="px-4 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {courses.map((c) => (
                <tr key={c.id} className="text-white/85">
                  <td className="px-4 py-3 tabular-nums text-white/60">{c.sortOrder}</td>
                  <td className="px-4 py-3 font-medium text-white">{c.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-canna-200/90">{c.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        c.status === "PUBLISHED"
                          ? "rounded-md border border-emerald-500/40 bg-emerald-950/40 px-2 py-0.5 text-emerald-200"
                          : "rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-white/55"
                      }
                    >
                      {c.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/admin/courses/${c.id}`}
                      className="font-semibold text-canna-200/90 hover:underline"
                    >
                      Módulos
                    </Link>
                    <Link
                      href={`/admin/courses/${c.id}/edit`}
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
        <Link href="/admin" className="text-canna-400/90 hover:underline">
          ← Painel admin
        </Link>
      </p>
    </div>
  );
}
