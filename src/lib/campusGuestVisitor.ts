/** Visitante no campus: ID estável + nickname local (sem conta). */

export const CAMPUS_GUEST_VISITOR_STORAGE_KEY = "thcproce.campus.guestVisitor.v1";
/** Nickname persistido separado do blob do ID (pedido de produto). */
export const CAMPUS_GUEST_NICKNAME_STORAGE_KEY = "thcproce.campus.guestNickname.v1";

export type CampusGuestVisitorStored = {
  guestId: string;
  guestNickname: string | null;
};

function newGuestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `guest_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function normalizeCampusGuestNickname(raw: string | null | undefined): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim().slice(0, 32);
  return t.length >= 2 ? t : null;
}

function persistGuestIdBlob(guestId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CAMPUS_GUEST_VISITOR_STORAGE_KEY, JSON.stringify({ guestId }));
  } catch {
    /* noop */
  }
}

/** Formato: `{ "v": 1, "nickname": "..." }`. */
function readNicknameFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CAMPUS_GUEST_NICKNAME_STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Record<string, unknown>;
    return normalizeCampusGuestNickname(typeof o.nickname === "string" ? o.nickname : null);
  } catch {
    return null;
  }
}

function writeNicknameToStorage(nickname: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!nickname) {
      window.localStorage.removeItem(CAMPUS_GUEST_NICKNAME_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(
      CAMPUS_GUEST_NICKNAME_STORAGE_KEY,
      JSON.stringify({ v: 1, nickname })
    );
  } catch {
    /* noop */
  }
}

/**
 * Migra `guestNickname` antigo dentro de `guestVisitor.v1` para a chave dedicada do nick.
 */
function migrateLegacyCombinedBlob(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(CAMPUS_GUEST_VISITOR_STORAGE_KEY);
    if (!raw) return;
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (typeof o.guestNickname !== "string") return;
    const migrated = normalizeCampusGuestNickname(o.guestNickname);
    const hadDedicated = window.localStorage.getItem(CAMPUS_GUEST_NICKNAME_STORAGE_KEY);
    if (migrated && !hadDedicated) {
      writeNicknameToStorage(migrated);
    }
    const guestId = typeof o.guestId === "string" ? o.guestId.trim() : "";
    const next: Record<string, unknown> = {};
    if (guestId) next.guestId = guestId;
    window.localStorage.setItem(CAMPUS_GUEST_VISITOR_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* noop */
  }
}

function ensureGuestId(): string {
  if (typeof window === "undefined") return "";
  migrateLegacyCombinedBlob();
  try {
    const raw = window.localStorage.getItem(CAMPUS_GUEST_VISITOR_STORAGE_KEY);
    if (raw) {
      const o = JSON.parse(raw) as Record<string, unknown>;
      const id = typeof o.guestId === "string" ? o.guestId.trim() : "";
      if (id) return id;
    }
  } catch {
    /* noop */
  }
  const guestId = newGuestId();
  persistGuestIdBlob(guestId);
  return guestId;
}

/** Quando `true`, visitantes podem ler o mural via API (sem gravar). Chat/ranking reais continuam só com sessão. */
export function campusGuestPublicReadEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_GUEST_PUBLIC_READ === "true";
}

export function readCampusGuestVisitor(): CampusGuestVisitorStored {
  if (typeof window === "undefined") {
    return { guestId: "", guestNickname: null };
  }
  try {
    migrateLegacyCombinedBlob();
    const guestId = ensureGuestId();
    const guestNickname = readNicknameFromStorage();
    return { guestId, guestNickname };
  } catch {
    const guestId = newGuestId();
    persistGuestIdBlob(guestId);
    return { guestId, guestNickname: null };
  }
}

export function setCampusGuestNickname(name: string | null): void {
  if (typeof window === "undefined") return;
  writeNicknameToStorage(normalizeCampusGuestNickname(name));
  ensureGuestId();
}
