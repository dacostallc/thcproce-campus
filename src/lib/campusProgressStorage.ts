import { areas, type Area } from "@/data/courses";
import { getLessonTitlesForArea } from "@/data/lessonOutline";
import { cannabis101HasLocalLessonMarksSync, hasCannabis101FirstLessonBegunSync } from "@/lib/campusCannabis101Hint";
import { getLastLessonIndex } from "@/lib/campusLastLesson";
import { CAMPUS_GUIDED_TOUR_DONE_LS_KEY, CAMPUS_TOUR_SEEN_LS_KEY } from "@/lib/campusOnboardingLs";

/** Alias legado ao JSON `campusProgress` — ver `campusOnboardingLs`. */
const CAMPUS_TOUR_COMPLETED_LS_KEY = CAMPUS_TOUR_SEEN_LS_KEY;

/** Versioned aggregate campus UI progress (resume chip, mirrored flags). Lesson marks / last-lesson indices stay authoritative in their legacy keys. */
export const CAMPUS_PROGRESS_LS_KEY = "thc_campus_progress_v1" as const;

/** Same-document updates (native `storage` does not fire in the authoring tab). */
export const CAMPUS_PROGRESS_UPDATED_EVENT = "thc-campus-progress-v1-changed" as const;

export const CAMPUS_LESSON_MARKS_LS_KEY = "thc_campus_lesson_v1" as const;

const SNAP_VERSION = 1 as const;

export type CourseProgressCacheEntry = { pct: number; updatedAt: number };

/** Persisted blob (omit fields that mirror other stores — reconciled on read). */
export type CampusProgressStored = {
  version: typeof SNAP_VERSION;
  lastAreaId: string | null;
  /** Resume pointer; paired with `lastAreaId`. */
  lastLessonIndex: number | null;
  courseProgressPct: Record<string, CourseProgressCacheEntry>;
  /** Mirror only; reconcile with Cannabis keys on load. */
  cannabis101Started: boolean;
  /** If true, resume chip stays hidden until next progression bump. */
  resumeBannerDismissed: boolean;
};

export type CampusProgress = CampusProgressStored & {
  /** Tour concluído ou pulado (`thc_campus_tour_seen_v1` OU `thc_campus_guided_tour_done_v1`). */
  tourCompleted: boolean;
};

function nowMs(): number {
  return Date.now();
}

export function areaByCampusId(id: string): Area | undefined {
  return areas.find((a) => a.id === id);
}

function readTourCompletedSync(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      window.localStorage.getItem(CAMPUS_TOUR_COMPLETED_LS_KEY) === "1" ||
      window.localStorage.getItem(CAMPUS_GUIDED_TOUR_DONE_LS_KEY) === "1"
    );
  } catch {
    return false;
  }
}

function deriveCannabis101StartedSync(): boolean {
  return hasCannabis101FirstLessonBegunSync() || cannabis101HasLocalLessonMarksSync();
}

type LessonMarksShape = Record<string, number[]>;

export function readLocalLessonMarks(): LessonMarksShape {
  if (typeof window === "undefined") return {};
  try {
    const j = JSON.parse(window.localStorage.getItem(CAMPUS_LESSON_MARKS_LS_KEY) ?? "{}") as unknown;
    if (!j || typeof j !== "object" || Array.isArray(j)) return {};
    const o: LessonMarksShape = {};
    for (const [k, v] of Object.entries(j)) {
      if (!Array.isArray(v)) continue;
      o[k] = v.filter((x): x is number => typeof x === "number");
    }
    return o;
  } catch {
    return {};
  }
}

/** Soma de aulas distintas marcadas em todas as áreas (marcações locais). */
export function sumDistinctLocalLessonMarksAcrossAreas(): number {
  const marks = readLocalLessonMarks();
  let n = 0;
  for (const arr of Object.values(marks)) {
    n += new Set(arr.filter((x) => typeof x === "number" && Number.isFinite(x)).map((i) => Math.floor(i))).size;
  }
  return n;
}

/** Progress % from **local** marks only (`thc_campus_lesson_v1`). */
export function computeLocalCoursePctFromMarks(areaId: string): number {
  const area = areaByCampusId(areaId);
  if (!area) return 0;
  const titles = getLessonTitlesForArea(area);
  const n = titles.length;
  if (!n) return 0;
  const marks = readLocalLessonMarks()[areaId] ?? [];
  const uniqueInRange = new Set(marks.filter((i) => i >= 0 && i < n));
  return Math.min(100, Math.round((uniqueInRange.size / n) * 100));
}

export function defaultCampusProgress(): CampusProgress {
  return {
    version: SNAP_VERSION,
    lastAreaId: null,
    lastLessonIndex: null,
    courseProgressPct: {},
    cannabis101Started: deriveCannabis101StartedSync(),
    tourCompleted: readTourCompletedSync(),
    resumeBannerDismissed: false
  };
}

export function parseCampusProgressStored(raw: string | null): Partial<CampusProgressStored> | null {
  if (raw == null || raw === "") return null;
  try {
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return null;
    return j as Partial<CampusProgressStored>;
  } catch {
    return null;
  }
}

/** Merge persisted JSON + authoritative keys + recomputed caches. */
export function loadCampusProgress(): CampusProgress {
  if (typeof window === "undefined") return defaultCampusProgress();

  let base = defaultCampusProgress();
  try {
    const parsed = parseCampusProgressStored(window.localStorage.getItem(CAMPUS_PROGRESS_LS_KEY));
    if (parsed && parsed.version === SNAP_VERSION) {
      base = {
        ...base,
        lastAreaId:
          typeof parsed.lastAreaId === "string"
            ? parsed.lastAreaId
            : parsed.lastAreaId === null
              ? null
              : base.lastAreaId,
        lastLessonIndex:
          typeof parsed.lastLessonIndex === "number" && Number.isFinite(parsed.lastLessonIndex)
            ? Math.floor(parsed.lastLessonIndex)
            : parsed.lastLessonIndex === null
              ? null
              : base.lastLessonIndex,
        courseProgressPct:
          parsed.courseProgressPct &&
          typeof parsed.courseProgressPct === "object" &&
          !Array.isArray(parsed.courseProgressPct)
            ? { ...sanitizeProgressMap(parsed.courseProgressPct) }
            : {},
        resumeBannerDismissed: Boolean(parsed.resumeBannerDismissed),
        cannabis101Started: Boolean(parsed.cannabis101Started)
      };
    }
  } catch {
    /* noop */
  }

  const cannabis = deriveCannabis101StartedSync();
  base.cannabis101Started = cannabis;
  base.tourCompleted = readTourCompletedSync();

  base.courseProgressPct = recomputeCourseProgressMap(base.courseProgressPct);

  return base;
}

function recomputeCourseProgressMap(
  prev: Record<string, CourseProgressCacheEntry>
): Record<string, CourseProgressCacheEntry> {
  const marks = readLocalLessonMarks();
  const keys = new Set([...Object.keys(marks), ...Object.keys(prev)]);
  const next: Record<string, CourseProgressCacheEntry> = {};
  const t = nowMs();
  for (const areaId of keys) {
    const newPct = computeLocalCoursePctFromMarks(areaId);
    const old = prev[areaId];
    next[areaId] = {
      pct: newPct,
      updatedAt: old && old.pct === newPct ? old.updatedAt : t
    };
  }
  return next;
}

function sanitizeProgressMap(o: Record<string, unknown>): Record<string, CourseProgressCacheEntry> {
  const out: Record<string, CourseProgressCacheEntry> = {};
  const t = nowMs();
  for (const [k, v] of Object.entries(o)) {
    if (v && typeof v === "object" && !Array.isArray(v) && typeof (v as { pct?: unknown }).pct === "number") {
      const pct = Math.min(100, Math.max(0, Math.round((v as { pct: number }).pct)));
      const u = typeof (v as { updatedAt?: unknown }).updatedAt === "number" ? (v as { updatedAt: number }).updatedAt : t;
      out[k] = { pct, updatedAt: u };
    }
  }
  return out;
}

function loadCampusProgressForMerge(): CampusProgressStored {
  if (typeof window === "undefined") {
    const d = defaultCampusProgress();
    return {
      version: SNAP_VERSION,
      lastAreaId: d.lastAreaId,
      lastLessonIndex: d.lastLessonIndex,
      courseProgressPct: d.courseProgressPct,
      cannabis101Started: deriveCannabis101StartedSync(),
      resumeBannerDismissed: d.resumeBannerDismissed
    };
  }

  const parsed = parseCampusProgressStored(window.localStorage.getItem(CAMPUS_PROGRESS_LS_KEY));
  let baseStored: CampusProgressStored = {
    version: SNAP_VERSION,
    lastAreaId: null,
    lastLessonIndex: null,
    courseProgressPct: {},
    cannabis101Started: false,
    resumeBannerDismissed: false
  };
  if (parsed && parsed.version === SNAP_VERSION) {
    baseStored = {
      version: SNAP_VERSION,
      lastAreaId:
        typeof parsed.lastAreaId === "string"
          ? parsed.lastAreaId
          : parsed.lastAreaId === null
            ? null
            : baseStored.lastAreaId,
      lastLessonIndex:
        typeof parsed.lastLessonIndex === "number" && Number.isFinite(parsed.lastLessonIndex)
          ? Math.floor(parsed.lastLessonIndex)
          : parsed.lastLessonIndex === null
            ? null
            : baseStored.lastLessonIndex,
      courseProgressPct:
        parsed.courseProgressPct &&
        typeof parsed.courseProgressPct === "object" &&
        !Array.isArray(parsed.courseProgressPct)
          ? { ...sanitizeProgressMap(parsed.courseProgressPct as Record<string, unknown>) }
          : {},
      cannabis101Started: Boolean(parsed.cannabis101Started),
      resumeBannerDismissed: Boolean(parsed.resumeBannerDismissed)
    };
  }
  baseStored.courseProgressPct = recomputeCourseProgressMap(baseStored.courseProgressPct);
  baseStored.cannabis101Started = deriveCannabis101StartedSync();

  return baseStored;
}

function writeCampusProgressStored(stored: CampusProgressStored): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CAMPUS_PROGRESS_LS_KEY, JSON.stringify(stored));
    window.dispatchEvent(new CustomEvent(CAMPUS_PROGRESS_UPDATED_EVENT));
  } catch {
    /* noop */
  }
}

/** Write snapshot; merges file + derived marks flags. Mirrors Cannabis key when lesson 0 is explicitly persisted via `persistLessonPanelVisit`. */
export function saveCampusProgress(patch: Partial<CampusProgressStored>): CampusProgress {
  if (typeof window === "undefined") return defaultCampusProgress();

  const cur = loadCampusProgressForMerge();
  const pctPatchKeys = Object.keys(patch.courseProgressPct ?? {}).length;

  const progressing =
    patch.lastAreaId !== undefined ||
    patch.lastLessonIndex !== undefined ||
    pctPatchKeys > 0;

  let mergedPct = { ...cur.courseProgressPct, ...(patch.courseProgressPct ?? {}) };
  mergedPct = recomputeCourseProgressMap(mergedPct);

  const merged: CampusProgressStored = {
    version: SNAP_VERSION,
    lastAreaId: patch.lastAreaId !== undefined ? patch.lastAreaId : cur.lastAreaId,
    lastLessonIndex: patch.lastLessonIndex !== undefined ? patch.lastLessonIndex : cur.lastLessonIndex,
    courseProgressPct: mergedPct,
    cannabis101Started: deriveCannabis101StartedSync(),
    resumeBannerDismissed: progressing ? false : patch.resumeBannerDismissed !== undefined ? patch.resumeBannerDismissed : cur.resumeBannerDismissed
  };

  writeCampusProgressStored(merged);

  return loadCampusProgress();
}

export function clearCampusProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CAMPUS_PROGRESS_LS_KEY);
    window.dispatchEvent(new CustomEvent(CAMPUS_PROGRESS_UPDATED_EVENT));
  } catch {
    /* noop */
  }
}

/** Elimina marcações «aula vista» usadas pelo mapa/missões; dispara mesmo evento de progresso campus. */
export function clearCampusLessonMarksStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CAMPUS_LESSON_MARKS_LS_KEY);
    window.dispatchEvent(new CustomEvent(CAMPUS_PROGRESS_UPDATED_EVENT));
  } catch {
    /* noop */
  }
}

/** Prefixo das flags one-shot XP por áula/índice (`watchAwardStorageKey`). */
export const CAMPUS_LOCAL_WATCH_AWARDED_LS_PREFIX = "thc_local_watch_awarded_" as const;

export function clearAllCampusLessonWatchAwardFlags(): void {
  if (typeof window === "undefined") return;
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(CAMPUS_LOCAL_WATCH_AWARDED_LS_PREFIX)) {
        toRemove.push(k);
      }
    }
    for (const k of toRemove) {
      window.localStorage.removeItem(k);
    }
  } catch {
    /* noop */
  }
}

export function dismissCampusResumeBanner(): void {
  saveCampusProgress({ resumeBannerDismissed: true });
}

/** Announce visit to lesson panel coordinates + refresh pct for course (local marks). */
export function persistLessonPanelVisit(areaId: string, lessonIndex: number): void {
  const area = areaByCampusId(areaId);
  const idx = Number.isFinite(lessonIndex) ? Math.floor(lessonIndex) : 0;
  const pct = computeLocalCoursePctFromMarks(areaId);
  const slot: CourseProgressCacheEntry = { pct, updatedAt: nowMs() };
  saveCampusProgress({
    lastAreaId: areaId,
    lastLessonIndex: area
      ? Math.min(Math.max(0, idx), Math.max(0, getLessonTitlesForArea(area).length - 1))
      : idx,
    courseProgressPct: { [areaId]: slot }
  });
}

/** After local marks merge (lesson marked seen). */
export function persistLessonMarkUpdate(areaId: string): void {
  const pct = computeLocalCoursePctFromMarks(areaId);
  saveCampusProgress({
    courseProgressPct: { [areaId]: { pct, updatedAt: nowMs() } }
  });
}

/** Optional hook when user opens course sheet on map — keeps resume area fresh. */
export function touchCampusCourseEntry(areaId: string): void {
  saveCampusProgress({
    lastAreaId: areaId
  });
}

export function getResumeLessonIndex(areaId: string, snapshot?: CampusProgress): number {
  const s = snapshot ?? loadCampusProgress();
  if (s.lastAreaId === areaId && typeof s.lastLessonIndex === "number" && Number.isFinite(s.lastLessonIndex)) {
    return Math.max(0, Math.floor(s.lastLessonIndex));
  }
  return getLastLessonIndex(areaId, 0);
}

export function hasCampusResumeContext(snapshot?: CampusProgress): boolean {
  const s = snapshot ?? loadCampusProgress();
  if (s.resumeBannerDismissed) return false;
  if (!s.lastAreaId || !areaByCampusId(s.lastAreaId)) return false;
  return true;
}
