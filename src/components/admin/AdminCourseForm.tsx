"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

import {
  createCourseAction,
  updateCourseAction,
  type CourseActionState,
} from "@/actions/admin/course";

const initial: CourseActionState = { ok: true };

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
  description: string | null;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
  thumbnailUrl: string | null;
};

type Props =
  | { mode: "create"; courseId?: undefined; defaultValues?: undefined }
  | { mode: "edit"; courseId: string; defaultValues: DefaultValues };

export function AdminCourseForm(props: Props) {
  const boundUpdate =
    props.mode === "edit"
      ? updateCourseAction.bind(null, props.courseId)
      : createCourseAction;

  const [state, formAction] = useFormState(boundUpdate, initial);

  const d = props.mode === "edit" ? props.defaultValues : null;

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
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          required
          defaultValue={d?.slug ?? ""}
          placeholder="ex.: cannabis-101"
          className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-2.5 text-sm outline-none focus:border-canna-400/50"
        />
        {state.ok === false && state.fieldErrors?.slug?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.slug[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-xs font-semibold text-canna-300">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={d?.description ?? ""}
          className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-2.5 text-sm outline-none focus:border-canna-400/50"
        />
        {state.ok === false && state.fieldErrors?.description?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.description[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="thumbnailUrl" className="mb-1.5 block text-xs font-semibold text-canna-300">
          URL da miniatura (opcional)
        </label>
        <input
          id="thumbnailUrl"
          name="thumbnailUrl"
          type="url"
          defaultValue={d?.thumbnailUrl ?? ""}
          placeholder="https://…"
          className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-2.5 text-sm outline-none focus:border-canna-400/50"
        />
        {state.ok === false && state.fieldErrors?.thumbnailUrl?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.thumbnailUrl[0]}</p>
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
          {state.ok === false && state.fieldErrors?.status?.[0] ? (
            <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.status[0]}</p>
          ) : null}
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
        <SubmitButton label={props.mode === "create" ? "Criar curso" : "Guardar alterações"} />
        <Link
          href="/admin/courses"
          className="text-sm text-white/55 underline-offset-4 hover:text-canna-200 hover:underline"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
