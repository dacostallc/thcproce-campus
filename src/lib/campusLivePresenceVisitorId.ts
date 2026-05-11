import { getOrCreateCampusVisitorId } from "@/lib/campusVisitorId";

const TAB_INSTANCE_KEY = "thc_campus_live_presence_tab_v1";

function randomTabSuffix(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  }
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * ID estável por **aba** (sessionStorage) composto com UUID do browser (localStorage).
 * Várias abas = vários visitantes no mapa; navegar dentro do campus mantém o mesmo id na aba.
 */
export function getCampusLivePresenceVisitorId(): string {
  if (typeof window === "undefined") return "";
  const browser = getOrCreateCampusVisitorId();
  if (!browser) return "";
  try {
    let tab = sessionStorage.getItem(TAB_INSTANCE_KEY);
    if (!tab || tab.length < 8) {
      tab = randomTabSuffix();
      sessionStorage.setItem(TAB_INSTANCE_KEY, tab);
    }
    return `${browser}:${tab}`;
  } catch {
    return browser;
  }
}
