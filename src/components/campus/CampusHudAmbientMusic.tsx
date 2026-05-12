"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, startTransition } from "react";
import { AnimatePresence, motion, useDragControls, useMotionValue } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  GripHorizontal,
  Headphones,
  Minimize2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCampusAudio } from "@/contexts/CampusAudioContext";
import {
  coerceCampusMediaPlayerMode,
  readCampusMediaPlayerPosition,
  writeCampusMediaPlayerPosition,
  type CampusMediaPlayerMode
} from "@/lib/campusMediaPlayerPositionStorage";

const mapHudGlassBtn =
  "flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.14] bg-black/[0.16] text-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition hover:border-emerald-300/35 hover:bg-white/[0.12] hover:text-white sm:h-9 sm:w-9";

const glassShell =
  "rounded-2xl border border-white/[0.12] bg-gradient-to-br from-black/[0.52] to-black/[0.34] shadow-[0_12px_44px_rgba(0,0,0,0.38)] backdrop-blur-3xl ring-1 ring-emerald-400/[0.14]";

/** Above map/HUD header; below main modals (~55+) e cinema/live dock (~38). */
const PLAYER_Z = 51;

function viewportMargins(): { top: number; left: number; right: number; bottom: number } {
  if (typeof window === "undefined") {
    return { top: 12, left: 12, right: 12, bottom: 24 };
  }
  const narrow = window.innerWidth < 640;
  return {
    top: 12,
    left: 12,
    right: 12,
    bottom: narrow ? 80 : 24
  };
}

function clampToViewport(x: number, y: number, width: number, height: number): { x: number; y: number } {
  const m = viewportMargins();
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const maxX = Math.max(m.left, vw - width - m.right);
  const maxY = Math.max(m.top, vh - height - m.bottom);
  return {
    x: Math.min(Math.max(x, m.left), maxX),
    y: Math.min(Math.max(y, m.top), maxY)
  };
}

function defaultPosition(width: number, height: number): { x: number; y: number } {
  void width;
  const m = viewportMargins();
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  return {
    x: vw - width - m.right,
    y: vh - height - m.bottom
  };
}

/**
 * Ambiente / rádio / cinema — overlay flutuante draggable; áudio global via Howler (`CampusAudioProvider`).
 */
export function CampusHudAmbientMusic() {
  const shellRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const xMv = useMotionValue(0);
  const yMv = useMotionValue(0);

  const {
    tracks,
    catalogResolved,
    playing,
    volume,
    muted,
    shuffle,
    repeatMode,
    current,
    togglePlay,
    goNext,
    goPrev,
    toggleMute,
    setVolume01,
    toggleShuffle,
    cycleRepeat
  } = useCampusAudio();

  const savedInitial =
    typeof window !== "undefined" ? readCampusMediaPlayerPosition() : null;
  const [playerMode, setPlayerMode] = useState<CampusMediaPlayerMode>(() =>
    coerceCampusMediaPlayerMode(savedInitial ?? {})
  );

  const persistPositionWithMode = useCallback(
    (mode: CampusMediaPlayerMode) => {
      const el = shellRef.current;
      if (!el || typeof window === "undefined") return;
      const rect = el.getBoundingClientRect();
      const c = clampToViewport(rect.left, rect.top, rect.width, rect.height);
      xMv.set(c.x);
      yMv.set(c.y);
      writeCampusMediaPlayerPosition({
        version: 1,
        x: c.x,
        y: c.y,
        expanded: mode === "expanded",
        playerMode: mode
      });
    },
    [xMv, yMv]
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const saved = readCampusMediaPlayerPosition();

    const apply = () => {
      const el = shellRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const def = defaultPosition(w, h);
      const rawX = saved?.x ?? def.x;
      const rawY = saved?.y ?? def.y;
      const c = clampToViewport(rawX, rawY, w, h);
      xMv.set(c.x);
      yMv.set(c.y);
    };

    apply();
    const id = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(id);
  }, [catalogResolved, tracks.length, playerMode, xMv, yMv]);

  useEffect(() => {
    const onResize = () => {
      const el = shellRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const c = clampToViewport(xMv.get(), yMv.get(), w, h);
      xMv.set(c.x);
      yMv.set(c.y);
      persistPositionWithMode(playerMode);
    };
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [catalogResolved, playerMode, xMv, yMv, persistPositionWithMode]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => persistPositionWithMode(playerMode));
    });
    return () => cancelAnimationFrame(id);
  }, [playerMode, persistPositionWithMode]);

  const onDragEnd = useCallback(() => {
    persistPositionWithMode(playerMode);
  }, [persistPositionWithMode, playerMode]);

  const expanded = playerMode === "expanded";
  const mini = playerMode === "mini";

  const shellMotionProps = {
    style: {
      x: xMv,
      y: yMv,
      position: "fixed" as const,
      left: 0,
      top: 0,
      zIndex: PLAYER_Z,
      touchAction: "none" as const
    },
    drag: true as const,
    dragControls,
    dragListener: false,
    dragMomentum: false,
    dragElastic: 0,
    onDragEnd
  };

  const loadingBody = (
    <>
      <div
        className="flex cursor-grab touch-none items-center gap-2 border-b border-white/[0.08] pb-2 active:cursor-grabbing"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <GripHorizontal size={15} className="shrink-0 text-white/38" aria-hidden />
        <Headphones size={16} className="shrink-0 animate-pulse text-emerald-200/75" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-200/65">
          Áudio do campus
        </span>
      </div>
      <div className="mt-3 space-y-2 px-0.5">
        <div className="h-2.5 w-[72%] animate-pulse rounded-full bg-white/[0.14]" />
        <div className="h-2 w-[52%] animate-pulse rounded-full bg-white/[0.09]" />
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-9 w-9 animate-pulse rounded-full bg-white/[0.12]" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-emerald-400/20 ring-1 ring-emerald-400/25" />
          <div className="h-9 w-9 animate-pulse rounded-full bg-white/[0.12]" />
        </div>
      </div>
      <p className="mt-3 px-0.5 text-[9px] leading-relaxed text-white/38">
        A carregar lista de faixas…
      </p>
    </>
  );

  const trackLabel = current?.title ?? "—";
  const hasTracks = tracks.length > 0;

  const volumeControls = (marginClass?: string) => (
    <div className={cn("flex items-center gap-2", marginClass)}>
      <button
        type="button"
        className={cn(mapHudGlassBtn, "h-8 w-8 shrink-0")}
        aria-label={muted ? "Ativar som" : "Silenciar"}
        aria-pressed={muted}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
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
          onChange={(e) => setVolume01(Number(e.target.value) / 100)}
          onPointerDown={(e) => e.stopPropagation()}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/12 accent-emerald-400"
        />
      </label>
    </div>
  );

  const repeatLabel =
    repeatMode === "one"
      ? "Repetir uma faixa"
      : repeatMode === "all"
        ? "Repetir todas"
        : "Sem repetir";

  const transportExtras = expanded ? (
    <div className="mt-2 flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={!hasTracks}
        className={cn(
          mapHudGlassBtn,
          "h-8 w-8",
          shuffle && "border-emerald-400/40 bg-emerald-500/15",
          !hasTracks && "cursor-not-allowed opacity-40"
        )}
        aria-label={shuffle ? "Desligar ordem aleatória" : "Ordem aleatória"}
        aria-pressed={shuffle}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          toggleShuffle();
        }}
      >
        <Shuffle size={15} aria-hidden />
      </button>
      <button
        type="button"
        disabled={!hasTracks}
        className={cn(
          mapHudGlassBtn,
          "h-8 w-8",
          repeatMode !== "off" && "border-emerald-400/40 bg-emerald-500/15",
          !hasTracks && "cursor-not-allowed opacity-40"
        )}
        aria-label={repeatLabel}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          cycleRepeat();
        }}
      >
        {repeatMode === "one" ? (
          <Repeat1 size={15} aria-hidden />
        ) : (
          <Repeat size={15} className={repeatMode === "all" ? "" : "opacity-55"} aria-hidden />
        )}
      </button>
    </div>
  ) : null;

  const miniBody = (
    <>
      <button
        type="button"
        className={cn(
          "relative flex h-full w-full flex-col items-center justify-center rounded-full outline-none transition hover:bg-white/[0.06]",
          playing ? "shadow-[0_0_20px_rgba(52,211,153,0.22)]" : ""
        )}
        aria-label="Expandir leitor de áudio"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          startTransition(() => setPlayerMode("compact"));
        }}
      >
        <Headphones size={22} className={cn("text-emerald-100/95", !hasTracks && "opacity-65")} aria-hidden />
        {playing ? (
          <span className="absolute inset-0 rounded-full ring-2 ring-emerald-400/35 ring-offset-0 animate-pulse" />
        ) : null}
      </button>
      <div
        className="absolute bottom-1 left-1/2 flex -translate-x-1/2 cursor-grab touch-none rounded-full bg-black/35 px-1 py-0.5 active:cursor-grabbing"
        onPointerDown={(e) => dragControls.start(e)}
        aria-hidden
      >
        <GripHorizontal size={12} className="text-white/45" />
      </div>
    </>
  );

  const cardBody = (
    <>
      <div
        className="flex cursor-grab touch-none items-center gap-2 border-b border-white/[0.08] pb-2 active:cursor-grabbing"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <GripHorizontal size={15} className="shrink-0 text-white/38" aria-hidden />
        <Headphones size={16} className="shrink-0 text-emerald-200/85" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-200/82">
          Ambiente · Rádio · Cinema
        </span>
        <span
          className="shrink-0 rounded-md border border-emerald-400/28 bg-emerald-500/[0.12] px-1 py-0.5 text-[7px] font-bold uppercase tracking-[0.14em] text-emerald-200/95"
          title="Motor Howler.js — áudio global; mantém-se ao mudar de página no campus"
        >
          Howler
        </span>
        <button
          type="button"
          className="rounded-lg p-1 text-white/55 transition hover:bg-white/10 hover:text-white"
          aria-label="Minimizar para ícone"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            startTransition(() => setPlayerMode("mini"));
          }}
        >
          <Minimize2 size={17} aria-hidden />
        </button>
        <button
          type="button"
          className="rounded-lg p-1 text-white/55 transition hover:bg-white/10 hover:text-white"
          aria-expanded={expanded}
          aria-label={expanded ? "Modo compacto" : "Expandir controlos"}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            startTransition(() => setPlayerMode((m) => (m === "expanded" ? "compact" : "expanded")));
          }}
        >
          {expanded ? <ChevronUp size={18} aria-hidden /> : <ChevronDown size={18} aria-hidden />}
        </button>
      </div>

      <p
        className={cn(
          "mt-2 font-medium leading-snug text-white/88",
          expanded ? "line-clamp-3 text-[11px]" : "truncate text-[10px]"
        )}
      >
        {hasTracks ? trackLabel : "Sem áudio disponível"}
      </p>

      {!hasTracks ? (
        <p className="mt-1 px-0.5 text-[9px] leading-snug text-white/46">
          Adicione arquivos em public/audio/ambience, radio ou cinema
        </p>
      ) : null}

      {!hasTracks ? <p className="sr-only">Nenhuma faixa encontrada</p> : null}

      <div className={cn("mt-2 flex items-center justify-center gap-1", expanded ? "mt-3" : "")}>
        <button
          type="button"
          disabled={!hasTracks}
          className={cn(mapHudGlassBtn, "h-8 w-8", !hasTracks && "cursor-not-allowed opacity-40")}
          aria-label="Faixa anterior"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
        >
          <SkipBack size={15} aria-hidden />
        </button>
        <button
          type="button"
          disabled={!hasTracks}
          className={cn(
            mapHudGlassBtn,
            expanded ? "h-10 w-10 border-emerald-400/28" : "h-9 w-9 border-emerald-400/28",
            !hasTracks && "cursor-not-allowed opacity-40"
          )}
          aria-label={
            !hasTracks ? "Sem faixas para reproduzir" : playing ? "Pausar" : "Reproduzir música ambiente"
          }
          aria-pressed={playing}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {playing ? (
            <Pause size={expanded ? 18 : 16} className="text-emerald-100" aria-hidden />
          ) : (
            <Play size={expanded ? 18 : 16} className="text-emerald-100" aria-hidden />
          )}
        </button>
        <button
          type="button"
          disabled={!hasTracks}
          className={cn(mapHudGlassBtn, "h-8 w-8", !hasTracks && "cursor-not-allowed opacity-40")}
          aria-label="Próxima faixa"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
        >
          <SkipForward size={15} aria-hidden />
        </button>
      </div>

      {transportExtras}

      {!expanded && !hasTracks ? (
        <div className="mt-2 border-t border-white/[0.07] pt-2">{volumeControls()}</div>
      ) : null}

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {volumeControls("mt-3")}
            <p className="mt-2 text-[9px] leading-relaxed text-white/42">
              {hasTracks ? (
                <>
                  Lista via /api/campus/audio-tracks · reprodução Howler.js (HTML5). O navegador pode bloquear autoplay
                  até interagires com play. Arrasta pela barra superior — não interfere com o mapa.
                </>
              ) : (
                <>
                  Nenhuma faixa válida na playlist (ou ficheiros em falta no servidor). Quando adicionares áudio,
                  atualiza a página.
                </>
              )}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );

  return (
    <motion.div
      ref={shellRef}
      {...shellMotionProps}
      className={cn(
        glassShell,
        "pointer-events-auto",
        !catalogResolved
          ? "w-[min(20rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.25rem)] p-3"
          : mini
            ? "relative flex h-14 w-14 max-h-[min(3.5rem,calc(100vw-1rem))] max-w-[min(3.5rem,calc(100vw-1rem))] flex-col items-center justify-center rounded-full p-0 ring-emerald-400/18"
            : cn(
                "w-[min(20rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.25rem)] overflow-hidden",
                expanded ? "p-3" : "p-2"
              )
      )}
      role={!catalogResolved ? "status" : "region"}
      aria-busy={!catalogResolved}
      aria-label={
        !catalogResolved
          ? "A preparar leitor de áudio"
          : tracks.length === 0
            ? "Leitor de áudio — sem faixas"
            : mini
              ? "Leitor ambiente minimizado"
              : "Música ambiente do campus"
      }
    >
      {!catalogResolved ? loadingBody : mini ? miniBody : cardBody}
    </motion.div>
  );
}
