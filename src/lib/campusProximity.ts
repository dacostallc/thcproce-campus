import { areas, type Area } from "@/data/courses";
import type { PctPos } from "@/stores/campusStore";

/** Distância euclidiana em espaço %-coord (approx. para proximidade de edifício). */
export function nearestArea(
  player: PctPos,
  maxDist = 10
): { area: Area; dist: number } | null {
  let best: { area: Area; dist: number } | null = null;
  for (const a of areas) {
    const dx = player.x - a.position.x;
    const dy = player.y - a.position.y;
    const dist = Math.hypot(dx, dy);
    if (!best || dist < best.dist) best = { area: a, dist };
  }
  if (!best || best.dist > maxDist) return null;
  return best;
}
