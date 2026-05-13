/**
 * Central XP reward amounts for campus progression.
 *
 * Wired from `awardXp` (`rewards.ts`): quiz pass, daily login / streak (`tickStreak`),
 * campus map ledger (`campusXpEngine`), lesson stack (`lessonMarkSeen` + `lessonProgressBonuses`),
 * microaulas (`campusMicroLessonComplete`).
 */

export const XP_REWARD_DAILY_LOGIN = 1;
export const XP_REWARD_COMPLETE_LESSON = 3;
export const XP_REWARD_COMPLETE_MODULE = 10;
export const XP_REWARD_COMPLETE_COURSE = 40;
export const XP_REWARD_STREAK_7_DAY = 15;
export const XP_REWARD_HIGH_QUIZ_BONUS = 5;

/** Baseline XP for approved quiz attempt (`applyQuizPassGamification`) — equals high-quiz bonus. */
export const XP_REWARD_QUIZ_PASS = XP_REWARD_HIGH_QUIZ_BONUS;

export function xpAmountDailyLogin(): number {
  return XP_REWARD_DAILY_LOGIN;
}

export function xpAmountCompleteLesson(): number {
  return XP_REWARD_COMPLETE_LESSON;
}

export function xpAmountCompleteModule(): number {
  return XP_REWARD_COMPLETE_MODULE;
}

export function xpAmountCompleteCourse(): number {
  return XP_REWARD_COMPLETE_COURSE;
}

export function xpAmountStreak7Day(): number {
  return XP_REWARD_STREAK_7_DAY;
}

export function xpAmountHighQuizBonus(): number {
  return XP_REWARD_HIGH_QUIZ_BONUS;
}

export function xpAmountQuizPass(): number {
  return XP_REWARD_QUIZ_PASS;
}
