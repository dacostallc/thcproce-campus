"use client";

/**
 * Coluna central da experiência cinematográfica: título da sessão, vídeo, markdown, checkpoints.
 * Não inclui sidebar, HUD nem footer — compostos pelo pai.
 */

import type { ReactNode } from "react";
import type { LessonQuizItem } from "@/data/lessonContent/types";
import { LessonStaticMarkdown } from "@/components/campus/LessonStaticMarkdown";
import {
  StreamQuizQuestion,
  type LessonQuizAcademicContext
} from "@/components/campus/LessonRichTabs";

export type LessonContentFrameProps = {
  frameTitle: string;
  sessionKicker?: string;
  videoSlot?: ReactNode;
  markdown: string;
  markdownClassName?: string;
  quiz?: readonly LessonQuizItem[] | undefined;
  quizContext: LessonQuizAcademicContext | null;
  devSourceLabel?: ReactNode;
};

export function LessonContentFrame({
  frameTitle,
  sessionKicker = "Sessão de estudo",
  videoSlot,
  markdown,
  markdownClassName,
  quiz,
  quizContext,
  devSourceLabel
}: LessonContentFrameProps) {
  const quizList = quiz ?? [];

  const checkpointsBlock = quizList.length > 0 && (
    <div className="mt-8 border-t border-[rgba(255,255,255,0.1)] pt-6">
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
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
  );

  return (
    <>
      <header className="shrink-0 border-b border-[#b8860b]/10 bg-gradient-to-b from-[#0c0c0c] via-[#070707] to-[#050505] px-4 py-4 sm:px-7 sm:py-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#a08b5c]/88">
          {sessionKicker}
        </p>
        <h2 className="mt-2 text-pretty text-lg font-semibold leading-[1.25] tracking-tight text-[#f7f2e9] sm:text-xl">
          {frameTitle}
        </h2>
      </header>

      {videoSlot ? (
        <div className="min-h-0 shrink border-b border-[#b8860b]/8 bg-gradient-to-b from-black/60 to-[#050505] px-4 py-5 sm:px-7">
          <div className="lesson-cinema-video-stage mx-auto min-h-0 w-full max-w-4xl overflow-hidden rounded-xl ring-1 ring-[#8a7040]/28 shadow-[0_24px_70px_rgba(0,0,0,0.65),0_0_0_1px_rgba(0,0,0,0.4)]">
            <div className="aspect-video w-full min-h-0 max-h-[min(46vh,460px)] [&_iframe]:h-full [&_iframe]:min-h-[200px] [&_iframe]:w-full">
              {videoSlot}
            </div>
          </div>
          <p className="mx-auto mt-3 max-w-4xl text-center text-[10px] text-white/30">
            Transmissão da sala · recursos premium quando configurados no campus
          </p>
        </div>
      ) : null}

      <div className="lesson-cinema-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-4 sm:px-5">
        <div className="lesson-cinematic-floating-inner lesson-static-surface lesson-static-course-frame-dark mx-auto max-w-[44rem] rounded-2xl border border-white/[0.06] px-5 py-6 shadow-[0_16px_56px_rgba(0,0,0,0.42)] sm:px-9 sm:py-9">
          {devSourceLabel}
          <LessonStaticMarkdown markdown={markdown} className={markdownClassName} />
          {checkpointsBlock}
        </div>
      </div>
    </>
  );
}
