/**
 * Estabilidade visual do mapa (fundos, WebGL opcional, debug).
 * Variáveis `NEXT_PUBLIC_*` são lidas no cliente em build/runtime.
 */

export function isCampusPixiLayerEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_ENABLE_PIXI === "true";
}

/**
 * Mapa com polígonos (`mapZones`), fog-of-war, tooltips e malha passeável.
 * Por omissão `false` — modo simples (hit-boxes + imagem limpa).
 */
export function isCampusAdvancedMap(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_ADVANCED_MAP === "true";
}

/** Contorno vermelho no estágio do mapa (#campus-map-stage) para inspecionar camadas. */
export function isCampusMapDebugOutline(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_MAP_DEBUG === "true";
}

/**
 * Polígonos do catálogo `campusMapAreasCatalog` + JSON opcional em localStorage.
 * Ativar para validar coordenadas manuais sem alterar a arte do mapa.
 */
export function isCampusMapAreasPolygonOverlayEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_MAP_AREAS_DEBUG === "true";
}

/** Polígonos/labels das áreas image-map sobre o modo simples (catálogo `CAMPUS_MAP_INTERACTIVE_AREAS`). */
export function isCampusMapInteractiveDebugEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_MAP_INTERACTIVE_DEBUG === "true";
}
