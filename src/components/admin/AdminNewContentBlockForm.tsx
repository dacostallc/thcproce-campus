"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  createContentBlockAction,
  type BlockActionState,
} from "@/actions/admin/contentBlock";
import { ADMIN_BLOCK_TYPES, type AdminBlockType } from "@/lib/admin/adminBlockTypes";

const initial: BlockActionState = { ok: true };

function jsonTemplateForType(t: AdminBlockType): string {
  switch (t) {
    case "HEADING":
      return JSON.stringify({ text: "Título", level: 2 }, null, 2);
    case "PARAGRAPH":
      return JSON.stringify({ text: "" }, null, 2);
    case "CALLOUT":
      return JSON.stringify({ text: "", variant: "info" }, null, 2);
    case "VIDEO_EMBED":
      return JSON.stringify({ url: "https://example.com" }, null, 2);
    case "IMAGE":
      return JSON.stringify({ url: "https://example.com", alt: "" }, null, 2);
    case "QUIZ_EMBED":
      return JSON.stringify({ quizId: "cole-o-id-do-quiz-criado-no-admin" }, null, 2);
    default:
      return "{}";
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-canna-600 px-4 py-2 text-sm font-semibold text-white hover:bg-canna-500 disabled:opacity-60"
    >
      {pending ? "A criar…" : "Adicionar bloco"}
    </button>
  );
}

type Props = {
  courseId: string;
  moduleId: string;
  lessonId: string;
  nextSortOrder: number;
};

export function AdminNewContentBlockForm({ courseId, moduleId, lessonId, nextSortOrder }: Props) {
  const [blockType, setBlockType] = useState<AdminBlockType>("PARAGRAPH");
  const dataDefault = useMemo(() => jsonTemplateForType(blockType), [blockType]);

  const action = createContentBlockAction.bind(null, courseId, moduleId, lessonId);
  const [state, formAction] = useFormState(action, initial);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-dashed border-canna-500/35 bg-canna-500/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-canna-300/90">
        Novo bloco
      </p>
      {state.ok === false && state.message ? (
        <p className="rounded border border-rose-500/40 bg-rose-950/40 px-2 py-1.5 text-xs text-rose-100">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <div>
          <label htmlFor="new-block-type" className="mb-1 block text-xs text-white/55">
            Tipo
          </label>
          <select
            id="new-block-type"
            name="type"
            value={blockType}
            onChange={(e) => setBlockType(e.target.value as AdminBlockType)}
            className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"
          >
            {ADMIN_BLOCK_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="new-block-order" className="mb-1 block text-xs text-white/55">
            Ordem
          </label>
          <input
            id="new-block-order"
            name="sortOrder"
            type="number"
            required
            defaultValue={nextSortOrder}
            className="w-24 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="new-block-data" className="mb-1 block text-xs text-white/55">
          Dados (JSON)
        </label>
        <textarea
          key={blockType}
          id="new-block-data"
          name="data"
          rows={8}
          defaultValue={dataDefault}
          spellCheck={false}
          className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 font-mono text-xs text-canna-50 outline-none focus:border-canna-400/50"
        />
      </div>

      {state.ok === false && state.fieldErrors?.sortOrder?.[0] ? (
        <p className="text-xs text-rose-300">{state.fieldErrors.sortOrder[0]}</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
