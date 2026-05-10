export type CampusPresenceStatus =
  | "idle"
  | "walking"
  | "cinema"
  | "lesson"
  | "exploring"
  /** TTL expirado ou ausência de heartbeat — só camada visual (fade‑out). */
  | "offline";

/** Visão unificada para UI — realtime Supabase, polling social ou fallback mock. */
export type CampusPresencePeer = {
  peerId: string;
  displayName: string;
  initials: string;
  avatarSeed?: string;
  xPercent: number;
  yPercent: number;
  status: CampusPresenceStatus;
  currentZoneId?: string;
  lastSeenAt: number;
  /** 0–1 para fade‑out elegante (só cliente). */
  visualOpacity?: number;
  /** Metadado opcional (social poll). */
  zoneTitlePt?: string | null;
  /** Nível amigável quando não há payload realtime completo. */
  levelHint?: string | null;
};
