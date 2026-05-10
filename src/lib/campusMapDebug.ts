/**
 * Modo debug do mapa: polígonos, vértices e ajuste visual (apenas cliente).
 * Ativar com `NEXT_PUBLIC_CAMPUS_DEBUG=true`.
 */
export function isCampusMapDebug(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_DEBUG === "true";
}
