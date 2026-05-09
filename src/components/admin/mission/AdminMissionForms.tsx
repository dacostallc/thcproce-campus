"use client";

import { useFormState, useFormStatus } from "react-dom";

import {
  createMissionAction,
  updateMissionAction,
  type MissionAdminState,
} from "@/actions/admin/missionAdmin";
import { MissionType } from "@prisma/client";

const initial: MissionAdminState = { ok: false };

const TYPE_OPTIONS: { value: MissionType; label: string }[] = [
  { value: MissionType.PASS_QUIZ, label: "PASS_QUIZ — Aprovar quiz" },
  { value: MissionType.COMPLETE_QUIZ, label: "COMPLETE_QUIZ — Completar quiz" },
  { value: MissionType.EARN_XP, label: "EARN_XP — Ganhar XP" },
  { value: MissionType.UNLOCK_ACHIEVEMENT, label: "UNLOCK_ACHIEVEMENT — Desbloquear conquista" },
];

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

export function AdminMissionCreateForm() {
  const [state, formAction] = useFormState(createMissionAction, initial);

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
          placeholder="mission_pass_first_quiz"
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
        <label className="mb-1 block text-xs font-semibold text-canna-300">Tipo</label>
        <select
          name="type"
          required
          defaultValue={MissionType.PASS_QUIZ}
          className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {state.ok === false && state.fieldErrors?.type?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.type[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Valor alvo</label>
        <input
          name="targetValue"
          type="number"
          min={1}
          defaultValue={1}
          className="w-32 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
        {state.ok === false && state.fieldErrors?.targetValue?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.targetValue[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Recompensa XP</label>
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
        <label className="mb-1 block text-xs font-semibold text-canna-300">Recompensa créditos souvenir</label>
        <input
          name="souvenirCreditsReward"
          type="number"
          min={0}
          defaultValue={0}
          className="w-32 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
        {state.ok === false && state.fieldErrors?.souvenirCreditsReward?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.souvenirCreditsReward[0]}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="isActive" id="mission-is-active" defaultChecked className="h-4 w-4 rounded" />
        <label htmlFor="mission-is-active" className="text-sm text-white/80">
          Missão activa (visível e sincronizada no perfil)
        </label>
      </div>
      <Submit label="Criar missão" />
    </form>
  );
}

const initialEdit: MissionAdminState = { ok: false };

type EditProps = {
  missionId: string;
  code: string;
  title: string;
  description: string | null;
  type: MissionType;
  targetValue: number;
  xpReward: number;
  souvenirCreditsReward: number;
  active: boolean;
};

export function AdminMissionEditForm({
  missionId,
  code,
  title,
  description,
  type,
  targetValue,
  xpReward,
  souvenirCreditsReward,
  active,
}: EditProps) {
  const action = updateMissionAction.bind(null, missionId);
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
        <label className="mb-1 block text-xs font-semibold text-canna-300">Tipo</label>
        <select
          name="type"
          required
          defaultValue={type}
          className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Valor alvo</label>
        <input
          name="targetValue"
          type="number"
          min={1}
          defaultValue={targetValue}
          className="w-32 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Recompensa XP</label>
        <input
          name="xpReward"
          type="number"
          min={0}
          defaultValue={xpReward}
          className="w-32 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">Recompensa créditos souvenir</label>
        <input
          name="souvenirCreditsReward"
          type="number"
          min={0}
          defaultValue={souvenirCreditsReward}
          className="w-32 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="isActive" id="mission-edit-active" defaultChecked={active} className="h-4 w-4 rounded" />
        <label htmlFor="mission-edit-active" className="text-sm text-white/80">
          Missão activa
        </label>
      </div>
      <Submit label="Guardar" />
    </form>
  );
}
