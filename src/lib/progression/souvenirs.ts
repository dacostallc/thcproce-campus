/**
 * Souvenir credit rewards (symbolic `Profile.souvenirCredits`).
 *
 * Wired via `awardSouvenirs` — ver `rewards.ts`: painel de aula, quiz, mapa, evento cinema, etc.
 */

export const SOUVENIR_REWARD_OPEN_LESSON = 2;
export const SOUVENIR_REWARD_QUIZ_CORRECT = 5;
export const SOUVENIR_REWARD_COMPLETE_ACTIVITY = 8;
export const SOUVENIR_REWARD_FIRST_COMPLETION_OF_DAY = 10;
export const SOUVENIR_REWARD_EXPLORE_NEW_AREA = 3;
export const SOUVENIR_REWARD_LIVE_EVENT = 30;

export function souvenirAmountOpenLesson(): number {
  return SOUVENIR_REWARD_OPEN_LESSON;
}

export function souvenirAmountQuizCorrect(): number {
  return SOUVENIR_REWARD_QUIZ_CORRECT;
}

export function souvenirAmountCompleteActivity(): number {
  return SOUVENIR_REWARD_COMPLETE_ACTIVITY;
}

export function souvenirAmountFirstCompletionOfDay(): number {
  return SOUVENIR_REWARD_FIRST_COMPLETION_OF_DAY;
}

export function souvenirAmountExploreNewArea(): number {
  return SOUVENIR_REWARD_EXPLORE_NEW_AREA;
}

export function souvenirAmountLiveEvent(): number {
  return SOUVENIR_REWARD_LIVE_EVENT;
}
