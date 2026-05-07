const KEY = "thc_campus_last_lesson_v1";

/** Última aula aberta por curso (areaId) — localStorage para retomar ao reabrir pelo mapa. */
export function getLastLessonIndex(areaId: string, fallback = 0): number {
  if (typeof window === "undefined") return fallback;
  try {
    const j = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, number>;
    const v = j[areaId];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) return Math.floor(v);
  } catch {
    /* noop */
  }
  return fallback;
}

export function setLastLessonIndex(areaId: string, index: number): void {
  if (typeof window === "undefined") return;
  try {
    const j = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, number>;
    j[areaId] = Math.max(0, Math.floor(index));
    localStorage.setItem(KEY, JSON.stringify(j));
  } catch {
    /* noop */
  }
}
