/**
 * Encadeamento de dados do hub /campus (um “prédio” = um curso):
 *
 * - **areaId** — `areas[].id` em `src/data/courses.ts` (slug estável, usado em URLs e localStorage).
 * - **courseId (Moodle)** — `moodleCourseIdForArea` em `src/lib/moodle/courseMap.ts` (+ opcional `MOODLE_COURSE_MAP`).
 * - **lessonOutline** — `getLessonTitlesForArea` em `src/data/lessonOutline.ts` (n aulas = `area.lessons`).
 * - **theme / player** — `src/data/courseLessonThemes.ts`, `LessonPanel`, `CampusLessonVideo`.
 * - **progresso** — `trpc.campus.lessonProgressMine` + `localStorage` (`thc_campus_lesson_v1`) + última aula `src/lib/campusLastLesson.ts`.
 */

export const CAMPUS_COURSE_BRIDGE_DOC = true as const;
