import type { PctPos } from "@/stores/campusStore";

/** Alinhado à animação em `CampusPlayer` (tween ease). */
export function estimateCampusWalkTweenMs(prev: PctPos, next: PctPos): number {
  const d = Math.hypot(next.x - prev.x, next.y - prev.y);
  if (d < 0.05) return 0;
  return Math.min(1850, Math.max(320, 280 + d * 28));
}

export type CampusSelfPresenceStatus = "idle" | "walking" | "cinema" | "lesson" | "exploring";
