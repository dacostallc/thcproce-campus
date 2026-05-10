"use client";

import { useMemo } from "react";
import { useCampusPresenceStore } from "@/stores/campusPresenceStore";
import { useCampusStore } from "@/stores/campusStore";
import { CampusUnifiedPresencePeers } from "@/components/campus/CampusUnifiedPresencePeers";
import type { CampusRealtimePayload } from "@/lib/campusCinemaSeats";
import {
  realtimePayloadToPresencePeer,
  socialPollPeerToPresencePeer,
  type CampusSocialPollPeerLite
} from "@/lib/campusPresencePeerMappers";
import type { CampusPresencePeer } from "@/types/campusPresencePeer";

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
 * pointer-events-none no subtree dos peers (walk/hotspots intocados).
 */
export function CampusMapPeerLayer({
  socialPeers,
  socialPollResolved = true,
  allowAmbientMock = true
}: Props) {
  const cinemaOpen = useCampusStore((s) => s.isCineOpen);
  const realtimeRecord = useCampusPresenceStore((s) => s.othersByUid);

  const { peers, realtimeByPeerId } = useMemo(() => {
    const rtEntries = Object.values(realtimeRecord);
    if (rtEntries.length > 0) {
      const realtimeByPeerId: Record<string, CampusRealtimePayload> = {};
      for (const p of rtEntries) realtimeByPeerId[p.uid] = p;
      return {
        peers: rtEntries.map(realtimePayloadToPresencePeer),
        realtimeByPeerId
      };
    }
    if (socialPeers?.length) {
      return {
        peers: socialPeers.map(socialPollPeerToPresencePeer),
        realtimeByPeerId: undefined
      };
    }
    if (!socialPollResolved) {
      return { peers: [], realtimeByPeerId: undefined };
    }
    if (allowAmbientMock) {
      return { peers: MOCK_FALLBACK_PEERS, realtimeByPeerId: undefined };
    }
    return { peers: [], realtimeByPeerId: undefined };
  }, [realtimeRecord, socialPeers, socialPollResolved, allowAmbientMock]);

  return (
    <CampusUnifiedPresencePeers
      cinemaOpen={cinemaOpen}
      peers={peers}
      realtimeByPeerId={realtimeByPeerId}
    />
  );
}
