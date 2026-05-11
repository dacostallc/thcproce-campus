/** HUD «Cinema e ao vivo»: chave dedicada (≠ player ambiente `campusMediaPlayerPosition`, ≠ presença). */
export const CAMPUS_CINEMA_LIVE_FRAME_LS_KEY = "thcproce.campus.cinemaLiveHudDockPosition.v1";

/** Legado: canto inferior / arrasto livre — migrado para dock superior. */
export type CampusCinemaLiveFramePositionV1 = {
  version: 1;
  x: number;
  y: number;
};

/** Dock superior: apenas deslocamento vertical preferido (px, `position:fixed` top). */
export type CampusCinemaLiveFramePositionV2 = {
  version: 2;
  y: number;
};

export type CampusCinemaLiveFrameStoredPosition = CampusCinemaLiveFramePositionV2;

function isFiniteNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/**
 * Lê posição vertical guardada (v2) ou migra v1 (só se não estiver no dock antigo em baixo).
 */
export function readCampusCinemaLiveFramePosition(): CampusCinemaLiveFrameStoredPosition | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CAMPUS_CINEMA_LIVE_FRAME_LS_KEY);
    if (!raw?.trim()) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (data.version === 2 && isFiniteNum(data.y)) {
      return { version: 2, y: data.y };
    }
    if (data.version === 1 && isFiniteNum(data.x) && isFiniteNum(data.y)) {
      const vh = window.innerHeight;
      /* Posições antigas junto ao rodapé → ignorar para adoptar o novo dock superior. */
      if (data.y > vh * 0.42) return null;
      return { version: 2, y: data.y };
    }
    return null;
  } catch {
    return null;
  }
}

export function writeCampusCinemaLiveFramePosition(p: CampusCinemaLiveFrameStoredPosition): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CAMPUS_CINEMA_LIVE_FRAME_LS_KEY,
      JSON.stringify({ version: 2, y: p.y })
    );
  } catch {
    /* quota */
  }
}
