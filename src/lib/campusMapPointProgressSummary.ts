import type { StudentProfile } from "@/lib/studentGamificationStorage";

/** Pastas em src/content/campus/map-points com rewards.json — manter alinhado ao repo (33). */
export const CAMPUS_MAP_POINT_REWARD_SLUG_TOTAL = 33;

export function countMapPointsWithRewardsClaimed(profile: StudentProfile): number {
  return Object.values(profile.mapPointProgressBySlug).filter((e) => Boolean(e.rewardsClaimedAt))
    .length;
}
