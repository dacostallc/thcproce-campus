import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteContentBlockAction } from "@/actions/admin/contentBlock";
import { AdminEditContentBlockForm } from "@/components/admin/AdminEditContentBlockForm";
import { AdminLessonForm } from "@/components/admin/AdminLessonForm";
import { AdminNewContentBlockForm } from "@/components/admin/AdminNewContentBlockForm";
import { ADMIN_BLOCK_TYPES, type AdminBlockType } from "@/lib/admin/adminBlockTypes";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { courseId: string; moduleId: string; lessonId: string };
};

function isAdminBlockType(t: string): t is AdminBlockType {
  return (ADMIN_BLOCK_TYPES as readonly string[]).includes(t);
}

export async function generateMetadata({ params }: Props) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: params.lessonId,
      moduleId: params.moduleId,
      module: { courseId: params.courseId },
    },
    select: { title: true },
  });
  return { title: lesson ? `${lesson.title} — Editar aula` : "Aula — Admin" };
}

export default async function AdminEditLessonPage({ params }: Props) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: params.lessonId,
      moduleId: params.moduleId,
      module: { courseId: params.courseId },
    },
    include: {
      blocks: { orderBy: { sortOrder: "asc" } },
      module: { select: { id: true, title: true, courseId: true, course: { select: { title: true } } } },
    },
  });
  if (!lesson) notFound();

  const maxOrder =
    lesson.blocks.length === 0
      ? 0
      : Math.max(...lesson.blocks.map((b) => b.sortOrder), -1);
  const nextSort = maxOrder + 1;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar aula</h1>
        <p className="mt-1 text-sm text-white/55">
          {lesson.module.course.title} → {lesson.module.title} → {lesson.title}
        </p>
      </div>

      <AdminLessonForm
        mode="edit"
        courseId={params.courseId}
        moduleId={params.moduleId}
        lessonId={lesson.id}
        defaultValues={{
          title: lesson.title,
          slug: lesson.slug,
          status: lesson.status,
          sortOrder: lesson.sortOrder,
        }}
      />

      <section className="border-t border-white/10 pt-8 space-y-4">
        <h2 className="text-lg font-semibold text-white">Blocos de conteúdo</h2>
        <p className="text-xs text-white/45">
          Ordene por número em &quot;Ordem&quot;. Tipos suportados: HEADING, PARAGRAPH, CALLOUT,
          VIDEO_EMBED, IMAGE, QUIZ_EMBED (<code className="font-mono">quizId</code>). Dados em JSON
          válido para o tipo escolhido.{" "}
          <Link
            href={`/admin/courses/${params.courseId}/modules/${params.moduleId}/lessons/${lesson.id}/quizzes`}
            className="text-canna-400/90 hover:underline"
          >
            Gerir quizzes desta aula
          </Link>
          .
        </p>

        <div className="space-y-4">
          {lesson.blocks.map((b) => {
            if (!isAdminBlockType(b.type)) {
              return (
                <div
                  key={b.id}
                  className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-xs text-amber-100/90"
                >
                  Bloco <code className="font-mono">{b.type}</code> — edição neste painel não está
                  disponível; altere no Prisma Studio ou numa fase futura.
                </div>
              );
            }
            return (
              <div key={b.id} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-white/35">{b.id}</span>
                  <form
                    action={deleteContentBlockAction.bind(
                      null,
                      params.courseId,
                      params.moduleId,
                      lesson.id,
                      b.id,
                    )}
                  >
                    <button
                      type="submit"
                      className="text-xs font-semibold text-rose-300/90 hover:text-rose-200 hover:underline"
                    >
                      Remover bloco
                    </button>
                  </form>
                </div>
                <AdminEditContentBlockForm
                  courseId={params.courseId}
                  moduleId={params.moduleId}
                  lessonId={lesson.id}
                  block={{
                    id: b.id,
                    type: b.type,
                    sortOrder: b.sortOrder,
                    dataJson: JSON.stringify(b.data, null, 2),
                  }}
                />
              </div>
            );
          })}
        </div>

        <AdminNewContentBlockForm
          courseId={params.courseId}
          moduleId={params.moduleId}
          lessonId={lesson.id}
          nextSortOrder={nextSort}
        />
      </section>

      <p className="text-xs text-white/40">
        <Link
          href={`/admin/courses/${params.courseId}/modules/${params.moduleId}/edit`}
          className="text-canna-400/90 hover:underline"
        >
          ← Voltar ao módulo
        </Link>
      </p>
    </div>
  );
}
