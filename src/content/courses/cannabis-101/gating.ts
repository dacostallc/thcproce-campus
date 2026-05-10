/** `completed` = marcada concluída · `visited` = painel aberto pelo menos uma vez (local) · `available` = ainda não visitada */
export type LessonGateStatus = "completed" | "visited" | "available" | "locked" | "soon";

export const CANNABIS101_GATING_ENV = {
  publishedLessons: "NEXT_PUBLIC_CANNABIS101_PUBLISHED_LESSONS",
  sequentialLock: "NEXT_PUBLIC_CANNABIS101_SEQUENTIAL_LOCK"
} as const;

/** Índices [0, published) liberados. Vazio no env = todas as aulas do outline. */
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
 * completed = concluída · visited = visitada sem concluir · available · locked (sequência pela anterior **concluída**) · soon
 */
export function getCannabis101LessonGate(
  index: number,
  total: number,
  doneSet: Set<number>,
  visitedSet: Set<number> = new Set()
): LessonGateStatus {
  const published = getPublishedLessonCount(total);
  if (index >= published) return "soon";
  const sequential = isSequentialLockEnabled();
  if (sequential && index > 0 && !doneSet.has(index - 1)) return "locked";
  if (doneSet.has(index)) return "completed";
  if (visitedSet.has(index)) return "visited";
  return "available";
}
