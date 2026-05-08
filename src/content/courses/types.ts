import type { AreaColor, AreaLevelLabel } from "@/data/areaTokens";
import type { LessonMediaHints } from "@/data/lessonContent/types";
import type { LessonGateStatus } from "./cannabis-101/gating";

/** Painel Moodle / tabs — igual ao legado até generalizar variants por curso. */
export type CourseLessonPanelUi = {
  moodleLessonSnippet: boolean;
  lessonRichTabsVariant: "cannabis101" | "campus";
};

/**
 * Marketing do mapa / catálogo.
 * Omitir `mapPosition` para preservar hotspots já definidos no fallback (`data/courses.ts`).
 */
export type CourseMarketing = {
  short: string;
  category: string;
  level: AreaLevelLabel;
  color: AreaColor;
  mapPosition?: { readonly x: number; readonly y: number };
  description: string;
  highlights: readonly string[];
  professor: string;
};

export type CourseManifest = {
  areaId: string;
  displayName: string;
  marketing?: CourseMarketing;
  hud: { nextLessonFallbackLabel: string };
  previewLessonTitles: readonly string[];
  stats: { lessonCount: number; hoursLabel: string };
};

/** Mídia hospedável / trailers — maior parte dos cursos fica undefined (fallback global). */
export type CourseMediaHandles = {
  heroPosterSrc?: string;
  lessonMediaHints?: LessonMediaHints;
  primaryMuxPlaybackId?: () => string;
  trailerMuxPlaybackId?: () => string;
  trailerYoutubeId?: () => string;
  hasTrailerConfigured?: () => boolean;
};

export type CourseGateDelegates = {
  getPublishedLessonCount: (totalLessons: number) => number;
  getLessonGate: (
    index: number,
    total: number,
    doneSet: Set<number>
  ) => LessonGateStatus;
};

export type RegisteredCourseCapabilities = {
  manifest: CourseManifest;
  lessonPanelUi?: Partial<CourseLessonPanelUi>;
  primaryMux?: () => string;
  gate?: CourseGateDelegates;
  media?: CourseMediaHandles;
};

/** Entrada aceite por `registerCourse()` — obrigatório: `manifest` com `areaId` (= `Area.id` no mapa). */
export type CourseRegistrationConfig = RegisteredCourseCapabilities;

export type { CourseLessonTheme } from "@/data/courseLessonThemes";
