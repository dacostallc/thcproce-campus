"use client";

import { useFormState, useFormStatus } from "react-dom";

import {
  createQuizAction,
  updateQuizAction,
  type QuizAdminState,
} from "@/actions/admin/quizAdmin";

const initial: QuizAdminState = { ok: true };

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-canna-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      {pending ? "A guardar…" : label}
    </button>
  );
}

type Props = { courseId: string; moduleId: string; lessonId: string };

export function AdminQuizCreateForm({ courseId, moduleId, lessonId }: Props) {
  const action = createQuizAction.bind(null, courseId, moduleId, lessonId);
  const [state, formAction] = useFormState(action, initial);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {state.ok === false && state.message ? (
        <p className="rounded border border-rose-500/40 bg-rose-950/40 px-2 py-1.5 text-sm text-rose-100">
          {state.message}
        </p>
      ) : null}
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Título</label>
        <input
          name="title"
          required
          className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
        {state.ok === false && state.fieldErrors?.title?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.title[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">
          % mínimo para aprovar (vazio = todas certas)
        </label>
        <input
          name="passingPercent"
          type="number"
          min={0}
          max={100}
          className="w-32 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
        {state.ok === false && state.fieldErrors?.passingPercent?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.passingPercent[0]}</p>
        ) : null}
      </div>
      <Submit label="Criar quiz" />
    </form>
  );
}

type MetaProps = Props & { quizId: string; title: string; passingPercent: number | null };

const initialMeta: QuizAdminState = { ok: false };

export function AdminQuizMetaForm({
  courseId,
  moduleId,
  lessonId,
  quizId,
  title,
  passingPercent,
}: MetaProps) {
  const action = updateQuizAction.bind(null, courseId, moduleId, lessonId, quizId);
  const [state, formAction] = useFormState(action, initialMeta);

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-xl border border-white/10 bg-black/25 p-4">
      {state.ok === false && state.message ? (
        <p className="text-sm text-rose-200">{state.message}</p>
      ) : null}
      {state.ok === true ? <p className="text-xs text-emerald-200/90">Metadados guardados.</p> : null}
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Título</label>
        <input
          name="title"
          required
          defaultValue={title}
          className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
        {state.ok === false && state.fieldErrors?.title?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.title[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">% aprovação (opcional)</label>
        <input
          name="passingPercent"
          type="number"
          min={0}
          max={100}
          defaultValue={passingPercent ?? ""}
          className="w-32 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
      </div>
      <Submit label="Guardar quiz" />
    </form>
  );
}
