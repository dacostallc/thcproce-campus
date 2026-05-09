/** Caminhos admin CMS para `revalidatePath`. */
export function adminCoursePath(courseId: string) {
  return `/admin/courses/${courseId}`;
}

export function adminModuleEditPath(courseId: string, moduleId: string) {
  return `/admin/courses/${courseId}/modules/${moduleId}/edit`;
}

export function adminLessonEditPath(courseId: string, moduleId: string, lessonId: string) {
  return `/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/edit`;
}

export function adminLessonQuizzesPath(courseId: string, moduleId: string, lessonId: string) {
  return `/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes`;
}

export function adminQuizEditPath(
  courseId: string,
  moduleId: string,
  lessonId: string,
  quizId: string,
) {
  return `/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes/${quizId}/edit`;
}
