import { CANNABIS101_LESSON_NODES } from "./lessons";

/**
 * Estimativa editorial de duração por aula (minutos), alinhada a `CANNABIS101_LESSON_NODES`.
 * Usada só para regra académica (tempo mínimo ≈ 70%) — migrável para catálogo servidor.
 * Tempos revisados para texto aplicável (leitura + anotações); revisitar após gravação de vídeos.
 */
export const CANNABIS101_LESSON_ESTIMATED_MINUTES: readonly number[] = [
  14, 22, 20, 26, 22, 21, 24, 23, 22, 18, 16
] as const;

export function getCannabis101LessonEstimatedMinutes(lessonIndex: number): number | null {
  const n = CANNABIS101_LESSON_NODES.length;
  if (!Number.isFinite(lessonIndex) || lessonIndex < 0 || lessonIndex >= n) return null;
  const m = CANNABIS101_LESSON_ESTIMATED_MINUTES[lessonIndex];
  return typeof m === "number" && Number.isFinite(m) && m > 0 ? m : null;
}
