"use client";

import {
  CAMPUS_MAP_BACKGROUND_IMG_STYLE,
  CAMPUS_MAP_BACKGROUND_IMG_STYLE_CONTAIN
} from "@/lib/campusArt";
import { useCampusSkyStore } from "@/stores/campusSkyStore";

type Props = {
  bgNightSrc: string;
  bgDaySrc: string;
  /** Em sync com `CampusMap` quando debug/preview de alinhamento usam `contain`. */
  campusMapAlignmentPreview?: boolean;
  /** Mensagem curta (ex.: erro de renderização ou WebGL). */
  hint?: string | null;
  onRetry?: () => void;
};

/**
 * Fundo do campus sem Next/Image, Framer Motion nem WebGL — último recurso quando o canvas principal falha.
 */
export function CampusMapCanvasFallback({
  bgNightSrc,
  bgDaySrc,
  campusMapAlignmentPreview,
  hint,
  onRetry
}: Props) {
  const sky = useCampusSkyStore((s) => s.sky);
  const imgStyle = campusMapAlignmentPreview ? CAMPUS_MAP_BACKGROUND_IMG_STYLE_CONTAIN : CAMPUS_MAP_BACKGROUND_IMG_STYLE;

  return (
    <div className="absolute inset-0 z-[5] overflow-hidden bg-ink-900">
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: sky === "night" ? 1 : 0,
          pointerEvents: sky === "night" ? "auto" : "none"
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgNightSrc}
          alt=""
          className="pointer-events-none opacity-100"
          style={{ ...imgStyle }}
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/8 via-transparent to-black/14"
          aria-hidden
        />
      </div>

      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: sky === "day" ? 1 : 0,
          pointerEvents: sky === "day" ? "auto" : "none"
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgDaySrc}
          alt=""
          className="pointer-events-none opacity-100"
          style={{ ...imgStyle }}
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-sky-400/8 via-transparent to-amber-200/12"
          aria-hidden
        />
      </div>

      {hint ? (
        <div className="pointer-events-auto absolute bottom-28 left-1/2 z-[30] w-[min(92vw,440px)] -translate-x-1/2 px-4">
          <div className="glass-strong rounded-2xl border border-amber-400/35 p-4 text-center shadow-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200">
              Modo mapa simplificado
            </p>
            <p className="mt-2 text-sm leading-snug text-white/80">{hint}</p>
            {onRetry ? (
              <button
                type="button"
                className="mt-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/18"
                onClick={onRetry}
              >
                Tentar animações completas
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
