"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { estimateCampusWalkTweenMs } from "@/lib/campusWalkEstimate";
import { useCampusSelfPresenceStore } from "@/stores/campusSelfPresenceStore";
import { useCampusStore } from "@/stores/campusStore";
import { useCampusHudStore } from "@/stores/campusHudStore";

const CAMPUS_ROUTE_PREFIX = "/campus";

function isCampusSurfacePath(pathname: string): boolean {
  const p = pathname || "";
  return p === CAMPUS_ROUTE_PREFIX || p.startsWith(`${CAMPUS_ROUTE_PREFIX}/`);
}

function resolveIdleExploreLesson(): void {
  const cinemaNow = useCampusStore.getState().isCineOpen;
  const lessonNow = useCampusHudStore.getState().campusLessonPanelOpen;
  const pathNow = typeof window !== "undefined" ? window.location.pathname || "" : "";
  const setStatus = useCampusSelfPresenceStore.getState().setStatus;

  if (cinemaNow) {
    setStatus("cinema");
    return;
  }
  if (lessonNow) {
    setStatus("lesson");
    return;
  }
  setStatus(isCampusSurfacePath(pathNow) ? "exploring" : "idle");
}

/**
 * Estado local do próprio aluno (online, posição %, idle/walking/cinema/lesson/exploring).
 * Integra com `player` existente; não substitui `CampusPresenceSync` (rede).
 */
export function CampusSelfPresenceSync() {
  const pathname = usePathname() ?? "";
  const walkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const patchPresence = useCampusSelfPresenceStore((s) => s.patch);
  const setAvatarPct = useCampusSelfPresenceStore((s) => s.setAvatarPct);
  const setOnline = useCampusSelfPresenceStore((s) => s.setOnline);
  const setStatus = useCampusSelfPresenceStore((s) => s.setStatus);

  useEffect(() => {
    const onVis = () => {
      const visible = document.visibilityState === "visible";
      setOnline(visible);
      if (!visible) setStatus("idle");
      else resolveIdleExploreLesson();
    };
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [setOnline, setStatus]);

  useEffect(() => {
    let prevPlayer = useCampusStore.getState().player;
    const unsub = useCampusStore.subscribe((state) => {
      const pos = state.player;
      if (pos.x === prevPlayer.x && pos.y === prevPlayer.y) return;

      setAvatarPct(pos);

      const ms = estimateCampusWalkTweenMs(prevPlayer, pos);
      prevPlayer = pos;

      if (walkingTimerRef.current) clearTimeout(walkingTimerRef.current);

      const cinemaOpen = state.isCineOpen;
      const lessonOpen = useCampusHudStore.getState().campusLessonPanelOpen;

      if (cinemaOpen) {
        patchPresence({ status: "cinema", lastAvatarPct: pos });
        return;
      }
      if (lessonOpen) {
        patchPresence({ status: "lesson", lastAvatarPct: pos });
        return;
      }

      patchPresence({ status: "walking", lastAvatarPct: pos });

      if (ms <= 0) return;

      walkingTimerRef.current = setTimeout(() => {
        walkingTimerRef.current = null;
        resolveIdleExploreLesson();
      }, ms + 40);
    });

    return () => {
      unsub();
      if (walkingTimerRef.current) clearTimeout(walkingTimerRef.current);
    };
  }, [patchPresence, setAvatarPct, setStatus]);

  useEffect(() => {
    let lastCine = useCampusStore.getState().isCineOpen;
    let lastLesson = useCampusHudStore.getState().campusLessonPanelOpen;

    const unsubCx = useCampusStore.subscribe((s) => {
      if (s.isCineOpen) setStatus("cinema");
      else if (lastCine && !s.isCineOpen) resolveIdleExploreLesson();
      lastCine = s.isCineOpen;
    });
    const unsubHud = useCampusHudStore.subscribe((h) => {
      const cin = useCampusStore.getState().isCineOpen;
      if (h.campusLessonPanelOpen && !cin) setStatus("lesson");
      else if (lastLesson && !h.campusLessonPanelOpen && !cin) resolveIdleExploreLesson();
      lastLesson = h.campusLessonPanelOpen;
    });

    return () => {
      unsubCx();
      unsubHud();
    };
  }, [setStatus]);

  useEffect(() => {
    if (!useCampusSelfPresenceStore.getState().online) {
      setStatus("idle");
      return;
    }
    resolveIdleExploreLesson();
  }, [pathname, setStatus]);

  useEffect(() => {
    const p = useCampusStore.getState().player;
    patchPresence({ lastAvatarPct: p });
  }, [patchPresence]);

  return null;
}
