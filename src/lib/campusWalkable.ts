/** Coordenadas do mapa em % (mesmo espaço que os hotspots em `courses.ts`). */
export type MapPctPoint = { x: number; y: number };

/**
 * Áreas passeáveis do campus em coordenadas de % do mapa (0–100), alinhadas
 * aos hotspots em `courses.ts` e à arte `public/campus/campus*.png`.
 *
 * Modelo: união de retângulos sobrepostos (“corredores”). Se o jogador clicar fora,
 * projetamos sobre o retângulo mais próximo (aresta mais próxima).
 *
 * Ao trocar o PNG ou o crop (`campusArt.ts`), revise estes valores — pode ativar
 * `NEXT_PUBLIC_CAMPUS_DEBUG_WALK=1` em `MapWalkLayer` futuramente para sobrepor guias.
 */
export type WalkRect = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export const CAMPUS_WALK_RECTS: readonly WalkRect[] = [
  { minX: 32, minY: 70, maxX: 58, maxY: 93 },
  { minX: 30, minY: 52, maxX: 54, maxY: 78 },
  { minX: 30, minY: 24, maxX: 52, maxY: 58 },
  { minX: 5, minY: 5, maxX: 96, maxY: 30 },
  { minX: 4, minY: 14, maxX: 36, maxY: 56 },
  { minX: 28, minY: 26, maxX: 58, maxY: 50 },
  { minX: 44, minY: 32, maxX: 66, maxY: 54 },
  { minX: 70, minY: 18, maxX: 96, maxY: 44 },
  { minX: 78, minY: 6, maxX: 98, maxY: 22 },
  { minX: 56, minY: 36, maxX: 82, maxY: 58 },
  { minX: 64, minY: 48, maxX: 92, maxY: 76 },
  { minX: 6, minY: 56, maxX: 40, maxY: 84 },
  { minX: 22, minY: 64, maxX: 68, maxY: 92 },
  { minX: 54, minY: 68, maxX: 98, maxY: 96 },
  // Ponte centro ↔ direita (medicina / coop / indústria)
  { minX: 50, minY: 28, maxX: 78, maxY: 48 }
];

function clamp(n: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, n));
}

/** Ponto da reta mais próximo de `p` no segmento a–b. */
function closestOnSegment(p: MapPctPoint, ax: number, ay: number, bx: number, by: number): MapPctPoint {
  const abx = bx - ax;
  const aby = by - ay;
  const len2 = abx * abx + aby * aby;
  if (len2 < 1e-9) return { x: ax, y: ay };
  const t = clamp(((p.x - ax) * abx + (p.y - ay) * aby) / len2, 0, 1);
  return { x: ax + abx * t, y: ay + aby * t };
}

/** Verdade se `p` está dentro de pelo menos uma zona passeável. */
export function isInWalkZone(p: MapPctPoint): boolean {
  return CAMPUS_WALK_RECTS.some(
    (r) => p.x >= r.minX && p.x <= r.maxX && p.y >= r.minY && p.y <= r.maxY
  );
}

/**
 * Projeta um ponto para o interior passeável mais próximo (união dos retângulos).
 * Se já estiver em alguma zona, devolve `p` (clampado dentro do ret ângulo contenedor).
 */
export function clampToWalkZone(p: MapPctPoint): MapPctPoint {
  const eps = 0.08;
  for (const r of CAMPUS_WALK_RECTS) {
    const ix = clamp(p.x, r.minX + eps, r.maxX - eps);
    const iy = clamp(p.y, r.minY + eps, r.maxY - eps);
    if (
      p.x >= r.minX &&
      p.x <= r.maxX &&
      p.y >= r.minY &&
      p.y <= r.maxY
    ) {
      return { x: ix, y: iy };
    }
  }

  let best: MapPctPoint | null = null;
  let bestD = Infinity;

  for (const r of CAMPUS_WALK_RECTS) {
    const cx = clamp(p.x, r.minX, r.maxX);
    const cy = clamp(p.y, r.minY, r.maxY);
    const d = Math.hypot(p.x - cx, p.y - cy);
    if (d < bestD - 1e-6) {
      bestD = d;
      best = { x: clamp(cx, r.minX + eps, r.maxX - eps), y: clamp(cy, r.minY + eps, r.maxY - eps) };
    }

    const x0 = r.minX;
    const x1 = r.maxX;
    const y0 = r.minY;
    const y1 = r.maxY;
    const edges: [number, number, number, number][] = [
      [x0, y0, x1, y0],
      [x1, y0, x1, y1],
      [x1, y1, x0, y1],
      [x0, y1, x0, y0]
    ];
    for (const [ax, ay, bx, by] of edges) {
      const q = closestOnSegment(p, ax, ay, bx, by);
      const dq = Math.hypot(p.x - q.x, p.y - q.y);
      if (dq < bestD - 1e-6) {
        bestD = dq;
        best = {
          x: clamp(q.x, r.minX + eps, r.maxX - eps),
          y: clamp(q.y, r.minY + eps, r.maxY - eps)
        };
      }
    }
  }

  if (!best) {
    return { x: clamp(p.x, 1, 99), y: clamp(p.y, 1, 99) };
  }

  return { x: clamp(best.x, 1, 99), y: clamp(best.y, 1, 99) };
}
