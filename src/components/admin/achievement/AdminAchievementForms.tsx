"use client";

import { useFormState, useFormStatus } from "react-dom";

import {
  createAchievementAction,
  updateAchievementAction,
  type AchievementAdminState,
} from "@/actions/admin/achievementAdmin";

const initial: AchievementAdminState = { ok: false };

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

export function AdminAchievementCreateForm() {
  const [state, formAction] = useFormState(createAchievementAction, initial);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {state.ok === false && state.message ? (
        <p className="rounded border border-rose-500/40 bg-rose-950/40 px-2 py-1.5 text-sm text-rose-100">
          {state.message}
        </p>
      ) : null}
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Código (único)</label>
        <input
          name="code"
          required
          placeholder="FIRST_QUIZ_PASSED"
          className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 font-mono text-sm"
        />
        {state.ok === false && state.fieldErrors?.code?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.code[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Título</label>
        <input name="title" required className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm" />
        {state.ok === false && state.fieldErrors?.title?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.title[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Descrição (opcional)</label>
        <textarea
          name="description"
          rows={3}
          className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">XP extra ao desbloquear</label>
        <input
          name="xpReward"
          type="number"
          min={0}
          defaultValue={0}
          className="w-32 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
        {state.ok === false && state.fieldErrors?.xpReward?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.xpReward[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">
          Créditos souvenir ao desbloquear (0 = nenhum)
        </label>
        <input
          name="souvenirCredits"
          type="number"
          min={0}
          defaultValue={0}
          className="w-32 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
        {state.ok === false && state.fieldErrors?.souvenirCredits?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.souvenirCredits[0]}</p>
        ) : null}
      </div>
      <Submit label="Criar achievement" />
    </form>
  );
}

const initialEdit: AchievementAdminState = { ok: false };

type EditProps = {
  achievementId: string;
  code: string;
  title: string;
  description: string | null;
  xpReward: number;
  souvenirCredits: number;
};

export function AdminAchievementEditForm({
  achievementId,
  code,
  title,
  description,
  xpReward,
  souvenirCredits,
}: EditProps) {
  const action = updateAchievementAction.bind(null, achievementId);
  const [state, formAction] = useFormState(action, initialEdit);

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-xl border border-white/10 bg-black/25 p-4">
      {state.ok === false && state.message ? (
        <p className="text-sm text-rose-200">{state.message}</p>
      ) : null}
      {state.ok === true ? <p className="text-xs text-emerald-200/90">Guardado.</p> : null}

      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Código</label>
        <input
          name="code"
          required
          defaultValue={code}
          className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 font-mono text-sm"
        />
        {state.ok === false && state.fieldErrors?.code?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.code[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Título</label>
        <input
          name="title"
          required
          defaultValue={title}
          className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Descrição</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={description ?? ""}
          className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">XP extra ao desbloquear</label>
        <input
          name="xpReward"
          type="number"
          min={0}
          defaultValue={xpReward}
          className="w-32 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Créditos souvenir ao desbloquear</label>
        <input
          name="souvenirCredits"
          type="number"
          min={0}
          defaultValue={souvenirCredits}
          className="w-32 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
      </div>
      <Submit label="Guardar" />
    </form>
  );
}
