import { CAMPUS_ZONES } from "@/data/campusZones";
import type { CampusZoneRectRecord } from "@/lib/campusZoneEditorTypes";

function bboxFromPolygon(polygon: { x: number; y: number }[]) {
  const xs = polygon.map((p) => p.x);
  const ys = polygon.map((p) => p.y);
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

/** Caixas de referência (% 0–100) a partir dos polígonos — para o editor retangular. */
export function rectRecordsFromCampusDefinitions(): CampusZoneRectRecord[] {
  return CAMPUS_ZONES.map((z) => {
    const bb = bboxFromPolygon(z.polygon);
    return {
      id: z.id,
      label: z.name,
      x: bb.x,
      y: bb.y,
      width: bb.width,
      height: bb.height,
      category: z.category,
      courseIds: [
        ...(z.courseSlug ? [z.courseSlug] : []),
        ...(z.relatedSlugs ?? [])
      ]
    };
  });
}
