"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  updateProfileAvatarAction,
  type ProfileAvatarActionState,
} from "@/actions/student/updateProfileAvatar";
import {
  AVATAR_COLORS,
  AVATAR_COLOR_LABELS,
  AVATAR_TYPES,
  AVATAR_TYPE_LABELS,
  avatarColorStyles,
  parseAvatarColor,
  parseAvatarType,
  type AvatarColor,
  type AvatarType,
} from "@/lib/profile/avatarOptions";
import { CampusPlayerAvatar } from "@/components/campus/CampusPlayerAvatar";
import type { StudentAvatarVariant } from "@/lib/studentGamificationStorage";
import { AVATAR_TIERS, getAvatarByXp } from "@/lib/progression/avatars";
import { cn } from "@/lib/utils";

// Mapa avatarType → variante SVG do mapa
const TYPE_TO_VARIANT: Record<AvatarType, StudentAvatarVariant> = {
  menino:      "student",
  menina:      "student",
  cultivador:  "cultivator",
  pesquisador: "researcher",
};

const initialAction: ProfileAvatarActionState = { ok: false };

function SubmitAvatarButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-canna-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-canna-500 disabled:opacity-60"
    >
      {pending ? "Guardando…" : "Guardar avatar"}
    </button>
  );
}

type Props = {
  avatarType: string | null;
  avatarColor: string | null;
  hatGlyph?: string | null;
  badgeGlyph?: string | null;
  /** XP total para mostrar o avatar de tier */
  xpTotal?: number;
};

export function ProfileAvatarEditor({
  avatarType,
  avatarColor,
  hatGlyph = null,
  badgeGlyph = null,
  xpTotal = 0,
}: Props) {
  const router = useRouter();
  const [state, formAction] = useFormState(updateProfileAvatarAction, initialAction);

  const [selectedType, setSelectedType]   = useState<AvatarType>(parseAvatarType(avatarType) ?? "cultivador");
  const [selectedColor, setSelectedColor] = useState<AvatarColor>(parseAvatarColor(avatarColor) ?? "verde");

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  const { ring, bg } = avatarColorStyles(selectedColor);
  const mapVariant   = TYPE_TO_VARIANT[selectedType];

  // XP tier info
  const tierInfo   = getAvatarByXp(xpTotal);
  const nextTier   = tierInfo.next;
  const pct        = Math.round(tierInfo.progressToNext * 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-white">Avatar</h2>

      {/* ── Duas colunas: avatar do mapa + avatar XP ── */}
      <div className="mt-5 grid grid-cols-2 gap-4">

        {/* Avatar do mapa (SVG customizável) */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">No campus</p>
          <div
            className={cn(
              "relative flex h-28 w-24 flex-col items-center justify-center rounded-2xl ring-2",
              ring, bg,
            )}
          >
            {hatGlyph && (
              <span className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 text-2xl drop-shadow-md" aria-hidden>
                {hatGlyph}
              </span>
            )}
            <CampusPlayerAvatar variant={mapVariant} className="scale-[2.2] origin-center mt-4" />
            {badgeGlyph && (
              <span className="absolute bottom-1 right-1 z-10 text-xl drop-shadow-md" aria-hidden>
                {badgeGlyph}
              </span>
            )}
          </div>
          <p className="text-[11px] text-white/55">
            {AVATAR_TYPE_LABELS[selectedType]} · {AVATAR_COLOR_LABELS[selectedColor]}
          </p>
        </div>

        {/* Avatar XP (PNG — nível automático) */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Nível XP</p>
          <div className="relative flex h-28 w-24 items-center justify-center rounded-2xl border border-amber-400/20 bg-black/40">
            <Image
              src={tierInfo.imageSrc}
              alt={tierInfo.label}
              width={72}
              height={80}
              className="object-contain drop-shadow-lg"
            />
          </div>
          <p className="text-[11px] font-semibold text-amber-200/90">{tierInfo.label}</p>
          <p className="text-[10px] text-white/40">{xpTotal} XP</p>
        </div>
      </div>

      {/* Barra de progresso XP */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-[10px] text-white/45">
          <span>{tierInfo.label}</span>
          {nextTier && <span className="text-amber-300/80">{nextTier.label} em {tierInfo.xpRemainingToNext} XP</span>}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-canna-600 to-amber-400/90 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Thumbnails dos tiers */}
        <div className="mt-2 flex justify-between gap-1">
          {AVATAR_TIERS.map((t) => (
            <div
              key={t.key}
              className={cn(
                "flex flex-col items-center gap-0.5 flex-1",
                xpTotal >= t.minXp ? "opacity-100" : "opacity-25 grayscale",
              )}
              title={`${t.label} · ${t.minXp} XP`}
            >
              <Image src={t.imageSrc} alt={t.label} width={24} height={28} className="object-contain" />
              <span className={cn("text-[7px] text-center leading-tight", xpTotal >= t.minXp ? "text-amber-200/80" : "text-white/30")}>
                {t.minXp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Formulário de personalização ── */}
      {state.ok === false && state.message && (
        <p className="mt-3 text-xs text-rose-300">{state.message}</p>
      )}
      {state.ok === true && (
        <p className="mt-3 text-xs text-emerald-300/90">Avatar guardado.</p>
      )}

      <form action={formAction} className="mt-5 space-y-4">
        {/* Tipo — grid visual */}
        <div>
          <p className="mb-2 text-xs font-semibold text-white/55">Estilo do personagem</p>
          <div className="grid grid-cols-4 gap-2">
            {AVATAR_TYPES.map((t) => (
              <label
                key={t}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-1 rounded-xl border p-2 transition",
                  selectedType === t
                    ? "border-canna-400/60 bg-canna-500/15 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:bg-white/[0.07]",
                )}
              >
                <input
                  type="radio"
                  name="avatarType"
                  value={t}
                  checked={selectedType === t}
                  onChange={() => setSelectedType(t)}
                  className="sr-only"
                />
                <CampusPlayerAvatar variant={TYPE_TO_VARIANT[t]} className="scale-[1.1]" />
                <span className="text-[9px] font-semibold">{AVATAR_TYPE_LABELS[t]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cor — swatches */}
        <div>
          <p className="mb-2 text-xs font-semibold text-white/55">Cor do anel</p>
          <div className="flex gap-2">
            {AVATAR_COLORS.map((c) => {
              const { ring: cr, bg: cb } = avatarColorStyles(c);
              return (
                <label
                  key={c}
                  title={AVATAR_COLOR_LABELS[c]}
                  className={cn(
                    "h-8 w-8 cursor-pointer rounded-full ring-2 transition",
                    cr, cb,
                    selectedColor === c ? "scale-110 shadow-lg" : "opacity-50 hover:opacity-80",
                  )}
                >
                  <input
                    type="radio"
                    name="avatarColor"
                    value={c}
                    checked={selectedColor === c}
                    onChange={() => setSelectedColor(c)}
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>
        </div>

        <SubmitAvatarButton />
      </form>
    </div>
  );
}
