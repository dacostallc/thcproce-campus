import type { PrismaClient } from "@prisma/client";
import {
  awardXpWithTx,
  unlockBadgeWithTx
} from "@/lib/campus/campusXpEngine";
import { CAMPUS_MISSION_CATALOG } from "@/lib/campus/campusMissions";

export type CampusGuidedMissionSyncResult = {
  newlyGrantedRewards: Array<{
    missionId: string;
    xp: number;
    badgeCode?: string;
  }>;
};

/**
 * Recalcula progresso a partir de zonas/microaulas e linhas persistidas,
 * marca conclusões e entrega XP/badge uma vez (`rewardClaimedAt`).
 */
export async function syncCampusGuidedMissions(
  prisma: PrismaClient,
  profileId: string
): Promise<CampusGuidedMissionSyncResult> {
  return prisma.$transaction(async (tx) => {
    const eventMissionIds = CAMPUS_MISSION_CATALOG.filter(
      (m) => m.objectiveType === "OPEN_PROFILE" || m.objectiveType === "OPEN_CINEMA"
    ).map((m) => m.id);

    const [
      zoneCount,
      greenhouseHit,
      microStarted,
      microCompleted,
      eventRows
    ] = await Promise.all([
      tx.userZoneDiscovery.count({ where: { profileId } }),
      tx.userZoneDiscovery.findUnique({
        where: { profileId_zoneLabel: { profileId, zoneLabel: "greenhouse" } }
      }),
      tx.userMicroLessonProgress.count({
        where: { profileId, startedAt: { not: null } }
      }),
      tx.userMicroLessonProgress.count({
        where: { profileId, completedAt: { not: null } }
      }),
      tx.campusMissionProgress.findMany({
        where: { profileId, missionId: { in: eventMissionIds } },
        select: { missionId: true, progressCurrent: true }
      })
    ]);

    const eventProgress = new Map(eventRows.map((r) => [r.missionId, r.progressCurrent]));

    const newlyGrantedRewards: CampusGuidedMissionSyncResult["newlyGrantedRewards"] =
      [];

    for (const def of CAMPUS_MISSION_CATALOG) {
      let computed = 0;
      switch (def.objectiveType) {
        case "DISCOVER_ZONE":
          computed = zoneCount;
          break;
        case "OPEN_GREENHOUSE":
          computed = greenhouseHit ? 1 : 0;
          break;
        case "OPEN_MICROLESSON":
          computed = microStarted;
          break;
        case "COMPLETE_MICROLESSON":
          computed = microCompleted;
          break;
        case "OPEN_PROFILE":
          computed = eventProgress.get(def.id) ?? 0;
          break;
        case "OPEN_CINEMA":
          computed = eventProgress.get(def.id) ?? 0;
          break;
        default:
          computed = 0;
      }

      const existing = await tx.campusMissionProgress.findUnique({
        where: { profileId_missionId: { profileId, missionId: def.id } }
      });

      const effective = Math.max(existing?.progressCurrent ?? 0, computed);
      const targetMet = effective >= def.targetValue;

      await tx.campusMissionProgress.upsert({
        where: { profileId_missionId: { profileId, missionId: def.id } },
        create: {
          profileId,
          missionId: def.id,
          progressCurrent: effective,
          completedAt: targetMet ? new Date() : null,
          rewardClaimedAt: null
        },
        update: {
          progressCurrent: effective,
          ...(targetMet && !existing?.completedAt ? { completedAt: new Date() } : {})
        }
      });

      const row = await tx.campusMissionProgress.findUnique({
        where: { profileId_missionId: { profileId, missionId: def.id } }
      });

      if (!row?.completedAt || row.rewardClaimedAt) continue;

      if (def.xpReward > 0) {
        await awardXpWithTx(tx, profileId, def.xpReward, "CAMPUS_MISSION_REWARD", {
          missionId: def.id
        });
      }
      if (def.badgeId) {
        await unlockBadgeWithTx(tx, profileId, def.badgeId);
      }

      await tx.campusMissionProgress.update({
        where: { profileId_missionId: { profileId, missionId: def.id } },
        data: { rewardClaimedAt: new Date() }
      });

      newlyGrantedRewards.push({
        missionId: def.id,
        xp: def.xpReward,
        badgeCode: def.badgeId
      });
    }

    return { newlyGrantedRewards };
  });
}
