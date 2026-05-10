"use client";

import { cn } from "@/lib/utils";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

type PeerRow = inferRouterOutputs<AppRouter>["campus"]["campusSocialPoll"]["peers"][number];

type Phase = "day" | "night";

/**
 * Pontos discretos por zona pedagógica — não geolocalização real.
 */
export function CampusSocialPresenceDots({
  phase,
  peers,
  className
}: {
  phase: Phase;
  peers?: PeerRow[] | null;
  className?: string;
}) {
  if (!peers?.length) return null;

  const ring =
    phase === "day"
      ? "ring-emerald-700/35 shadow-black/15"
      : "ring-white/18 shadow-black/35";

  return (
    <div className={cn("pointer-events-none absolute inset-0 z-[9] overflow-visible", className)}>
      <ul className="relative h-full w-full list-none">
        {peers.map((peer) => (
          <li key={peer.peerToken}>
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
