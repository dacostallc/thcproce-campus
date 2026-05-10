export const CAMPUS_MEDIA_PLAYER_POSITION_LS_KEY = "thcproce.campus.mediaPlayerPosition.v1";

export type CampusMediaPlayerMode = "expanded" | "compact" | "mini";

export type CampusMediaPlayerPositionV1 = {
  version: 1;
  /** `position:fixed` — px desde o canto superior-esquerdo do viewport. */
  x: number;
  y: number;
  /** Compat: true quando `playerMode === "expanded"`. */
  expanded: boolean;
  /** Preferencial sobre `expanded`. */
  playerMode?: CampusMediaPlayerMode;
};

function isFiniteNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

export function coerceCampusMediaPlayerMode(data: Partial<CampusMediaPlayerPositionV1>): CampusMediaPlayerMode {
  const m = data.playerMode;
  if (m === "expanded" || m === "compact" || m === "mini") return m;
  if (data.expanded) return "expanded";
  return "compact";
}

export function readCampusMediaPlayerPosition(): CampusMediaPlayerPositionV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CAMPUS_MEDIA_PLAYER_POSITION_LS_KEY);
    if (!raw?.trim()) return null;
    const data = JSON.parse(raw) as Partial<CampusMediaPlayerPositionV1>;
    if (data.version !== 1) return null;
    if (!isFiniteNum(data.x) || !isFiniteNum(data.y)) return null;
    const mode = coerceCampusMediaPlayerMode(data);
    return {
      version: 1,
      x: data.x,
      y: data.y,
      expanded: mode === "expanded",
      playerMode: mode
    };
  } catch {
    return null;
  }
}

export function writeCampusMediaPlayerPosition(p: CampusMediaPlayerPositionV1): void {
  if (typeof window === "undefined") return;
  const mode = coerceCampusMediaPlayerMode(p);
  try {
    window.localStorage.setItem(
      CAMPUS_MEDIA_PLAYER_POSITION_LS_KEY,
      JSON.stringify({
        version: 1,
        x: p.x,
        y: p.y,
        expanded: mode === "expanded",
        playerMode: mode
      })
    );
  } catch {
    /* quota */
  }
}