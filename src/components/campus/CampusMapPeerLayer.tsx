"use client";

import { useMemo } from "react";
import { useCampusPresenceStore } from "@/stores/campusPresenceStore";
import { useCampusStore } from "@/stores/campusStore";
import { CampusUnifiedPresencePeers } from "@/components/campus/CampusUnifiedPresencePeers";
import type { CampusRealtimePayload } from "@/lib/campusCinemaSeats";
import {
  socialPollPeerToPresencePeer,
  type CampusSocialPollPeerLite
} from "@/lib/campusPresencePeerMappers";
import type { CampusPresencePeer } from "@/types/campusPresencePeer";
import {
  useCampusPresencePeersVisual,
  type CampusPresencePeerVisual
} from "@/hooks/useCampusPresencePeersVisual";

const MOCK_FALLBACK_PEERS: CampusPresencePeer[] = [
  {
    peerId: "mock-campus-peer-a",
    displayName: "Colega no campus",
    initials: "DM",
    avatarSeed: "mock-campus-peer-a",
    xPercent: 24,
    yPercent: 58,
    status: "exploring",
    lastSeenAt: 0
  },
  {
    peerId: "mock-campus-peer-b",
    displayName: "Explorador",
    initials: "JP",
    avatarSeed: "mock-campus-peer-b",
    xPercent: 63,
    yPercent: 71,
    status: "lesson",
    lastSeenAt: 0
  },
  {
    peerId: "mock-campus-peer-c",
    displayName: "Em pausa",
    initials: "LS",
    avatarSeed: "mock-campus-peer-c",
    xPercent: 48,
    yPercent: 38,
    status: "idle",
    lastSeenAt: 0
  }
];

type Props = {
  /** `campus.campusSocialPoll.peers` — utilizadores autenticados online (BD). */
  socialPeers?: CampusSocialPollPeerLite[] | null;
  /** Quando `false`, poll ainda não chegou — evita flash dos mocks fictícios. */
  socialPollResolved?: boolean;
  /** Visitantes: bolhas ambientais discretas; autenticados: só utilizadores reais. */
  allowAmbientMock?: boolean;
};

/**
 * Prioridade: Supabase realtime (`campus-map`) → polling social → mock discreto.
 * Realtime passa por TTL + fade para não deixar fantasmas eternos no mapa.
 */
export function CampusMapPeerLayer({
  socialPeers,
  socialPollResolved = true,
  allowAmbientMock = true
}: Props) {
  const cinemaOpen = useCampusStore((s) => s.isCineOpen);
  const realtimeRecord = useCampusPresenceStore((s) => s.othersByUid);

  const realtimeVisuals = useCampusPresencePeersVisual(realtimeRecord);

  const realtimeByPeerId = useMemo(() => {
    const m: Record<string, CampusRealtimePayload> = {};
    for (const v of realtimeVisuals) {
      if (v.realtime) m[v.peer.peerId] = v.realtime;
    }
    return m;
  }, [realtimeVisuals]);

  const { items, realtimeMap } = useMemo((): {
    items: CampusPresencePeerVisual[];
    realtimeMap: Record<string, CampusRealtimePayload> | undefined;
  } => {
    const rtEntries = Object.values(realtimeRecord);
    if (rtEntries.length > 0) {
      return { items: realtimeVisuals, realtimeMap: realtimeByPeerId };
    }
    if (socialPeers?.length) {
      return {
        items: socialPeers.map((row) => ({
          peer: socialPollPeerToPresencePeer(row)
        })),
        realtimeMap: undefined
      };
    }
    if (!socialPollResolved) {
      return { items: [], realtimeMap: undefined };
    }
    if (allowAmbientMock) {
      return {
        items: MOCK_FALLBACK_PEERS.map((peer) => ({ peer })),
        realtimeMap: undefined
      };
    }
    return { items: [], realtimeMap: undefined };
  }, [
    realtimeRecord,
    realtimeVisuals,
    realtimeByPeerId,
    socialPeers,
    socialPollResolved,
    allowAmbientMock
  ]);

  return (
    <CampusUnifiedPresencePeers
      cinemaOpen={cinemaOpen}
      items={items}
      realtimeByPeerId={realtimeMap}
    />
  );
}
