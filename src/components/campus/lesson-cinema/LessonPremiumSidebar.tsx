"use client";

import { CheckCircle2, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type LessonPremiumSidebarProps = {
  titles: readonly string[];
  currentIndex: number;
  onSelectLesson: (index: number) => void;
  doneIndices: ReadonlySet<number>;
  lessonOrdinal: { current: number; total: number };
  className?: string;
};

/**
 * Índice de aulas — coluna esquerda estilo HUD / streaming premium.
 */
export function LessonPremiumSidebar({
  titles,
  currentIndex,
  onSelectLesson,
  doneIndices,
  lessonOrdinal,
  className
}: LessonPremiumSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden min-h-0 w-[13.5rem] shrink-0 flex-col border-r border-[#b8860b]/12 bg-[#080808]/98 lg:flex xl:w-[14.5rem]",
        className
      )}
    >
      <div className="flex shrink-0 items-start gap-2.5 border-b border-[#b8860b]/10 px-3 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#8a7040]/35 bg-[#0c0c0c] text-[#c9a962] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <PanelLeft className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a08b5c]/90">
            Trilha
          </p>
          <p className="text-[11px] tabular-nums text-white/40">
            {lessonOrdinal.current} / {lessonOrdinal.total || "—"}
          </p>
        </div>
      </div>
      <nav
        className="lesson-cinema-scroll flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-y-contain px-2.5 py-2.5"
        aria-label="Aulas do curso"
      >
        {titles.map((t, i) => {
          const active = i === currentIndex;
          const done = doneIndices.has(i);
          return (
            <button
              key={`${i}-${t.slice(0, 20)}`}
              type="button"
              onClick={() => onSelectLesson(i)}
              className={cn(
                "group flex w-full items-start gap-2 rounded-lg border border-transparent px-2 py-2 text-left transition-all duration-200",
                active
                  ? "border-[#9a7b2a]/45 bg-[#14120c] text-white shadow-[0_0_28px_-4px_rgba(201,169,98,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "text-white/62 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white/92"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded text-[9px] font-bold tabular-nums",
                  active
                    ? "bg-[#b8860b]/25 text-[#e8d5a3]"
                    : "bg-white/[0.06] text-white/38 group-hover:text-white/55"
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 text-[10px] leading-snug tracking-wide xl:text-[11px]">
                {t}
              </span>
              {done ? (
                <CheckCircle2
                  className="mt-0.5 size-3.5 shrink-0 text-emerald-400/85"
                  aria-label="Concluída"
                />
              ) : null}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
