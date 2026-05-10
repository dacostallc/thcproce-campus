/**
 * Overlays de polígonos / chrome técnico do image-map.
 * Em produção só aparecem com `?debugZones=1` (ou variantes true/yes).
 * Fora de produção, activos por omissão para desenvolvimento local.
 */

export function readCampusDebugZonesQuery(searchParams: URLSearchParams | null): boolean {
  if (!searchParams) return false;
  const v = searchParams.get("debugZones")?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function shouldShowCampusMapZonesPolygonDebug(debugZonesQuery: boolean): boolean {
  if (typeof process === "undefined") return debugZonesQuery;
  if (process.env.NODE_ENV !== "production") return true;
  return debugZonesQuery;
}
