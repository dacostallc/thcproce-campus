export function campusDbLessonFallback(reason: string, meta?: Record<string, unknown>): void {
  console.warn("[campus-db-lesson] fallback:", reason, meta && Object.keys(meta).length ? meta : "");
}
