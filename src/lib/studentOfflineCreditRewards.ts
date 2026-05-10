/**
 * Créditos de campus em modo offline (`localStorage`).
 * TODO Prisma: espelhar estes montantes ou regras no servidor quando `User.campusCredits`
 * ou telemetria oficial existir — hoje apenas `awardCredits` local.
 */

import { awardCredits } from "@/lib/studentGamificationStorage";

/** Valores centralizados para alinhar com produto/design depois. */
export const OFFLINE_CREDIT_AMOUNTS = {
  /** Nova aula marcada como vista (primeira vez, local). */
  lessonMarkedOnce: 4,
  /** Placeholder até haver avaliação de quiz no cliente. */
  quizPassedStub: 6,
  /** Visita/atividade genérica no campus (ex.: abrir zona). */
  campusActivityPing: 2
} as const;

export function grantOfflineCreditsForLessonMarked(): void {
  awardCredits(OFFLINE_CREDIT_AMOUNTS.lessonMarkedOnce, "offline_lesson_marked");
}

/** Chamar quando o fluxo de quiz local reportar sucesso — ainda opcional nos ecrãs. */
export function grantOfflineCreditsForQuizPassedStub(): void {
  awardCredits(OFFLINE_CREDIT_AMOUNTS.quizPassedStub, "offline_quiz_passed_stub");
}

export function grantOfflineCreditsForCampusActivity(): void {
  awardCredits(OFFLINE_CREDIT_AMOUNTS.campusActivityPing, "offline_campus_activity");
}
