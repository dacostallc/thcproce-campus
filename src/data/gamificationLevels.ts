/** Espelho estável para UI cliente — manter alinhado a `src/server/gamification.ts`. */
export const LEVEL_KEYS = [
  "semente",
  "muda",
  "vegetativa",
  "floracao",
  "colheita",
  "master"
] as const;

export function levelNumberFromKey(key: string | undefined): number {
  if (!key) return 1;
  const i = LEVEL_KEYS.indexOf(key as (typeof LEVEL_KEYS)[number]);
  return i >= 0 ? i + 1 : 1;
}
