import type { CampusRealtimePayload } from "@/lib/campusCinemaSeats";
import { normalizeCampusPeerIdentity } from "@/lib/campusCinemaSeats";
import type { CampusSocialStatusLight } from "@/types/campusSocialPresence";
import type { CampusPresencePeer, CampusPresenceStatus } from "@/types/campusPresencePeer";

export function campusPresenceInitials(displayName: string): string {
  const n = displayName.trim();
  if (!n) return "?";
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase().slice(0, 2);
  }
  return n.slice(0, 2).toUpperCase();
}

export function mapSocialStatusLightToPeerStatus(
  s: CampusSocialStatusLight
): CampusPresenceStatus {
  switch (s) {
    case "cinema":
      return "cinema";
    case "studying":
      return "lesson";
    case "rest":
      return "idle";
    default:
      return "exploring";
  }
}

export function derivePresenceStatusFromRealtimePayload(
  p: CampusRealtimePayload
): CampusPresenceStatus {
  const explicit = p.campusPresenceStatus;
  if (
    explicit === "idle" ||
    explicit === "walking" ||
    explicit === "cinema" ||
    explicit === "lesson" ||
    explicit === "exploring"
  ) {
    return explicit;
  }
  if (p.inCinema || p.campusActivity === "cinema") return "cinema";
  if (p.campusActivity === "lesson") return "lesson";
  return "exploring";
}

export function realtimePayloadToPresencePeer(p: CampusRealtimePayload): CampusPresencePeer {
  const id = normalizeCampusPeerIdentity(p);
  const z =
    typeof p.currentZoneId === "string" && p.currentZoneId.trim().length
      ? p.currentZoneId.trim().slice(0, 120)
      : undefined;
  return {
    peerId: p.uid,
    displayName: id.displayName,
    initials: campusPresenceInitials(id.displayName),
    avatarSeed: p.uid,
    xPercent: p.x,
    yPercent: p.y,
    status: derivePresenceStatusFromRealtimePayload(p),
    currentZoneId: z,
    lastSeenAt: typeof p.at === "number" && Number.isFinite(p.at) ? p.at : Date.now()
  };
}

export type CampusSocialPollPeerLite = {
  peerToken: string;
  displayLabel: string;
  zoneLabel: string | null;
  zoneTitlePt: string;
  statusLight: CampusSocialStatusLight;
  levelLabel: string;
  xPct: number;
  yPct: number;
};

export function socialPollPeerToPresencePeer(row: CampusSocialPollPeerLite): CampusPresencePeer {
  return {
    peerId: row.peerToken,
    displayName: row.displayLabel.trim().slice(0, 28) || "Colega",
    initials: campusPresenceInitials(row.displayLabel),
    avatarSeed: row.peerToken,
    xPercent: row.xPct,
    yPercent: row.yPct,
    status: mapSocialStatusLightToPeerStatus(row.statusLight),
    currentZoneId: row.zoneLabel ?? undefined,
    lastSeenAt: Date.now(),
    zoneTitlePt: row.zoneTitlePt,
    levelHint: row.levelLabel
  };
}
