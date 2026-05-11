"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, Clapperboard, GripVertical, MessageCircle, X } from "lucide-react";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { useCampusStore } from "@/stores/campusStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CampusMapHotspotPanel } from "@/components/campus/CampusMapHotspotPanel";
import {
  readCampusCinemaLiveFramePosition,
  writeCampusCinemaLiveFramePosition
} from "@/lib/campusCinemaLiveFramePositionStorage";
import { resolveCampusCinemaVideoSrc } from "@/lib/campus/campusMediaUrl";
import { CampusCinemaHudPreview } from "@/components/campus/CampusCinemaHudPreview";
import { CampusLiveStreamOfflinePoster } from "@/components/campus/CampusLiveStreamOfflinePoster";

type Props = {
  sky: "day" | "night";
  showHotspotTechStripe: boolean;
};

type MockRow = { id: string; label: string; meta: string };

function SectionBlock({
  title,
  rows,
  sky
}: {
  title: string;
  rows: MockRow[];
  sky: "day" | "night";
}) {
  return (
    <section className="space-y-2.5">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">{title}</h3>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li
            key={r.id}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-[13px] leading-snug backdrop-blur-md",
              sky === "day"
                ? "border-white/25 bg-white/[0.14] text-slate-900/92 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset]"
                : "border-white/12 bg-white/[0.06] text-white/90 shadow-inner shadow-black/20"
            )}
          >
            <span className="font-medium">{r.label}</span>
            <span
              className={cn(
                "mt-0.5 block text-[11px]",
                sky === "day" ? "text-slate-600/75" : "text-white/50"
              )}
            >
              {r.meta}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Acima do mapa / leitor ambiente (51); abaixo de modais maiores (~55+).
 * Fica abaixo do telão do Cine drive-in (40) para não tapar a sessão.
 */
const CINEMA_LIVE_FRAME_Z = 38;

/** ~linha do HUD fixo + gap — alinhado ao `pt` dos painéis slide-over do mapa. */
const CINEMA_DOCK_TOP_BELOW_HUD_PX = 66;

/** Ajuste fino: mais à esquerda e mais abaixo no viewport (px). */
const CINEMA_DOCK_NUDGE_LEFT_PX = 40;
const CINEMA_DOCK_NUDGE_DOWN_PX = 40;

function cinemaLiveViewportMargins(): { top: number; left: number; right: number; bottom: number } {
  if (typeof window === "undefined") {
    return { top: 78, left: 16, right: 16, bottom: 96 };
  }
  const narrow = window.innerWidth < 640;
  const vv = window.visualViewport;
  const insetTop = vv ? Math.max(12, vv.offsetTop + 6) : 14;
  const insetBottom = vv
    ? Math.max(16, window.innerHeight - vv.offsetTop - vv.height + 12)
    : narrow
      ? 80
      : 26;
  /** Dock superior: abaixo do header do campus e longe dos atalhos inferiores / tab mobile. */
  const top = insetTop + CINEMA_DOCK_TOP_BELOW_HUD_PX;
  return {
    top,
    left: Math.max(12, 14),
    right: Math.max(12, 14),
    bottom: narrow ? Math.max(96, insetBottom + 36) : Math.max(108, insetBottom + 20)
  };
}

function clampCinemaLiveFrameWithMargins(
  x: number,
  y: number,
  width: number,
  height: number,
  m: { top: number; left: number; right: number; bottom: number }
): { x: number; y: number } {
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const maxX = Math.max(m.left, vw - width - m.right);
  const maxY = Math.max(m.top, vh - height - m.bottom);
  return {
    x: Math.min(Math.max(x, m.left), maxX),
    y: Math.min(Math.max(y, m.top), maxY)
  };
}

/** Dock premium: canto superior-esquerdo (ficha do mapa abre à direita). */
function dockedCinemaLiveFrameXY(
  width: number,
  height: number,
  hotspotPanelOpen: boolean,
  savedY: number | null
): { x: number; y: number } {
  const mBase = cinemaLiveViewportMargins();
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const narrow = vw < 640;

  const padLeftBase =
    narrow && hotspotPanelOpen ? Math.max(mBase.left, 10) : mBase.left;
  const dockLeft = Math.max(6, padLeftBase - CINEMA_DOCK_NUDGE_LEFT_PX);
  const dockTop = mBase.top + CINEMA_DOCK_NUDGE_DOWN_PX;

  const m = {
    ...mBase,
    left: dockLeft,
    top: dockTop,
    ...(narrow && hotspotPanelOpen ? { right: Math.max(mBase.right, 10) } : {})
  };

  const xPreferred = Math.round(dockLeft);

  const yDefault = m.top;
  const yCandidate = savedY != null ? savedY : yDefault;
  const maxY = Math.max(m.top, vh - height - m.bottom);
  const y = Math.min(Math.max(yCandidate, m.top), maxY);

  return clampCinemaLiveFrameWithMargins(xPreferred, y, width, height, m);
}

/**
 * Painel HUD «Cinema e ao vivo» (zona `campus-cinema` / target `cinema_live_rail`).
 * Não confundir com: `CampusHudAmbientMusic`, `CineDriveIn`, nem cartões/peers no mapa.
 */
function CampusMapCinemaLiveFloatingFrame({
  cinemaExpanded,
  setCinemaExpanded,
  setCinemaOpen
}: {
  cinemaExpanded: boolean;
  setCinemaExpanded: (v: boolean) => void;
  setCinemaOpen: (v: boolean) => void;
}) {
  const hotspotPanelOpen = Boolean(useCampusHudStore((s) => s.campusMapHotspotPanelHitId));
  const cinemaHudStaticSrc = useMemo(() => resolveCampusCinemaVideoSrc(), []);
  const shellRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const xMv = useMotionValue(0);
  const yMv = useMotionValue(0);
  /** Preferência vertical (px): LS na primeira montagem; depois valor actual / arrasto. */
  const verticalAnchorRef = useRef<number | null | undefined>(undefined);

  const persistPosition = useCallback(() => {
    const el = shellRef.current;
    if (!el || typeof window === "undefined") return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const c = dockedCinemaLiveFrameXY(w, h, hotspotPanelOpen, verticalAnchorRef.current ?? null);
    xMv.set(c.x);
    yMv.set(c.y);
    verticalAnchorRef.current = c.y;
    writeCampusCinemaLiveFramePosition({ version: 2, y: c.y });
  }, [xMv, yMv, hotspotPanelOpen]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    if (verticalAnchorRef.current === undefined) {
      verticalAnchorRef.current = readCampusCinemaLiveFramePosition()?.y ?? null;
    }

    const apply = () => {
      const el = shellRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const c = dockedCinemaLiveFrameXY(w, h, hotspotPanelOpen, verticalAnchorRef.current ?? null);
      xMv.set(c.x);
      yMv.set(c.y);
      verticalAnchorRef.current = c.y;
    };

    apply();
    const id = requestAnimationFrame(() => requestAnimationFrame(apply));
    return () => cancelAnimationFrame(id);
  }, [cinemaExpanded, hotspotPanelOpen, xMv, yMv]);

  useEffect(() => {
    const onResize = () => {
      const el = shellRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const c = dockedCinemaLiveFrameXY(w, h, hotspotPanelOpen, verticalAnchorRef.current ?? null);
      xMv.set(c.x);
      yMv.set(c.y);
      verticalAnchorRef.current = c.y;
      writeCampusCinemaLiveFramePosition({ version: 2, y: c.y });
    };
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [xMv, yMv, hotspotPanelOpen]);

  const onDragEnd = useCallback(() => {
    verticalAnchorRef.current = yMv.get();
    persistPosition();
  }, [persistPosition, yMv]);

  return (
    <motion.div
      ref={shellRef}
      role="dialog"
      aria-modal
      aria-label="Cinema e ao vivo"
      title={cinemaExpanded ? undefined : "Cinema e ao vivo — expandir"}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      className={cn(
        "pointer-events-auto flex flex-col overflow-hidden border border-white/14 shadow-[0_12px_40px_rgba(0,0,0,0.38)] backdrop-blur-2xl ring-1 ring-white/[0.06]",
        hotspotPanelOpen
          ? "max-sm:rounded-2xl sm:rounded-r-2xl sm:rounded-l-lg"
          : "rounded-r-2xl rounded-l-lg",
        "max-h-[min(calc(100dvh-7rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)),560px)]",
        cinemaExpanded
          ? "w-[min(calc(100vw-1rem),340px)] min-w-[260px] max-sm:w-[min(calc(100vw-2.25rem),340px)]"
          : "w-11 min-w-[44px]"
      )}
      style={{
        x: xMv,
        y: yMv,
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: CINEMA_LIVE_FRAME_Z,
        touchAction: "none",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)"
      }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={onDragEnd}
      onClick={(e) => e.stopPropagation()}
    >
      {cinemaExpanded ? (
        <div
          className="flex cursor-grab touch-none items-center gap-1 border-b border-white/10 py-1 pl-1 pr-0.5 active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <GripVertical size={14} className="ml-0.5 shrink-0 text-white/38" aria-hidden />
          <Clapperboard size={15} className="shrink-0 text-amber-200/88" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-200/72">
            Ao vivo · cinema
          </span>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white"
            aria-expanded={cinemaExpanded}
            aria-label="Recolher painel"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setCinemaExpanded(false);
            }}
          >
            <ChevronLeft size={19} />
          </button>
          <button
            type="button"
            className="shrink-0 rounded-lg p-2 text-white/45 hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setCinemaOpen(false);
            }}
          >
            <X size={17} />
          </button>
        </div>
      ) : (
        <div
          className="flex cursor-grab touch-none flex-col items-center gap-1 border-b border-white/10 px-0 py-2 active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <span className="sr-only">Arrastar para mover o painel ao vivo na vertical</span>
          <GripVertical size={14} className="text-white/38" aria-hidden />
          <button
            type="button"
            className="flex h-9 w-full items-center justify-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white"
            aria-expanded={cinemaExpanded}
            aria-label="Expandir painel"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setCinemaExpanded(true);
            }}
          >
            <ChevronRight size={19} />
          </button>
        </div>
      )}
      {cinemaExpanded ? (
        <div className="thin-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 text-[13px] text-white/82">
          <div className="space-y-2 rounded-2xl border border-white/14 bg-white/[0.04] p-3 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-200/75">Player</p>
            {cinemaHudStaticSrc ? (
              <CampusCinemaHudPreview src={cinemaHudStaticSrc} />
            ) : (
              <CampusLiveStreamOfflinePoster />
            )}
          </div>
          <div className="rounded-2xl border border-amber-400/15 bg-amber-950/20 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200/70">Ao vivo</p>
            <p className="mt-2 text-white/75">
              Aqui verias o estado da transmissão ao vivo quando estiver ligada.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">Chat</p>
            <p className="mt-2 text-[12px] text-white/55">
              Espaço para conversa com quem está a ver o mesmo ecrã — ainda por configurar.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">Eventos</p>
            <p className="mt-2 text-[12px] text-white/55">
              Lista rápida do que passa no telão — exemplo para acompanhar o ritmo do campus.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">Programação</p>
            <p className="mt-2 text-[12px] text-white/55">
              Atalho para a programação do dia — abre o painel completo quando quiseres ver tudo junto.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1 pb-2 pt-1" aria-hidden>
          <Clapperboard size={14} className="text-amber-200/72" />
          <span className="max-h-[4.5rem] overflow-hidden text-[8px] font-semibold uppercase leading-tight tracking-wide text-white/42 [writing-mode:vertical-rl] rotate-180">
            Live
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function CampusMapInteractiveMapPanels({
  sky,
  showHotspotTechStripe
}: Props) {
  const scheduleOpen = useCampusHudStore((s) => s.campusMapScheduleDayOpen);
  const setScheduleOpen = useCampusHudStore((s) => s.setCampusMapScheduleDayOpen);
  const cinemaOpen = useCampusHudStore((s) => s.campusMapCinemaLiveOpen);
  const setCinemaOpen = useCampusHudStore((s) => s.setCampusMapCinemaLiveOpen);
  const cinemaExpanded = useCampusHudStore((s) => s.campusMapCinemaLiveExpanded);
  const setCinemaExpanded = useCampusHudStore((s) => s.setCampusMapCinemaLiveExpanded);
  const muralOpen = useCampusHudStore((s) => s.campusMapMuralFeedOpen);
  const setMuralOpen = useCampusHudStore((s) => s.setCampusMapMuralFeedOpen);
  const cineDriveInOpen = useCampusStore((s) => s.isCineOpen);

  const [muralDraft, setMuralDraft] = useState("");
  const [muralMessages, setMuralMessages] = useState<{ id: string; text: string; at: string }[]>([
    { id: "m1", text: "Boa energia neste campus — curti o painel novo.", at: "há pouco" },
    { id: "m2", text: "Alguém sabe quando abre a próxima live de solventless?", at: "há 1 h" }
  ]);

  const pushMuralDemo = useCallback(() => {
    const t = muralDraft.trim();
    if (!t) return;
    setMuralMessages((prev) => [
      { id: `local-${Date.now()}`, text: t, at: "agora" },
      ...prev
    ]);
    setMuralDraft("");
  }, [muralDraft]);

  const backdropTint =
    sky === "day" ? "bg-sky-950/[0.18] backdrop-blur-[10px]" : "bg-black/[0.22] backdrop-blur-[10px]";

  const glassPanel = cn(
    "border shadow-[220px_0_120px_rgba(14,165,233,0.04)]",
    sky === "day"
      ? "border-white/35 bg-gradient-to-br from-white/[0.42] via-white/[0.18] to-cyan-50/[0.16]"
      : "border-white/14 bg-gradient-to-br from-white/[0.09] via-white/[0.05] to-emerald-950/[0.12]"
  );

  return (
    <>
      <CampusMapHotspotPanel sky={sky} showTechStripe={showHotspotTechStripe} />
      <AnimatePresence>
        {scheduleOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Fechar programação"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn("fixed inset-0 z-[51]", backdropTint)}
              onClick={() => setScheduleOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal
              aria-labelledby="campus-schedule-day-title"
              initial={{ x: "-105%" }}
              animate={{ x: 0 }}
              exit={{ x: "-105%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className={cn(
                "fixed left-0 top-0 z-[52] flex h-full w-[min(100vw,380px)] flex-col pt-[calc(3.75rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] pl-[max(0.75rem,env(safe-area-inset-left))] pr-3"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={cn(
                  "flex max-h-[min(100dvh,100%)] flex-col overflow-hidden rounded-r-3xl",
                  glassPanel,
                  "backdrop-blur-2xl"
                )}
              >
                <header className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3.5">
                  <div>
                    <p
                      id="campus-schedule-day-title"
                      className={cn(
                        "text-base font-semibold tracking-tight",
                        sky === "day" ? "text-slate-900/95" : "text-white/94"
                      )}
                    >
                      Programação do dia
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/45">
                      Agenda ilustrativa — horários reais vêm da coordenação e da sala oficial.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                    aria-label="Fechar"
                    onClick={() => setScheduleOpen(false)}
                  >
                    <X size={18} strokeWidth={2} />
                  </button>
                </header>
                <div className="thin-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
                  <SectionBlock
                    sky={sky}
                    title="Aulas ao vivo"
                    rows={[
                      { id: "a1", label: "Cannabis 101 · dúvidas e síntese", meta: "14:00 · Sala de formação" },
                      { id: "a2", label: "Indoor: clima & VPD", meta: "16:30 · Laboratório" }
                    ]}
                  />
                  <SectionBlock
                    sky={sky}
                    title="Eventos"
                    rows={[
                      { id: "e1", label: "Bate-papo com cultivadores", meta: "18:00 · Praça" },
                      { id: "e2", label: "Sorteio de merch THCProce", meta: "19:45 · Loja" }
                    ]}
                  />
                  <SectionBlock
                    sky={sky}
                    title="Próximas lives"
                    rows={[
                      { id: "l1", label: "Extrações solventless", meta: "Amanhã · 11:00" },
                      { id: "l2", label: "Legislação em debate", meta: "Quinta · 20:00" }
                    ]}
                  />
                  <SectionBlock
                    sky={sky}
                    title="Cinema do dia"
                    rows={[{ id: "c1", label: "Curtas da comunidade", meta: "21:00 · Telão drive-in" }]}
                  />
                  <SectionBlock
                    sky={sky}
                    title="Em destaque"
                    rows={[
                      { id: "ag1", label: "Novidades na loja do campus", meta: "Esta semana" },
                      { id: "ag2", label: "Mais conteúdo outdoor a caminho", meta: "Em breve" }
                    ]}
                  />
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {cinemaOpen && !cineDriveInOpen ? (
          <CampusMapCinemaLiveFloatingFrame
            key="campus-cinema-live-floating"
            cinemaExpanded={cinemaExpanded}
            setCinemaExpanded={setCinemaExpanded}
            setCinemaOpen={setCinemaOpen}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {muralOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Fechar mural"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn("fixed inset-0 z-[51]", backdropTint)}
              onClick={() => setMuralOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-labelledby="campus-mural-feed-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed left-1/2 top-[44%] z-[52] w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2"
              onClick={(e) => e.stopPropagation()}
            >
                <div
                  className={cn(
                    "relative overflow-hidden rounded-[1.35rem] border border-cyan-200/30 p-[1px] shadow-[0_0_96px_rgba(34,211,238,0.16),0_0_1px_rgba(167,243,208,0.35)_inset]",
                    sky === "day" ? "bg-gradient-to-br from-white/55 via-cyan-100/25 to-violet-100/30" : "bg-gradient-to-br from-white/20 via-teal-500/10 to-violet-600/15"
                  )}
                >
                <div
                  className={cn(
                    "relative rounded-[1.28rem] px-5 py-5 backdrop-blur-2xl",
                    sky === "day" ? "bg-white/[0.38]" : "bg-[linear-gradient(160deg,rgba(255,255,255,0.1)_0%,rgba(6,22,30,0.55)_48%,rgba(8,16,24,0.62)_100%)]"
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(167,243,208,0.62),transparent_52%),radial-gradient(ellipse_at_88%_18%,rgba(196,181,253,0.42),transparent_48%),linear-gradient(125deg,transparent_40%,rgba(255,255,255,0.06)_50%,transparent_60%)] opacity-[0.42] mix-blend-overlay" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="text-teal-200/90" size={20} />
                      <div>
                        <h2
                          id="campus-mural-feed-title"
                          className={cn(
                            "text-lg font-semibold tracking-tight",
                            sky === "day" ? "text-slate-900/95" : "text-white/95"
                          )}
                        >
                          Mural do campus
                        </h2>
                        <p className="text-[11px] text-white/50">
                          Modo demonstração: os recados ficam guardados só neste aparelho.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl p-2 text-white/45 transition hover:bg-white/10 hover:text-white"
                      aria-label="Fechar"
                      onClick={() => setMuralOpen(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <ul className="relative mt-5 max-h-[min(42vh,320px)] space-y-3 overflow-y-auto pr-1">
                    {muralMessages.map((m, i) => (
                      <li
                        key={m.id}
                        className={cn(
                          "relative rounded-2xl border px-4 py-3 shadow-sm",
                          sky === "day"
                            ? "border-white/35 bg-white/55 text-slate-900/92"
                            : "border-white/12 bg-white/[0.07] text-white/88",
                          i > 0 ? "-mt-2 translate-x-1 scale-[0.98] opacity-90" : "",
                          i > 1 ? "translate-x-2 scale-[0.96] opacity-75" : ""
                        )}
                        style={{
                          transform: `perspective(800px) rotateX(${i * 2}deg) translateZ(${-i * 4}px)`,
                          zIndex: 10 - i
                        }}
                      >
                        <p className="text-[13px] leading-snug">{m.text}</p>
                        <p className="mt-1.5 text-[10px] text-white/40">{m.at}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-4 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={muralDraft}
                      onChange={(e) => setMuralDraft(e.target.value)}
                      placeholder="Escreve um recado…"
                      className={cn(
                        "min-h-[44px] flex-1 rounded-xl border px-3 text-[13px] outline-none ring-teal-400/30 focus:ring-2",
                        sky === "day"
                          ? "border-slate-300/60 bg-white/80 text-slate-900 placeholder:text-slate-500/80"
                          : "border-white/15 bg-black/30 text-white placeholder:text-white/35"
                      )}
                    />
                    <Button
                      type="button"
                      variant="glass"
                      size="sm"
                      className="shrink-0"
                      onClick={pushMuralDemo}
                    >
                      Publicar recado
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
