/**
 * Cannabis 101 — fonte canônica de conteúdo e configuração do curso.
 */
export {
  CANNABIS101_AREA_ID,
  CANNABIS101_MANIFEST,
  CANNABIS101_MODULES,
  CANNABIS101_EXPECTED_LESSON_TOTAL,
  cannabis101MoodleBaseUrl,
  cannabis101MoodleCourseUrl
} from "./manifest";
export {
  CANNABIS101_LESSONS,
  CANNABIS101_LESSON_NODES,
  CANNABIS101_OUTLINE_TITLES,
  cannabis101StableIdToLessonIndex,
  getCannabis101LessonStableId,
  type Cannabis101LessonNode
} from "./lessons";
export {
  CANNABIS101_MEDIA_ENV,
  CANNABIS101_HERO_POSTER_SRC,
  CANNABIS101_OPENING_COPY,
  CANNABIS101_LESSON_MEDIA_HINTS,
  getCannabis101PrimaryMuxPlaybackId,
  getCannabis101TrailerMuxPlaybackId,
  getCannabis101TrailerYoutubeId,
  getCannabis101LessonEmbedYoutubeId,
  getCannabis101OpeningVideoSrc,
  getCannabis101OpeningPosterSrc,
  hasCannabis101TrailerConfigured
} from "./media";
export { CANNABIS101_COURSE_THEME } from "./theme";
export {
  CANNABIS101_GATING_ENV,
  getPublishedLessonCount,
  isSequentialLockEnabled,
  getCannabis101LessonGate,
  type LessonGateStatus
} from "./gating";
export {
  getCannabis101StreamChapter,
  type Cannabis101StreamChapter
} from "./streamChapter";
