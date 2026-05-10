/**
 * Academic-style titles derived from offline campus profile (XP thresholds).
 * TODO Prisma: replace with authoritative server title fields when syncing gamification.
 */
import type { StudentProfile } from "@/lib/studentGamificationStorage";

export type StudentTitleEntry = {
  id: string;
  label: string;
  /** Minimum total XP inclusive for this bracket (ordering low → high). */
  minXp: number;
};

/** Ordered thresholds — evaluated from highest eligible minXp downward. */
export const STUDENT_TITLE_CATALOG: readonly StudentTitleEntry[] = [
  { id: "veteran_thcproce", label: "Veterano THCProce", minXp: 3_600 },
  { id: "cannabis_scientist", label: "Cientista Cannábico", minXp: 2_040 },
  { id: "hashmaker_master", label: "Mestre Hashmaker", minXp: 1_080 },
  { id: "extractor", label: "Extrator", minXp: 480 },
  { id: "cultivator", label: "Cultivador", minXp: 120 },
  { id: "beginner", label: "Iniciante", minXp: 0 }
] as const;

export function getStudentTitleForProfile(profile: Pick<StudentProfile, "xp">): {
  id: string;
  label: string;
} {
  const xp = typeof profile.xp === "number" && Number.isFinite(profile.xp) ? Math.max(0, Math.floor(profile.xp)) : 0;
  for (const row of STUDENT_TITLE_CATALOG) {
    if (xp >= row.minXp) return { id: row.id, label: row.label };
  }
  const fallback = STUDENT_TITLE_CATALOG[STUDENT_TITLE_CATALOG.length - 1];
  return { id: fallback.id, label: fallback.label };
}
