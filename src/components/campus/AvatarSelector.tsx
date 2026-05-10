"use client";

import { AvatarPreview } from "@/components/campus/AvatarPreview";
import { cn } from "@/lib/utils";
import {
  loadStudentProfile,
  saveStudentProfile,
  type StudentAvatarVariant
} from "@/lib/studentGamificationStorage";

const OPTIONS: { id: StudentAvatarVariant; label: string }[] = [
  { id: "visitor", label: "Visitante" },
  { id: "student", label: "Aluno" },
  { id: "cultivator", label: "Cultivador" },
  { id: "researcher", label: "Pesquisador" },
  { id: "chef", label: "Chef" }
];

type Props = {
  value: StudentAvatarVariant;
  /** Layout compacto para modal. */
  compact?: boolean;
};

export function AvatarSelector({ value, compact }: Props) {
  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div className="flex flex-wrap items-end gap-4">
        <AvatarPreview variant={value} size={compact ? "sm" : "md"} halo />
        <p className="max-w-[14rem] text-[11px] leading-relaxed text-white/50">
          Base do avatar no mapa. Futuro: combinar com roupas e acessórios do inventário (Prisma).
        </p>
      </div>
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-wide text-white/45",
          compact && "text-[10px]"
        )}
      >
        Escolher estilo
      </p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              const cur = loadStudentProfile();
              saveStudentProfile({
                avatarVariant: opt.id,
                equippedStoreSlots: {
                  ...cur.equippedStoreSlots,
                  avatarItemId: null
                }
              });
            }}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition",
              value === opt.id
                ? "border-canna-400/55 bg-canna-500/15 text-canna-50 shadow-[0_0_16px_rgba(52,211,153,0.12)]"
                : "border-white/12 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
