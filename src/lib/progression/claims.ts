/** Typed accessors for `Profile.progressionClaims` (JSON, default "{}"). */

import type { PrismaClient } from "@prisma/client";

import { awardSouvenirs, PROGRESSION_SOUVENIR_REASON } from "@/lib/progression/rewards";
import { SOUVENIR_REWARD_FIRST_COMPLETION_OF_DAY } from "@/lib/progression/souvenirs";

export type ProgressionClaimsJson = {
  lastDailyLoginXpDayUtc?: string;
  firstCompletionBonusDayUtc?: string;
  liveEventSouvenirDayUtc?: string;
  lessonOpenSouvenirKeys?: Record<string, true>;
  courseXpAwarded?: Record<string, true>;
  moduleXpAwarded?: Record<string, true>;
};

export function parseProgressionClaims(raw: unknown): ProgressionClaimsJson {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as ProgressionClaimsJson;
}

export function utcDayString(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function lessonOpenKey(areaId: string, lessonIndex: number): string {
  return `${areaId}:${lessonIndex}`;
}

/** Once per UTC day — any “completion” path (aula ou microaula). Returns souvenirs gained (0 if already claimed). */
export async function tryAwardFirstCompletionOfDaySouvenirs(
  prisma: PrismaClient,
  profileId: string,
): Promise<number> {
  const row = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { progressionClaims: true },
  });
  let claims = parseProgressionClaims(row?.progressionClaims);
  const day = utcDayString();
  if (claims.firstCompletionBonusDayUtc === day) return 0;

  await awardSouvenirs(
    prisma,
    profileId,
    SOUVENIR_REWARD_FIRST_COMPLETION_OF_DAY,
    PROGRESSION_SOUVENIR_REASON.FIRST_COMPLETION_OF_DAY,
    { dayUtc: day },
  );
  claims = { ...claims, firstCompletionBonusDayUtc: day };
  await prisma.profile.update({
    where: { id: profileId },
    data: { progressionClaims: claims as object },
  });
  return SOUVENIR_REWARD_FIRST_COMPLETION_OF_DAY;
}
