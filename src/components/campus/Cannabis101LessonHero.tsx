"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseLessonTheme } from "@/data/courseLessonThemes";
import {
  getCannabis101TrailerMuxPlaybackId,
  getCannabis101TrailerYoutubeId,
  hasCannabis101TrailerConfigured
} from "@/lib/video/cannabis101Stream";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

/** Poster estático em `/public/campus/themes/` — troque por WebP mantendo a referência. */
export const CANNABIS101_POSTER_SRC = "/campus/themes/cannabis101-hero.svg";

const MOODLE = "https://thcproce.com.br/escola";

type Props = {
  theme: CourseLessonTheme;
  lessonTitle: string;
  areaName: string;
  className?: string;
};

/**
 * Hero premium Cannabis 101: poster real + gradiente/partículas + trailer opcional (env).
 */
export function Cannabis101LessonHero({
  theme,
  lessonTitle,
  areaName,
  className = ""
}: Props) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const showTrailer = hasCannabis101TrailerConfigured();
  const trailerMux = getCannabis101TrailerMuxPlaybackId();
  const trailerYt = getCannabis101TrailerYoutubeId();

  return (
    <>
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden rounded-xl border border-canna-400/35 shadow-2xl shadow-black/50",
          className
        )}
      >
        <Image
          src={CANNABIS101_POSTER_SRC}
          alt="Cannabis 101 — ciência, moléculas, folha em macro e ambiente de laboratório THCProce"
          fill
          priority
          sizes="(min-width: 1024px) 960px, 100vw"
          className="object-cover object-center"
        />

        <div className={cn("absolute inset-0 opacity-80", theme.heroClass)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

        <motion.div
          className={cn(
            "absolute -left-1/4 top-1/4 size-[70%] rounded-full blur-3xl opacity-70",
            "bg-gradient-to-br",
            theme.orbClass
          )}
          animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.72, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-1/4 bottom-0 size-[55%] rounded-full bg-gradient-to-tl from-amber-500/18 to-transparent blur-3xl"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2748%27%20height=%2748%27%3E%3Ccircle%20cx=%272%27%20cy=%272%27%20r=%271%27%20fill=%27rgba(255,255,255,0.05)%27/%3E%3C/svg%3E')] opacity-45" />

        <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100">
              <Sparkles size={12} className="text-amber-300" />
              THCProce Science
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/60">{theme.tagline}</span>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">{areaName}</p>
            <h3 className="text-xl font-extrabold leading-tight text-white text-shadow-soft sm:text-2xl md:text-3xl">
              {lessonTitle}
            </h3>
            <p className="max-w-2xl text-sm leading-relaxed text-white/88">{theme.mood}</p>

            <p className="max-w-2xl rounded-lg border border-amber-500/25 bg-black/45 px-3 py-2 text-[11px] leading-relaxed text-amber-100/90 sm:text-xs">
              Conteúdo em liberação progressiva durante o pré-lançamento fundador. Novas aulas em vídeo
              e materiais extras entram nesta sala conforme o calendário da escola — nada aqui garante
              catálogo já fechado ou gravações 100% disponíveis.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {showTrailer ? (
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-400/45 bg-amber-500/15 px-4 py-2.5 text-sm font-bold text-amber-100 hover:bg-amber-500/25"
                >
                  <Play size={18} className="text-amber-200" fill="currentColor" />
                  Assistir trailer
                </button>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/45 px-4 py-2.5 text-sm font-semibold text-white/88">
                <Play size={18} className="text-canna-300" fill="currentColor" />
                Aula principal — aguarde o stream THCProce (Mux/Bunny)
              </span>
              <Link
                href={MOODLE}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-canna-400/40 bg-canna-500/15 px-4 py-2.5 text-sm font-bold text-canna-200 hover:bg-canna-500/25"
              >
                Sala Moodle →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {trailerOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Trailer Cannabis 101"
            onClick={() => setTrailerOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-amber-500/30 bg-black shadow-2xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setTrailerOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-black/60 p-2 text-white hover:bg-black/80"
                aria-label="Fechar trailer"
              >
                <X size={18} />
              </button>
              <div className="aspect-video w-full">
                {trailerMux ? (
                  <MuxPlayer
                    playbackId={trailerMux}
                    streamType="on-demand"
                    accentColor="#fbbf24"
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : trailerYt ? (
                  <iframe
                    title="Trailer Cannabis 101"
                    className="size-full border-0"
                    src={`https://www.youtube-nocookie.com/embed/${trailerYt}?rel=0&modestbranding=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
