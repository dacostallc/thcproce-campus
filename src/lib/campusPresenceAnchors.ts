import type { MapPctPoint } from "@/lib/campusWalkable";
import { CAMPUS_CINE_POSITION } from "@/config/campusCinema";
import type { CampusActivityKind } from "@/lib/campusPresenceActivity";

/**
 * Centros aproximados (% do mapa) quando queremos mostrar presença por hotspot,
 * sem animação de caminhada fina — não altera colisões nem malha do mapa.
 */
export const CAMPUS_PRESENCE_HOTSPOT_ANCHORS: Record<
  Exclude<CampusActivityKind, "studying" | "lesson">,
  MapPctPoint
> = {
  cinema: { x: CAMPUS_CINE_POSITION.x, y: CAMPUS_CINE_POSITION.y },
  /** Polígono «Deixa o teu recado» — centro estimado em %. */
  mural: { x: 62, y: 88 },
  /** Polígono «Souvenirs & loja». */
  shop: { x: 68, y: 78 }
};
