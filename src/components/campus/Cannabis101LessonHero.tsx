"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart2,
  BookOpen,
  FlaskConical,
  Leaf,
  Play,
  Shield,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseLessonTheme } from "@/data/courseLessonThemes";
import {
  getCannabis101TrailerMuxPlaybackId,
  getCannabis101TrailerYoutubeId,
  hasCannabis101TrailerConfigured
} from "@/lib/video/cannabis101Stream";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

/** Poster em `/public/campus/themes/` */
export const CANNABIS101_POSTER_SRC = "/campus/themes/cannabis101-hero.svg";

const PILLARS = [
  { label: "Ciência", Icon: FlaskConical },
  { label: "Evidência", Icon: BarChart2 },
  { label: "Segurança", Icon: Shield },
  { label: "Educação", Icon: BookOpen }
] as const;

type Props = {
  theme: CourseLessonTheme;
  /** Aula atual — linha secundária no hero */
  lessonTitle: string;
  areaName: string;
  className?: string;
  /** Sala reorganizada: cabeçalho visual baixo — conteúdo domina o centro */
  compact?: boolean;
  /** Compacto no rodapé da coluna: só marca + ações (sem repetir título da aula). */
  brandingOnly?: boolean;
};

function MoleculeBg() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full opacity-[0.14]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="mgold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7a5c12" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <g stroke="url(#mgold)" fill="none" strokeWidth="1.2">
        <path d="M120 80l40-23v46l-40 23v-46z" opacity="0.7" />
        <path d="M160 57l46 26v52l-46 26-46-26V83l46-26z" opacity="0.55" />
        <circle cx="1020" cy="140" r="8" fill="#d4af37" fillOpacity="0.25" />
        <path d="M980 200h90l45 78-45 78h-90l-45-78 45-78z" opacity="0.35" />
        <path d="M1500 320l52 30v60l-52 30-52-30v-60l52-30z" opacity="0.45" />
      </g>
    </svg>
  );
}

function HexLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-12 w-12 place-items-center sm:h-14 sm:w-14">
        <svg viewBox="0 0 56 56" className="h-full w-full drop-shadow-[0_0_12px_rgba(212,175,55,0.45)]">
          <path
            d="M28 4l22 13v26L28 56 6 43V17L28 4z"
            fill="#0a1f14"
            stroke="#c9a227"
            strokeWidth="1.5"
          />
          <path
            d="M28 12c6 4 10 10 10 16s-4 11-10 15c-6-4-10-9-10-15s4-12 10-16z"
            fill="#1a5c3a"
            opacity="0.9"
          />
        </svg>
        <Leaf className="absolute size-6 text-amber-200/95 sm:size-7" strokeWidth={1.5} />
      </div>
      <div className="leading-tight">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-200/90">THCPROCE</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/85">Science</p>
      </div>
    </div>
  );
}

function TrailerModal({
  open,
  onClose,
  trailerMux,
  trailerYt
}: {
  open: boolean;
  onClose: () => void;
  trailerMux: string;
  trailerYt: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Trailer Cannabis 101"
          onClick={onClose}
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
              onClick={onClose}
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
  );
}

/**
 * Hero premium Cannabis 101 (referência visual UI gamificada THCProce).
 */
export function Cannabis101LessonHero({
  theme,
  lessonTitle,
  areaName,
  className = "",
  compact = false,
  brandingOnly = false
}: Props) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const showTrailer = hasCannabis101TrailerConfigured();
  const trailerMux = getCannabis101TrailerMuxPlaybackId();
  const trailerYt = getCannabis101TrailerYoutubeId();

  if (compact) {
    return (
      <>
        <div
          className={cn(
            "relative flex w-full flex-col gap-3 overflow-hidden rounded-xl border border-amber-500/30 bg-[#050b08] p-3 shadow-lg sm:flex-row sm:items-center sm:gap-4 sm:p-4",
            className
          )}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0 opacity-50 bg-gradient-to-r",
              theme.heroClass
            )}
          />
          <div className="relative z-[1] flex shrink-0 items-center gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-amber-400/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] sm:h-[72px] sm:w-[72px]">
              <Image
                src={CANNABIS101_POSTER_SRC}
                alt=""
                fill
                className="object-cover object-[56%_38%]"
                sizes="80px"
              />
            </div>
          </div>
          <div className="relative z-[1] min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/70">Cannabis 101</p>
            {brandingOnly ? (
              <p className="mt-1 text-[11px] leading-snug text-white/50">
                Fundamentos da cannabis medicinal · {areaName}
              </p>
            ) : (
              <>
                <p className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base">
                  {lessonTitle}
                </p>
                <p className="mt-1 text-[11px] text-white/45">{areaName}</p>
              </>
            )}
          </div>
          <div className="relative z-[1] flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
            {showTrailer ? (
              <button
                type="button"
                onClick={() => setTrailerOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-canna-600 to-canna-500 px-3 py-2 text-xs font-bold text-white shadow-md hover:from-canna-500 hover:to-canna-400"
              >
                <Play size={14} fill="currentColor" />
                Trailer
              </button>
            ) : null}
            <Link
              href="/entrar"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-black/50 px-3 py-2 text-xs font-bold text-white/90 hover:border-amber-500/35"
            >
              Entrar na conta
            </Link>
          </div>
        </div>
        <TrailerModal
          open={trailerOpen}
          onClose={() => setTrailerOpen(false)}
          trailerMux={trailerMux}
          trailerYt={trailerYt}
        />
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "relative min-h-[300px] w-full overflow-hidden rounded-2xl border border-amber-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.55)] sm:min-h-[340px] md:min-h-[380px]",
          className
        )}
      >
        <div className="absolute inset-0 bg-[#030806]" />
        <div
          className={cn(
            "absolute inset-0 opacity-[0.65] bg-gradient-to-br from-emerald-950/90 via-[#061510] to-black",
            theme.heroClass
          )}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(212,175,55,0.08),transparent_55%)]" />
        <MoleculeBg />

        <motion.div
          className={cn(
            "absolute -right-10 top-1/3 size-[55%] max-w-xl rounded-full blur-3xl opacity-50 bg-gradient-to-br",
            theme.orbClass
          )}
          animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Folha em macro — anel dourado */}
        <div className="pointer-events-none absolute right-[4%] top-1/2 z-[1] hidden w-[38%] max-w-md -translate-y-1/2 md:block">
          <div className="relative mx-auto aspect-square w-[72%]">
            <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-2xl" />
            <div className="absolute inset-0 rounded-full border-[3px] border-amber-400/70 shadow-[0_0_40px_rgba(212,175,55,0.35)]" />
            <div className="absolute inset-[3%] overflow-hidden rounded-full ring-2 ring-amber-500/20">
              <Image
                src={CANNABIS101_POSTER_SRC}
                alt=""
                fill
                className="object-cover object-[56%_38%]"
                sizes="400px"
                priority
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex h-full min-h-[300px] flex-col p-5 sm:p-7 md:min-h-0 md:pr-[42%] md:pl-8 md:pt-8">
          <HexLogo />

          <div className="relative z-10 mt-5 flex justify-center md:hidden">
            <div className="relative h-36 w-36 shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/60 shadow-[0_0_30px_rgba(212,175,55,0.25)]" />
              <div className="absolute inset-[4%] overflow-hidden rounded-full">
                <Image
                  src={CANNABIS101_POSTER_SRC}
                  alt=""
                  width={144}
                  height={144}
                  className="size-full object-cover object-[56%_38%]"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="mt-4 max-w-xl space-y-4 md:mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-200/70">
              {areaName}
            </p>
            <h3 className="text-3xl font-extrabold leading-[1.05] tracking-tight text-white text-shadow-soft sm:text-4xl md:text-5xl">
              CANNABIS 101
            </h3>
            <p className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-400/90 bg-clip-text text-base font-bold uppercase tracking-[0.12em] text-transparent sm:text-lg">
              Fundamentos da cannabis medicinal
            </p>
            <p className="text-xs font-medium text-white/55 sm:text-sm">Aula atual: {lessonTitle}</p>

            <div className="flex flex-wrap gap-3 pt-1">
              {PILLARS.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-lg border border-amber-500/25 bg-black/40 px-3 py-2"
                >
                  <Icon className="size-4 text-amber-400" aria-hidden />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100/95">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-black/50 p-3 backdrop-blur-sm">
              <Leaf className="mt-0.5 size-5 shrink-0 text-amber-400" aria-hidden />
              <p className="text-[11px] leading-relaxed text-amber-50/90 sm:text-xs">
                Conteúdo em liberação progressiva. Estamos lançando o campus em fases. Novas aulas, vídeos e
                materiais serão adicionados continuamente durante o pré-lançamento fundador.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {showTrailer ? (
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-canna-600 to-canna-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-canna-900/40 transition hover:from-canna-500 hover:to-canna-400"
                >
                  <Play size={18} fill="currentColor" />
                  Assistir trailer
                </button>
              ) : null}
              <Link
                href="/entrar"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-[#0a1612] px-5 py-3 text-sm font-bold text-white/90 transition hover:border-amber-500/40 hover:bg-[#0f2218]"
              >
                Entrar na conta
              </Link>
            </div>
          </div>
        </div>
      </div>

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerMux={trailerMux}
        trailerYt={trailerYt}
      />
    </>
  );
}
