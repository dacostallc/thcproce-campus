import {
  CAMPUS_ZONES,
  CAMPUS_ZONE_ART_HEIGHT,
  CAMPUS_ZONE_ART_WIDTH,
  type CampusZone
} from "@/data/campusZones";

/**
 * Converte pontos no espaço da arte (CAMPUS_ZONE_ART_WIDTH × HEIGHT)
 * para atributo `d` de um polígono SVG no viewBox 0–100 (igual ao palco do mapa).
 */
export function pointsToSvg(
  points: [number, number][],
  imageWidth: number = CAMPUS_ZONE_ART_WIDTH,
  imageHeight: number = CAMPUS_ZONE_ART_HEIGHT
): string {
  if (points.length === 0) return "";
  const norm = points.map(
    ([x, y]) =>
      [(x / imageWidth) * 100, (y / imageHeight) * 100] as [number, number]
  );
  const [fx, fy] = norm[0]!;
  const rest = norm
    .slice(1)
    .map(([x, y]) => `L ${round4(x)} ${round4(y)}`)
    .join(" ");
  return `M ${round4(fx)} ${round4(fy)} ${rest} Z`;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

export function getZoneById(id: string): CampusZone | undefined {
  return CAMPUS_ZONES.find((z) => z.id === id);
}

export function getZonesByCourseId(courseId: string): CampusZone[] {
  return CAMPUS_ZONES.filter((z) => z.courseIds.includes(courseId));
}

export function getPrimaryCourseForZone(zone: CampusZone): string | null {
  return zone.courseIds[0] ?? null;
}

/**
 * Mapeia um ponto da arte (px) para coordenadas renderizadas (px do contentor).
 */
export function scalePoint(
  point: [number, number],
  imageWidth: number,
  imageHeight: number,
  renderedWidth: number,
  renderedHeight: number
): [number, number] {
  return [
    (point[0] / imageWidth) * renderedWidth,
    (point[1] / imageHeight) * renderedHeight
  ];
}

/** Posição do label no mesmo espaço 0–100 que o SVG do mapa. */
export function labelPositionToSvgPercent(
  labelPosition: { x: number; y: number },
  imageWidth: number = CAMPUS_ZONE_ART_WIDTH,
  imageHeight: number = CAMPUS_ZONE_ART_HEIGHT
): { x: number; y: number } {
  return {
    x: (labelPosition.x / imageWidth) * 100,
    y: (labelPosition.y / imageHeight) * 100
  };
}

/** Cobertura de áreas do mapa por `courseIds` (útil a hacks / debug). */
export function campusZoneIdsCoveringAreas(): Set<string> {
  const set = new Set<string>();
  for (const z of CAMPUS_ZONES) {
    for (const id of z.courseIds) set.add(id);
  }
  return set;
}
