"use client";

import { useMemo } from "react";
import type { MapZone } from "@/data/mapZones";
import {
  campusZoneLockedTooltip,
  type CampusUnlockContext,
  isCampusZoneUnlocked
} from "@/lib/campusZoneProgress";

export type ZoneStatus = {
  isLocked: boolean;
  isUnlocked: boolean;
  reason: string | null;
  opacity: number;
  grayscale: string;
  cursor: string;
  zoneFill: string;
  zoneStroke: string;
  zoneGlow: string;
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "").trim();
  const v =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(v, 16);
  if (Number.isNaN(n) || v.length !== 6) return { r: 74, g: 222, b: 128 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/**
 * Estado visual e de interação de uma zona (fog of war leve).
 * `active` = hover na zona desbloqueada.
 */
export function useZoneStatus(
  zone: MapZone,
  ctx: CampusUnlockContext,
  active: boolean
): ZoneStatus {
  return useMemo(() => {
    const locked = !isCampusZoneUnlocked(zone, ctx);
    const reason = locked ? campusZoneLockedTooltip(zone, ctx) : null;
    const { r, g, b } = hexToRgb(zone.color);

    const opacity = locked ? 0.52 : 1;
    const grayscale = locked ? "1" : "0";
    const cursor = locked ? "not-allowed" : "pointer";

    const fillAlpha = locked ? 0.07 : 0.09;
    const strokeAlpha = locked ? 0.22 : active ? 0.46 : 0.3;
    const zoneFill = `rgba(${r},${g},${b},${fillAlpha})`;
    const zoneStroke = `rgba(${r},${g},${b},${strokeAlpha})`;

    const glowAlpha = locked ? 0 : active ? 0.16 : 0.07;
    const zoneGlow =
      glowAlpha > 0
        ? `drop-shadow(0 0 5px rgba(${r},${g},${b},${glowAlpha})) drop-shadow(0 0 11px rgba(${r},${g},${b},${glowAlpha * 0.55}))`
        : "none";

    return {
      isLocked: locked,
      isUnlocked: !locked,
      reason,
      opacity,
      grayscale,
      cursor,
      zoneFill,
      zoneStroke,
      zoneGlow
    };
  }, [zone, ctx, active]);
}
