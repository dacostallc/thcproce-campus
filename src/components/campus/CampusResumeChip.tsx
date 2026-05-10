"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  areaByCampusId,
  CAMPUS_PROGRESS_UPDATED_EVENT,
  dismissCampusResumeBanner,
  hasCampusResumeContext,
  loadCampusProgress
} from "@/lib/campusProgressStorage";

type Props = {
  lessonPanelOpen: boolean;
  onContinue: () => void;
  /** Quando true, não usa posicionamento fixo — agrupa noutro contentor (HUD map-first). */
  embed?: boolean;
};

export function CampusResumeChip({ lessonPanelOpen, onContinue, embed = false }: Props) {
  const [mounted, setMounted] = useState(false);
  const [, bump] = useState(0);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const r = () => bump((x) => x + 1);
    if (typeof window === "undefined") return;
    window.addEventListener(CAMPUS_PROGRESS_UPDATED_EVENT, r);
    window.addEventListener("storage", r);
    return () => {
      window.removeEventListener(CAMPUS_PROGRESS_UPDATED_EVENT, r);
      window.removeEventListener("storage", r);
    };
  }, []);

  if (!mounted) return null;

  if (lessonPanelOpen) return null;

  const snap = loadCampusProgress();
  if (!hasCampusResumeContext(snap)) return null;

  const area = snap.lastAreaId ? areaByCampusId(snap.lastAreaId) : undefined;
  if (!area) return null;

  const pctCached = snap.lastAreaId ? snap.courseProgressPct[snap.lastAreaId]?.pct : undefined;

  const inner = (
    <div
      className={cn(
        "pointer-events-auto flex flex-wrap items-start gap-2 rounded-xl border border-white/[0.12] bg-black/[0.2] px-3 py-2 shadow-[0_8px_28px_rgba(0,0,0,0.2)] backdrop-blur-2xl ring-1 ring-inset ring-emerald-400/14",
        "max-sm:max-w-none"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-200/85">
          Continuar aula
        </p>
        <p className="mt-1 text-xs font-semibold leading-snug text-white [overflow-wrap:anywhere]">
          {area.name}
        </p>
        {typeof pctCached === "number" ? (
          <p className="mt-0.5 text-[10px] tabular-nums text-white/50">
            {pctCached}% local
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          size="sm"
          className="h-8 gap-1 px-2.5 text-[11px] font-bold"
          onClick={onContinue}
        >
          <Play className="size-3" aria-hidden />
          Continuar
        </Button>
        <button
          type="button"
          aria-label="Dispensar sugestão de retoma"
          onClick={() => dismissCampusResumeBanner()}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  );

  if (embed) return inner;

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[32] flex max-w-[min(340px,calc(100vw-3rem))] flex-col gap-2",
        "bottom-[calc(5rem+env(safe-area-inset-bottom))] right-3 max-sm:left-3 max-sm:max-w-none sm:bottom-28 sm:right-4"
      )}
      aria-live="polite"
    >
      {inner}
    </div>
  );
}
