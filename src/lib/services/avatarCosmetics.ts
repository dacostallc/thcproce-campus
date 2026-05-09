import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type DbTx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

import { appendProfileRewardLog } from "@/lib/rewards/rewardLedger";
import { REWARD_LOG_TYPE } from "@/lib/rewards/rewardLogTypes";

/** Concede itens cosméticos ligados a um código de achievement (idempotente). */
export async function grantCosmeticItemsForAchievementCode(
  tx: DbTx,
  profileId: string,
  achievementCode: string,
): Promise<void> {
  const items = await tx.avatarItem.findMany({
    where: {
      active: true,
      unlockAchievementCode: achievementCode,
    },
  });
  for (const item of items) {
    const existing = await tx.userAvatarItem.findUnique({
      where: {
        profileId_avatarItemId: { profileId, avatarItemId: item.id },
      },
    });
    if (existing) continue;
    await tx.userAvatarItem.create({
      data: { profileId, avatarItemId: item.id },
    });
    await appendProfileRewardLog(tx, {
      profileId,
      type: REWARD_LOG_TYPE.COSMETIC_UNLOCK,
      source: item.code,
      description: `${item.displayGlyph} ${item.name} (conquista ${achievementCode})`,
      xpAmount: 0,
      souvenirCreditsAmount: 0,
    });
  }
}

/**
 * Garante que todos os cosméticos associados às conquistas já obtidas existem em `UserAvatarItem`.
 * Útil no /perfil para utilizadores que já tinham achievements antes desta fase.
 */
export async function ensureUserUnlockedAvatarItems(profileId: string): Promise<void> {
  const rows = await prisma.userAchievement.findMany({
    where: { profileId },
    include: { achievement: { select: { code: true } } },
  });
  const codes = [...new Set(rows.map((r) => r.achievement.code))];
  if (codes.length === 0) return;

  const items = await prisma.avatarItem.findMany({
    where: {
      active: true,
      unlockAchievementCode: { in: codes },
    },
  });

  for (const item of items) {
    await prisma.userAvatarItem.upsert({
      where: {
        profileId_avatarItemId: { profileId, avatarItemId: item.id },
      },
      create: { profileId, avatarItemId: item.id },
      update: {},
    });
  }
}
