"use client";

import { useMemo } from "react";
import { CAMPUS_ZONES, type CampusZone } from "@/data/campusZones";
import {
  labelPositionToSvgPercent,
  pointsToSvg
} from "@/lib/campusZoneUtils";

type Phase = "day" | "night";

type Props = {
  phase: Phase;
  visible: boolean;
  selectedAreaId: string | null;
  nearestAreaId: string | null;
  onZonePointerDown?: (zone: CampusZone) => void;
};

function zoneVisualState(
  zone: CampusZone,
  selectedAreaId: string | null,
  nearestAreaId: string | null
): "active" | "hover" | "idle" {
  if (
    selectedAreaId &&
    zone.courseIds.includes(selectedAreaId)
  ) {
    return "active";
  }
  if (nearestAreaId && zone.courseIds.includes(nearestAreaId)) {
    return "hover";
  }
  return "idle";
}

/**
 * Polígonos do mapa numerado (01–17): sem cálculo automático — só `points` + `labelPosition` da config.
 */
export function CampusZoneOverlays({
  phase,
  visible,
  selectedAreaId,
  nearestAreaId,
  onZonePointerDown
}: Props) {
  const isNight = phase === "night";

  const sorted = useMemo(
    () => [...CAMPUS_ZONES].sort((a, b) => a.priority - b.priority),
    []
  );

  const styleForZone = useMemo(() => {
    return (zone: CampusZone, state: "active" | "hover" | "idle") => {
      let fillOpacity = isNight ? 0.16 : 0.11;
      let strokeOpacity = isNight ? 0.95 : 0.88;
      let strokeW = isNight ? 0.2 : 0.16;

      if (state === "hover") {
        fillOpacity += isNight ? 0.07 : 0.05;
        strokeOpacity = 1;
        strokeW += 0.04;
      }
      if (state === "active") {
        fillOpacity += isNight ? 0.09 : 0.06;
        strokeOpacity = 1;
        strokeW += 0.05;
      }

      if (zone.status !== "active") {
        fillOpacity *= 0.5;
        strokeOpacity *= 0.62;
      }

      const filter =
        state !== "idle"
          ? `drop-shadow(0 0 5px ${zone.glow}) drop-shadow(0 0 12px ${zone.glow})`
          : `drop-shadow(0 0 2px ${zone.glow})`;

      return { fillOpacity, strokeOpacity, strokeW, filter };
    };
  }, [isNight]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-[11] transition-opacity duration-700"
      style={{
        isolation: "isolate",
        mixBlendMode: "normal"
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none h-full w-full overflow-visible select-none"
        role="presentation"
      >
        <defs>
          <filter
            id="campus-zone-num-shadow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feDropShadow
              dx="0"
              dy="0.06"
              stdDeviation="0.2"
              floodColor="rgba(0,0,0,0.55)"
            />
          </filter>
        </defs>
        {sorted.map((zone) => {
          const d = pointsToSvg(zone.points);
          const state = zoneVisualState(zone, selectedAreaId, nearestAreaId);
          const { fillOpacity, strokeOpacity, strokeW, filter } = styleForZone(
            zone,
            state
          );

          const matte =
            isNight ? "rgba(2, 8, 6, 0.72)" : "rgba(252, 252, 255, 0.55)";
          const lp = labelPositionToSvgPercent(zone.labelPosition);

          const zoneA11yLabel = `${zone.number} · ${zone.label} — ${zone.description}`;

          return (
            <g key={zone.id} role="group" aria-label={zoneA11yLabel}>
              {/* Hit target: invisível mas clicável; visual por cima com pointer-events off */}
              <path
                d={d}
                fill="#000000"
                fillOpacity={0.02}
                stroke="transparent"
                strokeWidth={0.85}
                className="pointer-events-auto cursor-pointer touch-manipulation"
                style={{ pointerEvents: "auto" }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onZonePointerDown?.(zone);
                }}
              />
              <path
                d={d}
                fill="none"
                stroke={matte}
                strokeWidth={strokeW * 2.15}
                strokeLinejoin="round"
                strokeLinecap="round"
                shapeRendering="geometricPrecision"
                className="pointer-events-none"
                strokeDasharray={
                  zone.status !== "active" ? "0.35 0.22" : undefined
                }
              />
              <path
                d={d}
                fill={zone.glow}
                fillOpacity={fillOpacity}
                stroke={zone.color}
                strokeWidth={strokeW}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeOpacity={strokeOpacity}
                shapeRendering="geometricPrecision"
                className="pointer-events-none"
                strokeDasharray={
                  zone.status !== "active" ? "0.35 0.22" : undefined
                }
                style={{
                  paintOrder: "stroke fill" as const,
                  filter
                }}
              />

              <g
                className="pointer-events-none"
                style={{ filter: "url(#campus-zone-num-shadow)" }}
              >
                <circle
                  cx={lp.x}
                  cy={lp.y}
                  r={1.15}
                  fill="rgba(6,10,8,0.78)"
                  stroke={zone.color}
                  strokeWidth={0.18}
                />
                <text
                  x={lp.x}
                  y={lp.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  style={{
                    fontSize: "1.05px",
                    fontWeight: 700,
                    fontFamily: "system-ui, sans-serif"
                  }}
                >
                  {zone.number}
                </text>
              </g>

              <text
                x={lp.x}
                y={lp.y + 3.6}
                textAnchor="middle"
                fill={isNight ? "rgba(250,250,252,0.92)" : "rgba(15,23,42,0.9)"}
                stroke={isNight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.45)"}
                strokeWidth={0.12}
                style={{
                  fontSize: "0.75px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase" as const,
                  paintOrder: "stroke fill" as const
                }}
              >
                {zone.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
