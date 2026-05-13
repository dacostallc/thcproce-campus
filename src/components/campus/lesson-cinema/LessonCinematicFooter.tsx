"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

export type LessonCinematicFooterProps = {
  areaName: string;
  lessonTitle: string;
  lessonOrdinal: { current: number; total: number };
  trailProgressPct: number;
  onPrevLesson: () => void;
  onNextLesson: () => void;
  prevLessonDisabled: boolean;
  nextLessonDisabled: boolean;
  onExitLesson: () => void;
  className?: string;
};

/**
 * Barra inferior fina — navegação, breadcrumb e estado de persistência local (sem nova lógica).
 */
export function LessonCinematicFooter({
  areaName,
  lessonTitle,
  lessonOrdinal,
  trailProgressPct,
  onPrevLesson,
  onNextLesson,
  prevLessonDisabled,
  nextLessonDisabled,
  onExitLesson,
  className
}: LessonCinematicFooterProps) {
  const tp = Math.min(100, Math.max(0, trailProgressPct));
  const crumb = [areaName, `Aula ${lessonOrdinal.current}`, lessonTitle].filter(Boolean);

  return (
    <footer
      className={cn(
        "shrink-0 border-t border-[#b8860b]/12 bg-[#050505]/98 px-3 py-2.5 sm:px-4",
        className
      )}
    >
      <div className="mx-auto flex max-w-[100rem] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-white/42">
          <span className="flex items-center gap-1 text-[#a08b5c]/90">
            <Home className="size-3 shrink-0 opacity-70" aria-hidden />
            <span className="sr-only">Localização:</span>
          </span>
          <span className="min-w-0 truncate">
            {crumb.map((c, i) => (
              <span key={i}>
                {i > 0 ? <span className="mx-1 text-white/25">/</span> : null}
                <span className={i === crumb.length - 1 ? "text-white/65" : ""}>{c}</span>
              </span>
            ))}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-stretch gap-2 sm:max-w-md sm:flex-none">
          <div className="flex h-1 overflow-hidden rounded-full bg-white/[0.06]" title={`Progresso na área ${tp}%`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#5c4818] via-[#b8860b] to-[#d9c4a1] transition-[width] duration-500"
              style={{ width: `${tp}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={prevLessonDisabled}
              onClick={onPrevLesson}
              className="h-9 shrink-0 border border-[#2a2418] bg-[#0c0c0c] px-3 text-xs text-[#e8d5a3]/95 hover:bg-[#141414] hover:text-[#f5ecd8]"
            >
              <ChevronLeft className="mr-1 size-4" aria-hidden />
              Anterior
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onExitLesson}
              className="h-9 border border-[#2a2418] bg-transparent text-[11px] text-white/55 hover:bg-white/[0.04] hover:text-white/80"
            >
              Sair
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={nextLessonDisabled}
              onClick={onNextLesson}
              className="h-9 shrink-0 border border-[#2a2418] bg-[#0c0c0c] px-3 text-xs text-[#e8d5a3]/95 hover:bg-[#141414] hover:text-[#f5ecd8]"
            >
              Próxima
              <ChevronRight className="ml-1 size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
