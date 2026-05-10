"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";
import {
  CAMPUS_PRESENCE_MOVE_FLUSH_MS,
  CAMPUS_PRESENCE_TTL_MS,
  nextCampusPresenceHeartbeatDelayMs
} from "@/config/campusPresence";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import type { CampusRealtimePayload } from "@/lib/campusCinemaSeats";
import { isAllowedCinemaReactionEmoji } from "@/lib/campusCinemaSeats";
import type { CampusUserRole } from "@/config/userRoles";
import { coerceCampusUserRole } from "@/config/userRoles";
import {
  clampAdminBroadcastText,
  isFreshAdminBroadcast
} from "@/lib/campusAdminBroadcast";
import { getCampusPresenceUid } from "@/lib/campusPresenceId";
import {
  deriveLocalCampusActivity,
  coerceCampusActivityKind,
  inferCampusActivityFromLegacyPayload
} from "@/lib/campusPresenceActivity";
import {
  registerCampusRealtimeFlush,
  unregisterCampusRealtimeFlush
} from "@/lib/campusRealtimeFlush";
import { useCampusPresenceStore } from "@/stores/campusPresenceStore";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { useCampusStore } from "@/stores/campusStore";

/** Ative Presence (recom.). Desative só se o projeto ainda só usar broadcast legacy: `NEXT_PUBLIC_SUPABASE_DISABLE_PRESENCE=true`. */

function isFreshPresenceAt(atMs: unknown, now: number): boolean {
  const at = typeof atMs === "number" ? atMs : Number(atMs);
  return Number.isFinite(at) && now - at <= CAMPUS_PRESENCE_TTL_MS;
}

function parseRealtimePayload(row: unknown): CampusRealtimePayload | null {
  if (!row || typeof row !== "object") return null;
  const o = row as Record<string, unknown>;
  const uid = String(o.uid ?? "");
  if (!uid) return null;
  const ci = o.cinemaSeatIndex;
  const seatOk = typeof ci === "number" && Number.isFinite(ci) && ci >= 0 && ci < 4096;

  const le = o.lastEmoji;
  const lastEmoji =
    typeof le === "string" && isAllowedCinemaReactionEmoji(le) ? le : null;
  const leAtRaw = Number(o.lastEmojiAt);
  const lastEmojiAt = Number.isFinite(leAtRaw) ? leAtRaw : 0;

  const displayNameSrc = String(o.displayName ?? o.label ?? "").trim();
  const displayName = displayNameSrc.slice(0, 28) || "Aluno THC";
  const label = String(o.label ?? displayName).slice(0, 24) || displayName.slice(0, 24);

  const levelRaw = String(o.levelLabel ?? "").trim().slice(0, 28);
  const levelLabel = levelRaw.length ? levelRaw : "—";

  const xpNum = Number(o.xpTotal);
  const xpTotal =
    Number.isFinite(xpNum) && xpNum >= 0 ? Math.min(9_999_999, Math.round(xpNum)) : 0;

  const legacyStaff = o.isCampusStaff === true;
  const campusRole: CampusUserRole =
    coerceCampusUserRole(o.campusRole) ?? (legacyStaff ? "admin" : "free");

  const msSrc = o.memberSinceIso;
  const memberSinceIso =
    typeof msSrc === "string" && msSrc.length >= 10 ? msSrc.slice(0, 40) : null;

  const abSrc = typeof o.adminBroadcastText === "string" ? o.adminBroadcastText : "";
  const abText = clampAdminBroadcastText(abSrc);
  const abAt = Number(o.adminBroadcastAt);
  let adminBroadcastText: string | null = null;
  let adminBroadcastAt = 0;
  if (
    campusRole === "admin" &&
    abText.length > 0 &&
    Number.isFinite(abAt) &&
    isFreshAdminBroadcast(abAt)
  ) {
    adminBroadcastText = abText;
    adminBroadcastAt = Math.round(abAt);
  }

  const inCinema = Boolean(o.inCinema);
  const campusActivity =
    coerceCampusActivityKind(o.campusActivity) ??
    inferCampusActivityFromLegacyPayload(inCinema);

  return {
    uid,
    x: Number(o.x) || 0,
    y: Number(o.y) || 0,
    label,
    displayName,
    levelLabel,
    xpTotal,
    at: Number(o.at) || 0,
    inCinema,
    cinemaSeatIndex: seatOk ? Math.floor(ci) : null,
    avatarPosture: o.avatarPosture === "sit" ? "sit" : "stand",
    lastEmoji,
    lastEmojiAt,
    campusRole,
    memberSinceIso,
    adminBroadcastText,
    adminBroadcastAt,
    campusActivity
  };
}

function peersFromPresenceState(
  uid: string,
  state: Record<string, unknown>,
  now: number
): Record<string, CampusRealtimePayload> {
  const out: Record<string, CampusRealtimePayload> = {};
  for (const metas of Object.values(state)) {
    if (!Array.isArray(metas)) continue;
    for (const row of metas) {
      const p = parseRealtimePayload(row);
      if (!p || p.uid === uid) continue;
      if (!isFreshPresenceAt(p.at, now)) continue;
      out[p.uid] = p;
    }
  }
  return out;
}

type Props = {
  displayName: string;
  levelLabel: string;
  xpTotal: number;
  campusRole: CampusUserRole;
  memberSinceIso: string | null;
};

/** Supabase Realtime Presence quando disponível; fallback broadcast legacy (`pos`). */
export function CampusPresenceSync({
  displayName,
  levelLabel,
  xpTotal,
  campusRole,
  memberSinceIso
}: Props) {
  const pathname = usePathname() ?? "";
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const supa = useMemo(() => createSupabaseBrowser(), []);
  const uid = useMemo(() => getCampusPresenceUid(), []);
  const warnedMissingSupabaseRef = useRef(false);

  const displayRef = useRef(displayName);
  displayRef.current = displayName;
  const levelRef = useRef(levelLabel);
  levelRef.current = levelLabel;
  const xpRef = useRef(xpTotal);
  xpRef.current = xpTotal;
  const campusRoleRef = useRef(campusRole);
  campusRoleRef.current = campusRole;
  const memberSinceRef = useRef(memberSinceIso);
  memberSinceRef.current = memberSinceIso;

  const playerRef = useRef(useCampusStore.getState().player);
  const postureRef = useRef(useCampusStore.getState().avatarPosture);
  const cinemaOpenRef = useRef(useCampusStore.getState().isCineOpen);
  const seatRef = useRef(useCampusStore.getState().cinemaSeatIndex);

  useEffect(() => {
    const sync = () => {
      const s = useCampusStore.getState();
      playerRef.current = s.player;
      postureRef.current = s.avatarPosture;
      cinemaOpenRef.current = s.isCineOpen;
      seatRef.current = s.cinemaSeatIndex;
    };
    sync();
    return useCampusStore.subscribe(sync);
  }, []);

  useEffect(() => {
    const setOthers = useCampusPresenceStore.getState().setOthersFromRealtime;

    if (!supa || !uid) {
      if (!supa && !warnedMissingSupabaseRef.current) {
        warnedMissingSupabaseRef.current = true;
        if (process.env.NODE_ENV === "development") {
          console.info(
            "[CampusPresence] Supabase não configurado — presença/desmultiplicação em modo local (mapa continua normal)."
          );
        }
      }
      setOthers({});
      return;
    }

    const disablePresence =
      process.env.NEXT_PUBLIC_SUPABASE_DISABLE_PRESENCE === "true";

    const buildPayload = (): CampusRealtimePayload => {
      const cx = useCampusStore.getState();
      const le =
        cx.cinemaLastEmoji && isAllowedCinemaReactionEmoji(cx.cinemaLastEmoji)
          ? cx.cinemaLastEmoji
          : null;
      const name = displayRef.current.trim().slice(0, 28) || "Aluno THC";
      const lab = name.slice(0, 24);
      const lvl = levelRef.current.trim().slice(0, 28) || "—";
      const xr = Number(xpRef.current);
      const xpRounded =
        Number.isFinite(xr) && xr >= 0 ? Math.min(9_999_999, Math.round(xr)) : 0;

      const ms =
        typeof memberSinceRef.current === "string"
          ? memberSinceRef.current.slice(0, 40)
          : null;

      const role = campusRoleRef.current;
      const hud = useCampusHudStore.getState();
      const campusActivity = deriveLocalCampusActivity({
        pathname: pathnameRef.current,
        isCineOpen: cinemaOpenRef.current,
        lessonPanelOpen: hud.campusLessonPanelOpen,
        muralOpen: hud.muralOpen,
        muralFeedOpen: hud.campusMapMuralFeedOpen,
        campusStoreOpen: hud.campusStoreOpen
      });

      const localAb = cx.adminBroadcast;
      let adminBroadcastText: string | null = null;
      let adminBroadcastAt = 0;
      if (
        role === "admin" &&
        localAb &&
        localAb.text.length > 0 &&
        isFreshAdminBroadcast(localAb.sentAtMs)
      ) {
        adminBroadcastText = localAb.text;
        adminBroadcastAt = localAb.sentAtMs;
      }

      return {
        uid,
        x: playerRef.current.x,
        y: playerRef.current.y,
        label: lab,
        displayName: name,
        levelLabel: lvl,
        xpTotal: xpRounded,
        at: Date.now(),
        inCinema: cinemaOpenRef.current,
        cinemaSeatIndex:
          typeof seatRef.current === "number" && Number.isFinite(seatRef.current)
            ? seatRef.current
            : null,
        avatarPosture: postureRef.current,
        lastEmoji: le,
        lastEmojiAt: le ? cx.cinemaLastEmojiAt : 0,
        campusRole: role,
        memberSinceIso: ms,
        adminBroadcastText,
        adminBroadcastAt,
        campusActivity
      };
    };

    if (!disablePresence) {
      let ch: RealtimeChannel;
      let heartbeatTimeout: number | null = null;
      let moveThrottleTimeout: number | null = null;
      let lastMoveFlushWall = 0;
      let posSig = "";

      const flushPresence = () => {
        try {
          const state = ch.presenceState();
          const others = peersFromPresenceState(
            uid,
            state as Record<string, unknown>,
            Date.now()
          );
          setOthers(others);
        } catch {
          /* noop */
        }
      };

      ch = supa.channel("campus-map", {
        config: { presence: { key: uid } }
      });

      const flushImmediate = () => {
        try {
          void ch.track(buildPayload());
        } catch {
          /* noop */
        }
        flushPresence();
      };

      const queueHeartbeat = () => {
        heartbeatTimeout = window.setTimeout(() => {
          heartbeatTimeout = null;
          flushImmediate();
          queueHeartbeat();
        }, nextCampusPresenceHeartbeatDelayMs());
      };

      const maybeFlushOnMove = () => {
        const p = useCampusStore.getState().player;
        const nextSig = `${p.x},${p.y}`;
        if (nextSig === posSig) return;
        posSig = nextSig;
        const now = Date.now();
        const elapsed = now - lastMoveFlushWall;

        const run = () => {
          moveThrottleTimeout = null;
          lastMoveFlushWall = Date.now();
          flushImmediate();
        };

        if (elapsed >= CAMPUS_PRESENCE_MOVE_FLUSH_MS) {
          run();
          return;
        }
        const wait = CAMPUS_PRESENCE_MOVE_FLUSH_MS - elapsed;
        if (moveThrottleTimeout) window.clearTimeout(moveThrottleTimeout);
        moveThrottleTimeout = window.setTimeout(run, wait);
      };

      const p0 = useCampusStore.getState().player;
      posSig = `${p0.x},${p0.y}`;

      registerCampusRealtimeFlush(flushImmediate);

      const unsubMoves = useCampusStore.subscribe(maybeFlushOnMove);

      ch.on("presence", { event: "sync" }, flushPresence);
      ch.on("presence", { event: "join" }, flushPresence);
      ch.on("presence", { event: "leave" }, flushPresence);

      void ch.subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          flushImmediate();
          queueHeartbeat();
        }
      });

      return () => {
        if (heartbeatTimeout) window.clearTimeout(heartbeatTimeout);
        if (moveThrottleTimeout) window.clearTimeout(moveThrottleTimeout);
        unsubMoves();
        unregisterCampusRealtimeFlush(flushImmediate);
        void supa.removeChannel(ch);
      };
    }

    /** Broadcast fallback (Presence desativada por env ou compat). */
    const map = new Map<string, CampusRealtimePayload>();

    const flushBroadcastPeers = () => {
      const nowMs = Date.now();
      for (const [pid, row] of [...map.entries()]) {
        if (!isFreshPresenceAt(row.at, nowMs)) map.delete(pid);
      }

      map.delete(uid);
      const peers: Record<string, CampusRealtimePayload> = {};
      for (const [id, val] of map) {
        if (id !== uid) peers[id] = val;
      }
      setOthers(peers);
    };

    const ch = supa.channel("campus-map", {
      config: { broadcast: { self: false } }
    });

    let heartbeatTimeoutFb: number | null = null;
    let moveThrottleTimeoutFb: number | null = null;
    let lastMoveFlushWallFb = 0;
    let posSigFb = "";

    const flushImmediate = () => {
      void ch.send({
        type: "broadcast",
        event: "pos",
        payload: buildPayload()
      });
      flushBroadcastPeers();
    };

    const queueHeartbeatFb = () => {
      heartbeatTimeoutFb = window.setTimeout(() => {
        heartbeatTimeoutFb = null;
        flushImmediate();
        queueHeartbeatFb();
      }, nextCampusPresenceHeartbeatDelayMs());
    };

    const maybeFlushOnMoveFb = () => {
      const p = useCampusStore.getState().player;
      const nextSig = `${p.x},${p.y}`;
      if (nextSig === posSigFb) return;
      posSigFb = nextSig;
      const now = Date.now();
      const elapsed = now - lastMoveFlushWallFb;

      const run = () => {
        moveThrottleTimeoutFb = null;
        lastMoveFlushWallFb = Date.now();
        flushImmediate();
      };

      if (elapsed >= CAMPUS_PRESENCE_MOVE_FLUSH_MS) {
        run();
        return;
      }
      const wait = CAMPUS_PRESENCE_MOVE_FLUSH_MS - elapsed;
      if (moveThrottleTimeoutFb) window.clearTimeout(moveThrottleTimeoutFb);
      moveThrottleTimeoutFb = window.setTimeout(run, wait);
    };

    const pFb0 = useCampusStore.getState().player;
    posSigFb = `${pFb0.x},${pFb0.y}`;

    registerCampusRealtimeFlush(flushImmediate);

    const unsubMovesFb = useCampusStore.subscribe(maybeFlushOnMoveFb);

    ch.on("broadcast", { event: "pos" }, ({ payload }) => {
      const raw = payload as Record<string, unknown>;
      const p = parseRealtimePayload({
        uid: raw?.uid,
        x: raw?.x,
        y: raw?.y,
        label: raw?.label,
        displayName: raw?.displayName,
        levelLabel: raw?.levelLabel,
        xpTotal: raw?.xpTotal,
        at: raw?.at,
        inCinema: raw?.inCinema ?? false,
        cinemaSeatIndex: raw?.cinemaSeatIndex ?? null,
        avatarPosture: raw?.avatarPosture ?? "stand",
        lastEmoji: raw?.lastEmoji ?? null,
        lastEmojiAt: raw?.lastEmojiAt ?? 0,
        campusRole: raw?.campusRole,
        memberSinceIso: raw?.memberSinceIso,
        adminBroadcastText: raw?.adminBroadcastText,
        adminBroadcastAt: raw?.adminBroadcastAt,
        campusActivity: raw?.campusActivity
      });
      if (!p?.uid || p.uid === uid) return;

      const stale = !isFreshPresenceAt(p.at || 0, Date.now());
      if (stale || p.x == null || p.y == null) {
        map.delete(p.uid);
      } else {
        map.set(p.uid, p);
      }
      flushBroadcastPeers();
    });

    void ch.subscribe((status: string) => {
      if (status === "SUBSCRIBED") {
        flushImmediate();
        queueHeartbeatFb();
      }
    });

    return () => {
      if (heartbeatTimeoutFb) window.clearTimeout(heartbeatTimeoutFb);
      if (moveThrottleTimeoutFb) window.clearTimeout(moveThrottleTimeoutFb);
      unsubMovesFb();
      unregisterCampusRealtimeFlush(flushImmediate);
      void supa.removeChannel(ch);
    };
  }, [supa, uid]);

  return null;
}
