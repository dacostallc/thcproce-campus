import { getNearestWalkablePoint, isPointInWalkableZone } from "@/data/walkableZones";

/** Coordenadas do mapa em % (mesmo espaço que os hotspots em `courses.ts`). */
export type MapPctPoint = { x: number; y: number };

/**
 * Verdade se `p` está dentro da malha passeável (polígonos em `walkableZones`).
 */
export function isInWalkZone(p: MapPctPoint): boolean {
  return isPointInWalkableZone(p.x, p.y);
}

/**
 * Projeta um ponto para a malha passeável mais próxima (mesmo interior ou aresta mais próxima).
 */
export function clampToWalkZone(p: MapPctPoint): MapPctPoint {
  return getNearestWalkablePoint(p.x, p.y);
}

/** @deprecated Preferir `walkableZones` + polígonos — mantido para tooling legado. */
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
  { minX: 50, minY: 28, maxX: 78, maxY: 48 }
];

/** Fileiras do auditório ao pé do telão Cine THC (%, espaço dos hotspots — alinhar ao mapa quando trocar a arte). */
function buildCinemaSeats(): MapPctPoint[] {
  const raw: MapPctPoint[] = [];
  const cols = 8;
  const rows = 6;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const yaw = row * 0.38;
      const x = 55.5 + col * 4.35 + yaw;
      const y = 91.8 - row * 2.15;
      raw.push({ x, y });
    }
  }
  return raw.map(clampToWalkZone);
}

export const CINEMA_SEATS: readonly MapPctPoint[] = buildCinemaSeats();

/**
 * Corredores / laterais junto ao auditório — quando não há assento, o avatar vem para aqui
 * (em pé). Ajuste com a arte do mapa.
 */
function buildCinemaStandingSpots(): MapPctPoint[] {
  const raw: MapPctPoint[] = [
    { x: 52.2, y: 74 },
    { x: 52.8, y: 80.5 },
    { x: 53.4, y: 87 },
    { x: 91.5, y: 76 },
    { x: 92, y: 83 },
    { x: 57, y: 71 },
    { x: 88, y: 90 }
  ];
  return raw.map(clampToWalkZone);
}

export const CINEMA_STANDING_SPOTS: readonly MapPctPoint[] = buildCinemaStandingSpots();
