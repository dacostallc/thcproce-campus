/** Entradas em CAMPUS_DB_LESSONS: `areaId|lessonIndex|courseSlug|moduleSlug|lessonSlug` separadas por vírgula. */
export type CampusDbLessonEntry = {
  areaId: string;
  lessonIndex: number;
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
};

/**
 * Lê `CAMPUS_DB_LESSONS` (servidor). Sem valor = nenhuma aula piloto.
 * Formato por entrada: areaId|índice0based|slugCurso|slugMódulo|slugAula
 */
export function parseCampusDbLessonsEnv(): CampusDbLessonEntry[] {
  const raw = typeof process.env.CAMPUS_DB_LESSONS === "string" ? process.env.CAMPUS_DB_LESSONS.trim() : "";
  if (!raw) return [];
  const out: CampusDbLessonEntry[] = [];
  for (const part of raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)) {
    const segs = part.split("|").map((s) => s.trim());
    if (segs.length !== 5) {
      console.warn("[campus-db-lesson] entrada malformada (esperado 5 segmentos |):", part);
      continue;
    }
    const [areaId, idxStr, courseSlug, moduleSlug, lessonSlug] = segs;
    const lessonIndex = Number.parseInt(idxStr, 10);
    if (
      !areaId ||
      !Number.isFinite(lessonIndex) ||
      lessonIndex < 0 ||
      !courseSlug ||
      !moduleSlug ||
      !lessonSlug
    ) {
      console.warn("[campus-db-lesson] entrada inválida:", part);
      continue;
    }
    out.push({ areaId, lessonIndex, courseSlug, moduleSlug, lessonSlug });
  }
  return out;
}

export function getDbLessonTargetForCampusSlot(
  areaId: string,
  lessonIndex: number,
): { courseSlug: string; moduleSlug: string; lessonSlug: string } | null {
  const hit = parseCampusDbLessonsEnv().find(
    (e) => e.areaId === areaId && e.lessonIndex === lessonIndex,
  );
  return hit ? { courseSlug: hit.courseSlug, moduleSlug: hit.moduleSlug, lessonSlug: hit.lessonSlug } : null;
}
