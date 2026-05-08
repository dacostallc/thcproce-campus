/**
 * Estabilidade visual do mapa (fundos, WebGL opcional, debug).
 * Variáveis `NEXT_PUBLIC_*` são lidas no cliente em build/runtime.
 */

export function isCampusPixiLayerEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_ENABLE_PIXI === "true";
}

/** Contorno vermelho no estágio do mapa (#campus-map-stage) para inspecionar camadas. */
export function isCampusMapDebugOutline(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_MAP_DEBUG === "true";
}
