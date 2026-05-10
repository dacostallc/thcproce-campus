"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCampusHudStore } from "@/stores/campusHudStore";

export type CampusPresenceBreakdown = {
  /** Visitors unique on `/campus` routes (Realtime) when connected. */
  totalOnCampus: number | null;
  /**
   * Mock split — NOT from Supabase Presence yet.
   *
   * Formulas (UI demo until room/lesson tracks exist):
   * - Let `t = max(totalOnCampus, 8)` when online count unavailable use `t = 10 + (now/30s % 5)` for ambient map only.
   * - `inRooms = clamp(round(t * (0.38 + 0.04 * sin(seed))), 1, max(1, t - 2))`
   * - `inLessons = clamp(round(t * (0.19 + 0.03 * cos(seed * 1.3))), 1, max(1, t - inRooms - 1))`
   * - If `inRooms + inLessons > t`, scale both down proportionally (last step).
   */
  inRooms: number | null;
  inLessons: number | null;
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function deriveBreakdown(total: number | null, tick: number): CampusPresenceBreakdown {
  if (total === null) {
    const ambient = 10 + (Math.floor(tick / 2) % 6);
    const r = 0.38 + 0.04 * Math.sin(tick * 0.7);
    const l = 0.19 + 0.03 * Math.cos(tick * 0.9);
    let inRooms = clamp(Math.round(ambient * r), 1, Math.max(1, ambient - 2));
    let inLessons = clamp(Math.round(ambient * l), 1, Math.max(1, ambient - inRooms - 1));
    const sum = inRooms + inLessons;
    if (sum > ambient) {
      const scale = ambient / sum;
      inRooms = Math.max(1, Math.floor(inRooms * scale));
      inLessons = Math.max(1, Math.floor(inLessons * scale));
    }
    return {
      totalOnCampus: null,
      inRooms,
      inLessons
    };
  }

  const t = Math.max(total, 1);
  const seed = tick * 0.15;
  const r = 0.38 + 0.04 * Math.sin(seed);
  const l = 0.19 + 0.03 * Math.cos(seed * 1.3);
  let inRooms = clamp(Math.round(t * r), 1, Math.max(1, t - 2));
  let inLessons = clamp(Math.round(t * l), 1, Math.max(1, t - inRooms - 1));
  const sum = inRooms + inLessons;
  if (sum > t) {
    const scale = t / sum;
    inRooms = Math.max(1, Math.floor(inRooms * scale));
    inLessons = Math.max(1, Math.floor(inLessons * scale));
  }
  return { totalOnCampus: total, inRooms, inLessons };
}

/**
 * Reads `campusVisitorCount` from HUD store and exposes mock split rows for “salas / aulas”.
 * Re-computes every ~12s so numbers drift slightly (demo only).
 */
export function useCampusPresenceBreakdown(): CampusPresenceBreakdown {
  const total = useCampusHudStore((s) => s.campusVisitorCount);
  const [tick, setTick] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const id = window.setInterval(() => {
      if (!mounted.current) return;
      setTick((x) => x + 1);
    }, 12_000);
    return () => {
      mounted.current = false;
      window.clearInterval(id);
    };
  }, []);

  return useMemo(() => deriveBreakdown(total, tick), [total, tick]);
}
