/**
 * Presença HTTP em memória (instância Node).
 * Em deploy multi‑instância ou serverless frio, usar Redis / Supabase Realtime depois.
 */

export type CampusLivePresenceRecord = {
  visitorId: string;
  displayName: string;
  avatarVariant: string;
  currentHotspot: string | null;
  currentArea: string | null;
  xPct: number;
  yPct: number;
  lastSeenAt: number;
};

/** Heartbeat cliente (~10s); quem passa disto fica offline. */
export const CAMPUS_LIVE_PRESENCE_TTL_MS = 30_000;

const MAX_RECORDS = 800;

const store = new Map<string, CampusLivePresenceRecord>();

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 50;
  return Math.min(99, Math.max(1, n));
}

export function pruneCampusLivePresence(now = Date.now()): void {
  for (const [k, v] of store) {
    if (now - v.lastSeenAt > CAMPUS_LIVE_PRESENCE_TTL_MS) store.delete(k);
  }
}

export function upsertCampusLivePresence(input: {
  visitorId: string;
  displayName?: string | undefined;
  avatarVariant?: string | undefined;
  currentHotspot?: string | null | undefined;
  currentArea?: string | null | undefined;
  xPct: number;
  yPct: number;
  now?: number;
}): CampusLivePresenceRecord {
  const now = input.now ?? Date.now();
  pruneCampusLivePresence(now);

  const visitorId = input.visitorId.trim().slice(0, 180);
  const rec: CampusLivePresenceRecord = {
    visitorId,
    displayName: (input.displayName ?? "Visitante").trim().slice(0, 80) || "Visitante",
    avatarVariant: (input.avatarVariant ?? "student").trim().slice(0, 40) || "student",
    currentHotspot:
      typeof input.currentHotspot === "string" && input.currentHotspot.trim()
        ? input.currentHotspot.trim().slice(0, 120)
        : null,
    currentArea:
      typeof input.currentArea === "string" && input.currentArea.trim()
        ? input.currentArea.trim().slice(0, 120)
        : null,
    xPct: clampPct(input.xPct),
    yPct: clampPct(input.yPct),
    lastSeenAt: now
  };

  store.set(visitorId, rec);

  while (store.size > MAX_RECORDS) {
    let oldestKey: string | null = null;
    let oldestTs = Infinity;
    for (const [k, v] of store) {
      if (v.lastSeenAt < oldestTs) {
        oldestTs = v.lastSeenAt;
        oldestKey = k;
      }
    }
    if (oldestKey) store.delete(oldestKey);
    else break;
  }

  return rec;
}

export function listCampusLivePresence(now = Date.now()): CampusLivePresenceRecord[] {
  pruneCampusLivePresence(now);
  const out: CampusLivePresenceRecord[] = [];
  for (const v of store.values()) {
    if (now - v.lastSeenAt <= CAMPUS_LIVE_PRESENCE_TTL_MS) out.push(v);
  }
  return out.sort((a, b) => b.lastSeenAt - a.lastSeenAt);
}

export function campusLivePresenceOnlineCount(now = Date.now()): number {
  return listCampusLivePresence(now).length;
}
