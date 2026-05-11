/**
 * Contratos tipados para persistência futura (quiz, missões, inventário, XP real).
 * Sem implementação de API/BD — apenas shapes estáveis para evolução da engine.
 */

export type CampusMapPointId = string;

/** Estado por questão quando existir tracking persistente */
export type CampusMapPointQuizAttemptRecord = {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  completedAtIso?: string;
};

/** Snapshot serializável de progresso num único map-point */
export type CampusMapPointLearnerProgressDraft = {
  mapPointId: CampusMapPointId;
  quizAttempts?: CampusMapPointQuizAttemptRecord[];
  /** checklist mission.json por texto ou hash estável da linha */
  missionChecklistDone?: Record<string, boolean>;
  badgeUnlocked?: boolean;
  xpEarnedTotal?: number;
  greenCoinsEarnedTotal?: number;
  growerMasterApplied?: number;
  /** Hooks futuros sem schema fechado */
  inventoryGrantedIds?: string[];
  lastSyncedAtIso?: string;
};

/** Agregado perfil (futuro sync mobile / backend) */
export type CampusGrowerMasterProfileDraft = {
  totalXp?: number;
  totalGreenCoins?: number;
  growerMasterTier?: number;
  badgesUnlockedIds?: string[];
  completedMapPointIds?: CampusMapPointId[];
};
