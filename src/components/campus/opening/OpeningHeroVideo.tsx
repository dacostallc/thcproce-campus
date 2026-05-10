"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback
} from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export const OPENING_HERO_UNMUTED_VOLUME = 0.8;

export type OpeningHeroVideoHandle = {
  /** Para futuros players (ex.: Bunny): troca de URL sem desmontar o nó. */
  setSrc: (next: string | null) => void;
};

type Props = {
  /** URL absoluta ou caminho público (MP4/WebM/HLS quando o browser suportar). */
  src: string | null;
  posterSrc: string;
  className?: string;
  /** Chamado quando o vídeo falha ou `src` está vazio — usar poster só. */
  onUnavailable?: () => void;
  /**
   * Barra discreta: som (muted por defeito + ligar manualmente), play/pause, reiniciar.
   * Cantos inferiores — não sobrepõe título/CTA fora da área do vídeo.
   */
  playbackToolbar?: boolean;
};

/**
 * Camada de vídeo hero para aberturas de curso — autoplay silenciado, loop, object-cover.
 * Pensado para integração futura com Bunny Stream (mesmo elemento `<video>` ou swap por iframe).
 */
export const OpeningHeroVideo = forwardRef<OpeningHeroVideoHandle, Props>(
  function OpeningHeroVideo(
    { src, posterSrc, className, onUnavailable, playbackToolbar = false },
    ref
  ) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [fadeReady, setFadeReady] = useState(false);
    const [usePosterOnly, setUsePosterOnly] = useState(!src);
    /** Por defeito muted (autoplay); aluno liga som com gesto explícito. */
    const [soundOn, setSoundOn] = useState(false);
    const [pausedUi, setPausedUi] = useState(false);

    useImperativeHandle(ref, () => ({
      setSrc(next) {
        setSoundOn(false);
        if (!next) {
          setUsePosterOnly(true);
          return;
        }
        setUsePosterOnly(false);
        const el = videoRef.current;
        if (el) {
          el.src = next;
          void el.play().catch(() => {});
        }
      }
    }));

    useEffect(() => {
      if (!src) {
        setUsePosterOnly(true);
        onUnavailable?.();
        return;
      }
      const root = wrapRef.current?.closest("[data-lesson-scroll-root]") ?? null;
      const el = wrapRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e?.isIntersecting) setShouldLoad(true);
        },
        { root, threshold: 0.08, rootMargin: "40px 0px" }
      );
      io.observe(el);
      return () => io.disconnect();
    }, [src, onUnavailable]);

    useEffect(() => {
      if (!shouldLoad || !src || usePosterOnly) return;
      const v = videoRef.current;
      if (!v) return;
      void v.play().catch(() => {
        /* política do browser */
      });
    }, [shouldLoad, src, usePosterOnly]);

    useEffect(() => {
      const v = videoRef.current;
      if (!v || usePosterOnly || !shouldLoad) return;
      v.volume = soundOn ? OPENING_HERO_UNMUTED_VOLUME : 1;
      if (soundOn) {
        void v.play().catch(() => {});
      }
    }, [soundOn, usePosterOnly, shouldLoad]);

    const toggleSound = useCallback(() => {
      const v = videoRef.current;
      if (!v || usePosterOnly) return;
      if (soundOn) {
        setSoundOn(false);
      } else {
        setSoundOn(true);
        void v.play().catch(() => {});
      }
    }, [soundOn, usePosterOnly]);

    const togglePlay = useCallback(() => {
      const v = videoRef.current;
      if (!v || usePosterOnly) return;
      if (v.paused) {
        void v.play().catch(() => {});
      } else {
        v.pause();
      }
    }, [usePosterOnly]);

    const restart = useCallback(() => {
      const v = videoRef.current;
      if (!v || usePosterOnly) return;
      v.currentTime = 0;
      void v.play().catch(() => {});
    }, [usePosterOnly]);

    const toolbarBtn =
      "flex items-center justify-center gap-1.5 rounded-lg border border-emerald-400/28 bg-black/38 px-3 py-2.5 text-[11px] font-medium text-white/90 shadow-sm shadow-black/30 backdrop-blur-md transition-colors duration-200 hover:border-amber-400/38 hover:bg-black/52 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60 sm:h-9 sm:min-h-0 sm:py-1.5 sm:text-[10px]";

    const iconBtn =
      "aspect-square min-h-[44px] min-w-[44px] max-sm:shrink-0 sm:aspect-auto sm:min-h-0 sm:min-w-0 sm:px-2.5";

    const showToolbar = playbackToolbar && !usePosterOnly && Boolean(src);

    return (
      <div ref={wrapRef} className={cn("relative isolate overflow-hidden bg-black", className)}>
        {!usePosterOnly && src ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeReady ? 1 : 0 }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={shouldLoad ? src : undefined}
              poster={posterSrc}
              muted={!soundOn}
              playsInline
              loop
              autoPlay={shouldLoad}
              preload={shouldLoad ? "metadata" : "none"}
              aria-hidden
              onLoadedData={() => setFadeReady(true)}
              onPlay={() => setPausedUi(false)}
              onPause={() => setPausedUi(true)}
              onError={() => {
                setUsePosterOnly(true);
                onUnavailable?.();
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${posterSrc})` }}
            aria-hidden
          />
        )}

        {/* Overlay cinematográfico verde → preto */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/65 to-emerald-950/55"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(16,185,129,0.12),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-amber-950/20"
          aria-hidden
        />

        {showToolbar && shouldLoad ? (
          <div
            className="pointer-events-auto absolute bottom-3 left-3 z-[3] flex max-w-[calc(100%-5rem)] flex-wrap items-center gap-2 sm:bottom-4 sm:left-4 sm:max-w-[min(100%-8rem,20rem)]"
            role="toolbar"
            aria-label="Controlo do vídeo de abertura"
          >
            <button
              type="button"
              className={cn(toolbarBtn, iconBtn)}
              onClick={togglePlay}
              aria-label={pausedUi ? "Reproduzir vídeo" : "Pausar vídeo"}
              aria-pressed={!pausedUi}
            >
              {pausedUi ? (
                <Play className="size-[18px] text-emerald-100/95 sm:size-4" aria-hidden strokeWidth={2} />
              ) : (
                <Pause className="size-[18px] text-emerald-100/95 sm:size-4" aria-hidden strokeWidth={2} />
              )}
            </button>
            <button
              type="button"
              className={cn(toolbarBtn, iconBtn)}
              onClick={restart}
              aria-label="Reiniciar vídeo"
            >
              <RotateCcw className="size-[17px] text-amber-100/90 sm:size-[15px]" aria-hidden strokeWidth={2} />
            </button>
            <button
              type="button"
              className={cn(toolbarBtn, "min-h-[44px] px-3.5 sm:min-h-0")}
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? "Desligar som do vídeo" : "Ligar som do vídeo"}
            >
              {soundOn ? (
                <>
                  <VolumeX className="size-4 shrink-0 text-amber-100/85 sm:size-[14px]" aria-hidden strokeWidth={2} />
                  <span className="whitespace-nowrap">Desligar som</span>
                </>
              ) : (
                <>
                  <Volume2 className="size-4 shrink-0 text-emerald-100/90 sm:size-[14px]" aria-hidden strokeWidth={2} />
                  <span className="whitespace-nowrap">Ligar som</span>
                </>
              )}
            </button>
          </div>
        ) : null}
      </div>
    );
  }
);