"use client";

import { useFormState, useFormStatus } from "react-dom";

import {
  createAvatarItemAction,
  updateAvatarItemAction,
  type AvatarItemAdminState,
} from "@/actions/admin/avatarItemAdmin";
import { AvatarItemType } from "@prisma/client";

const initial: AvatarItemAdminState = { ok: false };

const TYPE_OPTIONS: { value: AvatarItemType; label: string }[] = [
  { value: AvatarItemType.HAT, label: "HAT — Chapéu" },
  { value: AvatarItemType.BADGE, label: "BADGE — Insígnia" },
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

export function AdminAvatarItemCreateForm() {
  const [state, formAction] = useFormState(createAvatarItemAction, initial);

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
          placeholder="hat_exemplo"
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
          defaultValue={AvatarItemType.BADGE}
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
        <label className="mb-1 block text-xs font-semibold text-canna-300">Emoji / símbolo</label>
        <input
          name="displayGlyph"
          defaultValue="✨"
          maxLength={16}
          className="w-24 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-center text-2xl"
        />
        <p className="mt-1 text-[11px] text-white/40">Um emoji ou caracter curto (sem upload de imagens).</p>
        {state.ok === false && state.fieldErrors?.displayGlyph?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.displayGlyph[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">
          Código de achievement para desbloquear (opcional)
        </label>
        <input
          name="requiredAchievementCode"
          placeholder="XP_1000 — deixe vazio se não aplicar"
          className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 font-mono text-sm"
        />
        {state.ok === false && state.fieldErrors?.unlockAchievementCode?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.unlockAchievementCode[0]}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="isActive" id="item-is-active" defaultChecked className="h-4 w-4 rounded" />
        <label htmlFor="item-is-active" className="text-sm text-white/80">
          Item activo (visível no perfil quando desbloqueado)
        </label>
      </div>
      <Submit label="Criar item" />
    </form>
  );
}

const initialEdit: AvatarItemAdminState = { ok: false };

type EditProps = {
  avatarItemId: string;
  code: string;
  title: string;
  description: string | null;
  type: AvatarItemType;
  displayGlyph: string;
  unlockAchievementCode: string | null;
  active: boolean;
};

export function AdminAvatarItemEditForm({
  avatarItemId,
  code,
  title,
  description,
  type,
  displayGlyph,
  unlockAchievementCode,
  active,
}: EditProps) {
  const action = updateAvatarItemAction.bind(null, avatarItemId);
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
        <label className="mb-1 block text-xs font-semibold text-canna-300">Emoji / símbolo</label>
        <input
          name="displayGlyph"
          defaultValue={displayGlyph}
          maxLength={16}
          className="w-24 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-center text-2xl"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-canna-300">
          Código de achievement para desbloquear (opcional)
        </label>
        <input
          name="requiredAchievementCode"
          defaultValue={unlockAchievementCode ?? ""}
          placeholder="Vazio = sem desbloqueio automático"
          className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 font-mono text-sm"
        />
        {state.ok === false && state.fieldErrors?.unlockAchievementCode?.[0] ? (
          <p className="mt-1 text-xs text-rose-300">{state.fieldErrors.unlockAchievementCode[0]}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          id="item-edit-active"
          defaultChecked={active}
          className="h-4 w-4 rounded"
        />
        <label htmlFor="item-edit-active" className="text-sm text-white/80">
          Item activo
        </label>
      </div>
      <Submit label="Guardar" />
    </form>
  );
}
