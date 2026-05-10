function newPresenceSid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `p_${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}`;
  }
  const u = typeof crypto !== "undefined" ? crypto.getRandomValues(new Uint8Array(8)) : null;
  if (!u) return `p_${Date.now().toString(36)}`;
  let hex = "";
  for (let i = 0; i < u.length; i++) hex += u[i]!.toString(16).padStart(2, "0");
  return `p_${hex}`;
}

/** ID estável por aba para Presence / broadcast (não atravessa refresh se sessionStorage mantida). */
export function getCampusPresenceUid(): string {
  if (typeof window === "undefined") return "";
  const k = "thc-presence-id";
  let id = sessionStorage.getItem(k);
  if (!id) {
    id = newPresenceSid();
    sessionStorage.setItem(k, id);
  }
  return id;
}
