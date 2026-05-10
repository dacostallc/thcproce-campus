"use client";

import { memo } from "react";
import { AvatarPreview } from "@/components/campus/AvatarPreview";
import { cn } from "@/lib/utils";
import {
  levelFromXp,
  xpRequiredCumulativeForLevel,
  type StudentAvatarVariant,
  type StudentVisualCosmeticsV1
} from "@/lib/studentGamificationStorage";

function statusFromLevel(level: number): string {
  if (level >= 15) return "Mentor em campo";
  if (level >= 10) return "Pesquisador ativo";
  if (level >= 6) return "Explorador avançado";
  if (level >= 3) return "Aprendiz em evolução";
  return "Recém-chegado ao campus";
}

type Props = {
  displayName: string;
  studentTitle?: string | null;
  email: string | null;
  /** Conta autenticada vs só progresso local. */
  accountHint: "authenticated" | "guest";
  avatarVariant: StudentAvatarVariant;
  visualCosmetics?: StudentVisualCosmeticsV1;
  xp: number;
  credits: number;
  badgeCount: number;
  souvenirUnlockedCount: number;
  bonusInventoryCount: number;
  helpfulPoints?: number;
  communityRank?: number;
  mentorLevel?: number;
  compact?: boolean;
};

function StudentProfileCardInner({
  displayName,
  studentTitle,
  email,
  accountHint,
  avatarVariant,
  visualCosmetics,
  xp,
  credits,
  badgeCount,
  souvenirUnlockedCount,
  bonusInventoryCount,
  helpfulPoints = 0,
  communityRank = 0,
  mentorLevel = 0,
  compact
}: Props) {
  const level = levelFromXp(xp);
  const curFloor = xpRequiredCumulativeForLevel(level);
  const nextFloor = xpRequiredCumulativeForLevel(level + 1);
  const span = Math.max(1, nextFloor - curFloor);
  const pct = Math.min(100, Math.round(((xp - curFloor) / span) * 100));

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.07] via-canna-500/[0.04] to-transparent p-4 shadow-[0_0_40px_rgba(0,0,0,0.15)] backdrop-blur-md",
        compact && "rounded-xl p-3"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(52,211,153,0.14),transparent_55%)]" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
        <AvatarPreview
          variant={avatarVariant}
          size={compact ? "sm" : "lg"}
          halo
          visualCosmetics={visualCosmetics}
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-canna-400/25 bg-canna-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-canna-100/95">
              {statusFromLevel(level)}
            </span>
            <span className="text-[10px] text-white/40">
              {accountHint === "authenticated" ? "Conta ligada" : "Modo visitante"}
            </span>
          </div>
          <div>
            <h2 className={cn("truncate text-lg font-bold text-white", compact && "text-base")}>
              {displayName}
            </h2>
            {studentTitle ? (
              <p className="truncate text-[12px] font-semibold italic text-amber-200/88">{studentTitle}</p>
            ) : null}
            {email ? (
              <p className="truncate text-xs text-sky-200/80">{email}</p>
            ) : (
              <p className="text-xs text-white/40">Sem e-mail na sessão — nome local acima.</p>
            )}
            <p className="mt-2 text-[10px] leading-relaxed text-white/44">
              Pontos úteis na comunidade:{" "}
              <span className="font-semibold text-white/72">{helpfulPoints}</span> · Posição estimada{" "}
              <span className="font-semibold text-white/72">#{communityRank}</span> · Nível mentor{" "}
              <span className="font-semibold text-white/72">{mentorLevel}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-black/15 px-2 py-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-white/40">Nível</p>
              <p className="text-sm font-bold tabular-nums text-white">{level}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/15 px-2 py-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-white/40">XP</p>
              <p className="text-sm font-bold tabular-nums text-canna-100/95">{xp}</p>
            </div>
            <div className="rounded-lg border border-sky-400/20 bg-sky-500/10 px-2 py-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-sky-200/70">Créditos</p>
              <p className="text-sm font-bold tabular-nums text-sky-100">{credits}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/15 px-2 py-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-white/40">Coleção</p>
              <p className="text-[11px] font-semibold tabular-nums text-white/85">
                {souvenirUnlockedCount + bonusInventoryCount}{" "}
                <span className="text-white/45">itens</span>
              </p>
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[10px] text-white/45">
              <span>Progresso para nível {level + 1}</span>
              <span className="tabular-nums">{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/30 ring-1 ring-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-canna-400/90 to-emerald-300/80 shadow-[0_0_12px_rgba(52,211,153,0.35)]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <p className="text-[10px] text-white/35">
            Insígnias neste navegador: <span className="font-semibold text-white/55">{badgeCount}</span> ·
            Souvenirs de curso: <span className="font-semibold text-white/55">{souvenirUnlockedCount}</span> ·
            Itens extras: <span className="font-semibold text-white/55">{bonusInventoryCount}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export const StudentProfileCard = memo(StudentProfileCardInner);
