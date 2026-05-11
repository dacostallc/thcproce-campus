/**
 * Alguns hotspots usam id estável no mapa enquanto a pasta editorial usa outro slug
 * (legado / compatibilidade de conteúdo). Mantém-se o id do hotspot inalterado.
 */
const CONTENT_SLUG_BY_HOTSPOT: Record<string, string> = {
  "campus-cinema": "campus-live-cinema"
};

/** Pasta sob `src/content/campus/map-points/<slug>/` */
export function resolveCampusMapPointContentFolderSlug(mapPointId: string): string {
  return CONTENT_SLUG_BY_HOTSPOT[mapPointId] ?? mapPointId;
}
