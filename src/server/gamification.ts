export const LEVELS = [
  { key: "semente", label: "Semente", minXp: 0 },
  { key: "muda", label: "Muda", minXp: 200 },
  { key: "vegetativa", label: "Vegetativa", minXp: 500 },
  { key: "floracao", label: "Floração", minXp: 1200 },
  { key: "colheita", label: "Colheita", minXp: 2500 },
  { key: "master", label: "Master Grower", minXp: 5000 }
] as const;

export type LevelRow = (typeof LEVELS)[number];

export function levelFromXp(xp: number): LevelRow {
  let current: LevelRow = LEVELS[0];
  for (const L of LEVELS) {
    if (xp >= L.minXp) current = L;
  }
  return current;
}
