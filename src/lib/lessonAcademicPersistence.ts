/**
 * Persistência local das regras académicas (tempo na aula + tentativas de quiz).
 * TODO Prisma: migrar para `StudentLessonDwell` / `StudentLessonQuizAttempt` mantendo estes tipos.
 */

export const LESSON_DWELL_LS_KEY = "thc_lesson_dwell_v1" as const;
export const LESSON_QUIZ_ATTEMPTS_LS_KEY = "thc_lesson_quiz_attempts_v1" as const;
export const LESSON_VISITS_LS_KEY = "thc_lesson_visits_v1" as const;

const DWELL_VERSION = 1 as const;
const QUIZ_VERSION = 1 as const;
const VISITS_VERSION = 1 as const;

/** Chave composta estável no cliente — espelhar como `(areaId, lessonIndex)` na BD. */
export type LessonDwellLessonKey = `${string}:${number}`;

export function lessonDwellStorageKey(areaId: string, lessonIndex: number): LessonDwellLessonKey {
  return `${areaId}:${lessonIndex}`;
}

export type LessonDwellRecord = {
  /** Tempo acumulado com o painel da aula aberto (ms). */
  accumulatedMs: number;
  updatedAtMs: number;
};

export type LessonDwellStoredV1 = {
  version: typeof DWELL_VERSION;
  byLesson: Partial<Record<LessonDwellLessonKey, LessonDwellRecord>>;
};

export type LessonQuizAttemptRecord = {
  pickedIndex: number;
  /** Créditos efectivamente aplicados na primeira tentativa válida (ex.: −2 pode virar 0 se saldo já era 0). */
  creditsDeltaApplied: number;
  recordedAtMs: number;
};

export type LessonQuizAttemptsStoredV1 = {
  version: typeof QUIZ_VERSION;
  /** Chave: `${areaId}:${lessonIndex}:${questionId}` */
  byQuestion: Partial<Record<string, LessonQuizAttemptRecord>>;
};

export function lessonQuizAttemptStorageKey(
  areaId: string,
  lessonIndex: number,
  questionId: string
): string {
  return `${areaId}:${lessonIndex}:${questionId}`;
}

/** Id estável para uma questão inline (texto + índice no array da aula). */
export function buildInlineLessonQuizQuestionId(questionIndex: number, questionText: string): string {
  const norm = questionText.trim().slice(0, 160);
  return `q${questionIndex}_${hashFnv1a32(norm)}`;
}

function hashFnv1a32(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

function readDwellBlob(): LessonDwellStoredV1 {
  if (typeof window === "undefined") {
    return { version: DWELL_VERSION, byLesson: {} };
  }
  try {
    const raw = window.localStorage.getItem(LESSON_DWELL_LS_KEY);
    if (!raw) return { version: DWELL_VERSION, byLesson: {} };
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return { version: DWELL_VERSION, byLesson: {} };
    const o = j as Partial<LessonDwellStoredV1>;
    if (o.version !== DWELL_VERSION || !o.byLesson || typeof o.byLesson !== "object") {
      return { version: DWELL_VERSION, byLesson: {} };
    }
    return { version: DWELL_VERSION, byLesson: { ...o.byLesson } };
  } catch {
    return { version: DWELL_VERSION, byLesson: {} };
  }
}

function writeDwellBlob(blob: LessonDwellStoredV1): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LESSON_DWELL_LS_KEY, JSON.stringify(blob));
  } catch {
    /* noop */
  }
}

export function readLessonDwellAccumulatedMs(areaId: string, lessonIndex: number): number {
  const key = lessonDwellStorageKey(areaId, lessonIndex);
  const rec = readDwellBlob().byLesson[key];
  const ms = rec?.accumulatedMs;
  return typeof ms === "number" && Number.isFinite(ms) && ms >= 0 ? ms : 0;
}

export function persistLessonDwellAccumulatedMs(
  areaId: string,
  lessonIndex: number,
  accumulatedMs: number
): void {
  const key = lessonDwellStorageKey(areaId, lessonIndex);
  const ms = Math.max(0, Math.floor(accumulatedMs));
  const blob = readDwellBlob();
  blob.byLesson[key] = { accumulatedMs: ms, updatedAtMs: Date.now() };
  writeDwellBlob(blob);
}

function readQuizBlob(): LessonQuizAttemptsStoredV1 {
  if (typeof window === "undefined") {
    return { version: QUIZ_VERSION, byQuestion: {} };
  }
  try {
    const raw = window.localStorage.getItem(LESSON_QUIZ_ATTEMPTS_LS_KEY);
    if (!raw) return { version: QUIZ_VERSION, byQuestion: {} };
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return { version: QUIZ_VERSION, byQuestion: {} };
    const o = j as Partial<LessonQuizAttemptsStoredV1>;
    if (o.version !== QUIZ_VERSION || !o.byQuestion || typeof o.byQuestion !== "object") {
      return { version: QUIZ_VERSION, byQuestion: {} };
    }
    return { version: QUIZ_VERSION, byQuestion: { ...o.byQuestion } };
  } catch {
    return { version: QUIZ_VERSION, byQuestion: {} };
  }
}

function writeQuizBlob(blob: LessonQuizAttemptsStoredV1): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LESSON_QUIZ_ATTEMPTS_LS_KEY, JSON.stringify(blob));
  } catch {
    /* noop */
  }
}

export function readLessonQuizAttempt(questionCompositeKey: string): LessonQuizAttemptRecord | null {
  const rec = readQuizBlob().byQuestion[questionCompositeKey];
  if (!rec || typeof rec.pickedIndex !== "number") return null;
  return rec;
}

export function persistLessonQuizAttempt(
  questionCompositeKey: string,
  attempt: LessonQuizAttemptRecord
): void {
  const blob = readQuizBlob();
  blob.byQuestion[questionCompositeKey] = attempt;
  writeQuizBlob(blob);
}

export type LessonVisitsStoredV1 = {
  version: typeof VISITS_VERSION;
  /** Por área: índices de aulas onde o painel foi aberto pelo menos uma vez. */
  byArea: Record<string, number[]>;
};

function readVisitsBlob(): LessonVisitsStoredV1 {
  if (typeof window === "undefined") {
    return { version: VISITS_VERSION, byArea: {} };
  }
  try {
    const raw = window.localStorage.getItem(LESSON_VISITS_LS_KEY);
    if (!raw) return { version: VISITS_VERSION, byArea: {} };
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return { version: VISITS_VERSION, byArea: {} };
    const o = j as Partial<LessonVisitsStoredV1>;
    if (o.version !== VISITS_VERSION || !o.byArea || typeof o.byArea !== "object") {
      return { version: VISITS_VERSION, byArea: {} };
    }
    return { version: VISITS_VERSION, byArea: { ...o.byArea } };
  } catch {
    return { version: VISITS_VERSION, byArea: {} };
  }
}

function writeVisitsBlob(blob: LessonVisitsStoredV1): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LESSON_VISITS_LS_KEY, JSON.stringify(blob));
  } catch {
    /* noop */
  }
}

/** Regista visita à aula (painel aberto) — independente de «concluída». */
export function persistLessonVisit(areaId: string, lessonIndex: number): void {
  const idx = Math.max(0, Math.floor(lessonIndex));
  const blob = readVisitsBlob();
  const set = new Set(blob.byArea[areaId] ?? []);
  set.add(idx);
  blob.byArea[areaId] = [...set].sort((a, b) => a - b);
  writeVisitsBlob(blob);
}

export function readLessonVisitedIndices(areaId: string): Set<number> {
  const arr = readVisitsBlob().byArea[areaId] ?? [];
  const out = new Set<number>();
  for (const x of arr) {
    if (typeof x === "number" && Number.isFinite(x) && x >= 0) out.add(Math.floor(x));
  }
  return out;
}

export function clearLessonAcademicLocalStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LESSON_DWELL_LS_KEY);
    window.localStorage.removeItem(LESSON_QUIZ_ATTEMPTS_LS_KEY);
    window.localStorage.removeItem(LESSON_VISITS_LS_KEY);
  } catch {
    /* noop */
  }
}
