/**
 * TODO Prisma: `CampusLeaderboardSnapshot` / materialized leaderboard from Postgres.
 *
 * Demo rows for THCProce campus HUD / ranking page — deterministic mock data only.
 */

export type CampusLeaderboardSortKey =
  | "xp"
  | "credits"
  | "lessonsCompleted"
  | "souvenirsCount";

export type CampusLeaderboardRowMock = {
  id: string;
  displayName: string;
  xp: number;
  credits: number;
  lessonsCompleted: number;
  souvenirsCount: number;
};

const RAW: CampusLeaderboardRowMock[] = [
  {
    id: "mock-ana",
    displayName: "Ana Verde",
    xp: 4_820,
    credits: 412,
    lessonsCompleted: 38,
    souvenirsCount: 6
  },
  {
    id: "mock-bruno",
    displayName: "Bruno Extrator",
    xp: 3_260,
    credits: 289,
    lessonsCompleted: 29,
    souvenirsCount: 5
  },
  {
    id: "mock-camila",
    displayName: "Camila Indoor",
    xp: 2_910,
    credits: 198,
    lessonsCompleted: 24,
    souvenirsCount: 4
  },
  {
    id: "mock-diego",
    displayName: "Diego Pesquisador",
    xp: 2_340,
    credits: 356,
    lessonsCompleted: 21,
    souvenirsCount: 3
  },
  {
    id: "mock-elisa",
    displayName: "Elisa THC",
    xp: 1_880,
    credits: 140,
    lessonsCompleted: 18,
    souvenirsCount: 4
  },
  {
    id: "mock-felipe",
    displayName: "Felipe Horta",
    xp: 1_420,
    credits: 95,
    lessonsCompleted: 15,
    souvenirsCount: 2
  },
  {
    id: "mock-gabi",
    displayName: "Gabi Biblioteca",
    xp: 1_050,
    credits: 312,
    lessonsCompleted: 12,
    souvenirsCount: 3
  },
  {
    id: "mock-henrique",
    displayName: "Henrique Lobby",
    xp: 640,
    credits: 48,
    lessonsCompleted: 9,
    souvenirsCount: 1
  }
];

export const CAMPUS_LEADERBOARD_MOCK_ROWS: CampusLeaderboardRowMock[] = [...RAW];

export function sortCampusLeaderboardMockRows(
  rows: CampusLeaderboardRowMock[],
  key: CampusLeaderboardSortKey
): CampusLeaderboardRowMock[] {
  return [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (bv !== av) return bv - av;
    return a.displayName.localeCompare(b.displayName, "pt");
  });
}
