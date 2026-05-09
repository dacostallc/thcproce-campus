import type { PrismaClient } from "@prisma/client";

import { grantCosmeticItemsForAchievementCode } from "@/lib/services/avatarCosmetics";
import { appendProfileRewardLog } from "@/lib/rewards/rewardLedger";
import { REWARD_LOG_TYPE } from "@/lib/rewards/rewardLogTypes";
import { levelFromXp } from "@/server/gamification";

/** XP base por aprovação de quiz (para além de recompensas de achievements). */
export const XP_REWARD_QUIZ_PASS = 50;

/** Créditos simbólicos por quiz aprovado (além dos definidos em cada achievement). */
export const SOUVENIR_CREDITS_QUIZ_PASS = 3;

/**
 * Códigos com critérios automáticos nesta fase. Outros códigos na tabela não desbloqueiam
 * automaticamente (podem ser usados noutras fases).
 */
export const GAMIFICATION_ACHIEVEMENT_CODES = [
  "FIRST_QUIZ_PASSED",
  "QUIZ_PASSED",
  "XP_100",
  "XP_500",
  "XP_1000",
] as const;

export type GamificationAchievementCode = (typeof GAMIFICATION_ACHIEVEMENT_CODES)[number];

export type UnlockedAchievementRow = {
  code: string;
  title: string;
  xpReward: number;
  souvenirCredits: number;
};

export type QuizPassGamificationOptions = {
  quizId?: string | null;
  quizTitle?: string | null;
};

export type QuizPassGamificationResult = {
  xpGained: number;
  xpTotal: number;
  levelKey: string;
  levelLabel: string;
  souvenirCreditsGained: number;
  souvenirCreditsTotal: number;
  unlocked: UnlockedAchievementRow[];
};

type DbTx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

function isGamificationCode(s: string): s is GamificationAchievementCode {
  return (GAMIFICATION_ACHIEVEMENT_CODES as readonly string[]).includes(s);
}

function meetsAutomaticCriterion(
  code: GamificationAchievementCode,
  ctx: { passedCount: number; xpTotal: number },
): boolean {
  switch (code) {
    case "FIRST_QUIZ_PASSED":
      return ctx.passedCount === 1;
    case "QUIZ_PASSED":
      return ctx.passedCount >= 2;
    case "XP_100":
      return ctx.xpTotal >= 100;
    case "XP_500":
      return ctx.xpTotal >= 500;
    case "XP_1000":
      return ctx.xpTotal >= 1000;
    default:
      return false;
  }
}

async function ownedAchievementCodes(tx: DbTx, profileId: string): Promise<Set<string>> {
  const rows = await tx.userAchievement.findMany({
    where: { profileId },
    include: { achievement: { select: { code: true } } },
  });
  return new Set(rows.map((r) => r.achievement.code));
}

/**
 * Aplica XP pelo quiz aprovado, actualiza nível (`Profile.levelKey` e `Profile.xpTotal`)
 * e desbloqueia achievements com critérios automáticos (incluindo recompensa XP do achievement).
 */
export async function applyQuizPassGamification(
  tx: DbTx,
  profileId: string,
  opts?: QuizPassGamificationOptions | null,
): Promise<QuizPassGamificationResult> {
  await tx.profile.update({
    where: { id: profileId },
    data: {
      xpTotal: { increment: XP_REWARD_QUIZ_PASS },
      souvenirCredits: { increment: SOUVENIR_CREDITS_QUIZ_PASS },
    },
  });

  await appendProfileRewardLog(tx, {
    profileId,
    type: REWARD_LOG_TYPE.QUIZ_PASS,
    source: opts?.quizId ?? null,
    description: opts?.quizTitle?.trim()
      ? `Quiz aprovado: ${opts.quizTitle.trim()}`
      : "Quiz aprovado no campus",
    xpAmount: XP_REWARD_QUIZ_PASS,
    souvenirCreditsAmount: SOUVENIR_CREDITS_QUIZ_PASS,
  });

  let xpGained = XP_REWARD_QUIZ_PASS;
  let souvenirCreditsGained = SOUVENIR_CREDITS_QUIZ_PASS;
  const passedCount = await tx.quizAttempt.count({
    where: { profileId, passed: true },
  });

  let profile = await tx.profile.findUniqueOrThrow({
    where: { id: profileId },
    select: { xpTotal: true, souvenirCredits: true },
  });

  const unlocked: UnlockedAchievementRow[] = [];
  const ownedCodes = await ownedAchievementCodes(tx, profileId);
  const ownedMut = new Set(ownedCodes);

  for (let safety = 0; safety < 24; safety += 1) {
    const achievements = await tx.achievement.findMany({
      where: { code: { in: [...GAMIFICATION_ACHIEVEMENT_CODES] } },
    });

    let progressed = false;
    for (const ach of achievements) {
      if (ownedMut.has(ach.code)) continue;
      if (!isGamificationCode(ach.code)) continue;
      if (
        !meetsAutomaticCriterion(ach.code, {
          passedCount,
          xpTotal: profile.xpTotal,
        })
      ) {
        continue;
      }

      const inserted = await tx.userAchievement.createMany({
        data: [{ profileId, achievementId: ach.id }],
        skipDuplicates: true,
      });
      if (inserted.count === 0) {
        ownedMut.add(ach.code);
        continue;
      }
      await grantCosmeticItemsForAchievementCode(tx, profileId, ach.code);
      ownedMut.add(ach.code);
      unlocked.push({
        code: ach.code,
        title: ach.title,
        xpReward: ach.xpReward,
        souvenirCredits: ach.souvenirCredits,
      });

      if (ach.xpReward > 0 || ach.souvenirCredits > 0) {
        await tx.profile.update({
          where: { id: profileId },
          data: {
            ...(ach.xpReward > 0 ? { xpTotal: { increment: ach.xpReward } } : {}),
            ...(ach.souvenirCredits > 0
              ? { souvenirCredits: { increment: ach.souvenirCredits } }
              : {}),
          },
        });
        if (ach.xpReward > 0) xpGained += ach.xpReward;
        if (ach.souvenirCredits > 0) souvenirCreditsGained += ach.souvenirCredits;
        profile = await tx.profile.findUniqueOrThrow({
          where: { id: profileId },
          select: { xpTotal: true, souvenirCredits: true },
        });
      }

      await appendProfileRewardLog(tx, {
        profileId,
        type: REWARD_LOG_TYPE.ACHIEVEMENT_UNLOCK,
        source: ach.code,
        description: `Conquista desbloqueada: ${ach.title}`,
        xpAmount: ach.xpReward,
        souvenirCreditsAmount: ach.souvenirCredits,
      });

      progressed = true;
    }

    if (!progressed) break;
  }

  const level = levelFromXp(profile.xpTotal);
  await tx.profile.update({
    where: { id: profileId },
    data: { levelKey: level.key },
  });

  return {
    xpGained,
    xpTotal: profile.xpTotal,
    levelKey: level.key,
    levelLabel: level.label,
    souvenirCreditsGained,
    souvenirCreditsTotal: profile.souvenirCredits,
    unlocked,
  };
}
