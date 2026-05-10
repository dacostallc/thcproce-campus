"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { useCampusPresenceStore } from "@/stores/campusPresenceStore";
import { useCampusStore } from "@/stores/campusStore";
import type { CampusActivityKind } from "@/lib/campusPresenceActivity";
import { deriveLocalCampusActivity, campusActivityLabelPt } from "@/lib/campusPresenceActivity";
import {
  coerceCampusActivityKind,
  inferCampusActivityFromLegacyPayload
} from "@/lib/campusPresenceActivity";
import type { CampusRealtimePayload } from "@/lib/campusCinemaSeats";

export type CampusPresenceVisitorRow = {
  uid: string;
  displayName: string;
  activity: CampusActivityKind;
  activityLabel: string;
};

export type CampusPresenceBreakdown = {
  /** Visitantes únicos em `/campus` via Realtime (`useCampusPresence`) quando ligado. */
  totalOnCampus: number | null;
  /**
   * Compat — overlay «Campus vivo»: antes mock puro; agora derivado de contagens por actividade
   * quando há dados de peers (senão mantém heurística suave).
   */
  inRooms: number | null;
  inLessons: number | null;
  activityCounts: Record<CampusActivityKind, number>;
  visitors: CampusPresenceVisitorRow[];
  /** Estado local (mapa + pathname) para destacar na lista. */
  localVisitorRow: CampusPresenceVisitorRow | null;
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function peerActivity(p: CampusRealtimePayload): CampusActivityKind {
  return (
    coerceCampusActivityKind(p.campusActivity) ??
    inferCampusActivityFromLegacyPayload(Boolean(p.inCinema))
  );
}

function deriveAmbientBreakdown(total: number | null, tick: number): Pick<
  CampusPresenceBreakdown,
  "totalOnCampus" | "inRooms" | "inLessons"
> {
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

const ZERO_ACTIVITY: Record<CampusActivityKind, number> = {
  studying: 0,
  cinema: 0,
  mural: 0,
  shop: 0,
  lesson: 0
};

/**
 * Presença rica: contagem global (`campusVisitorCount`) + histograma e lista a partir dos peers do mapa.
 * Sem hacks de servidor — quando não há Supabase, a lista fica vazia mas o overlay mantém ruído demo legível.
 */
export function useCampusPresenceBreakdown(): CampusPresenceBreakdown {
  const total = useCampusHudStore((s) => s.campusVisitorCount);
  const othersByUid = useCampusPresenceStore((s) => s.othersByUid);
  const pathname = usePathname() ?? "";

  const muralOpen = useCampusHudStore((s) => s.muralOpen);
  const muralFeedOpen = useCampusHudStore((s) => s.campusMapMuralFeedOpen);
  const campusStoreOpen = useCampusHudStore((s) => s.campusStoreOpen);
  const lessonPanelOpen = useCampusHudStore((s) => s.campusLessonPanelOpen);

  const isCineOpen = useCampusStore((s) => s.isCineOpen);

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

  const localActivity = useMemo(
    () =>
      deriveLocalCampusActivity({
        pathname,
        isCineOpen,
        lessonPanelOpen,
        muralOpen,
        muralFeedOpen,
        campusStoreOpen
      }),
    [
      pathname,
      isCineOpen,
      lessonPanelOpen,
      muralOpen,
      muralFeedOpen,
      campusStoreOpen
    ]
  );

  return useMemo(() => {
    const ambient = deriveAmbientBreakdown(total, tick);
    const peers = Object.values(othersByUid);

    if (!peers.length) {
      return {
        ...ambient,
        activityCounts: { ...ZERO_ACTIVITY },
        visitors: [],
        localVisitorRow: {
          uid: "__local__",
          displayName: "Tu (esta sessão)",
          activity: localActivity,
          activityLabel: campusActivityLabelPt(localActivity)
        }
      };
    }

    const activityCounts: Record<CampusActivityKind, number> = { ...ZERO_ACTIVITY };
    for (const p of peers) {
      activityCounts[peerActivity(p)] += 1;
    }

    const visitors: CampusPresenceVisitorRow[] = [...peers]
      .sort((a, b) =>
        String(a.displayName || a.label).localeCompare(String(b.displayName || b.label), "pt")
      )
      .slice(0, 14)
      .map((p) => {
        const act = peerActivity(p);
        return {
          uid: p.uid,
          displayName: String(p.displayName || p.label || "Aluno").slice(0, 28),
          activity: act,
          activityLabel: campusActivityLabelPt(act)
        };
      });

    const cinemaCluster = activityCounts.cinema + activityCounts.mural + activityCounts.shop;
    const inRooms = Math.max(1, cinemaCluster + Math.round(activityCounts.studying * 0.35));
    const inLessons = Math.max(1, activityCounts.lesson);

    return {
      totalOnCampus: ambient.totalOnCampus,
      inRooms,
      inLessons,
      activityCounts,
      visitors,
      localVisitorRow: {
        uid: "__local__",
        displayName: "Tu (esta sessão)",
        activity: localActivity,
        activityLabel: campusActivityLabelPt(localActivity)
      }
    };
  }, [othersByUid, total, tick, localActivity]);
}
