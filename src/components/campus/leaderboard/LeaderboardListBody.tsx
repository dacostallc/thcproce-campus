"use client";

import { memo } from "react";
import type { CampusLeaderboardRowMock } from "@/lib/campusLeaderboardMock";
import { LeaderboardCard } from "@/components/campus/leaderboard/LeaderboardCard";

type Props = { rows: CampusLeaderboardRowMock[] };

const LeaderboardRows = memo(function LeaderboardRows({ rows }: Props) {
  return (
    <ul className="space-y-2">
      {rows.map((row, idx) => (
        <LeaderboardCard key={row.id} row={row} rank={idx + 1} />
      ))}
    </ul>
  );
});

export default LeaderboardRows;
