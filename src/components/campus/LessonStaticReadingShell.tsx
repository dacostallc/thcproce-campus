"use client";

import type { ReactNode } from "react";
import type { AreaColor } from "@/data/courses";
import type { LessonQuizItem } from "@/data/lessonContent/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { LessonStaticMarkdown } from "@/components/campus/LessonStaticMarkdown";
import {
  StreamQuizQuestion,
  type LessonQuizAcademicContext
} from "@/components/campus/LessonRichTabs";
import type { LessonCinematicHudModel } from "@/components/campus/lesson-cinema/lessonCinematicTypes";
import { LessonFooterNav } from "@/components/campus/lesson-experience/LessonFooterNav";
import { LessonHud } from "@/components/campus/lesson-experience/LessonHud";
import { LessonSidebar } from "@/components/campus/lesson-experience/LessonSidebar";
import { LessonContentFrame } from "@/components/campus/lesson-experience/LessonContentFrame";

export type LessonStaticNavProps = {
  titles: readonly string[];
  currentIndex: number;
  onSelectLesson: (index: number) => void;
  doneIndices: ReadonlySet<number>;
};

type Props = {
  markdown: string;
  accent: AreaColor;
  quiz?: readonly LessonQuizItem[] | undefined;
  quizContext: LessonQuizAcademicContext | null;
  lessonOrdinal: { current: number; total: number };
  onPrevLesson: () => void;
  onNextLesson: () => void;
  prevLessonDisabled: boolean;
  nextLessonDisabled: boolean;
  onExitLesson: () => void;
  supplement?: ReactNode;
  isCannabis101Room: boolean;
  /** Título editorial da aula (H1); usado no cabeçalho da «janela do curso». */
  lessonFrameTitle?: string;
  /** Índice da aula (sidebar + mobile). Só Cannabis 101. */
  lessonNav?: LessonStaticNavProps;
  /** HUD direita + footer cinematográfico (opcional; recomendado com Cannabis 101). */
  cinematicHud?: LessonCinematicHudModel;
  /** Se fornecido, exibe o player de narração ElevenLabs logo abaixo do título. */
  audioId?: { courseId: string; lessonId: string };
};

/**
 * Moldura de leitura: Markdown + quiz + vídeo + navegação.
 * Cannabis 101: layout em duas colunas (índice + conteúdo), leitura no centro, tema escuro.
 */
export function LessonStaticReadingShell({
  markdown,
  accent,
  quiz,
  quizContext,
  lessonOrdinal,
  onPrevLesson,
  onNextLesson,
  prevLessonDisabled,
  nextLessonDisabled,
  onExitLesson,
  supplement,
  isCannabis101Room,
  lessonFrameTitle,
  lessonNav,
  cinematicHud,
  audioId,
}: Props) {
  const accentBorder =
    accent === "amber"
      ? "border-amber-500/25"
      : accent === "canna"
        ? "border-canna-500/20"
        : accent === "purple"
          ? "border-purple-500/20"
          : accent === "cyan"
            ? "border-cyan-500/20"
            : "border-rose-500/20";

  const quizList = quiz ?? [];
  const useCourseFrame = Boolean(isCannabis101Room && lessonNav && lessonNav.titles.length > 0);
  const frameTitle = (lessonFrameTitle ?? "").trim() || `Aula ${lessonOrdinal.current}`;

  const footerNav = (
    <div
      className={cn(
        "relative z-20 shrink-0 border-t border-white/10 bg-[#060908] px-3 py-3 sm:px-5",
        useCourseFrame && "bg-[#050806]"
      )}
    >
      <div className="mt-0 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="default"
          size="sm"
          disabled={prevLessonDisabled}
          onClick={onPrevLesson}
          className={cn(
            "border border-white/12 bg-[#0f1714] text-white hover:bg-[#141d1a]",
            isCannabis101Room && "border-amber-500/25 hover:border-amber-400/35"
          )}
        >
          <ChevronLeft className="mr-1 size-4" aria-hidden />
          Aula anterior
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onExitLesson}
          className="order-first font-semibold sm:order-none"
        >
          Sair da aula
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          disabled={nextLessonDisabled}
          onClick={onNextLesson}
          className={cn(
            "border border-white/12 bg-[#0f1714] text-white hover:bg-[#141d1a]",
            isCannabis101Room && "border-amber-500/25 hover:border-amber-400/35"
          )}
        >
          Próxima aula
          <ChevronRight className="ml-1 size-4" aria-hidden />
        </Button>
      </div>
      <p className="mt-3 text-center text-[11px] tabular-nums text-white/45">
        Aula {lessonOrdinal.current}/{lessonOrdinal.total || "—"}
      </p>
    </div>
  );

  if (useCourseFrame && lessonNav) {
    const { titles, currentIndex, onSelectLesson, doneIndices } = lessonNav;
    const hud = cinematicHud;
    const hudPanelProps = hud
      ? (() => {
          const { areaName: _a, lessonTitleForCrumb: _t, ...rest } = hud;
          return rest;
        })()
      : null;

    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#b8860b]/16 bg-[#060606]/94 shadow-[0_28px_90px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[4px]",
            accentBorder
          )}
        >
          <div className="flex min-h-0 flex-1 flex-row overflow-hidden">
            <LessonSidebar
              titles={titles}
              currentIndex={currentIndex}
              onSelectLesson={onSelectLesson}
              doneIndices={doneIndices}
              lessonOrdinal={lessonOrdinal}
            />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#050505]/35">
              <div className="shrink-0 border-b border-[#b8860b]/10 bg-[#050505]/95 px-3 py-2 lg:hidden">
                <label className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#a08b5c]/90">
                  <BookOpen className="size-3" aria-hidden />
                  Ir para aula
                </label>
                <select
                  className="w-full rounded-lg border border-[#3d3428]/90 bg-[#0c0c0c] px-3 py-2 text-sm text-[#f0ebe0] outline-none focus:ring-1 focus:ring-[#b8860b]/45"
                  value={currentIndex}
                  onChange={(e) => onSelectLesson(Number(e.target.value))}
                >
                  {titles.map((t, i) => (
                    <option key={i} value={i}>
                      {i + 1}. {t}
                    </option>
                  ))}
                </select>
              </div>

              {hud ? (
                <div className="lg:hidden">
                  <details className="group border-b border-[#b8860b]/10 bg-[#080808]/98">
                    <summary className="cursor-pointer list-none px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9a962]/85 marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-between gap-2">
                        Painel da sala
                      </span>
                    </summary>
                    <LessonHud variant="drawer" {...hudPanelProps!} />
                  </details>
                </div>
              ) : null}

              <LessonContentFrame
                frameTitle={frameTitle}
                markdown={markdown}
                markdownClassName="!max-w-none lesson-static-content--cinematic"
                quiz={quizList}
                quizContext={quizContext}
                audioId={audioId}
              />

              {hud ? (
                <LessonFooterNav
                  areaName={hud.areaName}
                  lessonTitle={hud.lessonTitleForCrumb}
                  lessonOrdinal={lessonOrdinal}
                  trailProgressPct={hud.trailProgressPct}
                  onPrevLesson={onPrevLesson}
                  onNextLesson={onNextLesson}
                  prevLessonDisabled={prevLessonDisabled}
                  nextLessonDisabled={nextLessonDisabled}
                  onExitLesson={onExitLesson}
                />
              ) : (
                footerNav
              )}
            </div>

            {hud && hudPanelProps ? <LessonHud variant="rail" {...hudPanelProps} /> : null}
          </div>
        </div>
      </div>
    );
  }

  /** Layout legado — outros cursos / sem navegação estruturada */
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-[#0a100e]/90 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-[2px]",
          accentBorder
        )}
      >
        <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto flex min-h-0 w-full max-w-[60rem] flex-1 flex-col overflow-hidden">
            <div
              className={cn(
                "lesson-static-surface min-h-0 flex-1 overflow-y-auto overscroll-y-contain rounded-xl px-4 py-5 scrollbar-thin sm:px-7 sm:py-7",
                "md:max-h-[min(58svh,560px)]"
              )}
            >
              <LessonStaticMarkdown markdown={markdown} />
              {quizList.length > 0 ? (
                <div className="mt-8 border-t border-[rgba(15,31,24,0.12)] pt-6">
                  <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#163529]/55">
                    Checkpoints rápidos
                  </p>
                  <div className="space-y-6">
                    {quizList.map((q, i) => (
                      <StreamQuizQuestion
                        key={`${i}-${q.question.slice(0, 24)}`}
                        q={q}
                        displayOrdinal={i + 1}
                        quizStorageIndex={i}
                        cinematicHints={false}
                        quizContext={quizContext}
                        classroomMode
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {supplement ? (
          <div className="relative z-0 shrink-0 border-t border-white/5 px-4 pb-2 pt-3 sm:px-8 sm:pb-3 sm:pt-4">
            <div className="pointer-events-auto max-h-[min(26vh,280px)] space-y-2 overflow-y-auto opacity-95 scrollbar-thin">
              {supplement}
            </div>
          </div>
        ) : null}

        {footerNav}
      </div>
    </div>
  );
}
