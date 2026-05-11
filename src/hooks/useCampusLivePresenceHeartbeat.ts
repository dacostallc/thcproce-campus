"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";
import { useCampusStore } from "@/stores/campusStore";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { getCampusLivePresenceVisitorId } from "@/lib/campusLivePresenceVisitorId";
import {
  blendPlayerTowardHotspot,
  jitterPresencePctByVisitorId
} from "@/lib/campusLivePresenceCoords";
import { CAMPUS_MAP_INTERACTIVE_AREAS } from "@/lib/campusMapAreasCatalog";
import { loadStudentProfile } from "@/lib/studentGamificationStorage";
import { useCampusGuestVisitor } from "@/hooks/useCampusGuestVisitor";
import type { CampusLivePresenceOnlineDto } from "@/lib/campusLivePresenceDto";

const HEARTBEAT_MS = 10_000;

function preferHttpPresence(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_USE_HTTP_PRESENCE !== "false";
}

/**
 * Heartbeat HTTP (~10s), TTL servidor 30s.
 * Posição e hotspot lidos em cada tick (sem reiniciar o intervalo).
 */
export function useCampusLivePresenceHeartbeat(
  setPeersFromOthers: (rows: CampusLivePresenceOnlineDto[]) => void
): void {
  const pathname = usePathname() ?? "";
  const onCampus =
    pathname === CAMPUS_HOME_PATH || pathname.startsWith(`${CAMPUS_HOME_PATH}/`);
  const { status, data: session } = useSession();
  const { guestNickname, guestHydrated } = useCampusGuestVisitor(status);

  const sessionRef = useRef<Session | null>(session);
  sessionRef.current = session ?? null;
  const authStatusRef = useRef(status);
  authStatusRef.current = status;
  const guestRef = useRef({ guestNickname, guestHydrated });
  guestRef.current = { guestNickname, guestHydrated };

  const cbRef = useRef(setPeersFromOthers);
  cbRef.current = setPeersFromOthers;

  useEffect(() => {
    if (!onCampus || typeof window === "undefined" || !preferHttpPresence()) return;

    let cancelled = false;
    const visitorId = getCampusLivePresenceVisitorId();
    if (!visitorId) return;

    const beat = async () => {
      if (cancelled || document.visibilityState === "hidden") return;

      const hotspotId = useCampusHudStore.getState().campusMapHotspotPanelHitId;
      const { x, y } = useCampusStore.getState().player;

      const hit = hotspotId
        ? CAMPUS_MAP_INTERACTIVE_AREAS.find((h) => h.id === hotspotId) ?? null
        : null;

      const blended = blendPlayerTowardHotspot({ x, y }, hit);
      const jittered = jitterPresencePctByVisitorId(visitorId, blended.xPct, blended.yPct);

      const st = authStatusRef.current;
      const sess = sessionRef.current;
      const { guestHydrated: gh, guestNickname: gn } = guestRef.current;

      let displayName = "Visitante";
      if (st === "authenticated") {
        displayName = (
          sess?.user?.name ??
          sess?.user?.email?.split("@")[0] ??
          "Aluno"
        )
          .trim()
          .slice(0, 80);
      } else if (gh && gn?.trim()) {
        displayName = gn.trim().slice(0, 80);
      } else {
        try {
          const p = loadStudentProfile();
          if (p.displayName?.trim()) displayName = p.displayName.trim().slice(0, 80);
        } catch {
          /* noop */
        }
      }

      let avatarVariant = "student";
      try {
        avatarVariant = loadStudentProfile().avatarVariant;
      } catch {
        /* noop */
      }

      try {
        const res = await fetch("/api/campus/presence/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId,
            displayName,
            avatarVariant,
            currentHotspot: hotspotId,
            currentArea: hit?.type ?? null,
            xPct: jittered.xPct,
            yPct: jittered.yPct
          }),
          keepalive: true
        });
        if (!res.ok) throw new Error("heartbeat_failed");
        const data = (await res.json()) as {
          ok?: boolean;
          online?: CampusLivePresenceOnlineDto[];
          count?: number;
        };
        if (!data.ok || !Array.isArray(data.online)) throw new Error("bad_payload");

        const hud = useCampusHudStore.getState();
        hud.setCampusVisitorCount(data.count ?? data.online.length);
        hud.setVisitorPresenceStatus("connected");

        cbRef.current(data.online.filter((r) => r.visitorId !== visitorId));
      } catch {
        useCampusHudStore.getState().setVisitorPresenceStatus("offline");
      }
    };

    void beat();
    const timer = window.setInterval(beat, HEARTBEAT_MS);
    const onVis = () => {
      if (!document.hidden) void beat();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
      cbRef.current([]);
      const hud = useCampusHudStore.getState();
      hud.setCampusVisitorCount(null);
      hud.setVisitorPresenceStatus("offline");
    };
  }, [onCampus]);
}
