"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import type { CampusLivePresenceOnlineDto } from "@/lib/campusLivePresenceDto";

type PeerRow = inferRouterOutputs<AppRouter>["campus"]["campusSocialPoll"]["peers"][number];

type Phase = "day" | "night";

type UnifiedDot = {
  key: string;
  displayLabel: string;
  zoneTitlePt: string;
  statusLabelPt: string;
  levelLabel: string;
  avatarUrl: string | null;
  xPct: number;
  yPct: number;
};

function peerRowToDot(p: PeerRow): UnifiedDot {
  return {
    key: `soc:${p.peerToken}`,
    displayLabel: p.displayLabel,
    zoneTitlePt: p.zoneTitlePt,
    statusLabelPt: p.statusLabelPt,
    levelLabel: p.levelLabel,
    avatarUrl: p.avatarUrl ?? null,
    xPct: p.xPct,
    yPct: p.yPct
  };
}

function httpPeerToDot(p: CampusLivePresenceOnlineDto): UnifiedDot {
  return {
    key: `http:${p.visitorId}`,
    displayLabel: p.displayName.slice(0, 28) || "Visitante",
    zoneTitlePt: p.zoneTitlePt,
    statusLabelPt: p.currentHotspot ? "Área aberta" : "A explorar",
    levelLabel: "Campus",
    avatarUrl: null,
    xPct: p.xPct,
    yPct: p.yPct
  };
}

/**
 * Pontos no mapa — conta social (TRPC) + visitantes em tempo real (API HTTP).
 */
export function CampusSocialPresenceDots({
  phase,
  peers,
  httpPeers,
  className
}: {
  phase: Phase;
  peers?: PeerRow[] | null;
  /** Presença anónima/autenticada via `/api/campus/presence` (exclui o próprio cliente). */
  httpPeers?: CampusLivePresenceOnlineDto[] | null;
  className?: string;
}) {
  const dots = useMemo((): UnifiedDot[] => {
    const a = (peers ?? []).map(peerRowToDot);
    const b = (httpPeers ?? []).map(httpPeerToDot);
    return [...a, ...b];
  }, [peers, httpPeers]);

  if (!dots.length) return null;

  const ring =
    phase === "day"
      ? "ring-emerald-700/35 shadow-black/15"
      : "ring-white/18 shadow-black/35";

  return (
    <div className={cn("pointer-events-none absolute inset-0 z-[9] overflow-visible", className)}>
      <ul className="relative h-full w-full list-none">
        {dots.map((peer) => (
          <li key={peer.key}>
            <span
              className={cn(
                "pointer-events-auto absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-default items-center justify-center rounded-full border border-white/14 bg-black/38 text-[10px] font-semibold text-white/88 shadow-md backdrop-blur-md ring-1 transition hover:bg-black/48 hover:ring-emerald-400/35",
                ring
              )}
              style={{ left: `${peer.xPct}%`, top: `${peer.yPct}%` }}
              title={`${peer.displayLabel}\n${peer.zoneTitlePt}\n${peer.statusLabelPt}\nNível: ${peer.levelLabel}`}
              tabIndex={0}
              role="img"
            >
              {peer.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element -- avatar público pequeno */
                <img
                  src={peer.avatarUrl}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span aria-hidden className="tabular-nums opacity-90">
                  {(peer.displayLabel.slice(0, 1) || "?").toUpperCase()}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
