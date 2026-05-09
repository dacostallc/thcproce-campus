import {
  CAMPUS_ZONES,
  CAMPUS_ZONE_ART_HEIGHT,
  CAMPUS_ZONE_ART_WIDTH
} from "@/data/campusZones";
import type { CampusZoneRectRecord } from "@/lib/campusZoneEditorTypes";

function bboxFromPoints(points: [number, number][]) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/** Caixas de referência (bbox dos polígonos em % 0–100) para o editor retangular. */
export function rectRecordsFromCampusDefinitions(): CampusZoneRectRecord[] {
  return CAMPUS_ZONES.map((z) => {
    const bb = bboxFromPoints(z.points);
    return {
      id: z.id,
      label: z.label,
      x: (bb.x / CAMPUS_ZONE_ART_WIDTH) * 100,
      y: (bb.y / CAMPUS_ZONE_ART_HEIGHT) * 100,
      width: (bb.width / CAMPUS_ZONE_ART_WIDTH) * 100,
      height: (bb.height / CAMPUS_ZONE_ART_HEIGHT) * 100,
      areaType: z.areaType,
      courseIds: [...z.courseIds]
    };
  });
}
