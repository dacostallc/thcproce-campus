/**
 * Barrel fino para imports históricos `@/content/courses`.
 * Núcleo do engine: `coursesRegistry.ts` + `types.ts`.
 */
export { CANNABIS101_AREA_ID, CANNABIS101_MANIFEST } from "./cannabis-101/manifest";
export type { CourseLessonPanelUi, CourseRegistrationConfig } from "./types";
export {
  registerCourse,
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
} from "./coursesRegistry";
