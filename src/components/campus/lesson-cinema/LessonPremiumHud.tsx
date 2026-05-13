"use client";

import { Button } from "@/components/ui/button";
import { ProgressionHudStrip } from "@/components/progression/ProgressionHudStrip";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock3, Sparkles, Target } from "lucide-react";
import { XP_REWARD_COMPLETE_LESSON } from "@/lib/progression/xp";
import type { LessonProgressionSnapshot } from "./lessonCinematicTypes";

export type LessonPremiumHudProps = {
  /** `rail` = coluna direita em desktop; `drawer` = painel em mobile. */
  variant?: "rail" | "drawer";
  className?: string;
  /** Conta ligada — mostra dados reais; senão mensagem de convidado. */
  isAuthenticated: boolean;
  progression: LessonProgressionSnapshot | null;
  /** Progresso do curso na área (aulas feitas / total). */
  trailProgressPct: number;
  doneInArea: number;
  totalLessons: number;
  /** Permanência nesta aula */
  dwellLiveMs: number;
  dwellRequiredMs: number;
  dwellPct: number;
  dwellRemainingLabel: string;
  alreadyComplete: boolean;
  completeBlocked: boolean;
  onMarkComplete: () => void;
  markCompletePending: boolean;
};

function formatStudyMs(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${mm}m`;
  }
  if (m <= 0) return `${r}s`;
  return `${m}:${String(r).padStart(2, "0")}`;
}

/**
 * HUD lateral direita — painel sci-fi discreto (progressão, tempo, conclusão).
 */
export function LessonPremiumHud({
  variant = "rail",
  className,
  isAuthenticated,
  progression,
  trailProgressPct,
  doneInArea,
  totalLessons,
  dwellLiveMs,
  dwellRequiredMs: _dwellRequiredMs,
  dwellPct,
  dwellRemainingLabel,
  alreadyComplete,
  completeBlocked,
  onMarkComplete,
  markCompletePending
}: LessonPremiumHudProps) {
  const trailPct = Math.min(100, Math.max(0, trailProgressPct));
  const dwellBar = Math.min(100, Math.max(0, dwellPct));

  return (
    <aside
      className={cn(
        variant === "drawer"
          ? "flex max-h-[min(58vh,480px)] w-full shrink-0 flex-col border-t border-[#b8860b]/12 bg-[#060606]/98 lg:hidden"
          : "hidden min-h-0 w-[17rem] shrink-0 flex-col border-l border-[#b8860b]/12 bg-[#060606]/98 xl:w-[18rem] 2xl:w-[19rem] lg:flex",
        className
      )}
    >
      <div className="shrink-0 border-b border-[#b8860b]/10 px-3 py-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a08b5c]/90">
          Painel da sala
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain px-3 py-3 lesson-cinema-scroll">
        {/* Curso */}
        <div className="rounded-xl border border-[#2a2418]/80 bg-[#0a0a0a]/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#c9a962]/85">
            <Target className="size-3.5" aria-hidden />
            Curso · área
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6b5420] via-[#b8860b] to-[#d4af6a] transition-[width] duration-500"
              style={{ width: `${trailPct}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] tabular-nums text-white/58">
            {doneInArea}/{totalLessons || "—"} aulas · {trailPct}%
          </p>
        </div>

        {/* Tempo na aula */}
        <div className="rounded-xl border border-[#2a2418]/80 bg-[#0a0a0a]/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#c9a962]/85">
            <Clock3 className="size-3.5" aria-hidden />
            Tempo nesta aula
          </div>
          <p className="mt-2 text-lg font-semibold tabular-nums tracking-tight text-white/92">
            {formatStudyMs(dwellLiveMs)}
          </p>
          {!alreadyComplete ? (
            <>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-800 to-emerald-500/90 transition-[width] duration-300"
                  style={{ width: `${dwellBar}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] leading-snug text-white/48">{dwellRemainingLabel}</p>
            </>
          ) : null}
        </div>

        {/* Progressão conta */}
        <div className="rounded-xl border border-[#2a2418]/80 bg-[#0a0a0a]/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#c9a962]/85">
            <Sparkles className="size-3.5" aria-hidden />
            Progressão
          </div>
          {isAuthenticated && progression ? (
            <div className="mt-2">
              <ProgressionHudStrip
                compact
                className="!flex-col !items-stretch !gap-2"
                xp={progression.xp}
                levelLabel={progression.levelLabel}
                souvenirCredits={progression.souvenirCredits}
                progressPercent={progression.progressPercent}
                nextTierLabel={progression.nextTierLabel}
                nextTierMinXp={progression.nextTierMinXp}
              />
            </div>
          ) : null}
        </div>

        {/* Concluir — mesma ação que o toolbar anterior */}
        <div className="rounded-xl border border-[#9a7b2a]/25 bg-gradient-to-b from-[#14110a]/95 to-[#0c0c0c] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
          <Button
            type="button"
            size="sm"
            disabled={alreadyComplete || markCompletePending || completeBlocked}
            onClick={onMarkComplete}
            className={cn(
              "h-10 w-full font-bold tracking-wide",
              "border border-[#b8860b]/35 bg-[#1a150c] text-[#f5e6c8] hover:bg-[#221a0e]",
              !alreadyComplete && !completeBlocked && "shadow-[0_0_24px_-6px_rgba(184,134,11,0.45)]"
            )}
            title={
              alreadyComplete
                ? "Esta aula já está concluída no teu progresso."
                : completeBlocked
                  ? `Permanência mínima antes de concluir (${dwellRemainingLabel}).`
                  : `Concluir e registar +${XP_REWARD_COMPLETE_LESSON} XP de base na primeira marcação com conta.`
            }
          >
            {alreadyComplete ? (
              <>
                <CheckCircle2 className="mr-2 size-4 shrink-0" aria-hidden />
                Concluída
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 size-4 shrink-0" aria-hidden />
                Concluir aula
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
