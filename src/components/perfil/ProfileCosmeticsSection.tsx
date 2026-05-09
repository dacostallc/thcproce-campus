"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import {
  setActiveAvatarCosmeticsAction,
  type ActiveCosmeticsState,
} from "@/actions/student/setActiveAvatarCosmetics";

export type CosmeticRow = {
  avatarItemId: string;
  code: string;
  name: string;
  type: "HAT" | "BADGE";
  displayGlyph: string;
  unlockedAt: string;
};

const initial: ActiveCosmeticsState = { ok: false };

function SubmitCosmeticsButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 rounded-xl bg-canna-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      {pending ? "A guardar…" : "Guardar chapéu e insígnia"}
    </button>
  );
}

type Props = {
  unlocked: CosmeticRow[];
  activeHatItemId: string | null;
  activeBadgeItemId: string | null;
};

export function ProfileCosmeticsSection({ unlocked, activeHatItemId, activeBadgeItemId }: Props) {
  const router = useRouter();
  const [state, formAction] = useFormState(setActiveAvatarCosmeticsAction, initial);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  const hats = unlocked.filter((u) => u.type === "HAT");
  const badges = unlocked.filter((u) => u.type === "BADGE");

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-white">Cosméticos</h2>
      <p className="mt-1 text-xs text-white/50">
        Desbloqueados automaticamente com conquistas — sem loja ou pagamento.
      </p>

      {unlocked.length === 0 ? (
        <p className="mt-3 text-sm text-white/55">
          Ainda não desbloqueou chapéus ou insígnias. Continue a completar quizzes e conquistas.
        </p>
      ) : (
        <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
          {unlocked.map((u) => (
            <li
              key={`${u.avatarItemId}`}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm"
            >
              <span className="text-2xl" aria-hidden>
                {u.displayGlyph}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-white/90">{u.name}</div>
                <div className="text-[10px] text-white/40">
                  {u.type === "HAT" ? "Chapéu" : "Insígnia"} ·{" "}
                  {new Date(u.unlockedAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="mt-6 space-y-3 border-t border-white/10 pt-4">
        <div>
          <label htmlFor="active-hat" className="mb-1 block text-xs text-white/55">
            Chapéu visível
          </label>
          <select
            id="active-hat"
            name="activeHatItemId"
            defaultValue={activeHatItemId ?? ""}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"
          >
            <option value="">Nenhum</option>
            {hats.map((h) => (
              <option key={h.avatarItemId} value={h.avatarItemId}>
                {h.displayGlyph} {h.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="active-badge" className="mb-1 block text-xs text-white/55">
            Insígnia visível
          </label>
          <select
            id="active-badge"
            name="activeBadgeItemId"
            defaultValue={activeBadgeItemId ?? ""}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"
          >
            <option value="">Nenhum</option>
            {badges.map((b) => (
              <option key={b.avatarItemId} value={b.avatarItemId}>
                {b.displayGlyph} {b.name}
              </option>
            ))}
          </select>
        </div>

        {state.ok === false && state.message ? (
          <p className="text-xs text-rose-300">{state.message}</p>
        ) : null}
        {state.ok === true ? <p className="text-xs text-emerald-300/90">Preferências guardadas.</p> : null}

        <SubmitCosmeticsButton />
      </form>
    </div>
  );
}
