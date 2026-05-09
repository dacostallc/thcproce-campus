import { MissionType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { appendProfileRewardLog } from "@/lib/rewards/rewardLedger";
import { REWARD_LOG_TYPE } from "@/lib/rewards/rewardLogTypes";
import { levelFromXp } from "@/server/gamification";

type Stats = {
  passedQuizCount: number;
  completedQuizCount: number;
  achievementCount: number;
  xpTotal: number;
};

async function loadStats(profileId: string): Promise<Stats> {
  const [profile, passedQuizCount, completedQuizCount, achievementCount] = await Promise.all([
    prisma.profile.findUnique({
      where: { id: profileId },
      select: { xpTotal: true },
    }),
    prisma.quizAttempt.count({ where: { profileId, passed: true } }),
    prisma.quizAttempt.count({ where: { profileId } }),
    prisma.userAchievement.count({ where: { profileId } }),
  ]);
  return {
    xpTotal: profile?.xpTotal ?? 0,
    passedQuizCount,
    completedQuizCount,
    achievementCount,
  };
}

function progressForMissionType(m: { type: MissionType; targetValue: number }, s: Stats): number {
  let raw = 0;
  switch (m.type) {
    case MissionType.PASS_QUIZ:
      raw = s.passedQuizCount;
      break;
    case MissionType.COMPLETE_QUIZ:
      raw = s.completedQuizCount;
      break;
    case MissionType.EARN_XP:
      raw = s.xpTotal;
      break;
    case MissionType.UNLOCK_ACHIEVEMENT:
      raw = s.achievementCount;
      break;
    default:
      raw = 0;
  }
  return Math.min(raw, m.targetValue);
}

/**
 * Actualiza progresso / conclusão de missões a partir do estado actual do perfil.
 * Recompensas só uma vez por missão. Recarrega XP após cada conclusão para encadear EARN_XP.
 */
export async function syncMissionsForProfile(profileId: string): Promise<void> {
  const missions = await prisma.mission.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  for (let round = 0; round < 16; round += 1) {
    let stats = await loadStats(profileId);
    const completedIds = new Set(
      (
        await prisma.userMissionProgress.findMany({
          where: { profileId, completedAt: { not: null } },
          select: { missionId: true },
        })
      ).map((r) => r.missionId),
    );

    let completedThisRound = false;

    for (const m of missions) {
      if (completedIds.has(m.id)) {
        continue;
      }

      const progress = progressForMissionType(m, stats);

      if (progress >= m.targetValue) {
        const awarded = await prisma.$transaction(async (tx) => {
          await tx.userMissionProgress.upsert({
            where: { profileId_missionId: { profileId, missionId: m.id } },
            create: {
              profileId,
              missionId: m.id,
              currentProgress: progress,
              completedAt: null,
            },
            update: {
              currentProgress: progress,
            },
          });

          const claimed = await tx.userMissionProgress.updateMany({
            where: {
              profileId,
              missionId: m.id,
              completedAt: null,
              currentProgress: { gte: m.targetValue },
            },
            data: { completedAt: new Date() },
          });

          if (claimed.count === 0) {
            return false;
          }

          if (m.xpReward > 0 || m.souvenirCreditsReward > 0) {
            await tx.profile.update({
              where: { id: profileId },
              data: {
                ...(m.xpReward > 0 ? { xpTotal: { increment: m.xpReward } } : {}),
                ...(m.souvenirCreditsReward > 0
                  ? { souvenirCredits: { increment: m.souvenirCreditsReward } }
                  : {}),
              },
            });
            if (m.xpReward > 0) {
              const p = await tx.profile.findUnique({
                where: { id: profileId },
                select: { xpTotal: true },
              });
              if (p) {
                const level = levelFromXp(p.xpTotal);
                await tx.profile.update({
                  where: { id: profileId },
                  data: { levelKey: level.key },
                });
              }
            }
          }

          await appendProfileRewardLog(tx, {
            profileId,
            type: REWARD_LOG_TYPE.MISSION_COMPLETE,
            source: m.code,
            description: `Missão concluída: ${m.title}`,
            xpAmount: m.xpReward,
            souvenirCreditsAmount: m.souvenirCreditsReward,
          });

          return true;
        });

        if (awarded) {
          stats = await loadStats(profileId);
          completedIds.add(m.id);
          completedThisRound = true;
        }
      } else {
        await prisma.userMissionProgress.upsert({
          where: { profileId_missionId: { profileId, missionId: m.id } },
          create: {
            profileId,
            missionId: m.id,
            currentProgress: progress,
          },
          update: {
            currentProgress: progress,
          },
        });
      }
    }

    if (!completedThisRound) {
      break;
    }
  }
}
