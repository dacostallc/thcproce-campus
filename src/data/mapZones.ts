import { CAMPUS_ZONES } from "@/data/campusZones";
import { findZoneContainingPoint } from "@/lib/geo/isPointInPolygon";

/**
 * Fonte única das zonas do mapa campus (viewBox 0–100 = %).
 * `requiredCourse` / `requiredXP` vêm dos gates em `campusZones.ts`.
 */
export type MapZone = {
  id: string;
  name: string;
  color: string;
  path: string;
  points: ReadonlyArray<{ x: number; y: number }>;
  courseSlug: string | null;
  requiredXP?: number;
  requiredCourse?: string;
  /** Pulso “LIVE AGORA” quando o campus está em live. */
  isLivePulseAnchor?: boolean;
  /** Ponto na calçada à entrada do prédio (não o centro do telhado). */
  entryPoint: { x: number; y: number };
};

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

export function polygonToSvgPath(
  polygon: ReadonlyArray<{ x: number; y: number }>
): string {
  if (polygon.length === 0) return "";
  const [first, ...rest] = polygon;
  const segs = rest.map((p) => `L ${round4(p.x)} ${round4(p.y)}`).join(" ");
  return `M ${round4(first!.x)} ${round4(first!.y)} ${segs} Z`;
}

/** Frente do volume: média-X dos vértices na faixa inferior + passo para a “rua”. */
function streetEntryFromPolygon(
  poly: ReadonlyArray<{ x: number; y: number }>,
  padY = 2.1
): { x: number; y: number } {
  if (poly.length === 0) return { x: 50, y: 75 };
  let maxY = -Infinity;
  for (const p of poly) maxY = Math.max(maxY, p.y);
  const band = 3.5;
  let sx = 0;
  let n = 0;
  for (const p of poly) {
    if (p.y >= maxY - band) {
      sx += p.x;
      n++;
    }
  }
  const x = n > 0 ? round4(sx / n) : poly[0]!.x;
  const y = round4(Math.min(97.8, maxY + padY));
  return { x, y };
}

export const mapZones: MapZone[] = CAMPUS_ZONES.map((z) => ({
  id: z.id,
  name: z.name,
  color: z.color,
  path: polygonToSvgPath(z.polygon),
  points: z.polygon,
  courseSlug: z.courseSlug ?? null,
  requiredXP: z.gate?.requiredXP,
  requiredCourse: z.gate?.requiredCourse,
  isLivePulseAnchor: z.id === "praca-central",
  entryPoint: z.entryPoint ?? streetEntryFromPolygon(z.polygon)
}));

export function findMapZoneAtPercent(px: number, py: number): MapZone | null {
  return findZoneContainingPoint(px, py, mapZones);
}
