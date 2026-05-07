export type LessonGateStatus = "seen" | "available" | "locked" | "soon";

/** Índices [0, published) liberados para conteúdo textual. Vazio no env = todas as aulas do outline. */
export function getPublishedLessonCount(totalLessons: number): number {
  const raw =
    typeof process.env.NEXT_PUBLIC_CANNABIS101_PUBLISHED_LESSONS === "string"
      ? process.env.NEXT_PUBLIC_CANNABIS101_PUBLISHED_LESSONS.trim()
      : "";
  if (!raw) return totalLessons;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < 0) return totalLessons;
  return Math.min(Math.max(0, n), totalLessons);
}

export function isSequentialLockEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CANNABIS101_SEQUENTIAL_LOCK === "true";
}

/**
 * seen = marcada vista · available = pode abrir · locked = sequência · soon = fora do calendário
 */
export function getCannabis101LessonGate(
  index: number,
  total: number,
  doneSet: Set<number>
): LessonGateStatus {
  const published = getPublishedLessonCount(total);
  if (index >= published) return "soon";
  const sequential = isSequentialLockEnabled();
  if (sequential && index > 0 && !doneSet.has(index - 1)) return "locked";
  if (doneSet.has(index)) return "seen";
  return "available";
}
