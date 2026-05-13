/**
 * Stack-on bonuses when a lesson is newly marked complete (`lessonMarkSeen`): first completion of
 * the UTC day (souvenirs), module milestone XP (Cannabis 101), course completion XP.
 *
 * The base +3 XP for “complete lesson” is granted in `campus.lessonMarkSeen` before this runs.
 */

import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101";
import { getCannabis101StreamChapter } from "@/content/courses/cannabis-101/streamChapter";
import type { Area } from "@/data/courses";
import { areas } from "@/data/courses";
import { getLessonTitlesForArea } from "@/data/lessonOutline";
import {
  parseProgressionClaims,
  tryAwardFirstCompletionOfDaySouvenirs,
  type ProgressionClaimsJson,
} from "@/lib/progression/claims";
import { PROGRESSION_XP_REASON, awardXp } from "@/lib/progression/rewards";
import { XP_REWARD_COMPLETE_COURSE, XP_REWARD_COMPLETE_MODULE } from "@/lib/progression/xp";
import type { PrismaClient } from "@prisma/client";

export type LessonMarkBonusResult = {
  souvenirsFirstCompletionOfDay: number;
  xpFromModule: number;
  xpFromCourse: number;
};

function areaById(areaId: string): Area | undefined {
  return areas.find((a) => a.id === areaId);
}

export async function applyLessonMarkedBonuses(
  prisma: PrismaClient,
  profileId: string,
  input: { areaId: string; lessonIndex: number },
): Promise<LessonMarkBonusResult> {
  const out: LessonMarkBonusResult = {
    souvenirsFirstCompletionOfDay: 0,
    xpFromModule: 0,
    xpFromCourse: 0,
  };

  const row = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { progressionClaims: true, lessonProgress: true },
  });
  let claims: ProgressionClaimsJson = parseProgressionClaims(row?.progressionClaims);

  const firstSouv = await tryAwardFirstCompletionOfDaySouvenirs(prisma, profileId);
  if (firstSouv > 0) {
    out.souvenirsFirstCompletionOfDay = firstSouv;
    const refreshed = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { progressionClaims: true },
    });
    claims = parseProgressionClaims(refreshed?.progressionClaims);
  }

  let lpMap: Record<string, number[]> = {};
  try {
    lpMap = row?.lessonProgress ? (JSON.parse(row.lessonProgress) as Record<string, number[]>) : {};
  } catch {
    lpMap = {};
  }
  const done = new Set(lpMap[input.areaId] ?? []);

  const area = areaById(input.areaId);
  if (!area) {
    await prisma.profile.update({
      where: { id: profileId },
      data: { progressionClaims: claims as object },
    });
    return out;
  }

  if (input.areaId === CANNABIS101_AREA_ID) {
    const ch = getCannabis101StreamChapter(input.lessonIndex);
    if (ch && ch.lessonOrdinalInModule === ch.lessonsInModule) {
      const modKey = `${input.areaId}:${ch.moduleId}`;
      if (!claims.moduleXpAwarded?.[modKey]) {
        await awardXp(
          prisma,
          profileId,
          XP_REWARD_COMPLETE_MODULE,
          PROGRESSION_XP_REASON.COMPLETE_MODULE,
          { areaId: input.areaId, moduleId: ch.moduleId },
        );
        claims = {
          ...claims,
          moduleXpAwarded: { ...claims.moduleXpAwarded, [modKey]: true },
        };
        out.xpFromModule = XP_REWARD_COMPLETE_MODULE;
      }
    }
  }

  const titles = getLessonTitlesForArea(area);
  if (titles.length > 0 && titles.every((_, i) => done.has(i))) {
    const courseKey = input.areaId;
    if (!claims.courseXpAwarded?.[courseKey]) {
      await awardXp(
        prisma,
        profileId,
        XP_REWARD_COMPLETE_COURSE,
        PROGRESSION_XP_REASON.COMPLETE_COURSE,
        { areaId: input.areaId },
      );
      claims = {
        ...claims,
        courseXpAwarded: { ...claims.courseXpAwarded, [courseKey]: true },
      };
      out.xpFromCourse = XP_REWARD_COMPLETE_COURSE;
    }
  }

  await prisma.profile.update({
    where: { id: profileId },
    data: { progressionClaims: claims as object },
  });

  return out;
}
