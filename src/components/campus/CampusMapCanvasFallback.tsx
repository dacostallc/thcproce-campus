"use client";

import { CAMPUS_IMAGE_OBJECT_POSITION } from "@/lib/campusArt";
import { useCampusSkyStore } from "@/stores/campusSkyStore";

type Props = {
  bgNightSrc: string;
  bgDaySrc: string;
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
  hint,
  onRetry
}: Props) {
  const sky = useCampusSkyStore((s) => s.sky);

  return (
    <div className="absolute inset-0 z-[5] overflow-hidden bg-ink-900">
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: sky === "night" ? 1 : 0,
          pointerEvents: sky === "night" ? "auto" : "none"
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgNightSrc}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-100 brightness-100"
          style={{ objectPosition: CAMPUS_IMAGE_OBJECT_POSITION }}
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
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: sky === "day" ? 1 : 0,
          pointerEvents: sky === "day" ? "auto" : "none"
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgDaySrc}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-100 brightness-100"
          style={{ objectPosition: CAMPUS_IMAGE_OBJECT_POSITION }}
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
