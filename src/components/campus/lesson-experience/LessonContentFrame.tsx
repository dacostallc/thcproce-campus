"use client";

/**
 * Coluna central da experiência cinematográfica: título da sessão, player de narração,
 * markdown e checkpoints. Não inclui sidebar, HUD nem footer — compostos pelo pai.
 */

import type { LessonQuizItem } from "@/data/lessonContent/types";
import { LessonStaticMarkdown } from "@/components/campus/LessonStaticMarkdown";
import { LessonAudioPlayer } from "@/components/campus/LessonAudioPlayer";
import { cn } from "@/lib/utils";
import {
  StreamQuizQuestion,
  type LessonQuizAcademicContext
} from "@/components/campus/LessonRichTabs";

export type LessonContentFrameProps = {
  frameTitle: string;
  sessionKicker?: string;
  markdown: string;
  markdownClassName?: string;
  quiz?: readonly LessonQuizItem[] | undefined;
  quizContext: LessonQuizAcademicContext | null;
  /** Identificadores para o player ElevenLabs. Omitir para não exibir. */
  audioId?: { courseId: string; lessonId: string };
};

export function LessonContentFrame({
  frameTitle,
  sessionKicker = "",
  markdown,
  markdownClassName,
  quiz,
  quizContext,
  audioId,
}: LessonContentFrameProps) {
  const quizList = quiz ?? [];

  const checkpointsBlock = quizList.length > 0 && (
    <div className="mt-8 border-t border-[rgba(255,255,255,0.1)] pt-6">
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
        {sessionKicker.trim() ? (
          <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#a08b5c]/88">
            {sessionKicker}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-pretty text-lg font-semibold leading-[1.25] tracking-tight text-[#f7f2e9] sm:text-xl",
            sessionKicker.trim() ? "mt-2" : "mt-0"
          )}
        >
          {frameTitle}
        </h2>
      </header>

      <div className="lesson-cinema-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-2 py-3 sm:px-3">
        <div className="lesson-cinematic-floating-inner lesson-static-surface lesson-static-course-frame-dark mx-auto w-full max-w-[62rem] rounded-2xl border border-white/[0.06] px-4 py-5 shadow-[0_16px_56px_rgba(0,0,0,0.42)] sm:px-7 sm:py-7">

          {/* Player de narração — imediatamente após o título, antes do conteúdo */}
          {audioId && (
            <div className="mb-5">
              <LessonAudioPlayer
                courseId={audioId.courseId}
                lessonId={audioId.lessonId}
                lessonTitle={frameTitle}
              />
            </div>
          )}

          <LessonStaticMarkdown markdown={markdown} className={markdownClassName} />
          {checkpointsBlock}
        </div>
      </div>
    </>
  );
}
