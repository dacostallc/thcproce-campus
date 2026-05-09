"use client";

import { useFormState, useFormStatus } from "react-dom";

import {
  createQuestionAction,
  createOptionAction,
  type QuizAdminState,
} from "@/actions/admin/quizAdmin";

const initial: QuizAdminState = { ok: true };

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-canna-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
    >
      {pending ? "…" : label}
    </button>
  );
}

type Ctx = { courseId: string; moduleId: string; lessonId: string; quizId: string };

export function AdminNewQuestionForm({ courseId, moduleId, lessonId, quizId }: Ctx) {
  const action = createQuestionAction.bind(null, courseId, moduleId, lessonId, quizId);
  const [state, formAction] = useFormState(action, initial);

  return (
    <form action={formAction} className="mt-4 space-y-2 rounded-lg border border-dashed border-white/20 p-3">
      <p className="text-xs font-semibold text-white/70">Nova pergunta</p>
      {state.ok === false && state.message ? (
        <p className="text-xs text-rose-300">{state.message}</p>
      ) : null}
      <div>
        <label className="mb-0.5 block text-[10px] text-white/50">Enunciado</label>
        <textarea
          name="prompt"
          required
          rows={2}
          className="w-full rounded border border-white/15 bg-black/40 px-2 py-1 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <div>
          <label className="mb-0.5 block text-[10px] text-white/50">Tipo</label>
          <select name="type" className="rounded border border-white/15 bg-black/40 px-2 py-1 text-xs">
            <option value="SINGLE_CHOICE">SINGLE_CHOICE</option>
            <option value="TRUE_FALSE">TRUE_FALSE</option>
          </select>
        </div>
        <div>
          <label className="mb-0.5 block text-[10px] text-white/50">Ordem</label>
          <input
            name="sortOrder"
            type="number"
            required
            defaultValue={0}
            className="w-20 rounded border border-white/15 bg-black/40 px-2 py-1 text-xs"
          />
        </div>
      </div>
      <div>
        <label className="mb-0.5 block text-[10px] text-white/50">Explicação (pós-resultado)</label>
        <textarea
          name="explanation"
          rows={2}
          className="w-full rounded border border-white/15 bg-black/40 px-2 py-1 text-xs"
        />
      </div>
      <Submit label="Adicionar pergunta" />
    </form>
  );
}

type OptCtx = Ctx & { questionId: string };

export function AdminNewOptionForm({ courseId, moduleId, lessonId, quizId, questionId }: OptCtx) {
  const action = createOptionAction.bind(null, courseId, moduleId, lessonId, quizId, questionId);
  const [state, formAction] = useFormState(action, initial);

  return (
    <form action={formAction} className="mt-2 flex flex-wrap items-end gap-2 border-t border-white/10 pt-2">
      {state.ok === false && state.message ? <span className="text-[10px] text-rose-300">{state.message}</span> : null}
      <input
        name="label"
        placeholder="Texto da opção"
        required
        className="min-w-[8rem] flex-1 rounded border border-white/15 bg-black/40 px-2 py-1 text-xs"
      />
      <input
        name="sortOrder"
        type="number"
        required
        defaultValue={0}
        className="w-16 rounded border border-white/15 bg-black/40 px-2 py-1 text-xs"
      />
      <label className="flex items-center gap-1 text-[10px] text-white/60">
        <input type="checkbox" name="isCorrect" className="rounded" />
        Correta
      </label>
      <Submit label="+ opção" />
    </form>
  );
}
