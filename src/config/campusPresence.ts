/**
 * Presença no mapa (/campus): TTL, heartbeat e rede (Supabase Presence / broadcast).
 * Peers sem `at` fresco dentro de {@link CAMPUS_PRESENCE_TTL_MS} deixam de contar como «vivos»;
 * a UI aplica fade antes de retirar o avatar (evita fantasmas permanentes).
 */

/** Consideramos peer «vivo» enquanto `Date.now() - lastSeenAt <= TTL`. */
export const CAMPUS_PRESENCE_TTL_MS = 60_000;

/** Depois do TTL, opacity anima até zero durante esta janela antes de remover do mapa. */
export const CAMPUS_PRESENCE_PEER_FADE_MS = 1_200;

/** Tick da camada visual (fade / cleanup) — baixo custo, só no cliente do mapa. */
export const CAMPUS_PRESENCE_VISUAL_TICK_MS = 480;

/** Heartbeat Presence: ~15–30s (pedido produto; reduz fantasmas sem spam). */
export const CAMPUS_PRESENCE_HEARTBEAT_MIN_MS = 15_000;
export const CAMPUS_PRESENCE_HEARTBEAT_MAX_MS = 30_000;

/**
 * Após mover o jogador: no máximo um `track` / broadcast neste intervalo (suaviza avatar).
 * Movimento inferior a {@link CAMPUS_PRESENCE_SIGNIFICANT_MOVE_PCT} (% mapa) não dispara envio.
 */
export const CAMPUS_PRESENCE_MOVE_FLUSH_MS = 280;

/** Delta mínimo em % do mapa para considerar movimento relevante (evita spam por micro‑drift). */
export const CAMPUS_PRESENCE_SIGNIFICANT_MOVE_PCT = 0.32;

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
