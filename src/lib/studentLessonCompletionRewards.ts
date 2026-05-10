/**
 * Pacote offline ao concluir aula pela primeira vez (marcação local).
 * TODO Prisma: usar `grantLessonCompletionReward()` server-side quando progresso oficial existir —
 * preservar estas assinaturas para alinhar com API futura.
 */

import {
  OFFLINE_CREDIT_AMOUNTS,
  grantOfflineCreditsForLessonMarked
} from "@/lib/studentOfflineCreditRewards";
import { awardXp, grantBadge } from "@/lib/studentGamificationStorage";
import { bumpMissionLessonMarkedOnce } from "@/lib/studentMissionsTelemetry";

export const LESSON_COMPLETION_OFFLINE_XP = 25 as const;

export type LessonCompletionRewardSnapshot = {
  applied: boolean;
  xpAdded: number;
  creditsAdded: number;
  coursePercentApprox: number;
};

/**
 * Chamado apenas quando esta aula ganha marca local **nova** pelo aluno (`wasNewLocalMark`).
 * Não repete XP/credits se `applied === false`.
 */
export function grantLessonCompletionReward(args: {
  isFirstLocalMarkForThisLesson: boolean;
  totalLessonsInArea: number;
  /** Quantas aulas distintas já estão concluídas **após** esta marca (incluindo a actual). */
  lessonsDoneCountAfterMark: number;
}): LessonCompletionRewardSnapshot {
  const pct =
    args.totalLessonsInArea > 0
      ? Math.min(
          100,
          Math.round((args.lessonsDoneCountAfterMark / args.totalLessonsInArea) * 100)
        )
      : 0;

  if (!args.isFirstLocalMarkForThisLesson) {
    return {
      applied: false,
      xpAdded: 0,
      creditsAdded: 0,
      coursePercentApprox: pct
    };
  }

  awardXp(LESSON_COMPLETION_OFFLINE_XP, "lesson_mark_seen");
  grantBadge("first_lesson");
  grantOfflineCreditsForLessonMarked();
  bumpMissionLessonMarkedOnce();

  return {
    applied: true,
    xpAdded: LESSON_COMPLETION_OFFLINE_XP,
    creditsAdded: OFFLINE_CREDIT_AMOUNTS.lessonMarkedOnce,
    coursePercentApprox: pct
  };
}
