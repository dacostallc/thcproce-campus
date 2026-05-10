export type PolygonPoint = { x: number; y: number };

/**
 * Geofencing em 2D: testa se um ponto está no interior de um polígono simples (sem auto-interseção).
 * Algoritmo ray-casting — O(n). Coordenadas no mesmo espaço que o polígono (ex.: % 0–100 do mapa).
 *
 * @param px,py — ponto de consulta (ex.: % relativos ao viewBox do mapa)
 * @param polygon — vértices ordenados (fechado implicitamente: último → primeiro)
 */
export function isPointInPolygon(
  px: number,
  py: number,
  polygon: ReadonlyArray<PolygonPoint>
): boolean {
  const n = polygon.length;
  if (n < 3) return false;

  let inside = false;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i]!.x;
    const yi = polygon[i]!.y;
    const xj = polygon[j]!.x;
    const yj = polygon[j]!.y;

    if (yj === yi) continue;

    const intersects =
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/**
 * Primeira zona que contém o ponto, considerando ordem de pintura (últimas do array = por cima).
 * Útil para hover/clique quando polígonos se tocam.
 */
export function findZoneContainingPoint<T extends { points: ReadonlyArray<PolygonPoint> }>(
  px: number,
  py: number,
  zones: readonly T[]
): T | null {
  for (let i = zones.length - 1; i >= 0; i--) {
    const z = zones[i]!;
    if (isPointInPolygon(px, py, z.points)) return z;
  }
  return null;
}
