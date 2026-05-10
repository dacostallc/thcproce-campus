import { CANNABIS101_LESSON_NODES } from "./lessons";

/**
 * Estimativa editorial de duração por aula (minutos), alinhada a `CANNABIS101_LESSON_NODES`.
 * Usada só para regra académica (tempo mínimo ≈ 70%) — migrável para catálogo servidor.
 */
export const CANNABIS101_LESSON_ESTIMATED_MINUTES: readonly number[] = [
  10, 14, 16, 18, 15, 17, 18, 16, 20, 15, 12
] as const;

export function getCannabis101LessonEstimatedMinutes(lessonIndex: number): number | null {
  const n = CANNABIS101_LESSON_NODES.length;
  if (!Number.isFinite(lessonIndex) || lessonIndex < 0 || lessonIndex >= n) return null;
  const m = CANNABIS101_LESSON_ESTIMATED_MINUTES[lessonIndex];
  return typeof m === "number" && Number.isFinite(m) && m > 0 ? m : null;
}
