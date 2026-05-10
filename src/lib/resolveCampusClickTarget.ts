import { findMapZoneAtPercent, type MapZone } from "@/data/mapZones";
import {
  getNearestWalkablePoint,
  isPointInWalkableZone
} from "@/data/walkableZones";

export type CampusClickResolved =
  | { type: "zone"; zone: MapZone; destination: { x: number; y: number } }
  | { type: "walkable"; destination: { x: number; y: number } }
  | { type: "none" };

/** Garante entrada de prédio `entryPoint` sobre a malha passeável. */
export function snapZoneEntryToWalkable(ep: { x: number; y: number }): {
  x: number;
  y: number;
} {
  if (isPointInWalkableZone(ep.x, ep.y)) return ep;
  return getNearestWalkablePoint(ep.x, ep.y);
}

/**
 * Prioridade: zona de curso (telhado) → malha passeável → nada.
 * Coordenadas em % relativamente ao palco do mapa (0–100).
 */
export function resolveCampusClickTarget(
  px: number,
  py: number
): CampusClickResolved {
  const zone = findMapZoneAtPercent(px, py);
  if (zone) {
    const destination = snapZoneEntryToWalkable(zone.entryPoint);
    return { type: "zone", zone, destination };
  }
  if (isPointInWalkableZone(px, py)) {
    return { type: "walkable", destination: { x: px, y: py } };
  }
  return { type: "none" };
}
