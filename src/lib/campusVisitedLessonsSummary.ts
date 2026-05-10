import { areas } from "@/data/courses";

const AWARD_PREFIX = "thc_local_watch_awarded_" as const;

/** Mapa areaId → índices de aulas que já abriram o painel pelo menos uma vez (flags de XP único). */
export function parseOpenedLessonKeysFromStorage(): Map<string, Set<number>> {
  const map = new Map<string, Set<number>>();
  if (typeof window === "undefined") return map;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k?.startsWith(AWARD_PREFIX)) continue;
      const body = k.slice(AWARD_PREFIX.length);
      const lastUnderscore = body.lastIndexOf("_");
      if (lastUnderscore <= 0) continue;
      const areaId = body.slice(0, lastUnderscore);
      const idx = Number(body.slice(lastUnderscore + 1));
      if (!Number.isFinite(idx)) continue;
      if (!map.has(areaId)) map.set(areaId, new Set());
      map.get(areaId)!.add(Math.floor(idx));
    }
  } catch {
    /* noop */
  }
  return map;
}

export function countLessonsOpenedOnce(): number {
  let n = 0;
  for (const set of parseOpenedLessonKeysFromStorage().values()) {
    n += set.size;
  }
  return n;
}

export type CourseVisitRow = {
  areaId: string;
  courseName: string;
  distinctLessonsVisited: number;
};

export function listOpenedLessonCountsByCourse(): CourseVisitRow[] {
  const parsed = parseOpenedLessonKeysFromStorage();
  const rows: CourseVisitRow[] = [];
  for (const [areaId, set] of parsed) {
    const a = areas.find((x) => x.id === areaId);
    rows.push({
      areaId,
      courseName: a?.name ?? areaId,
      distinctLessonsVisited: set.size
    });
  }
  return rows.sort((x, y) => y.distinctLessonsVisited - x.distinctLessonsVisited);
}
