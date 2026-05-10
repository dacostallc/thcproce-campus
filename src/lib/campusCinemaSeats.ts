import {
  clampToWalkZone,
  type MapPctPoint,
  CINEMA_SEATS,
  CINEMA_STANDING_SPOTS
} from "@/lib/campusWalkable";
import type { PctPos } from "@/stores/campusStore";
import type { CampusUserRole } from "@/config/userRoles";
import { coerceCampusUserRole } from "@/config/userRoles";
import type { CampusSelfPresenceStatus } from "@/lib/campusWalkEstimate";
import type { CampusActivityKind } from "@/lib/campusPresenceActivity";
import {
  inferCampusActivityFromLegacyPayload,
  coerceCampusActivityKind
} from "@/lib/campusPresenceActivity";
import { CAMPUS_PRESENCE_HOTSPOT_ANCHORS } from "@/lib/campusPresenceAnchors";

export const CINEMA_REACTION_EMOJIS = ["🔥", "👏", "🌱"] as const;

export const CINEMA_EMOJI_TTL_MS = 2800;

/** Metadados de cinema nos payloads de realtime (Presence ou broadcast fallback). */
export type CampusRealtimePayload = {
  uid: string;
  x: number;
  y: number;
  /** Compat payloads antigos — espelha geralmente displayName */
  label: string;
  displayName: string;
  levelLabel: string;
  xpTotal: number;
  at: number;
  inCinema: boolean;
  cinemaSeatIndex: number | null;
  avatarPosture: "stand" | "sit";
  /** Reação (teclas 1–3); `lastEmojiAt` em epoch ms. */
  lastEmoji: string | null;
  lastEmojiAt: number;
  /** Hierarquia visual (cores / ícones da tag). */
  campusRole: CampusUserRole;
  /** ISO 8601 — “Membro desde …” nos peers (hover ou mobile). */
  memberSinceIso: string | null;
  /** Aviso em destaque do admin (balão). Só honrado se campusRole === admin e TTL válido. */
  adminBroadcastText: string | null;
  adminBroadcastAt: number;
  /** Fase 4 — contexto pedagógico / UX (realtime). */
  campusActivity: CampusActivityKind;
  /** Presença fina (idle / walking / cinema / lesson / exploring) — opcional para peers antigos. */
  campusPresenceStatus?: CampusSelfPresenceStatus;
  /** Zona pedagógica / hotspot atual (heartbeat social). */
  currentZoneId?: string | null;
};

export function isAllowedCinemaReactionEmoji(s: string): s is (typeof CINEMA_REACTION_EMOJIS)[number] {
  return (CINEMA_REACTION_EMOJIS as readonly string[]).includes(s);
}

const DEFAULT_PEER_NAME = "Aluno THC";

export function normalizeCampusPeerIdentity(p: CampusRealtimePayload) {
  const rawName = String(p.displayName || p.label || "").trim().slice(0, 26);
  const displayName = rawName.length ? rawName : DEFAULT_PEER_NAME;
  const levelOk = String(p.levelLabel ?? "").trim();
  const levelLabel = levelOk.length ? levelOk.slice(0, 28) : "—";
  const xr = Number(p.xpTotal);
  const xpTotal =
    Number.isFinite(xr) && xr >= 0 ? Math.min(9_999_999, Math.round(xr)) : 0;

  const coerced = coerceCampusUserRole(p.campusRole);
  const legacyAdmin =
    (p as unknown as { isCampusStaff?: boolean }).isCampusStaff === true;
  const campusRole: CampusUserRole = coerced ?? (legacyAdmin ? "admin" : "free");

  const msRaw = p.memberSinceIso;
  const memberSinceIso =
    typeof msRaw === "string" && msRaw.length >= 10 ? msRaw.slice(0, 40) : null;

  const act = coerceCampusActivityKind(p.campusActivity);
  const campusActivity =
    act ?? inferCampusActivityFromLegacyPayload(Boolean(p.inCinema));

  return { displayName, levelLabel, xpTotal, campusRole, memberSinceIso, campusActivity };
}

function peerPresenceJitter(uid: string, pt: MapPctPoint): MapPctPoint {
  let h = 2166136261;
  for (let i = 0; i < uid.length; i++) {
    h ^= uid.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const dx = (((h >>> 0) % 11) - 5) * 0.35;
  const dy = ((((h >>> 8) % 11) - 5) * 0.35);
  return {
    x: Math.min(99, Math.max(1, pt.x + dx)),
    y: Math.min(99, Math.max(1, pt.y + dy))
  };
}

function shuffleInPlace(xs: number[]) {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
}

/** Escolhe um índice de assento livre (aleatório entre os vagos). */
export function pickFreeCinemaSeat(occupied: ReadonlySet<number>): number | null {
  const ids = Array.from({ length: CINEMA_SEATS.length }, (_, i) => i);
  shuffleInPlace(ids);
  for (const i of ids) {
    if (!occupied.has(i)) return i;
  }
  return null;
}

export function collectOccupiedCinemaSeatIndices(
  peersByUid: Record<string, CampusRealtimePayload>
): Set<number> {
  const set = new Set<number>();
  for (const p of Object.values(peersByUid)) {
    if (
      p.inCinema &&
      typeof p.cinemaSeatIndex === "number" &&
      p.cinemaSeatIndex >= 0 &&
      p.cinemaSeatIndex < CINEMA_SEATS.length
    ) {
      set.add(p.cinemaSeatIndex);
    }
  }
  return set;
}

/** Igual ao easing de deslocamento do `CampusPlayer` (+ pequeno buffer). */
export function estimateCampusWalkMs(from: PctPos, to: PctPos): number {
  const d = Math.hypot(to.x - from.x, to.y - from.y);
  const sec = Math.min(1.85, Math.max(0.32, 0.28 + d * 0.028));
  return Math.round(sec * 1000) + 110;
}

export function getSeatPositionForIndex(index: number): MapPctPoint {
  const s = CINEMA_SEATS[index];
  return s ? clampToWalkZone(s) : clampToWalkZone({ x: 76, y: 84 });
}

/** Preferir coordenada do assento quando o peer está sentado no cinema (alinhamento com a grelha). */
export function getPeerMapPixelsFromPayload(p: CampusRealtimePayload): MapPctPoint {
  if (
    p.inCinema &&
    p.avatarPosture === "sit" &&
    typeof p.cinemaSeatIndex === "number" &&
    p.cinemaSeatIndex >= 0 &&
    p.cinemaSeatIndex < CINEMA_SEATS.length
  ) {
    return getSeatPositionForIndex(p.cinemaSeatIndex);
  }

  const act =
    coerceCampusActivityKind(p.campusActivity) ??
    inferCampusActivityFromLegacyPayload(Boolean(p.inCinema));

  if (act === "mural") {
    return peerPresenceJitter(p.uid, CAMPUS_PRESENCE_HOTSPOT_ANCHORS.mural);
  }
  if (act === "shop") {
    return peerPresenceJitter(p.uid, CAMPUS_PRESENCE_HOTSPOT_ANCHORS.shop);
  }
  if (act === "cinema") {
    return peerPresenceJitter(p.uid, CAMPUS_PRESENCE_HOTSPOT_ANCHORS.cinema);
  }

  return { x: p.x, y: p.y };
}

/** Lateral / corredor quando o auditório está cheio — entre os mais próximos do jogador. */
export function pickStandingSpotForFullHouse(from: PctPos): MapPctPoint {
  const spots = [...CINEMA_STANDING_SPOTS];
  spots.sort(
    (a, b) =>
      Math.hypot(a.x - from.x, a.y - from.y) - Math.hypot(b.x - from.x, b.y - from.y)
  );
  const k = Math.max(1, Math.min(3, spots.length));
  const pick = spots[Math.floor(Math.random() * k)] ?? spots[0];
  return pick ? clampToWalkZone(pick) : clampToWalkZone(from);
}
