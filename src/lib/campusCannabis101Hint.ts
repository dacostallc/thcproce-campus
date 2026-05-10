import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";

/** Marca quando o aluno acede pela primeira vez à **aula 0** Cannabis 101 (painel fecha o destaque permanentemente). */
export const CANNABIS101_START_HINT_LS_KEY = "thc_c101_first_lesson_began_v1" as const;

const CAMPUS_LESSON_LS_KEY = "thc_campus_lesson_v1";

export const CANNABIS101_START_HINT_EVENT = "thc-campus-c101-start-hint" as const;

type LsShape = Record<string, number[]>;

function readLessonLs(): LsShape {
  if (typeof window === "undefined") return {};
  try {
    const j = JSON.parse(window.localStorage.getItem(CAMPUS_LESSON_LS_KEY) ?? "{}") as unknown;
    if (!j || typeof j !== "object" || Array.isArray(j)) return {};
    const o: LsShape = {};
    for (const [k, v] of Object.entries(j)) {
      if (!Array.isArray(v)) continue;
      o[k] = v.filter((x): x is number => typeof x === "number");
    }
    return o;
  } catch {
    return {};
  }
}

export function notifyCannabis101StartHintListeners(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CANNABIS101_START_HINT_EVENT));
}

/** Após visitar a aula inicial (ou equivalente gamificado), o destaque não volta. */
export function markCannabis101FirstLessonBegun(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CANNABIS101_START_HINT_LS_KEY, "1");
  } catch {
    /* noop */
  }
  notifyCannabis101StartHintListeners();
}

export function hasCannabis101FirstLessonBegunSync(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CANNABIS101_START_HINT_LS_KEY) === "1";
}

/** Visto “Marcar episódio” / progresso local por aula no campus (qualquer índice). */
export function cannabis101HasLocalLessonMarksSync(): boolean {
  const marks = readLessonLs()[CANNABIS101_AREA_ID];
  return Array.isArray(marks) && marks.length > 0;
}
