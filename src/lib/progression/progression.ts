import type { PrismaClient } from "@prisma/client";

import { getAvatarByXp } from "@/lib/progression/avatars";

export type UserProgressionDTO = {
  xp: number;
  souvenirCredits: number;
  levelKey: string;
  displayName: string | null;
  avatar: ReturnType<typeof getAvatarByXp>;
  nextAvatarPreview: ReturnType<typeof getAvatarByXp>["next"];
  progressPercent: number;
  futureRanking: null;
  futureAuraId: null;
  futureBadges: readonly [];
  updatedAt: Date;
};

/** Serializable shape for leaderboards / exports (`userId` == Prisma `Profile.id`). */
export type ProgressionRankingSnapshot = {
  userId: string;
  xp: number;
  souvenirs: number;
  tierKey: string;
  updatedAt: Date;
};

export async function getUserProgression(
  prisma: PrismaClient,
  profileId: string,
): Promise<UserProgressionDTO> {
  const p = await prisma.profile.findUnique({
    where: { id: profileId },
    select: {
      xpTotal: true,
      souvenirCredits: true,
      levelKey: true,
      displayName: true,
      updatedAt: true,
    },
  });
  if (!p) {
    throw new Error(`[progression] Profile not found: ${profileId}`);
  }

  const avatar = getAvatarByXp(p.xpTotal);

  return {
    xp: p.xpTotal,
    souvenirCredits: p.souvenirCredits,
    levelKey: p.levelKey,
    displayName: p.displayName,
    avatar,
    nextAvatarPreview: avatar.next,
    progressPercent: Math.round(avatar.progressToNext * 100),
    futureRanking: null,
    futureAuraId: null,
    futureBadges: [],
    updatedAt: p.updatedAt,
  };
}

export function toProgressionRankingSnapshot(row: {
  id: string;
  xpTotal: number;
  souvenirCredits: number;
  levelKey: string;
  updatedAt: Date;
}): ProgressionRankingSnapshot {
  return {
    userId: row.id,
    xp: row.xpTotal,
    souvenirs: row.souvenirCredits,
    tierKey: row.levelKey,
    updatedAt: row.updatedAt,
  };
}
