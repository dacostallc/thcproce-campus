import type { PrismaClient } from "@prisma/client";
import { CAMPUS_MAP_INTERACTIVE_AREAS } from "@/lib/campusMapAreasCatalog";
import { hotspotEffectiveCourseId } from "@/lib/campusMapHotspotResolve";
import {
  countMicroLessonsInZone,
  resolveCampusMapZoneLabel,
  type CampusMapZoneLabel
} from "@/data/campusMicroLessonContext";
import type { CampusZoneStatus } from "@/types/campusProgress";

export type CampusWorldSnapshot = {
  hitZoneStates: Record<string, CampusZoneStatus>;
  zonesByLabel: Record<
    string,
    {
      visitCount: number;
      status: string;
      firstSeenAt: string;
      lastSeenAt: string;
    }
  >;
  microLessons: Array<{
    blueprintId: string;
    zoneLabel: string;
    legacyHitId: string | null;
    startedAt: string | null;
    completedAt: string | null;
    xpEarned: number;
    secondsEngaged: number;
  }>;
  badges: Array<{ badgeCode: string; unlockedAt: string }>;
  xpTotal: number;
  levelKey: string;
  levelLabel: string;
  restore: {
    lastZoneLabel: string | null;
    lastLegacyHitId: string | null;
    lastBuildingCourseId: string | null;
    lastMicroLessonBlueprintId: string | null;
    lastPanelKind: string | null;
  };
  recommendedZoneLabels: string[];
};

function blueprintTotalForZone(zone: CampusMapZoneLabel): number {
  return countMicroLessonsInZone(zone);
}

function completedMicrosForZone(
  zone: CampusMapZoneLabel,
  microRows: Array<{ zoneLabel: string; completedAt: Date | null }>
): number {
  return microRows.filter((r) => r.zoneLabel === zone && r.completedAt != null).length;
}

export async function buildCampusWorldSnapshot(
  prisma: PrismaClient,
  profileId: string,
  xpTotal: number,
  levelKey: string,
  levelLabel: string
): Promise<CampusWorldSnapshot> {
  const [progress, zones, micros, badges] = await Promise.all([
    prisma.userCampusProgress.findUnique({ where: { profileId } }),
    prisma.userZoneDiscovery.findMany({ where: { profileId } }),
    prisma.userMicroLessonProgress.findMany({ where: { profileId } }),
    prisma.userBadge.findMany({ where: { profileId }, orderBy: { unlockedAt: "desc" } })
  ]);

  const zonesByLabel: CampusWorldSnapshot["zonesByLabel"] = {};
  for (const z of zones) {
    zonesByLabel[z.zoneLabel] = {
      visitCount: z.visitCount,
      status: z.status,
      firstSeenAt: z.firstSeenAt.toISOString(),
      lastSeenAt: z.lastSeenAt.toISOString()
    };
  }

  const recommendedRaw = progress?.recommendedZoneLabels;
  let recommendedZoneLabels: string[] = [];
  if (Array.isArray(recommendedRaw)) {
    recommendedZoneLabels = recommendedRaw.filter((x): x is string => typeof x === "string");
  }

  const microLessons = micros.map((m) => ({
    blueprintId: m.blueprintId,
    zoneLabel: m.zoneLabel,
    legacyHitId: m.legacyHitId,
    startedAt: m.startedAt?.toISOString() ?? null,
    completedAt: m.completedAt?.toISOString() ?? null,
    xpEarned: m.xpEarned,
    secondsEngaged: m.secondsEngaged
  }));

  const hitZoneStates: Record<string, CampusZoneStatus> = {};

  for (const hit of CAMPUS_MAP_INTERACTIVE_AREAS) {
    const courseId = hotspotEffectiveCourseId(hit);
    const zone = resolveCampusMapZoneLabel({
      legacyHitId: hit.id,
      courseId: courseId ?? undefined
    });
    const zd = zonesByLabel[zone];
    const needed = blueprintTotalForZone(zone);
    const done = completedMicrosForZone(zone, micros);

    let status: CampusZoneStatus = "new";
    if (needed > 0 && done >= needed) {
      status = "completed";
    } else if (recommendedZoneLabels.includes(zone) && zd && zd.visitCount > 0) {
      status = "recommended";
    } else if (zd && zd.visitCount > 0) {
      status = "discovered";
    } else if (recommendedZoneLabels.includes(zone)) {
      status = "recommended";
    }

    hitZoneStates[hit.id] = status;
  }

  return {
    hitZoneStates,
    zonesByLabel,
    microLessons,
    badges: badges.map((b) => ({
      badgeCode: b.badgeCode,
      unlockedAt: b.unlockedAt.toISOString()
    })),
    xpTotal,
    levelKey,
    levelLabel,
    restore: {
      lastZoneLabel: progress?.lastZoneLabel ?? null,
      lastLegacyHitId: progress?.lastLegacyHitId ?? null,
      lastBuildingCourseId: progress?.lastBuildingCourseId ?? null,
      lastMicroLessonBlueprintId: progress?.lastMicroLessonBlueprintId ?? null,
      lastPanelKind: progress?.lastPanelKind ?? null
    },
    recommendedZoneLabels
  };
}
