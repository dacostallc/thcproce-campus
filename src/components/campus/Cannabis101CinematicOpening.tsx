"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CANNABIS101_OPENING_COPY,
  getCannabis101OpeningPosterSrc,
  getCannabis101OpeningVideoSrc
} from "@/content/courses/cannabis-101/media";
import { OpeningHeroVideo } from "@/components/campus/opening/OpeningHeroVideo";

type Props = {
  /** Chamado após o fade de saída — persistir sessão no pai. */
  onEnterLesson: () => void;
  scrollTargetId?: string;
  className?: string;
};

/**
 * Abertura cinematográfica «Cannabis Sem Mito» — Cannabis 101 (tom documental / educacional premium).
 */
export function Cannabis101CinematicOpening({
  onEnterLesson,
  scrollTargetId = "c101-after-cinematic",
  className
}: Props) {
  const [present, setPresent] = useState(true);

  const videoSrc = getCannabis101OpeningVideoSrc();
  const posterSrc = getCannabis101OpeningPosterSrc();

  const handleEnter = useCallback(() => {
    if (!present) return;
    setPresent(false);
  }, [present]);

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        onEnterLesson();
        queueMicrotask(() => {
          document.getElementById(scrollTargetId)?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        });
      }}
    >
      {present ? (
        <motion.section
          key="c101-opening"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "overflow-hidden rounded-2xl border border-white/[0.09] bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-emerald-500/10",
            className
          )}
          aria-label="Abertura cinematográfica do Cannabis 101"
        >
          <div className="relative aspect-[21/9] min-h-[min(52vh,420px)] w-full max-md:aspect-video max-md:min-h-[220px]">
            <OpeningHeroVideo
              src={videoSrc}
              posterSrc={posterSrc}
              playbackToolbar
              className="absolute inset-0 h-full w-full"
            />

            <div
              className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 opacity-[0.34] sm:bottom-5 sm:right-5"
              aria-hidden
            >
              <Leaf className="size-4 text-amber-200/90 sm:size-[1.05rem]" strokeWidth={2} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/88 sm:text-[11px]">
                THCProce
              </span>
            </div>
          </div>

          <div className="relative bg-gradient-to-b from-black via-zinc-950 to-black px-5 pb-9 pt-8 sm:px-10 sm:pb-10 sm:pt-9">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-300/45">
              {CANNABIS101_OPENING_COPY.filmEyebrow}
            </p>

            <h2 className="mt-3 font-serif text-[1.65rem] font-semibold tracking-tight text-white sm:text-3xl md:text-[2.15rem] md:leading-[1.15]">
              {CANNABIS101_OPENING_COPY.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-white/58 sm:text-[15px] md:mx-0">
              {CANNABIS101_OPENING_COPY.subtitle}
            </p>

            <div className="mt-8 flex justify-center md:justify-start">
              <Button
                type="button"
                size="lg"
                className={cn(
                  "group relative min-w-[200px] overflow-hidden border border-amber-400/22 bg-gradient-to-b from-emerald-950/80 to-black/90 px-8 font-semibold tracking-wide text-amber-50/95 shadow-[0_8px_40px_rgba(0,0,0,0.45)] transition-[box-shadow,transform,border-color] duration-300",
                  "hover:border-emerald-400/35 hover:text-white hover:shadow-[0_0_28px_rgba(16,185,129,0.22),0_12px_44px_rgba(0,0,0,0.5)] hover:brightness-[1.03]",
                  "active:scale-[0.99]"
                )}
                onClick={handleEnter}
              >
                <span className="relative z-[1]">{CANNABIS101_OPENING_COPY.cta}</span>
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 70% at 50% 100%, rgba(16,185,129,0.16), transparent 62%)"
                  }}
                  aria-hidden
                />
              </Button>
            </div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
