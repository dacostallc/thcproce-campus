"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { CAMPUS_PRESENCE_TTL_MS } from "@/config/campusPresence";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { getOrCreateCampusVisitorId } from "@/lib/campusVisitorId";
import { useCampusHudStore } from "@/stores/campusHudStore";

/** Canal Realtime dedicado à contagem de visitantes (separado de `campus-map` / avatares). */
export const CAMPUS_VISITOR_PRESENCE_CHANNEL = "campus-presence";

/** Heartbeat ~25–30s (pedido de produto). */
const CAMPUS_VISITOR_HEARTBEAT_MS = 28_000;

export type CampusVisitorPresenceStatus = "connected" | "connecting" | "offline";

export type CampusVisitorPresencePayload = {
  visitorId: string;
  page: "campus";
  timestamp: number;
};

/** Parser mínimo alinhado à forma `metas[]` do Presence (como `parseRealtimePayload` no mapa). */
export function parseCampusVisitorPresencePayload(row: unknown): {
  visitorId: string;
  page: string;
  timestamp: number;
} | null {
  if (!row || typeof row !== "object") return null;
  const o = row as Record<string, unknown>;
  const visitorId = typeof o.visitorId === "string" ? o.visitorId.trim() : "";
  if (!visitorId) return null;
  const page = typeof o.page === "string" ? o.page : "";
  const tsRaw = o.timestamp;
  const timestamp = typeof tsRaw === "number" ? tsRaw : Number(tsRaw);
  if (!Number.isFinite(timestamp)) return null;
  return { visitorId, page, timestamp };
}

function isFreshVisitorTimestamp(timestamp: number, now: number): boolean {
  return Number.isFinite(timestamp) && now - timestamp <= CAMPUS_PRESENCE_TTL_MS;
}

function countFreshCampusVisitors(
  state: Record<string, unknown>,
  now: number
): number {
  const seen = new Set<string>();
  for (const metas of Object.values(state)) {
    if (!Array.isArray(metas)) continue;
    for (const row of metas) {
      const p = parseCampusVisitorPresencePayload(row);
      if (!p || p.page !== "campus") continue;
      if (!isFreshVisitorTimestamp(p.timestamp, now)) continue;
      seen.add(p.visitorId);
    }
  }
  return seen.size;
}

/**
 * Contagem de visitantes únicos no `/campus` via Supabase Presence (`campus-presence`).
 * Atualiza `campusHudStore` (`campusVisitorCount`, `visitorPresenceStatus`).
 */
export function useCampusPresence(): {
  onlineCount: number | null;
  status: CampusVisitorPresenceStatus;
} {
  const pathname = usePathname();
  const onCampus =
    pathname === CAMPUS_HOME_PATH ||
    pathname.startsWith(`${CAMPUS_HOME_PATH}/`);

  const onlineCount = useCampusHudStore((s) => s.campusVisitorCount);
  const status = useCampusHudStore((s) => s.visitorPresenceStatus);

  const setCampusVisitorCount = useCampusHudStore((s) => s.setCampusVisitorCount);
  const setVisitorPresenceStatus = useCampusHudStore((s) => s.setVisitorPresenceStatus);

  const supa = useMemo(() => createSupabaseBrowser(), []);

  useEffect(() => {
    if (!onCampus) {
      setCampusVisitorCount(null);
      setVisitorPresenceStatus("offline");
      return;
    }

    const disablePresence =
      process.env.NEXT_PUBLIC_SUPABASE_DISABLE_PRESENCE === "true";

    if (!supa || disablePresence) {
      setCampusVisitorCount(null);
      setVisitorPresenceStatus("offline");
      return;
    }

    const visitorId = getOrCreateCampusVisitorId();
    if (!visitorId) {
      setCampusVisitorCount(null);
      setVisitorPresenceStatus("offline");
      return;
    }

    setVisitorPresenceStatus("connecting");
    setCampusVisitorCount(null);

    let alive = true;
    let ch: RealtimeChannel | null = null;
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    let subscribed = false;

    const pushCount = () => {
      if (!alive || !ch || !subscribed) return;
      try {
        const state = ch.presenceState() as Record<string, unknown>;
        const raw = countFreshCampusVisitors(state, Date.now());
        setCampusVisitorCount(Math.max(raw, 1));
      } catch {
        setCampusVisitorCount(null);
        setVisitorPresenceStatus("offline");
      }
    };

    const trackNow = () => {
      if (!alive || !ch || !subscribed) return;
      const payload: CampusVisitorPresencePayload = {
        visitorId,
        page: "campus",
        timestamp: Date.now()
      };
      try {
        void ch.track(payload);
        pushCount();
      } catch {
        setCampusVisitorCount(null);
        setVisitorPresenceStatus("offline");
      }
    };

    ch = supa.channel(CAMPUS_VISITOR_PRESENCE_CHANNEL, {
      config: { presence: { key: visitorId } }
    });

    ch.on("presence", { event: "sync" }, pushCount);
    ch.on("presence", { event: "join" }, pushCount);
    ch.on("presence", { event: "leave" }, pushCount);

    void ch.subscribe((chanStatus: string) => {
      if (!alive) return;
      if (chanStatus === "SUBSCRIBED") {
        subscribed = true;
        setVisitorPresenceStatus("connected");
        trackNow();
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        heartbeatInterval = setInterval(trackNow, CAMPUS_VISITOR_HEARTBEAT_MS);
        return;
      }
      if (
        chanStatus === "CHANNEL_ERROR" ||
        chanStatus === "TIMED_OUT" ||
        chanStatus === "CLOSED"
      ) {
        subscribed = false;
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
        setCampusVisitorCount(null);
        setVisitorPresenceStatus("offline");
      }
    });

    return () => {
      alive = false;
      subscribed = false;
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
      if (ch && supa) {
        try {
          void ch.untrack();
        } catch {
          /* noop */
        }
        void supa.removeChannel(ch);
        ch = null;
      }
      setCampusVisitorCount(null);
      setVisitorPresenceStatus("offline");
    };
  }, [onCampus, supa, setCampusVisitorCount, setVisitorPresenceStatus]);

  return {
    onlineCount,
    status
  };
}
