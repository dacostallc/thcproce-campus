"use client";

import { useEffect, useRef } from "react";
import { enterCampusLiveAuditorium } from "@/lib/campusEnterLiveAuditorium";
import { SESSION_CAMPUS_CINE_LIVE_DISMISSED } from "@/lib/campusLiveSession";
import { useCampusPresenceStore } from "@/stores/campusPresenceStore";
import { useCampusStore } from "@/stores/campusStore";

/**
 * Com live ativa ao carregar ou quando a live acaba de iniciar (`false` → `true`), entra no auditório e abre o Cine
 * para o público esperar enquanto vê os assentos (e usar o chat se quiserem).
 */
export function CampusLiveAuditoriumAutoEnter() {
  const isLiveActive = useCampusStore((s) => s.isLiveActive);
  const prevLiveActiveRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isLiveActive) {
      try {
        sessionStorage.removeItem(SESSION_CAMPUS_CINE_LIVE_DISMISSED);
      } catch {
        /* SSR / modo privado */
      }
      prevLiveActiveRef.current = false;
      return;
    }

    const prev = prevLiveActiveRef.current;
    prevLiveActiveRef.current = true;

    const shouldAutoEnter =
      prev === null /* primeiro render com live já ligada na env ou store */ ||
      prev === false; /* live acaba de ser ligada */

    if (!shouldAutoEnter) return;

    try {
      if (sessionStorage.getItem(SESSION_CAMPUS_CINE_LIVE_DISMISSED)) return;
    } catch {
      /* continuar mesmo sem sessão */
    }

    queueMicrotask(() => {
      const st = useCampusStore.getState();
      enterCampusLiveAuditorium({
        othersByUid: useCampusPresenceStore.getState().othersByUid,
        player: st.player,
        setPlayer: st.setPlayer,
        setAvatarPosture: st.setAvatarPosture,
        setCinemaSeatIndex: st.setCinemaSeatIndex,
        setCinemaAuditoriumFull: st.setCinemaAuditoriumFull,
        setIsCineOpen: st.setIsCineOpen
      });
    });
  }, [isLiveActive]);

  return null;
}
