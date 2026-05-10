"use client";

import { useEffect, useRef } from "react";
import { useCampusStore } from "@/stores/campusStore";
import { mergeCampusMapMemory, readCampusMapMemory } from "@/lib/campusMapMemoryStorage";

/**
 * Persistência leve no cliente (cinema + spawn) — preparação para sync com perfil.
 * Sem ler LS durante SSR (sem hydration mismatch).
 */
export function CampusWorldPersistenceSync() {
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    const mem = readCampusMapMemory();
    if (mem?.cinemaDriveInOpen === true) {
      useCampusStore.getState().setIsCineOpen(true);
    }
  }, []);

  useEffect(() => {
    let prevCine = useCampusStore.getState().isCineOpen;
    return useCampusStore.subscribe((s) => {
      if (s.isCineOpen === prevCine) return;
      prevCine = s.isCineOpen;
      mergeCampusMapMemory({ cinemaDriveInOpen: s.isCineOpen });
    });
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    return useCampusStore.subscribe((s) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        mergeCampusMapMemory({
          lastAvatarPct: s.player,
          lastSpawnPosition: { xPercent: s.player.x, yPercent: s.player.y },
          lastActivityAt: Date.now()
        });
      }, 400);
    });
  }, []);

  return null;
}
