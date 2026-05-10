import type { Prisma, PrismaClient } from "@prisma/client";
import { levelFromXp, LEVELS } from "@/server/gamification";
import type { CampusLevel } from "@/types/campusProgress";
import type { CampusXpActionType } from "@/types/campusProgress";

export function calculateLevel(xp: number): CampusLevel {
  const row = levelFromXp(xp);
  return { key: row.key, label: row.label, minXp: row.minXp };
}

const BADGE_ZONE_VISITS = "explorer_campus";
const BADGE_MICRO_PREFIX = "micro_zone_";

async function applyXpDelta(
  tx: Prisma.TransactionClient,
  profileId: string,
  amount: number,
  actionType: CampusXpActionType,
  meta?: Record<string, unknown> | null
): Promise<{ xpTotal: number }> {
  const p = await tx.profile.update({
    where: { id: profileId },
    data: { xpTotal: { increment: amount } },
    select: { xpTotal: true }
  });
  const lvl = levelFromXp(p.xpTotal);
  await tx.profile.update({
    where: { id: profileId },
    data: { levelKey: lvl.key }
  });
  await tx.userXpLedger.create({
    data: {
      profileId,
      actionType,
      amount,
      meta: meta === undefined ? undefined : (meta as Prisma.InputJsonValue)
    }
  });
  return { xpTotal: p.xpTotal };
}

/** Igual a `awardXp`, mas dentro de uma transacção Prisma já aberta (ex.: sincronizar várias missões). */
export async function awardXpWithTx(
  tx: Prisma.TransactionClient,
  profileId: string,
  amount: number,
  actionType: CampusXpActionType,
  meta?: Record<string, unknown> | null
): Promise<{ xpTotal: number }> {
  return applyXpDelta(tx, profileId, amount, actionType, meta);
}

export async function awardXp(
  prisma: PrismaClient,
  profileId: string,
  amount: number,
  actionType: CampusXpActionType,
  meta?: Record<string, unknown> | null
): Promise<{ xpTotal: number; level: CampusLevel }> {
  if (amount <= 0) {
    const p = await prisma.profile.findUniqueOrThrow({
      where: { id: profileId },
      select: { xpTotal: true }
    });
    return { xpTotal: p.xpTotal, level: calculateLevel(p.xpTotal) };
  }

  const updated = await prisma.$transaction(async (tx) => {
    const { xpTotal } = await applyXpDelta(tx, profileId, amount, actionType, meta);
    return xpTotal;
  });

  return { xpTotal: updated, level: calculateLevel(updated) };
}

export async function unlockBadge(
  prisma: PrismaClient,
  profileId: string,
  badgeCode: string
): Promise<boolean> {
  try {
    await prisma.userBadge.create({
      data: { profileId, badgeCode }
    });
    return true;
  } catch {
    return false;
  }
}

export async function unlockBadgeWithTx(
  tx: Prisma.TransactionClient,
  profileId: string,
  badgeCode: string
): Promise<boolean> {
  try {
    await tx.userBadge.create({
      data: { profileId, badgeCode }
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Avalia desbloqueios de badges de campus (zonas + microaulas) sem lançar XP.
 * Usado após `awardXp` directo (ex.: conclusão de microaula com valor editorial).
 */
export async function syncCampusBadgeUnlocks(
  prisma: PrismaClient,
  profileId: string
): Promise<string[]> {
  const newBadges: string[] = [];

  const zoneCount = await prisma.userZoneDiscovery.count({
    where: { profileId }
  });
  if (zoneCount >= 3) {
    const ok = await unlockBadge(prisma, profileId, BADGE_ZONE_VISITS);
    if (ok) newBadges.push(BADGE_ZONE_VISITS);
  }

  const zones = await prisma.userZoneDiscovery.findMany({
    where: { profileId },
    select: { zoneLabel: true }
  });
  for (const z of zones) {
    const total = await prisma.userMicroLessonProgress.count({
      where: { profileId, zoneLabel: z.zoneLabel, completedAt: { not: null } }
    });
    if (total >= 2) {
      const code = `${BADGE_MICRO_PREFIX}${z.zoneLabel}`;
      const ok = await unlockBadge(prisma, profileId, code);
      if (ok) newBadges.push(code);
    }
  }

  return newBadges;
}

export async function recordCampusAction(
  prisma: PrismaClient,
  profileId: string,
  kind: CampusXpActionType,
  opts?: { xp?: number; meta?: Record<string, unknown> | null }
): Promise<{ xpTotal: number; level: CampusLevel; newBadges: string[] }> {
  const xpAmount = opts?.xp ?? defaultXpForAction(kind);
  const { xpTotal, level } = await awardXp(prisma, profileId, xpAmount, kind, opts?.meta);

  const newBadges = await syncCampusBadgeUnlocks(prisma, profileId);

  return { xpTotal, level, newBadges };
}

function defaultXpForAction(kind: CampusXpActionType): number {
  switch (kind) {
    case "OPEN_MICRO_LESSON":
      return 4;
    case "COMPLETE_MICRO_LESSON":
      return 14;
    case "VISIT_ZONE_FIRST":
      return 10;
    case "VISIT_ZONE_REPEAT":
      return 2;
    case "OPEN_COURSE_PANEL":
      return 3;
    case "COMPLETE_TRAIL":
      return 40;
    case "LIVE_ATTEND":
      return 12;
    case "ADJUSTMENT":
      return 0;
    case "CAMPUS_MISSION_REWARD":
      return 0;
    default:
      return 0;
  }
}

export { LEVELS };
