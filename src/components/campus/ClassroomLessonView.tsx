"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AreaColor } from "@/data/courses";
import type { LessonRichContent } from "@/data/lessonRichTypes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  buildClassroomSlidesFromRichContent,
  type ClassroomSlide
} from "@/lib/classroomLessonSlides";
import {
  StreamQuizQuestion,
  type LessonQuizAcademicContext
} from "@/components/campus/LessonRichTabs";

type Props = {
  content: LessonRichContent;
  skipIntro?: boolean;
  accent: AreaColor;
  quizContext: LessonQuizAcademicContext | null;
  lessonQuizCinematic?: boolean;
  lessonOrdinal: { current: number; total: number };
  onPrevLesson: () => void;
  onNextLesson: () => void;
  prevLessonDisabled: boolean;
  nextLessonDisabled: boolean;
  onExitLesson: () => void;
  supplement?: ReactNode;
};

const slideMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }
};

export function ClassroomLessonView({
  content,
  skipIntro = false,
  accent,
  quizContext,
  lessonQuizCinematic = false,
  lessonOrdinal,
  onPrevLesson,
  onNextLesson,
  prevLessonDisabled,
  nextLessonDisabled,
  onExitLesson,
  supplement
}: Props) {
  const slides = useMemo(
    () => buildClassroomSlidesFromRichContent(content, { skipIntro }),
    [content, skipIntro]
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx((i) => {
      const last = Math.max(0, slides.length - 1);
      return Math.min(i, last);
    });
  }, [slides.length]);

  const safeIdx = slides.length ? Math.min(idx, slides.length - 1) : 0;
  const slide: ClassroomSlide | undefined = slides[safeIdx];
  const lastSlide = Math.max(0, slides.length - 1);

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

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-[#0a100e] shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
          accentBorder
        )}
      >
        <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-8 sm:py-6">
          <AnimatePresence mode="wait">
            {slide ? (
              <motion.div
                key={`${slide.id}-${safeIdx}`}
                initial={slideMotion.initial}
                animate={slideMotion.animate}
                exit={slideMotion.exit}
                transition={slideMotion.transition}
                className="pointer-events-none flex min-h-0 flex-1 flex-col"
              >
                <p className="pointer-events-auto shrink-0 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  {slide.title}
                </p>
                <div className="pointer-events-none mt-4 flex min-h-0 flex-1 flex-col justify-start">
                  <div className="mx-auto w-full max-w-[42rem] min-h-0 flex-1 overflow-y-auto scrollbar-thin pointer-events-auto">
                    {slide.kind === "text" ? (
                      <p className="whitespace-pre-line px-1 text-center text-[15px] leading-[1.75] text-white/[0.92] sm:text-[16px] sm:leading-[1.78] md:text-[17px] md:leading-[1.76]">
                        {slide.body}
                      </p>
                    ) : (
                      <div className="w-full text-left sm:px-1">
                        <StreamQuizQuestion
                          q={slide.question}
                          displayOrdinal={slide.questionIndex + 1}
                          quizStorageIndex={slide.questionIndex}
                          cinematicHints={lessonQuizCinematic}
                          quizContext={quizContext}
                          classroomMode
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="empty"
                initial={slideMotion.initial}
                animate={slideMotion.animate}
                exit={slideMotion.exit}
                transition={slideMotion.transition}
                className="pointer-events-auto mx-auto max-w-[42rem] px-2 text-center text-sm leading-relaxed text-white/55"
              >
                Não há texto disponível para esta aula neste ambiente. Use o Moodle ou aguarde a
                sincronização do conteúdo.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {supplement ? (
          <div className="relative z-0 shrink-0 border-t border-white/5 px-4 pb-2 pt-3 sm:px-8 sm:pb-3 sm:pt-4">
            <div className="max-h-[min(26vh,280px)] space-y-2 overflow-y-auto scrollbar-thin opacity-95 pointer-events-auto">
              {supplement}
            </div>
          </div>
        ) : null}

        <div className="relative z-20 shrink-0 border-t border-white/10 bg-[#0a100e] px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={safeIdx < 1}
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                className="border border-white/12 bg-[#0f1714] text-white hover:bg-[#141d1a]"
              >
                <ChevronLeft className="mr-1 size-4" aria-hidden />
                Voltar
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={safeIdx >= lastSlide}
                onClick={() => setIdx((i) => Math.min(lastSlide, i + 1))}
                className="border border-white/12 bg-[#0f1714] text-white hover:bg-[#141d1a]"
              >
                Avançar
                <ChevronRight className="ml-1 size-4" aria-hidden />
              </Button>
            </div>
            <p className="text-center text-[11px] tabular-nums text-white/45 sm:text-left">
              Passo {slides.length ? safeIdx + 1 : 0} de {slides.length || 0}
              <span className="mx-2 text-white/25">·</span>
              Aula {lessonOrdinal.current}/{lessonOrdinal.total || "—"}
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={prevLessonDisabled}
              onClick={() => {
                setIdx(0);
                onPrevLesson();
              }}
              className="border border-white/12 bg-[#0f1714] text-white hover:bg-[#141d1a]"
            >
              <ChevronLeft className="mr-1 size-4" aria-hidden />
              Aula anterior
            </Button>
            <Button type="button" variant="default" size="sm" onClick={onExitLesson} className="font-semibold">
              Sair da aula
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={nextLessonDisabled}
              onClick={() => {
                setIdx(0);
                onNextLesson();
              }}
              className="border border-white/12 bg-[#0f1714] text-white hover:bg-[#141d1a]"
            >
              Próxima aula
              <ChevronRight className="ml-1 size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
