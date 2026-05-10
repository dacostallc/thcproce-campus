"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CampusRealtimePayload } from "@/lib/campusCinemaSeats";
import {
  CAMPUS_PRESENCE_PEER_FADE_MS,
  CAMPUS_PRESENCE_TTL_MS,
  CAMPUS_PRESENCE_VISUAL_TICK_MS
} from "@/config/campusPresence";
import { realtimePayloadToPresencePeer } from "@/lib/campusPresencePeerMappers";
import type { CampusPresencePeer } from "@/types/campusPresencePeer";

export type CampusPresencePeerVisual = {
  peer: CampusPresencePeer;
  realtime?: CampusRealtimePayload;
};

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/**
 * Mantém um snapshot «fantasma» por peer até TTL+fades, aplicando opacity para saída suave.
 * O store realtime só inclui peers frescos; este hook evita desaparecimentos bruscos.
 */
export function useCampusPresencePeersVisual(
  raw: Record<string, CampusRealtimePayload>
): CampusPresencePeerVisual[] {
  const ghostRef = useRef<Map<string, CampusRealtimePayload>>(new Map());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((x) => x + 1);
    }, CAMPUS_PRESENCE_VISUAL_TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  return useMemo(() => {
    const now = Date.now();
    const ghosts = ghostRef.current;

    for (const [uid, p] of Object.entries(raw)) {
      ghosts.set(uid, p);
    }

    const out: CampusPresencePeerVisual[] = [];
    const TTL = CAMPUS_PRESENCE_TTL_MS;
    const FADE = CAMPUS_PRESENCE_PEER_FADE_MS;

    for (const [uid, p] of [...ghosts.entries()]) {
      const at =
        typeof p.at === "number" && Number.isFinite(p.at) ? p.at : now;
      const age = now - at;

      if (age > TTL + FADE) {
        ghosts.delete(uid);
        continue;
      }

      const opacity = age <= TTL ? 1 : clamp01(1 - (age - TTL) / FADE);
      const mapped = realtimePayloadToPresencePeer(p);

      const peer: CampusPresencePeer = {
        ...mapped,
        lastSeenAt: at,
        status: opacity < 1 ? "offline" : mapped.status,
        visualOpacity: opacity,
        currentZoneId: p.currentZoneId ?? mapped.currentZoneId
      };

      out.push({ peer, realtime: opacity > 0 ? p : undefined });
    }

    out.sort((a, b) => a.peer.peerId.localeCompare(b.peer.peerId));
    return out;
  }, [raw, tick]);
}
