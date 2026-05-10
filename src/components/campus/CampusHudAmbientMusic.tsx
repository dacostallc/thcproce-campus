"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  startTransition
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Headphones,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CAMPUS_HUD_AMBIENT_DEFAULT_VOLUME,
  CAMPUS_HUD_AMBIENT_PLAYLIST,
  campusHudAmbientProbeSrc,
  readCampusHudAmbientMuted,
  readCampusHudAmbientPlayingIntent,
  readCampusHudAmbientTrackIndex,
  readCampusHudAmbientVolume,
  writeCampusHudAmbientMuted,
  writeCampusHudAmbientPlayingIntent,
  writeCampusHudAmbientTrackIndex,
  writeCampusHudAmbientVolume,
  type CampusHudAmbientTrack
} from "@/lib/campusHudAmbientMusic";

const mapHudGlassBtn =
  "flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.14] bg-black/[0.16] text-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition hover:border-emerald-300/35 hover:bg-white/[0.12] hover:text-white sm:h-9 sm:w-9";

/**
 * Player ambiente global no HUD — MP3 locais, autoplay desligado, estado em localStorage.
 * Um único `<audio>` mantém-se montado com o HUD (não reinicia ao abrir painéis do mapa).
 */
export function CampusHudAmbientMusic() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const errorSkipRef = useRef(0);
  const playingRef = useRef(false);
  const resumeAttemptedRef = useRef(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [tracks, setTracks] = useState<CampusHudAmbientTrack[]>([]);
  const [ready, setReady] = useState(false);

  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(CAMPUS_HUD_AMBIENT_DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  playingRef.current = playing;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const resolved: CampusHudAmbientTrack[] = [];
      for (const t of CAMPUS_HUD_AMBIENT_PLAYLIST) {
        if (cancelled) return;
        const ok = await campusHudAmbientProbeSrc(t.src);
        if (ok) resolved.push(t);
      }
      if (cancelled) return;
      setTracks(resolved);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || tracks.length === 0) return;
    const idx = readCampusHudAmbientTrackIndex(tracks.length);
    const vol = readCampusHudAmbientVolume();
    const mu = readCampusHudAmbientMuted();
    setTrackIndex(idx);
    setVolume(vol);
    setMuted(mu);
  }, [ready, tracks.length]);

  /** Sem faixas válidas: não restaurar autoplay nem manter intent que dispara `<audio>`. */
  useEffect(() => {
    if (!ready || tracks.length > 0) return;
    resumeAttemptedRef.current = false;
    writeCampusHudAmbientPlayingIntent(false);
    setPlaying(false);
  }, [ready, tracks.length]);

  useEffect(() => {
    if (!panelOpen) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [panelOpen]);

  const current = tracks[trackIndex] ?? null;

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current) return;
    let abs: string;
    try {
      abs = new URL(current.src, window.location.origin).href;
    } catch {
      abs = current.src;
    }
    const prevSrc = el.src;
    if (prevSrc !== abs) {
      el.src = current.src;
      errorSkipRef.current = 0;
    }
    el.volume = volume;
    el.muted = muted;
    if (playingRef.current) {
      void el.play().catch(() => {
        setPlaying(false);
        writeCampusHudAmbientPlayingIntent(false);
      });
    }
  }, [current, muted, volume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current || tracks.length === 0) return;

    const onPlay = () => {
      setPlaying(true);
      writeCampusHudAmbientPlayingIntent(true);
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      startTransition(() => {
        setTrackIndex((i) => {
          const next = (i + 1) % tracks.length;
          writeCampusHudAmbientTrackIndex(next);
          return next;
        });
      });
    };
    const onError = () => {
      errorSkipRef.current += 1;
      if (errorSkipRef.current > tracks.length + 2) {
        setPlaying(false);
        writeCampusHudAmbientPlayingIntent(false);
        return;
      }
      startTransition(() => {
        setTrackIndex((i) => {
          const next = (i + 1) % tracks.length;
          writeCampusHudAmbientTrackIndex(next);
          return next;
        });
      });
    };

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
    };
  }, [current, tracks.length]);

  useEffect(() => {
    if (tracks.length === 0) return;
    writeCampusHudAmbientTrackIndex(trackIndex);
  }, [trackIndex, tracks.length]);

  /** Uma tentativa ao ficar pronto: só se existir faixa verificada + intent guardado. */
  useEffect(() => {
    if (!ready || tracks.length === 0 || !current) return;
    if (!readCampusHudAmbientPlayingIntent()) return;
    if (resumeAttemptedRef.current) return;
    resumeAttemptedRef.current = true;
    const el = audioRef.current;
    if (!el) return;
    const id = window.requestAnimationFrame(() => {
      void el.play().catch(() => {
        writeCampusHudAmbientPlayingIntent(false);
        setPlaying(false);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [ready, tracks.length, current?.src]);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el || tracks.length === 0) return;
    if (playingRef.current) {
      writeCampusHudAmbientPlayingIntent(false);
      el.pause();
      return;
    }
    void el.play().catch(() => {
      /* autoplay / erro transitório */
    });
  }, [tracks.length]);

  const toggleMute = useCallback(() => {
    startTransition(() => {
      setMuted((m) => {
        const next = !m;
        writeCampusHudAmbientMuted(next);
        return next;
      });
    });
  }, []);

  const goPrev = useCallback(() => {
    if (tracks.length === 0) return;
    startTransition(() => {
      setTrackIndex((i) => {
        const next = (i - 1 + tracks.length) % tracks.length;
        writeCampusHudAmbientTrackIndex(next);
        return next;
      });
    });
  }, [tracks.length]);

  const goNext = useCallback(() => {
    if (tracks.length === 0) return;
    startTransition(() => {
      setTrackIndex((i) => {
        const next = (i + 1) % tracks.length;
        writeCampusHudAmbientTrackIndex(next);
        return next;
      });
    });
  }, [tracks.length]);

  const onVolumeInput = useCallback((next: number) => {
    const v = Math.min(1, Math.max(0, next));
    setVolume(v);
    writeCampusHudAmbientVolume(v);
  }, []);

  if (!ready) {
    return null;
  }

  if (tracks.length === 0) {
    return (
      <div className="pointer-events-auto relative">
        <button
          type="button"
          disabled
          className={cn(mapHudGlassBtn, "cursor-not-allowed opacity-45")}
          aria-label="Música ambiente indisponível — coloca MP3 ou WAV em public/audio (lista em campusHudAmbientMusic)."
          title="Sem faixas em /public/audio/"
        >
          <Headphones size={17} strokeWidth={2} aria-hidden />
        </button>
      </div>
    );
  }

  const trackLabel = current?.title ?? "—";

  return (
    <>
      <audio ref={audioRef} preload="none" playsInline className="hidden" aria-hidden />
      <div className="pointer-events-auto relative" ref={wrapRef}>
        <button
          type="button"
          className={cn(mapHudGlassBtn, playing ? "border-emerald-400/35 text-emerald-100" : undefined)}
          aria-expanded={panelOpen}
          aria-haspopup="true"
          aria-label={
            playing
              ? "Música ambiente a tocar — abrir controles"
              : "Música ambiente — abrir controles"
          }
          onClick={() => setPanelOpen((v) => !v)}
        >
          <Headphones size={17} strokeWidth={2} aria-hidden />
        </button>

        <AnimatePresence>
          {panelOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-[calc(100%+0.35rem)] z-[61] w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-white/[0.12] bg-black/[0.38] p-3 shadow-xl shadow-black/30 backdrop-blur-2xl ring-1 ring-emerald-400/12"
              role="dialog"
              aria-label="Música ambiente do campus"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-200/88">
                Ambiente · MP3 local
              </p>
              <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-white/88">
                {trackLabel}
              </p>

              <div className="mt-3 flex items-center justify-center gap-1">
                <button
                  type="button"
                  className={cn(mapHudGlassBtn, "h-8 w-8")}
                  aria-label="Faixa anterior"
                  onClick={goPrev}
                >
                  <SkipBack size={15} aria-hidden />
                </button>
                <button
                  type="button"
                  className={cn(mapHudGlassBtn, "h-10 w-10 border-emerald-400/28")}
                  aria-label={playing ? "Pausar" : "Reproduzir"}
                  aria-pressed={playing}
                  onClick={togglePlay}
                >
                  {playing ? (
                    <Pause size={18} className="text-emerald-100" aria-hidden />
                  ) : (
                    <Play size={18} className="text-emerald-100" aria-hidden />
                  )}
                </button>
                <button
                  type="button"
                  className={cn(mapHudGlassBtn, "h-8 w-8")}
                  aria-label="Próxima faixa"
                  onClick={goNext}
                >
                  <SkipForward size={15} aria-hidden />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className={cn(mapHudGlassBtn, "h-8 w-8 shrink-0")}
                  aria-label={muted ? "Ativar som" : "Silenciar"}
                  aria-pressed={muted}
                  onClick={toggleMute}
                >
                  {muted ? (
                    <VolumeX size={16} className="text-amber-200/90" aria-hidden />
                  ) : (
                    <Volume2 size={16} className="text-emerald-100/95" aria-hidden />
                  )}
                </button>
                <label className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="sr-only">Volume ambiente</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(volume * 100)}
                    onChange={(e) => onVolumeInput(Number(e.target.value) / 100)}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/12 accent-emerald-400"
                  />
                </label>
              </div>
              <p className="mt-2 text-[9px] leading-relaxed text-white/42">
                Sem autoplay — áudio separado do vídeo das aulas.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
