/** ID estável por aba para Presence / broadcast (não atravessa refresh se sessionStorage mantida). */
export function getCampusPresenceUid(): string {
  if (typeof window === "undefined") return "";
  const k = "thc-presence-id";
  let id = sessionStorage.getItem(k);
  if (!id) {
    id = `p_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem(k, id);
  }
  return id;
}
