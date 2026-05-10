export const CAMPUS_CINEMA_LIVE_FRAME_LS_KEY = "thcproce.campus.cinemaLiveFramePosition.v1";

export type CampusCinemaLiveFramePositionV1 = {
  version: 1;
  /** `position:fixed` — px desde o canto superior-esquerdo do viewport. */
  x: number;
  y: number;
};

function isFiniteNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

export function readCampusCinemaLiveFramePosition(): CampusCinemaLiveFramePositionV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CAMPUS_CINEMA_LIVE_FRAME_LS_KEY);
    if (!raw?.trim()) return null;
    const data = JSON.parse(raw) as Partial<CampusCinemaLiveFramePositionV1>;
    if (data.version !== 1) return null;
    if (!isFiniteNum(data.x) || !isFiniteNum(data.y)) return null;
    return { version: 1, x: data.x, y: data.y };
  } catch {
    return null;
  }
}

export function writeCampusCinemaLiveFramePosition(p: CampusCinemaLiveFramePositionV1): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CAMPUS_CINEMA_LIVE_FRAME_LS_KEY,
      JSON.stringify({ version: 1, x: p.x, y: p.y })
    );
  } catch {
    /* quota */
  }
}
