"use client";

import { lazy, memo, Suspense, useMemo, useState } from "react";
import {
  type CampusLeaderboardRowMock,
  type CampusLeaderboardSortKey,
  CAMPUS_LEADERBOARD_MOCK_ROWS,
  sortCampusLeaderboardMockRows
} from "@/lib/campusLeaderboardMock";

const RowsLazy = lazy(async () => import("./LeaderboardListBody"));

const SORT_KEYS: { id: CampusLeaderboardSortKey; label: string }[] = [
  { id: "xp", label: "XP" },
  { id: "credits", label: "Créditos" },
  { id: "lessonsCompleted", label: "Aulas" },
  { id: "souvenirsCount", label: "Souvenirs" }
];

type Props = { showHeader?: boolean };

export const CampusLeaderboard = memo(function CampusLeaderboard({
  showHeader = true
}: Props) {
  const [sort, setSort] = useState<CampusLeaderboardSortKey>("xp");
  const sorted = useMemo(
    () => sortCampusLeaderboardMockRows(CAMPUS_LEADERBOARD_MOCK_ROWS, sort),
    [sort]
  );

  return (
    <div className="space-y-3">
      {showHeader ? (
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-200/92">
            Ranking exemplificativo
          </p>
          <p className="text-[11px] leading-relaxed text-white/52">
            Lista fictícia só para navegação até o leaderboard da escola ficar disponível nos servidores.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {SORT_KEYS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSort(id)}
            className={
              sort === id
                ? "rounded-full border border-amber-300/52 bg-amber-500/[0.12] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-100"
                : "rounded-full border border-white/14 bg-black/26 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/68 transition hover:bg-white/10 hover:text-white"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <Suspense fallback={<LeaderboardSkeleton rows={sorted} />}>
        <RowsLazy rows={sorted} />
      </Suspense>
    </div>
  );
});

/** Minimal placeholder while chunked list loads (prevents CLS jump). */
function LeaderboardSkeleton({ rows }: { rows: CampusLeaderboardRowMock[] }) {
  return (
    <ul className="space-y-2" aria-busy aria-label="Ranking a carregar">
      {rows.map((r, i) => (
        <li
          key={r.id}
          className="h-[4.85rem] animate-pulse rounded-xl border border-white/10 bg-white/[0.04]"
          style={{ animationDelay: `${i * 40}ms` }}
        />
      ))}
    </ul>
  );
}
