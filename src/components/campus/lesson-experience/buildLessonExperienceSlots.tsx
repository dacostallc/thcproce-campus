"use client";

/**
 * Adapter puro: mapeia variante → chrome + body da sala.
 * Sem dados remotos, sem XP, sem regras de progresso — só composição estrutural.
 */

import type { ReactNode } from "react";
import type { Area } from "@/data/courses";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  LessonExperienceAdapterKind,
  LessonExperienceSlots
} from "./lessonExperienceModel";

export type LessonChromeParams = {
  area: Area;
  headerBarClassName: string;
  trailProgressPct: number;
  doneCount: number;
  totalLessons: number;
  /** Exibir como «Aula N de …» (1-based). */
  lessonOrdinalOneBased: number;
  isCannabis101Room: boolean;
  displayLessonTitle: string;
  onClose: () => void;
};

/** Blocos já resolvidos no LessonPanel — ordem fixa, idêntica ao layout anterior. */
export type LessonBodyBlocks = {
  constructionNotice: ReactNode | null;
  srHeading: ReactNode;
  /** Inclui wrapper `shrink-0` (pode ser div vazio no modo cinematográfico). */
  markToolbarSlot: ReactNode | null;
  dbSyncLine: ReactNode | null;
  dbBlockRenderer: ReactNode | null;
  staticLoadingLine: ReactNode | null;
  staticReadingShell: ReactNode | null;
  classroomLessonView: ReactNode | null;
};

export function resolveLessonExperienceKind(
  underConstruction: boolean,
  isCannabis101Room: boolean,
  hasStaticLessonPayload: boolean
): LessonExperienceAdapterKind {
  if (underConstruction) return "under-construction";
  if (isCannabis101Room && hasStaticLessonPayload) return "cannabis101-cinematic";
  return "classic";
}

function buildLessonChromeHeader(p: LessonChromeParams): ReactNode {
  const {
    area,
    headerBarClassName,
    trailProgressPct,
    doneCount,
    totalLessons,
    lessonOrdinalOneBased,
    isCannabis101Room,
    displayLessonTitle,
    onClose
  } = p;

  return (
    <header
      className={cn(
        "shrink-0 border-b px-4 py-4 sm:px-6 sm:py-5 !bg-[#050806]/90",
        headerBarClassName
      )}
    >
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={trailProgressPct}
        aria-valuetext={`progresso nesta área ${trailProgressPct} por cento`}
        aria-label={`Progresso nesta área (${trailProgressPct} por cento, ${doneCount} de ${
          totalLessons || 0
        } aulas concluídas)`}
        className="mb-4 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.08]"
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out",
            isCannabis101Room
              ? "from-amber-600/95 to-amber-400/80"
              : "from-emerald-600/90 to-teal-400/75"
          )}
          style={{ width: `${trailProgressPct}%` }}
        />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">{area.name}</p>
          <p
            className={cn(
              "mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/38",
              isCannabis101Room && "tracking-[0.2em] text-amber-200/50"
            )}
          >
            Aula {lessonOrdinalOneBased} de {totalLessons || "—"}
          </p>
          {isCannabis101Room ? (
            <span id="lesson-panel-title" className="sr-only">
              {displayLessonTitle} — {area.name}
            </span>
          ) : (
            <h2
              id="lesson-panel-title"
              className={cn("mt-2 text-balance text-base font-semibold leading-snug text-white sm:text-lg")}
            >
              {displayLessonTitle}
            </h2>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-[#0a100e] text-white hover:bg-white/10"
          aria-label="Fechar aula e voltar ao campus"
        >
          <X size={20} />
        </button>
      </div>
    </header>
  );
}

function buildLessonExperienceBody(_kind: LessonExperienceAdapterKind, blocks: LessonBodyBlocks): ReactNode {
  return (
    <div
      data-lesson-scroll-root
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-5"
    >
      {blocks.constructionNotice}
      {blocks.srHeading}
      {blocks.markToolbarSlot}
      {blocks.dbSyncLine}
      {blocks.dbBlockRenderer}
      {blocks.staticLoadingLine}
      {blocks.staticReadingShell}
      {blocks.classroomLessonView}
    </div>
  );
}

export function buildLessonExperienceSlots(
  kind: LessonExperienceAdapterKind,
  chrome: LessonChromeParams,
  blocks: LessonBodyBlocks
): LessonExperienceSlots {
  return {
    kind,
    chromeHeader: buildLessonChromeHeader(chrome),
    body: buildLessonExperienceBody(kind, blocks)
  };
}
