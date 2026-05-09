"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

import {
  createLessonAction,
  updateLessonAction,
  type LessonActionState,
} from "@/actions/admin/lesson";

import { adminModuleEditPath } from "@/lib/admin/adminRevalidate";

const initial: LessonActionState = { ok: true };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-canna-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-canna-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "A guardar…" : label}
    </button>
  );
}

type DefaultValues = {
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
};

type Props =
  | { mode: "create"; courseId: string; moduleId: string }
  | {
      mode: "edit";
      courseId: string;
      moduleId: string;
      lessonId: string;
      defaultValues: DefaultValues;
    };

export function AdminLessonForm(props: Props) {
  const action =
    props.mode === "edit"
      ? updateLessonAction.bind(null, props.courseId, props.moduleId, props.lessonId)
      : createLessonAction.bind(null, props.courseId, props.moduleId);

  const [state, formAction] = useFormState(action, initial);
  const d = props.mode === "edit" ? props.defaultValues : null;
  const cancelHref = adminModuleEditPath(props.courseId, props.moduleId);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      {state.ok === false && state.message ? (
        <p className="rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-sm text-rose-100">
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="title" className="mb-1.5 block text-xs font-semibold text-canna-300">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={d?.title ?? ""}
          className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-2.5 text-sm outline-none focus:border-canna-400/50"
        />
        {state.ok === false && state.fieldErrors?.title?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.title[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="slug" className="mb-1.5 block text-xs font-semibold text-canna-300">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          defaultValue={d?.slug ?? ""}
          className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-2.5 text-sm outline-none focus:border-canna-400/50"
        />
        {state.ok === false && state.fieldErrors?.slug?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.slug[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-6">
        <div>
          <label htmlFor="status" className="mb-1.5 block text-xs font-semibold text-canna-300">
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue={d?.status ?? "DRAFT"}
            className="rounded-xl border border-white/15 bg-black/35 px-4 py-2.5 text-sm outline-none focus:border-canna-400/50"
          >
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder" className="mb-1.5 block text-xs font-semibold text-canna-300">
            Ordem
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            required
            defaultValue={d?.sortOrder ?? 0}
            className="w-32 rounded-xl border border-white/15 bg-black/35 px-4 py-2.5 text-sm outline-none focus:border-canna-400/50"
          />
          {state.ok === false && state.fieldErrors?.sortOrder?.[0] ? (
            <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.sortOrder[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <SubmitButton label={props.mode === "create" ? "Criar aula" : "Guardar aula"} />
        <Link
          href={cancelHref}
          className="text-sm text-white/55 underline-offset-4 hover:text-canna-200 hover:underline"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
