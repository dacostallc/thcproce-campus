/** Dados só para UI cinematográfica — sem lógica nova. */
export type LessonProgressionSnapshot = {
  xp: number;
  levelLabel: string;
  souvenirCredits: number;
  progressPercent: number;
  nextTierLabel: string | null;
  nextTierMinXp: number | null;
  streak: number;
};

export type LessonCinematicHudModel = {
  areaName: string;
  lessonTitleForCrumb: string;
  isAuthenticated: boolean;
  progression: LessonProgressionSnapshot | null;
  trailProgressPct: number;
  doneInArea: number;
  totalLessons: number;
  dwellLiveMs: number;
  dwellRequiredMs: number;
  dwellPct: number;
  dwellRemainingLabel: string;
  alreadyComplete: boolean;
  completeBlocked: boolean;
  onMarkComplete: () => void;
  markCompletePending: boolean;
};
