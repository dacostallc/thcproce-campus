/** Valores persistidos em `ProfileRewardLog.type` (não alterar sem migração de dados). */
export const REWARD_LOG_TYPE = {
  QUIZ_PASS: "QUIZ_PASS",
  ACHIEVEMENT_UNLOCK: "ACHIEVEMENT_UNLOCK",
  MISSION_COMPLETE: "MISSION_COMPLETE",
  REFERRAL_REFERRER: "REFERRAL_REFERRER",
  REFERRAL_RECIPIENT: "REFERRAL_RECIPIENT",
  COSMETIC_UNLOCK: "COSMETIC_UNLOCK",
} as const;

export type RewardLogTypeCode = (typeof REWARD_LOG_TYPE)[keyof typeof REWARD_LOG_TYPE];

export const REWARD_LOG_TYPE_LABEL_PT: Record<string, string> = {
  [REWARD_LOG_TYPE.QUIZ_PASS]: "Quiz aprovado",
  [REWARD_LOG_TYPE.ACHIEVEMENT_UNLOCK]: "Conquista",
  [REWARD_LOG_TYPE.MISSION_COMPLETE]: "Missão",
  [REWARD_LOG_TYPE.REFERRAL_REFERRER]: "Indicação (quem convidou)",
  [REWARD_LOG_TYPE.REFERRAL_RECIPIENT]: "Indicação (convidado)",
  [REWARD_LOG_TYPE.COSMETIC_UNLOCK]: "Cosmético",
};
