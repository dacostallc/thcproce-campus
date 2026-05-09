"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import {
  updateProfileAvatarAction,
  type ProfileAvatarActionState,
} from "@/actions/student/updateProfileAvatar";
import {
  AVATAR_COLORS,
  AVATAR_COLOR_LABELS,
  AVATAR_TYPES,
  AVATAR_TYPE_EMOJI,
  AVATAR_TYPE_LABELS,
  avatarColorStyles,
  parseAvatarColor,
  parseAvatarType,
  type AvatarColor,
  type AvatarType,
} from "@/lib/profile/avatarOptions";

const initialAction: ProfileAvatarActionState = { ok: false };

function SubmitAvatarButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 rounded-xl bg-canna-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      {pending ? "A guardar…" : "Guardar avatar"}
    </button>
  );
}

type Props = {
  avatarType: string | null;
  avatarColor: string | null;
  hatGlyph?: string | null;
  badgeGlyph?: string | null;
};

export function ProfileAvatarEditor({
  avatarType,
  avatarColor,
  hatGlyph = null,
  badgeGlyph = null,
}: Props) {
  const router = useRouter();
  const [state, formAction] = useFormState(updateProfileAvatarAction, initialAction);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  const type = parseAvatarType(avatarType) ?? ("cultivador" as AvatarType);
  const color = parseAvatarColor(avatarColor) ?? ("verde" as AvatarColor);
  const { ring, bg } = avatarColorStyles(color);
  const emoji = AVATAR_TYPE_EMOJI[type];

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-white">Avatar</h2>
      <p className="mt-1 text-xs text-white/50">Ilustração simples por enquanto — sem upload nem loja.</p>

      <div className="relative mx-auto mt-4 h-36 w-36">
        {hatGlyph ? (
          <span
            className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 text-2xl leading-none drop-shadow-md"
            aria-hidden
          >
            {hatGlyph}
          </span>
        ) : null}
        <div
          className={`flex h-full w-full flex-col items-center justify-center rounded-2xl ring-2 ${ring} ${bg}`}
          aria-hidden
        >
          <span className="text-5xl leading-none">{emoji}</span>
          <span className="mt-2 text-center text-[11px] font-medium text-white/70">
            {AVATAR_TYPE_LABELS[type]} · {AVATAR_COLOR_LABELS[color]}
          </span>
        </div>
        {badgeGlyph ? (
          <span
            className="absolute bottom-1 right-1 z-10 text-xl leading-none drop-shadow-md"
            aria-hidden
          >
            {badgeGlyph}
          </span>
        ) : null}
      </div>

      {state.ok === false && state.message ? (
        <p className="mt-3 text-xs text-rose-300">{state.message}</p>
      ) : null}
      {state.ok === true ? (
        <p className="mt-3 text-xs text-emerald-300/90">Avatar guardado.</p>
      ) : null}

      <form action={formAction} className="mt-4 space-y-3">
        <div>
          <label htmlFor="avatar-type" className="mb-1 block text-xs text-white/55">
            Tipo
          </label>
          <select
            id="avatar-type"
            name="avatarType"
            defaultValue={type}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"
          >
            {AVATAR_TYPES.map((t) => (
              <option key={t} value={t}>
                {AVATAR_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="avatar-color" className="mb-1 block text-xs text-white/55">
            Cor
          </label>
          <select
            id="avatar-color"
            name="avatarColor"
            defaultValue={color}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"
          >
            {AVATAR_COLORS.map((c) => (
              <option key={c} value={c}>
                {AVATAR_COLOR_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <SubmitAvatarButton />
      </form>
    </div>
  );
}
