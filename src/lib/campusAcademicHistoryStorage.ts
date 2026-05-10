/**
 * Histórico académico agregado localmente — espelhar métricas no backend quando existir modelo.
 */

export const CAMPUS_ACADEMIC_HISTORY_LS_KEY = "thc_campus_academic_history_v1" as const;

const VERSION = 1 as const;

export type CourseAcademicHistoryEntry = {
  courseId: string;
  /** Tempo acumulado com painéis de aula focados (ms). */
  studyMsTotal: number;
  /** Eventos de quiz com resposta registada (≥1 tentativa persistida). */
  quizzesAnswered: number;
  /** Módulos = índices de aulas distintos tocados. */
  lessonIndicesTouched: number[];
  updatedAtMs: number;
};

export type CampusAcademicHistoryStored = {
  version: typeof VERSION;
  byCourse: Record<string, CourseAcademicHistoryEntry>;
};

function readBlob(): CampusAcademicHistoryStored {
  if (typeof window === "undefined") {
    return { version: VERSION, byCourse: {} };
  }
  try {
    const raw = window.localStorage.getItem(CAMPUS_ACADEMIC_HISTORY_LS_KEY);
    if (!raw) return { version: VERSION, byCourse: {} };
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return { version: VERSION, byCourse: {} };
    const o = j as Partial<CampusAcademicHistoryStored>;
    if (o.version !== VERSION || !o.byCourse || typeof o.byCourse !== "object") {
      return { version: VERSION, byCourse: {} };
    }
    return { version: VERSION, byCourse: { ...o.byCourse } };
  } catch {
    return { version: VERSION, byCourse: {} };
  }
}

function writeBlob(blob: CampusAcademicHistoryStored): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CAMPUS_ACADEMIC_HISTORY_LS_KEY, JSON.stringify(blob));
  } catch {
    /* noop */
  }
}

/** Chamado quando `persistLessonDwellAccumulatedMs` avança — regista delta de estudo. */
export function recordAcademicStudyMsDelta(
  courseId: string,
  lessonIndex: number,
  previousAccumulatedMs: number,
  nextAccumulatedMs: number
): void {
  const delta = Math.max(0, Math.floor(nextAccumulatedMs - previousAccumulatedMs));
  if (!delta) return;
  const blob = readBlob();
  const prev =
    blob.byCourse[courseId] ??
    ({
      courseId,
      studyMsTotal: 0,
      quizzesAnswered: 0,
      lessonIndicesTouched: [],
      updatedAtMs: Date.now()
    } satisfies CourseAcademicHistoryEntry);

  const touched = new Set(prev.lessonIndicesTouched ?? []);
  touched.add(Math.max(0, Math.floor(lessonIndex)));

  blob.byCourse[courseId] = {
    ...prev,
    courseId,
    studyMsTotal: Math.max(0, prev.studyMsTotal + delta),
    lessonIndicesTouched: [...touched].sort((a, b) => a - b),
    updatedAtMs: Date.now()
  };
  writeBlob(blob);
}

export function bumpAcademicQuizAnswered(courseId: string): void {
  const blob = readBlob();
  const prev =
    blob.byCourse[courseId] ??
    ({
      courseId,
      studyMsTotal: 0,
      quizzesAnswered: 0,
      lessonIndicesTouched: [],
      updatedAtMs: Date.now()
    } satisfies CourseAcademicHistoryEntry);
  blob.byCourse[courseId] = {
    ...prev,
    courseId,
    quizzesAnswered: prev.quizzesAnswered + 1,
    updatedAtMs: Date.now()
  };
  writeBlob(blob);
}

export function readCampusAcademicHistoryRows(): CourseAcademicHistoryEntry[] {
  const blob = readBlob();
  return Object.values(blob.byCourse).sort((a, b) => b.updatedAtMs - a.updatedAtMs);
}

export function clearCampusAcademicHistoryStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CAMPUS_ACADEMIC_HISTORY_LS_KEY);
  } catch {
    /* noop */
  }
}
