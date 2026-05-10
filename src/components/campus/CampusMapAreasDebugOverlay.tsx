"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  type CampusMapArea,
  CAMPUS_MAP_AREAS_OVERLAY_LS_KEY,
  campusMapNormalizePolygonToPercent,
  campusMapPolygonToSvgPoints,
  resolveCampusMapAreasForOverlay
} from "@/lib/campusMapAreasCatalog";
import { isCampusMapAreasPolygonOverlayEnabled } from "@/config/campusMapStability";

type Props = {
  className?: string;
  /**
   * Só uso da página `/preview/campus-map-areas`: só estes vértices, sem ler catálogo/LS nem exigir flags de ambiente.
   */
  isolatedPreviewAreas?: CampusMapArea[] | null;
  /**
   * No `/campus`, quando passado por `CampusMap`, substitui a heurística `NODE_ENV === development`
   * (ex.: em produção só com `?debugZones=1` ou flag `NEXT_PUBLIC_CAMPUS_MAP_AREAS_DEBUG`).
   */
  catalogMergeEnabled?: boolean;
};

/**
 * Desenha polígonos sobre o palco do mapa (viewBox 0 0 100 100, mesmo sistema que hit-boxes simples).
 * Montagem no `/campus` é decidida por `CampusMap` (debug de zonas / env).
 */
export function CampusMapAreasDebugOverlay({
  className,
  isolatedPreviewAreas,
  catalogMergeEnabled
}: Props) {
  const [lsJson, setLsJson] = useState<string | null>(null);

  const envAllowsOverlayOnCampus =
    typeof catalogMergeEnabled === "boolean"
      ? catalogMergeEnabled
      : typeof process !== "undefined" &&
        (process.env.NODE_ENV === "development" || isCampusMapAreasPolygonOverlayEnabled());

  useEffect(() => {
    if (typeof window === "undefined" || isolatedPreviewAreas !== undefined) return;
    const read = () => {
      try {
        setLsJson(window.localStorage.getItem(CAMPUS_MAP_AREAS_OVERLAY_LS_KEY));
      } catch {
        setLsJson(null);
      }
    };
    read();
    const onStorage = (e: StorageEvent) => {
      if (e.key === CAMPUS_MAP_AREAS_OVERLAY_LS_KEY) read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isolatedPreviewAreas]);

  const merged = useMemo(() => {
    if (isolatedPreviewAreas !== undefined) {
      return isolatedPreviewAreas ?? [];
    }
    if (!envAllowsOverlayOnCampus) return [];
    return resolveCampusMapAreasForOverlay({
      /** Exemplos só com flag explícita — evita poluír o `/campus` quando o modo image-map já está activo. */
      includeExamples: isCampusMapAreasPolygonOverlayEnabled(),
      jsonOverride: lsJson
    });
  }, [isolatedPreviewAreas, envAllowsOverlayOnCampus, lsJson]);

  if (!merged.length) return null;

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 z-[6] overflow-visible [&_polygon]:motion-reduce:stroke-[0.4]",
        className
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {merged.map((area) => {
        const pts = campusMapNormalizePolygonToPercent(area);
        const ptsAttr = campusMapPolygonToSvgPoints(pts);
        const isEx = Boolean(area.exampleOnly);
        return (
          <g key={area.id}>
            <polygon
              points={ptsAttr}
              fill={isEx ? "rgba(250,204,21,0.12)" : "rgba(52,211,153,0.1)"}
              stroke={isEx ? "rgba(250,204,21,0.65)" : "rgba(52,211,153,0.55)"}
              strokeWidth={0.25}
              vectorEffect="non-scaling-stroke"
            />
            {area.label ? (
              <text
                x={pts[0]!.x}
                y={Math.max(0, pts[0]!.y - 1)}
                fill={isEx ? "rgba(250,230,138,0.95)" : "rgba(209,250,229,0.95)"}
                fontSize={2}
                fontWeight={600}
              >
                {area.label.length > 36 ? `${area.label.slice(0, 34)}…` : area.label}
              </text>
            ) : (
              <text
                x={pts[0]!.x}
                y={Math.max(0, pts[0]!.y - 1)}
                fill="rgba(255,255,255,0.72)"
                fontSize={1.65}
              >
                {area.id}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
