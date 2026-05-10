"use client";

import { memo } from "react";
import type { CampusLeaderboardRowMock } from "@/lib/campusLeaderboardMock";
import { cn } from "@/lib/utils";

type Props = { row: CampusLeaderboardRowMock; rank: number };

/** Memoized row tile for perf on long lists / tab switches. */
export const LeaderboardCard = memo(function LeaderboardCard({
  row,
  rank
}: Props) {
  return (
    <li
      className={cn(
        "rounded-xl border border-white/12 bg-black/25 px-3 py-2.5 backdrop-blur-sm",
        rank <= 3 && "border-amber-300/42 bg-gradient-to-br from-amber-500/[0.08] to-transparent"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[11px] font-bold tabular-nums text-emerald-200/92">#{rank}</span>
          <p className="truncate font-semibold text-white">{row.displayName}</p>
          <dl className="mt-2 grid grid-cols-4 gap-x-2 gap-y-1 text-[10px] text-white/62">
            <div>
              <dt className="uppercase tracking-wide text-white/36">XP</dt>
              <dd className="font-semibold tabular-nums text-white">{row.xp}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wide text-white/36">Cred.</dt>
              <dd className="font-semibold tabular-nums text-white">{row.credits}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wide text-white/36">Aulas</dt>
              <dd className="font-semibold tabular-nums text-white">{row.lessonsCompleted}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wide text-white/36">Souv.</dt>
              <dd className="font-semibold tabular-nums text-white">{row.souvenirsCount}</dd>
            </div>
          </dl>
        </div>
      </div>
    </li>
  );
});
