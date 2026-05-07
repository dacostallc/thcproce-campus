import type { Area } from "@/data/courses";
import type { PctPos } from "@/stores/campusStore";

export function distancePct(a: PctPos, b: PctPos): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

/** Retorna a área mais próxima e a distância em “%” do mapa. */
export function nearestArea(
  pos: PctPos,
  list: Area[]
): { area: Area; dist: number } | null {
  if (!list.length) return null;
  let best = list[0]!;
  let bestD = distancePct(pos, best.position);
  for (let i = 1; i < list.length; i++) {
    const area = list[i]!;
    const d = distancePct(pos, area.position);
    if (d < bestD) {
      best = area;
      bestD = d;
    }
  }
  return { area: best, dist: bestD };
}
