"use client";

import { useEffect, useMemo, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
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
  registerCampusRealtimeFlush,
  unregisterCampusRealtimeFlush
} from "@/lib/campusRealtimeFlush";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { useCampusPresenceStore } from "@/stores/campusPresenceStore";
import { useCampusStore } from "@/stores/campusStore";

/** Ative Presence (recom.). Desative só se o projeto ainda só usar broadcast legacy: `NEXT_PUBLIC_SUPABASE_DISABLE_PRESENCE=true`. */

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

  return {
    uid,
    x: Number(o.x) || 0,
    y: Number(o.y) || 0,
    label,
    displayName,
    levelLabel,
    xpTotal,
    at: Number(o.at) || 0,
    inCinema: Boolean(o.inCinema),
    cinemaSeatIndex: seatOk ? Math.floor(ci) : null,
    avatarPosture: o.avatarPosture === "sit" ? "sit" : "stand",
    lastEmoji,
    lastEmojiAt,
    campusRole,
    memberSinceIso,
    adminBroadcastText,
    adminBroadcastAt
  };
}

function peersFromPresenceState(
  uid: string,
  state: Record<string, unknown>
): Record<string, CampusRealtimePayload> {
  const out: Record<string, CampusRealtimePayload> = {};
  for (const metas of Object.values(state)) {
    if (!Array.isArray(metas)) continue;
    for (const row of metas) {
      const p = parseRealtimePayload(row);
      if (!p || p.uid === uid) continue;
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
  const supa = useMemo(() => createSupabaseBrowser(), []);
  const uid = useMemo(() => getCampusPresenceUid(), []);

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
    const setOnline = useCampusHudStore.getState().setOnlineApprox;

    if (!supa || !uid) {
      const seed =
        typeof window !== "undefined"
          ? uid.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 88)
          : 140;
      setOnline(105 + (seed % 45));
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
        adminBroadcastAt
      };
    };

    const pushOnlineCount = (nOthers: number) => setOnline(Math.max(1, 1 + nOthers));

    if (!disablePresence) {
      let ch: RealtimeChannel;

      const flushPresence = () => {
        try {
          const state = ch.presenceState();
          const others = peersFromPresenceState(uid, state as Record<string, unknown>);
          setOthers(others);
          pushOnlineCount(Object.keys(others).length);
        } catch {
          /* noop */
        }
      };

      ch = supa.channel("campus-map", {
        config: { presence: { key: uid } }
      });

      const flushImmediate = () => {
        void ch.track(buildPayload());
      };

      registerCampusRealtimeFlush(flushImmediate);

      ch.on("presence", { event: "sync" }, flushPresence);
      ch.on("presence", { event: "join" }, flushPresence);
      ch.on("presence", { event: "leave" }, flushPresence);

      void ch.subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await ch.track(buildPayload());
        }
      });

      const iv = window.setInterval(() => {
        void ch.track(buildPayload());
      }, 400);

      return () => {
        unregisterCampusRealtimeFlush(flushImmediate);
        window.clearInterval(iv);
        void supa.removeChannel(ch);
      };
    }

    /** Broadcast fallback (Presence desativada por env ou compat). */
    const map = new Map<string, CampusRealtimePayload>();

    const flushBroadcastPeers = () => {
      map.delete(uid);
      const peers: Record<string, CampusRealtimePayload> = {};
      for (const [id, val] of map) {
        if (id !== uid) peers[id] = val;
      }
      setOthers(peers);
      pushOnlineCount(Object.keys(peers).length);
    };

    const ch = supa.channel("campus-map", {
      config: { broadcast: { self: false } }
    });

    const flushImmediate = () => {
      void ch.send({
        type: "broadcast",
        event: "pos",
        payload: buildPayload()
      });
      flushBroadcastPeers();
    };

    registerCampusRealtimeFlush(flushImmediate);

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
        adminBroadcastAt: raw?.adminBroadcastAt
      });
      if (!p?.uid || p.uid === uid) return;

      const stale = Date.now() - (p.at || 0) > 14000;
      if (stale || p.x == null || p.y == null) {
        map.delete(p.uid);
      } else {
        map.set(p.uid, p);
      }
      flushBroadcastPeers();
    });

    void ch.subscribe();

    const iv = window.setInterval(() => {
      flushImmediate();
    }, 380);

    return () => {
      unregisterCampusRealtimeFlush(flushImmediate);
      window.clearInterval(iv);
      void supa.removeChannel(ch);
    };
  }, [supa, uid]);

  return null;
}
