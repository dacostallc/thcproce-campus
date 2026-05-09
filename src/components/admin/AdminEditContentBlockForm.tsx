"use client";

import { useFormState, useFormStatus } from "react-dom";

import {
  updateContentBlockAction,
  type BlockActionState,
} from "@/actions/admin/contentBlock";

import { ADMIN_BLOCK_TYPES, type AdminBlockType } from "@/lib/admin/adminBlockTypes";

const initial: BlockActionState = { ok: true };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15 disabled:opacity-60"
    >
      {pending ? "…" : "Guardar bloco"}
    </button>
  );
}

export type SerializableBlock = {
  id: string;
  type: AdminBlockType;
  sortOrder: number;
  dataJson: string;
};

type Props = {
  courseId: string;
  moduleId: string;
  lessonId: string;
  block: SerializableBlock;
};

export function AdminEditContentBlockForm({ courseId, moduleId, lessonId, block }: Props) {
  const action = updateContentBlockAction.bind(null, courseId, moduleId, lessonId, block.id);
  const [state, formAction] = useFormState(action, initial);

  return (
    <form action={formAction} className="space-y-2 rounded-lg border border-white/10 bg-black/25 p-3">
      {state.ok === false && state.message ? (
        <p className="rounded border border-rose-500/35 bg-rose-950/35 px-2 py-1 text-xs text-rose-100">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label className="mb-0.5 block text-[10px] uppercase tracking-wider text-white/45">
            Tipo
          </label>
          <select
            name="type"
            defaultValue={block.type}
            className="rounded border border-white/15 bg-black/40 px-2 py-1.5 font-mono text-xs"
          >
            {ADMIN_BLOCK_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-0.5 block text-[10px] uppercase tracking-wider text-white/45">
            Ordem
          </label>
          <input
            name="sortOrder"
            type="number"
            required
            defaultValue={block.sortOrder}
            className="w-20 rounded border border-white/15 bg-black/40 px-2 py-1.5 font-mono text-xs"
          />
        </div>
        <SubmitButton />
      </div>
      {state.ok === false && state.fieldErrors?.sortOrder?.[0] ? (
        <p className="text-xs text-rose-300">{state.fieldErrors.sortOrder[0]}</p>
      ) : null}
      <textarea
        name="data"
        rows={6}
        defaultValue={block.dataJson}
        spellCheck={false}
        className="w-full rounded border border-white/15 bg-black/50 px-2 py-1.5 font-mono text-xs text-canna-50 outline-none focus:border-canna-400/40"
      />
    </form>
  );
}
