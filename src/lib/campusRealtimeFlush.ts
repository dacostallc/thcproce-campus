/** Dispara sync imediato (`track`/`broadcast`), ex.: reação emoji — fora dos heartbeats/throttle de movimento. */
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
