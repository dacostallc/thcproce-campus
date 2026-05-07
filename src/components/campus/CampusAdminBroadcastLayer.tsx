"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import type { CampusRealtimePayload } from "@/lib/campusCinemaSeats";
import {
  getPeerMapPixelsFromPayload,
  getSeatPositionForIndex
} from "@/lib/campusCinemaSeats";
import { isFreshAdminBroadcast } from "@/lib/campusAdminBroadcast";
import { playCampusAdminBroadcastChime } from "@/lib/campusAdminBroadcastSound";
import { useCampusPresenceStore } from "@/stores/campusPresenceStore";
import { useCampusStore } from "@/stores/campusStore";
import { CampusAdminBroadcastBubble } from "@/components/campus/CampusAdminBroadcastBubble";

const BUBBLE_MAX_PX = 384;
const SCREEN_PAD_PX = 14;

function clampAnchorCenterToViewport(anchorXPercent: number, anchorYPercent: number) {
  if (typeof window === "undefined") {
    return {
      left: `${anchorXPercent}%`,
      top: `${anchorYPercent}%`,
      transform: "translate(-50%, -135%)"
    };
  }
  const vw = window.visualViewport?.width ?? window.innerWidth;
  const pad = SCREEN_PAD_PX;
  const bubbleHalf = Math.min(BUBBLE_MAX_PX, vw - pad * 2) / 2;
  const cx = (anchorXPercent / 100) * vw;
  const clamped = Math.round(Math.min(Math.max(bubbleHalf + pad, cx), vw - bubbleHalf - pad));

  return {
    left: `${clamped}px`,
    top: `${anchorYPercent}%`,
    transform: "translate(-50%, -135%)"
  } as const;
}

function ClampedBroadcastAnchor({
  anchorXPercent,
  anchorYPercent,
  children
}: {
  anchorXPercent: number;
  anchorYPercent: number;
  children: ReactNode;
}) {
  const [style, setStyle] = useState(() =>
    clampAnchorCenterToViewport(anchorXPercent, anchorYPercent)
  );

  useLayoutEffect(() => {
    const run = () =>
      setStyle(clampAnchorCenterToViewport(anchorXPercent, anchorYPercent));
    run();
    window.addEventListener("resize", run);
    window.visualViewport?.addEventListener("resize", run);
    return () => {
      window.removeEventListener("resize", run);
      window.visualViewport?.removeEventListener("resize", run);
    };
  }, [anchorXPercent, anchorYPercent]);

  return (
    <motion.div className="absolute left-0 top-0" style={style}>
      {children}
    </motion.div>
  );
}

type Props = {
  /** E-mail reconhecido como admin (NEXT_PUBLIC_CAMPUS_ADMIN_EMAILS). */
  isCampusAdmin: boolean;
};

function peerHasLiveBroadcast(p: CampusRealtimePayload) {
  return (
    p.campusRole === "admin" &&
    Boolean(p.adminBroadcastText?.length) &&
    isFreshAdminBroadcast(p.adminBroadcastAt)
  );
}

export function CampusAdminBroadcastLayer({ isCampusAdmin }: Props) {
  const selfBroadcast = useCampusStore((s) => s.adminBroadcast);
  const player = useCampusStore((s) => s.player);
  const isCineOpen = useCampusStore((s) => s.isCineOpen);
  const posture = useCampusStore((s) => s.avatarPosture);
  const seatIndex = useCampusStore((s) => s.cinemaSeatIndex);

  const othersByUid = useCampusPresenceStore((s) => s.othersByUid);
  const heardRef = useRef<Set<string>>(new Set());

  const selfAnchor = useMemo(() => {
    if (
      isCineOpen &&
      posture === "sit" &&
      typeof seatIndex === "number" &&
      Number.isFinite(seatIndex)
    ) {
      return getSeatPositionForIndex(seatIndex);
    }
    return player;
  }, [isCineOpen, posture, seatIndex, player.x, player.y]);

  const showSelf =
    isCampusAdmin &&
    selfBroadcast != null &&
    isFreshAdminBroadcast(selfBroadcast.sentAtMs);

  const peerAdmins = useMemo(() => {
    return Object.values(othersByUid).filter(peerHasLiveBroadcast);
  }, [othersByUid]);

  useEffect(() => {
    for (const p of peerAdmins) {
      if (!p.adminBroadcastText) continue;
      const k = `${p.uid}-${p.adminBroadcastAt}`;
      if (heardRef.current.has(k)) continue;
      heardRef.current.add(k);
      playCampusAdminBroadcastChime();
      if (heardRef.current.size > 56) heardRef.current.clear();
    }
  }, [peerAdmins]);

  return (
    <div
      className="fixed inset-0 z-[44] overflow-x-hidden pointer-events-none"
      aria-hidden={!showSelf && peerAdmins.length === 0}
    >
      <AnimatePresence mode="sync">
        {showSelf && selfBroadcast ? (
          <ClampedBroadcastAnchor
            key={`self-${selfBroadcast.sentAtMs}`}
            anchorXPercent={selfAnchor.x}
            anchorYPercent={selfAnchor.y}
          >
            <CampusAdminBroadcastBubble text={selfBroadcast.text} />
          </ClampedBroadcastAnchor>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {peerAdmins.map((p) => {
          if (!p.adminBroadcastText) return null;
          const pos = getPeerMapPixelsFromPayload(p);
          return (
            <ClampedBroadcastAnchor
              key={`${p.uid}-${p.adminBroadcastAt}`}
              anchorXPercent={pos.x}
              anchorYPercent={pos.y}
            >
              <CampusAdminBroadcastBubble text={p.adminBroadcastText} />
            </ClampedBroadcastAnchor>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
