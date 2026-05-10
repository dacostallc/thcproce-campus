import { isPointInPolygon } from "@/lib/geo/isPointInPolygon";

/** Polígono fechado em % (0–100), mesmo espaço que `mapZones`. */
export type WalkablePolygon = ReadonlyArray<{ x: number; y: number }>;

function clamp(n: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, n));
}

/**
 * Malha passeável (união de polígonos).
 * Gerada a partir das mesmas áreas retangulares usadas historicamente no campus,
 * convertidas em quads para hit-tests precisos com `isPointInPolygon`.
 */
export const walkableZones: WalkablePolygon[] = [
  quad(32, 70, 58, 93),
  quad(30, 52, 54, 78),
  quad(30, 24, 52, 58),
  quad(5, 5, 96, 30),
  quad(4, 14, 36, 56),
  quad(28, 26, 58, 50),
  quad(44, 32, 66, 54),
  quad(70, 18, 96, 44),
  quad(78, 6, 98, 22),
  quad(56, 36, 82, 58),
  quad(64, 48, 92, 76),
  quad(6, 56, 40, 84),
  quad(22, 64, 68, 92),
  quad(54, 68, 98, 96),
  quad(50, 28, 78, 48)
];

function quad(
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
): WalkablePolygon {
  return [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY }
  ];
}

/** Ponto na aresta do polígono mais próximo de (px,py). */
function closestOnSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): { x: number; y: number } {
  const abx = bx - ax;
  const aby = by - ay;
  const len2 = abx * abx + aby * aby;
  if (len2 < 1e-9) return { x: ax, y: ay };
  const t = clamp(((px - ax) * abx + (py - ay) * aby) / len2, 0, 1);
  return { x: ax + abx * t, y: ay + aby * t };
}

export function isPointInWalkableZone(px: number, py: number): boolean {
  for (const poly of walkableZones) {
    if (isPointInPolygon(px, py, poly)) return true;
  }
  return false;
}

/**
 * Se já estiver na malha, devolve o próprio ponto (ligeiramente limitado ao canvas).
 * Caso contrário, o ponto da união de polígonos mais próximo (aresta mais próxima).
 */
export function getNearestWalkablePoint(
  px: number,
  py: number
): { x: number; y: number } {
  for (const poly of walkableZones) {
    if (isPointInPolygon(px, py, poly)) {
      return { x: clamp(px, 0.5, 99.5), y: clamp(py, 0.5, 99.5) };
    }
  }

  let bestX = 50;
  let bestY = 50;
  let bestD = Infinity;

  for (const poly of walkableZones) {
    const n = poly.length;
    for (let i = 0; i < n; i++) {
      const a = poly[i]!;
      const b = poly[(i + 1) % n]!;
      const q = closestOnSegment(px, py, a.x, a.y, b.x, b.y);
      const d = Math.hypot(px - q.x, py - q.y);
      if (d < bestD - 1e-9) {
        bestD = d;
        bestX = q.x;
        bestY = q.y;
      }
    }
  }

  return { x: clamp(bestX, 0.5, 99.5), y: clamp(bestY, 0.5, 99.5) };
}

export function walkablePolygonToSvgPath(poly: WalkablePolygon): string {
  if (poly.length === 0) return "";
  const [f, ...r] = poly;
  const segs = r.map((p) => `L ${p.x} ${p.y}`).join(" ");
  return `M ${f!.x} ${f!.y} ${segs} Z`;
}
