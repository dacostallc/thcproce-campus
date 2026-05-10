export const CAMPUS_AVATAR_POSITION_LS_KEY = "thcproce.campus.avatarPosition.v1";

export type CampusAvatarPositionV1 = {
  xPercent: number;
  yPercent: number;
};

function isFinitePct(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/** Lê posição persistida do avatar no mapa (% relativos ao content-box da arte). */
export function readCampusAvatarPositionV1(): CampusAvatarPositionV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CAMPUS_AVATAR_POSITION_LS_KEY);
    if (!raw?.trim()) return null;
    const data = JSON.parse(raw) as Partial<CampusAvatarPositionV1>;
    if (!isFinitePct(data.xPercent) || !isFinitePct(data.yPercent)) return null;
    const x = Math.min(99, Math.max(1, data.xPercent));
    const y = Math.min(99, Math.max(1, data.yPercent));
    return { xPercent: x, yPercent: y };
  } catch {
    return null;
  }
}

export function writeCampusAvatarPositionV1(p: CampusAvatarPositionV1): void {
  if (typeof window === "undefined") return;
  try {
    const x = Math.min(99, Math.max(1, p.xPercent));
    const y = Math.min(99, Math.max(1, p.yPercent));
    window.localStorage.setItem(
      CAMPUS_AVATAR_POSITION_LS_KEY,
      JSON.stringify({ xPercent: x, yPercent: y })
    );
  } catch {
    /* quota / private mode */
  }
}
