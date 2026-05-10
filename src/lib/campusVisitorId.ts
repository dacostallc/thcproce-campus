/** Chave em `localStorage` para visitante anónimo no campus (contagem de presença). */
export const CAMPUS_VISITOR_ID_STORAGE_KEY = "thc_campus_visitor_id_v1";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function randomUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6]! & 0x0f) | 0x40;
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;
    const h = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }
  throw new Error("crypto unavailable");
}

/**
 * Lê ou cria um UUID persistente para este browser (só em contexto com `localStorage`).
 */
export function getOrCreateCampusVisitorId(): string {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return "";
  }
  try {
    const existing = localStorage.getItem(CAMPUS_VISITOR_ID_STORAGE_KEY);
    if (existing && UUID_RE.test(existing.trim())) {
      return existing.trim();
    }
    const id = randomUuidV4();
    localStorage.setItem(CAMPUS_VISITOR_ID_STORAGE_KEY, id);
    return id;
  } catch {
    return "";
  }
}
