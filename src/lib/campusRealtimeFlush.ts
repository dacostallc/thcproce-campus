/** Permite disparar sync imediato (ex.: emoji) antes do próximo intervalo de 400ms. */
let realtimeFlush: (() => void) | null = null;

export function registerCampusRealtimeFlush(fn: () => void) {
  realtimeFlush = fn;
}

export function unregisterCampusRealtimeFlush(fn: () => void) {
  if (realtimeFlush === fn) realtimeFlush = null;
}

export function requestCampusRealtimeFlush() {
  realtimeFlush?.();
}
