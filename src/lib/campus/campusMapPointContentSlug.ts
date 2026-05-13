/**
 * Quando o id do hotspot ≠ pasta em `map-points/<slug>/`, mapear aqui.
 * Cinema: id e pasta coincidem (`campus-live-cinema`).
 */
const CONTENT_SLUG_BY_HOTSPOT: Record<string, string> = {};

/** Pasta sob `src/content/campus/map-points/<slug>/` */
export function resolveCampusMapPointContentFolderSlug(mapPointId: string): string {
  return CONTENT_SLUG_BY_HOTSPOT[mapPointId] ?? mapPointId;
}
