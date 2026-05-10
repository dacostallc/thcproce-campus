/**
 * Estabilidade visual do mapa (fundos, debug).
 * Variáveis `NEXT_PUBLIC_*` são lidas no cliente em build/runtime.
 */

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

/**
 * Modal bem-vindo, chip «Novo por aqui?», beacon inicial do Cannabis 101 e cartão «Comece aqui» ao carregar `/campus`.
 * Por omissão **desligado** (mapa limpo); tour manual pelo HUD continua disponível.
 * Ativar: `NEXT_PUBLIC_CAMPUS_AUTO_ONBOARDING_UX=true`.
 */
export function isCampusAutoOnboardingUxEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_AUTO_ONBOARDING_UX === "true";
}
