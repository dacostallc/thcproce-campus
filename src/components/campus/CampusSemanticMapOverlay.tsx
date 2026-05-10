"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CAMPUS_MAP_ITEMS,
  type CampusMapItem
} from "@/lib/campus/campusMapRegistry";
import type { Area } from "@/data/courses";
import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";
import { useCampusStore } from "@/stores/campusStore";
import { useCampusHudStore } from "@/stores/campusHudStore";

/** Ative/desative o overlay semântico sobre o mapa simples. */
export const ENABLE_SEMANTIC_MAP_OVERLAY = true;

type Props = {
  areas: readonly Area[];
  onSelectCourseArea: (area: Area) => void;
  /**
   * Abre aula do Cannabis 101 quando o stable id é válido.
   * Deve aplicar o mesmo fluxo que o mapa (gates, admin, etc.) via callback no pai.
   */
  onTryOpenCannabis101LessonByStableId?: (stableId: string) => boolean;
};

const CATEGORY_PT: Record<CampusMapItem["category"], string> = {
  fundamentos: "Fundamentos",
  cultivo: "Cultivo",
  extracao: "Extração",
  medicina: "Medicina",
  legislacao: "Legislação",
  genetica: "Genética",
  laboratorio: "Laboratório",
  comunidade: "Comunidade",
  evento: "Evento"
};

function statusLabelPt(status: CampusMapItem["status"]) {
  switch (status) {
    case "available":
      return "Disponível";
    case "coming-soon":
      return "Em breve";
    case "locked":
      return "Bloqueado";
    default:
      return status;
  }
}

function pinSurfaceClass(status: CampusMapItem["status"]) {
  switch (status) {
    case "available":
      return cn(
        "border border-emerald-300/90 bg-gradient-to-br from-amber-300 via-amber-400/95 to-emerald-600",
        "shadow-[0_0_10px_rgba(52,211,153,0.55),0_1px_2px_rgba(0,0,0,0.55)]"
      );
    case "coming-soon":
      return cn(
        "border border-amber-800/55 bg-black/62",
        "shadow-[inset_0_1px_0_rgba(251,191,36,0.12)] ring-1 ring-amber-950/40"
      );
    case "locked":
      return "border border-white/12 bg-zinc-900/88 opacity-70 shadow-inner";
    default:
      return "";
  }
}

export function CampusSemanticMapOverlay({
  areas,
  onSelectCourseArea,
  onTryOpenCannabis101LessonByStableId
}: Props) {
  const cineOpen = useCampusStore((s) => s.isCineOpen);
  const cinemaDockOpen = useCampusHudStore((s) => s.campusMapCinemaLiveOpen);
  const interactionsSuppressed = cineOpen || cinemaDockOpen;

  const [detailItem, setDetailItem] = useState<CampusMapItem | null>(null);

  const pins = useMemo(() => CAMPUS_MAP_ITEMS.filter((i) => i.marker), []);

  const resolveArea = useCallback(
    (courseId: string) => areas.find((a) => a.id === courseId) ?? null,
    [areas]
  );

  const activatePin = useCallback(
    (item: CampusMapItem) => {
      if (interactionsSuppressed) return;

      if (
        item.linkedLessonId &&
        item.linkedCourseId === CANNABIS101_AREA_ID &&
        onTryOpenCannabis101LessonByStableId?.(item.linkedLessonId)
      ) {
        setDetailItem(null);
        return;
      }

      if (item.linkedCourseId) {
        const area = resolveArea(item.linkedCourseId);
        if (area) {
          setDetailItem(null);
          onSelectCourseArea(area);
          return;
        }
      }

      setDetailItem(item);
    },
    [
      interactionsSuppressed,
      onSelectCourseArea,
      onTryOpenCannabis101LessonByStableId,
      resolveArea
    ]
  );

  useEffect(() => {
    if (!detailItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailItem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailItem]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[9]">
      {pins.map((item) => {
        const m = item.marker!;
        const label = item.shortTitle ?? item.title;
        const suppressed = interactionsSuppressed;

        return (
          <button
            key={item.id}
            type="button"
            disabled={suppressed}
            aria-label={label}
            title={item.title}
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`
            }}
            className={cn(
              "pointer-events-auto absolute z-[1] -translate-x-1/2 -translate-y-1/2 p-2",
              "touch-manipulation outline-none transition-transform duration-150",
              "focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
              !suppressed && "hover:scale-110 active:scale-95",
              suppressed && "cursor-default opacity-45 pointer-events-none"
            )}
            onClick={() => activatePin(item)}
          >
            <span
              className={cn(
                "relative flex size-[11px] shrink-0 items-center justify-center rounded-full",
                pinSurfaceClass(item.status)
              )}
              aria-hidden
            >
              <span className="absolute inset-[3px] rounded-full bg-white/14 blur-[0.5px]" />
            </span>
          </button>
        );
      })}

      {detailItem ? (
        <>
          <button
            type="button"
            aria-label="Fechar detalhes do ponto"
            className="pointer-events-auto absolute inset-0 z-[2] bg-black/48 backdrop-blur-[2px]"
            onClick={() => setDetailItem(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`semantic-map-pin-${detailItem.id}-title`}
            className={cn(
              "pointer-events-auto absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-[3] w-[min(22rem,calc(100%-2rem))]",
              "-translate-x-1/2 rounded-2xl border border-emerald-500/22 bg-black/72 px-4 py-3 shadow-xl backdrop-blur-md",
              "ring-1 ring-amber-400/15"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <h2
                id={`semantic-map-pin-${detailItem.id}-title`}
                className="text-sm font-semibold tracking-tight text-emerald-100/95"
              >
                {detailItem.title}
              </h2>
              <button
                type="button"
                className="shrink-0 rounded-lg px-2 py-1 text-[11px] uppercase tracking-wider text-amber-200/85 hover:bg-white/8"
                onClick={() => setDetailItem(null)}
              >
                Fechar
              </button>
            </div>
            <p className="mt-2 text-[13px] leading-snug text-white/78">
              {detailItem.description}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-white/55">
              <dt className="font-medium text-emerald-200/75">Estado</dt>
              <dd>{statusLabelPt(detailItem.status)}</dd>
              <dt className="font-medium text-emerald-200/75">Categoria</dt>
              <dd className="capitalize">{CATEGORY_PT[detailItem.category]}</dd>
            </dl>
          </div>
        </>
      ) : null}
    </div>
  );
}
