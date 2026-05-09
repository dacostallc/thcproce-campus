"use client";

import { useFormState, useFormStatus } from "react-dom";

import {
  deleteOptionAction,
  deleteQuestionAction,
  updateOptionAction,
  updateQuestionAction,
  type QuizAdminState,
} from "@/actions/admin/quizAdmin";
import { AdminNewOptionForm } from "@/components/admin/quiz/AdminQuestionForms";

const initial: QuizAdminState = { ok: false };

type Q = {
  id: string;
  prompt: string;
  type: string;
  sortOrder: number;
  explanation: string | null;
  options: { id: string; label: string; sortOrder: number; isCorrect: boolean }[];
};

type Props = {
  courseId: string;
  moduleId: string;
  lessonId: string;
  quizId: string;
  question: Q;
};

type OptCtx = {
  courseId: string;
  moduleId: string;
  lessonId: string;
  quizId: string;
  questionId: string;
};

function SmallSubmit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-white/10 px-2 py-1 text-[10px] font-semibold text-white disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}

function AdminOptionEditRow({
  courseId,
  moduleId,
  lessonId,
  quizId,
  questionId,
  option: o,
}: OptCtx & { option: Q["options"][number] }) {
  const action = updateOptionAction.bind(null, courseId, moduleId, lessonId, quizId, questionId, o.id);
  const [state, formAction] = useFormState(action, initial);

  return (
    <div className="rounded border border-white/10 bg-black/20 p-2">
      {state.ok === true ? <p className="text-[10px] text-emerald-200/80">Opção guardada.</p> : null}
      {state.ok === false && state.message ? (
        <p className="text-[10px] text-rose-300">{state.message}</p>
      ) : null}
      <form action={formAction} className="mt-1 flex flex-wrap items-end gap-2">
        <input
          name="label"
          defaultValue={o.label}
          required
          className="min-w-[6rem] flex-1 rounded border border-white/15 bg-black/40 px-2 py-1 text-xs"
        />
        <input
          name="sortOrder"
          type="number"
          required
          defaultValue={o.sortOrder}
          className="w-14 rounded border border-white/15 bg-black/40 px-2 py-1 text-xs"
        />
        <label className="flex items-center gap-1 text-[10px] text-white/60">
          <input type="checkbox" name="isCorrect" defaultChecked={o.isCorrect} className="rounded" />
          Correta
        </label>
        <SmallSubmit label="Guardar" />
      </form>
      <form
        action={deleteOptionAction.bind(null, courseId, moduleId, lessonId, quizId, questionId, o.id)}
        className="mt-1"
      >
        <button type="submit" className="text-[10px] text-rose-300/90 hover:underline">
          Remover opção
        </button>
      </form>
    </div>
  );
}

export function AdminQuestionCard({ courseId, moduleId, lessonId, quizId, question: q }: Props) {
  const action = updateQuestionAction.bind(null, courseId, moduleId, lessonId, quizId, q.id);
  const [state, formAction] = useFormState(action, initial);

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      {state.ok === true ? <p className="mb-2 text-xs text-emerald-200/90">Pergunta actualizada.</p> : null}
      {state.ok === false && state.message ? (
        <p className="mb-2 text-xs text-rose-300">{state.message}</p>
      ) : null}

      <form action={formAction} className="space-y-2">
        <div>
          <label className="text-[10px] text-white/45">Enunciado</label>
          <textarea
            name="prompt"
            required
            defaultValue={q.prompt}
            rows={2}
            className="mt-0.5 w-full rounded border border-white/15 bg-black/40 px-2 py-1 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div>
            <label className="text-[10px] text-white/45">Tipo</label>
            <select
              name="type"
              defaultValue={q.type}
              className="mt-0.5 block rounded border border-white/15 bg-black/40 px-2 py-1 text-xs"
            >
              <option value="SINGLE_CHOICE">SINGLE_CHOICE</option>
              <option value="TRUE_FALSE">TRUE_FALSE</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-white/45">Ordem</label>
            <input
              name="sortOrder"
              type="number"
              required
              defaultValue={q.sortOrder}
              className="mt-0.5 w-20 rounded border border-white/15 bg-black/40 px-2 py-1 text-xs"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-white/45">Explicação</label>
          <textarea
            name="explanation"
            rows={2}
            defaultValue={q.explanation ?? ""}
            className="mt-0.5 w-full rounded border border-white/15 bg-black/40 px-2 py-1 text-xs"
          />
        </div>
        <SmallSubmit label="Guardar pergunta" />
      </form>

      <div className="mt-3 border-t border-white/10 pt-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/45">Opções</p>
        <ul className="space-y-3">
          {q.options.map((o) => (
            <li key={o.id}>
              <AdminOptionEditRow
                courseId={courseId}
                moduleId={moduleId}
                lessonId={lessonId}
                quizId={quizId}
                questionId={q.id}
                option={o}
              />
            </li>
          ))}
        </ul>
        <AdminNewOptionForm
          courseId={courseId}
          moduleId={moduleId}
          lessonId={lessonId}
          quizId={quizId}
          questionId={q.id}
        />
      </div>

      <form
        action={deleteQuestionAction.bind(null, courseId, moduleId, lessonId, quizId, q.id)}
        className="mt-3"
      >
        <button type="submit" className="text-xs font-semibold text-rose-300 hover:underline">
          Remover pergunta
        </button>
      </form>
    </div>
  );
}
