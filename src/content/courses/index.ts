/**
 * Dados e registo de cursos do campus (sem UI).
 * Novo curso: pacote em `src/content/courses/<course-id>/` + `registerCourse({ ... })` em `coursesRegistry.ts`.
 */
export type {
  CourseLessonPanelUi,
  CourseMarketing,
  CourseManifest,
  CourseMediaHandles,
  CourseGateDelegates,
  RegisteredCourseCapabilities,
  CourseRegistrationConfig,
  CourseLessonTheme
} from "./types";

export {
  registerCourse,
  CANNABIS101_AREA_ID,
  CANNABIS101_MANIFEST,
  getRegisteredCourseAreaIds,
  hasRegisteredCourseCapabilities,
  getCourseManifest,
  coursePreviewLessonTitlesForArea,
  hudNextLessonCueForArea,
  getCourseTheme,
  getCourseLessons,
  getCourseMedia,
  getCourseGate,
  isCannabis101CourseArea,
  areaUsesMoodleLessonSnippet,
  lessonRichTabsVariantForArea,
  areaUsesRegisteredPrimaryMux,
  registeredPrimaryMuxPlaybackId,
  cannabis101HudNextLessonCue,
  cannabis101CoursePreviewLessonTitles,
  cannabis101DisplayName
} from "./registry";
