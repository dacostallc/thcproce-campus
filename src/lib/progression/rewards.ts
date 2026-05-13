/**
 * Profile progression rewards — updates `Profile.xpTotal`, `Profile.levelKey`, `Profile.souvenirCredits`.
 *
 * Callsites: quiz (`applyQuizPassGamification`), campus ledger (`campusXpEngine`), aulas (`lessonMarkSeen`),
 * ritmo diário (`tickStreak`), abertura de painel (`lessonFirstOpen`), evento cinema (`campusGuidedMissionEvent`).
 */

import type { Prisma, PrismaClient } from "@prisma/client";

import { getAvatarByXp } from "@/lib/progression/avatars";

export type ProgressionDbClient =
  | Prisma.TransactionClient
  | Omit<
      PrismaClient,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >;

export const PROGRESSION_XP_REASON = {
  QUIZ_PASS: "quiz_pass",
  ACHIEVEMENT_UNLOCK: "achievement_unlock",
  CAMPUS_ACTION: "campus_action",
  CAMPUS_LEDGER: "campus_ledger",
  DAILY_LOGIN: "daily_login",
  STREAK_7_DAY: "streak_7_day",
  COMPLETE_LESSON: "complete_lesson",
  COMPLETE_MODULE: "complete_module",
  COMPLETE_COURSE: "complete_course",
} as const;

export const PROGRESSION_SOUVENIR_REASON = {
  QUIZ_PASS: "quiz_pass",
  ACHIEVEMENT_UNLOCK: "achievement_unlock",
  FIRST_COMPLETION_OF_DAY: "first_completion_of_day",
  OPEN_LESSON: "open_lesson",
  CAMPUS_ACTION: "campus_action",
  LIVE_EVENT: "live_event",
} as const;

export type ProgressionAwardResult = {
  xpTotal: number;
  souvenirCredits: number;
  levelKey: string;
  avatar: ReturnType<typeof getAvatarByXp>;
};

async function loadProgressionSnapshot(
  db: ProgressionDbClient,
  profileId: string,
): Promise<ProgressionAwardResult> {
  const p = await db.profile.findUniqueOrThrow({
    where: { id: profileId },
    select: { xpTotal: true, souvenirCredits: true, levelKey: true },
  });
  const avatar = getAvatarByXp(p.xpTotal);
  return {
    xpTotal: p.xpTotal,
    souvenirCredits: p.souvenirCredits,
    levelKey: p.levelKey,
    avatar,
  };
}

export async function awardXp(
  db: ProgressionDbClient,
  profileId: string,
  amount: number,
  reason: string,
  meta?: Record<string, unknown> | null,
): Promise<ProgressionAwardResult> {
  const delta = Math.floor(Number(amount) || 0);
  if (delta <= 0) {
    return loadProgressionSnapshot(db, profileId);
  }

  const updated = await db.profile.update({
    where: { id: profileId },
    data: { xpTotal: { increment: delta } },
    select: { xpTotal: true, souvenirCredits: true },
  });

  const avatar = getAvatarByXp(updated.xpTotal);
  await db.profile.update({
    where: { id: profileId },
    data: { levelKey: avatar.key },
  });

  console.info(
    "[progression:xp]",
    JSON.stringify({
      profileId,
      amount: delta,
      reason,
      meta: meta ?? undefined,
      xpTotal: updated.xpTotal,
      souvenirCredits: updated.souvenirCredits,
      levelKey: avatar.key,
    }),
  );

  return {
    xpTotal: updated.xpTotal,
    souvenirCredits: updated.souvenirCredits,
    levelKey: avatar.key,
    avatar,
  };
}

export async function awardSouvenirs(
  db: ProgressionDbClient,
  profileId: string,
  amount: number,
  reason: string,
  meta?: Record<string, unknown> | null,
): Promise<ProgressionAwardResult> {
  const delta = Math.floor(Number(amount) || 0);
  if (delta <= 0) {
    return loadProgressionSnapshot(db, profileId);
  }

  const updated = await db.profile.update({
    where: { id: profileId },
    data: { souvenirCredits: { increment: delta } },
    select: { xpTotal: true, souvenirCredits: true, levelKey: true },
  });

  const avatar = getAvatarByXp(updated.xpTotal);

  console.info(
    "[progression:souvenirs]",
    JSON.stringify({
      profileId,
      amount: delta,
      reason,
      meta: meta ?? undefined,
      souvenirCreditsTotal: updated.souvenirCredits,
      xpTotal: updated.xpTotal,
      levelKey: updated.levelKey,
    }),
  );

  return {
    xpTotal: updated.xpTotal,
    souvenirCredits: updated.souvenirCredits,
    levelKey: updated.levelKey,
    avatar,
  };
}
