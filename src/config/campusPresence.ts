/**
 * Presença no mapa (/campus): TTL e ritmo do heartbeat (Supabase Presence / broadcast).
 * Peers sem `at` atualizado dentro de {@link CAMPUS_PRESENCE_TTL_MS} ficam de fora da contagem
 * e do payload de outros avatares — evita fantasmas quando a aba cai ou o socket some.
 */

/** TTL (segundos) — escolha 75s dentro do pedido [60–90]. */
export const CAMPUS_PRESENCE_TTL_MS = 75_000;

/** Heartbeat Presence (intervalo nominal entre dois `track` quando parado): ~25–40s. */
export const CAMPUS_PRESENCE_HEARTBEAT_MIN_MS = 25_000;
export const CAMPUS_PRESENCE_HEARTBEAT_MAX_MS = 40_000;

/** Após mover o jogador: no máximo um `track` / broadcast neste intervalo (suaviza avatar). */
export const CAMPUS_PRESENCE_MOVE_FLUSH_MS = 220;

/** Próximo atraso de heartbeat (~25–40s), sem Math.random quando `crypto` existe. */
export function nextCampusPresenceHeartbeatDelayMs(): number {
  const lo = CAMPUS_PRESENCE_HEARTBEAT_MIN_MS;
  const hi = CAMPUS_PRESENCE_HEARTBEAT_MAX_MS;
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const u = new Uint32Array(1);
    crypto.getRandomValues(u);
    const frac = u[0]! / 2 ** 32;
    return Math.floor(lo + frac * (hi - lo));
  }
  return Math.floor((lo + hi) / 2);
}
