/**
 * Tipos das missões locais Fase 2 — espelhar em Prisma quando migrar.
 */

export type CampusMissionPhase2Id =
  | "campus-p2-enter"
  | "campus-p2-cannabis101"
  | "campus-p2-first-lesson-complete"
  | "campus-p2-first-quiz-correct"
  | "campus-p2-mural"
  | "campus-p2-cinema"
  | "campus-p2-three-lessons"
  | "campus-p2-xp-twenty"
  | "campus-p2-profile";

export type CampusMissionPhase2Status = "pending" | "completed";

/** Estado persistido por missão no cliente. */
export type CampusMissionPhase2Record = {
  status: CampusMissionPhase2Status;
  /** ISO8601 quando concluída; `null` se pendente. */
  completedAt: string | null;
};

/** Definição estática (catálogo) — futuro CMS / seed servidor. */
export type CampusMissionPhase2Definition = {
  id: CampusMissionPhase2Id;
  title: string;
  description: string;
  rewardXp: number;
  rewardCredits: number;
  /** Badge simples persistido em `StudentProfile.badges` via `grantBadge`. */
  rewardBadgeId: string;
  /** Rótulo curto para o cartão da missão. */
  badgeLabel: string;
  /** Ícone livre (emoji) para listagens compactas. */
  badgeEmoji: string;
  /** Itens MOCK em `bonusInventoryIds` — ver `studentGamificationMockCatalog.ts`. */
  rewardInventoryIds?: readonly string[];
};

/** Merge catálogo + estado para UI. */
export type CampusMissionPhase2UiRow = CampusMissionPhase2Definition &
  CampusMissionPhase2Record;
