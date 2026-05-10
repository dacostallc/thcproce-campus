const SESSION_KEY = "thcproce.campus.zoneEntryPrompt.dismissed.v1";

function parseDismissed(raw: string | null): Set<string> {
  if (!raw?.trim()) return new Set();
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return new Set();
    return new Set(data.filter((x): x is string => typeof x === "string" && x.length > 0));
  } catch {
    return new Set();
  }
}

/** IDs de área (`Area.id`) onde o utilizador escolheu «Depois» / fechar nesta sessão. */
export function readDismissedZoneEntryPromptIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  return parseDismissed(sessionStorage.getItem(SESSION_KEY));
}

export function dismissZoneEntryPromptForArea(areaId: string): void {
  if (typeof window === "undefined") return;
  try {
    const next = readDismissedZoneEntryPromptIds();
    next.add(areaId);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...next]));
  } catch {
    /* quota / private mode */
  }
}
