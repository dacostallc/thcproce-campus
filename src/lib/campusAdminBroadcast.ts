/** Aviso em destaque do professor (balão + som) — só role `admin` no payload. */

export const CAMPUS_ADMIN_BROADCAST_TTL_MS = 5000;
export const CAMPUS_ADMIN_BROADCAST_MAX_LEN = 140;

export function clampAdminBroadcastText(raw: string): string {
  const t = raw.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  return t.slice(0, CAMPUS_ADMIN_BROADCAST_MAX_LEN);
}

export function isFreshAdminBroadcast(atMs: number, now = Date.now()): boolean {
  if (!Number.isFinite(atMs) || atMs <= 0) return false;
  const age = now - atMs;
  return age >= -1500 && age < CAMPUS_ADMIN_BROADCAST_TTL_MS + 800;
}
