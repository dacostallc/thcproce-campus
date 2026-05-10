/**
 * Tipos de domínio — persistência THCProce Campus (mapa, zonas, microaulas, XP).
 * Espelham enums conceituais; armazenamento Prisma usa principalmente `string` estável.
 */

export type CampusZoneStatus = "new" | "discovered" | "completed" | "recommended";

export type CampusZoneState = {
  zoneLabel: string;
  status: CampusZoneStatus;
  visitCount: number;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
};

export type CampusMicroLessonState = {
  blueprintId: string;
  zoneLabel: string;
  legacyHitId: string | null;
  startedAt: string | null;
  completedAt: string | null;
  xpEarned: number;
  secondsEngaged: number;
};

export type CampusXpEvent = {
  actionType: CampusXpActionType;
  amount: number;
  createdAt: string;
  meta?: Record<string, unknown> | null;
};

export type CampusBadge = {
  badgeCode: string;
  unlockedAt: string;
};

export type CampusLevel = {
  key: string;
  label: string;
  minXp: number;
};

export type CampusXpActionType =
  | "OPEN_MICRO_LESSON"
  | "COMPLETE_MICRO_LESSON"
  | "VISIT_ZONE_FIRST"
  | "VISIT_ZONE_REPEAT"
  | "OPEN_COURSE_PANEL"
  | "COMPLETE_TRAIL"
  | "LIVE_ATTEND"
  | "ADJUSTMENT"
  | "CAMPUS_MISSION_REWARD";

export type CampusDifficulty = "Iniciante" | "Intermediário" | "Avançado";
