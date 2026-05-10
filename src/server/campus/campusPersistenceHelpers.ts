import type { Prisma, PrismaClient } from "@prisma/client";
import {
  getCampusZoneEducationalContext,
  type CampusMapZoneLabel
} from "@/data/campusMicroLessonContext";

export async function refreshCampusRecommendedZones(
  prisma: PrismaClient,
  profileId: string
): Promise<void> {
  const visited = await prisma.userZoneDiscovery.findMany({
    where: { profileId },
    select: { zoneLabel: true }
  });
  const labels: string[] = [];
  for (const v of visited) {
    try {
      const ctx = getCampusZoneEducationalContext(v.zoneLabel as CampusMapZoneLabel);
      const total = ctx.microLessonBlueprints.length;
      const done = await prisma.userMicroLessonProgress.count({
        where: { profileId, zoneLabel: v.zoneLabel, completedAt: { not: null } }
      });
      if (total > 0 && done < total) labels.push(v.zoneLabel);
    } catch {
      /* zoneLabel desconhecido — ignorar */
    }
  }

  await prisma.userCampusProgress.upsert({
    where: { profileId },
    create: {
      profileId,
      recommendedZoneLabels: labels
    },
    update: {
      recommendedZoneLabels: labels
    }
  });
}

export function appendNavigationHistory(
  prev: unknown,
  entry: { at: string; zoneLabel: string; hitId: string | null }
): Prisma.InputJsonValue {
  const hist = Array.isArray(prev) ? [...prev] : [];
  hist.push(entry);
  const trimmed = hist.slice(-48);
  return trimmed as Prisma.InputJsonValue;
}
