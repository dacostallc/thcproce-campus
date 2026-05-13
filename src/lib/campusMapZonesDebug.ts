/**
 * Overlays de polígonos / chrome técnico do image-map.
 *
 * - **`/campus` (superfície live):** nunca — experiência final sem camadas técnicas.
 * - **`/preview/campus`:** em dev activo por omissão; em produção só com `?debugZones=1` (ou true/yes).
 */

export type CampusMapSurface = "live" | "preview";

export function readCampusDebugZonesQuery(searchParams: URLSearchParams | null): boolean {
  if (!searchParams) return false;
  const v = searchParams.get("debugZones")?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function shouldShowCampusMapZonesPolygonDebug(
  debugZonesQuery: boolean,
  surface: CampusMapSurface
): boolean {
  if (surface === "live") return false;
  if (typeof process === "undefined") return debugZonesQuery;
  if (process.env.NODE_ENV !== "production") return true;
  return debugZonesQuery;
}
