import type {
  CampusMapPointMission,
  CampusMapPointQuiz,
  CampusMapPointRewards
} from "@/lib/campus/campusMapPointBundle.types";
import {
  loadStudentProfile,
  saveStudentProfile,
  SOUVENIR_CATALOG,
  type MapPointProgressEntry,
  type StudentProfile
} from "@/lib/studentGamificationStorage";

export function alignMissionChecklist(mission: CampusMapPointMission, stored?: boolean[]): boolean[] {
  const n = mission.checklist.length;
  if (n === 0) return [];
  if (!stored || stored.length !== n) return Array(n).fill(false);
  return stored.map(Boolean);
}

/** Missão (se existir) totalmente marcada e quiz (se existir) com todas as questões respondidas. */
export function isMapPointBundleComplete(
  mission: CampusMapPointMission | undefined,
  quiz: CampusMapPointQuiz | undefined,
  entry: MapPointProgressEntry
): boolean {
  if (mission && mission.checklist.length > 0) {
    const checks = alignMissionChecklist(mission, entry.missionChecklist);
    if (!checks.every(Boolean)) return false;
  }
  if (quiz) {
    for (const q of quiz.questions) {
      if (!entry.quizByQuestionId?.[q.id]) return false;
    }
  }
  return true;
}

export function persistMissionCheckToggle(
  slug: string,
  mission: CampusMapPointMission,
  index: number
): StudentProfile {
  const cur = loadStudentProfile();
  const prev = cur.mapPointProgressBySlug[slug] ?? {};
  const checks = alignMissionChecklist(mission, prev.missionChecklist);
  if (index < 0 || index >= checks.length) return cur;
  const nextChecks = [...checks];
  nextChecks[index] = !nextChecks[index];
  return saveStudentProfile({
    mapPointProgressBySlug: {
      [slug]: { ...prev, missionChecklist: nextChecks }
    }
  });
}

export function persistMapPointQuizAnswer(
  slug: string,
  questionId: string,
  selectedIndex: number,
  correct: boolean
): StudentProfile {
  const cur = loadStudentProfile();
  const prev = cur.mapPointProgressBySlug[slug] ?? {};
  const quizByQuestionId = { ...(prev.quizByQuestionId ?? {}) };
  quizByQuestionId[questionId] = {
    selectedIndex: Math.max(0, Math.min(3, Math.floor(selectedIndex))),
    correct,
    at: new Date().toISOString()
  };
  return saveStudentProfile({
    mapPointProgressBySlug: {
      [slug]: { ...prev, quizByQuestionId }
    }
  });
}

/**
 * Aplica `rewards.json` uma vez por slug após missão+quiz estarem completos.
 * Idempotente via `rewardsClaimedAt`.
 */
export function tryClaimMapPointBundleRewards(
  slug: string,
  rewards: CampusMapPointRewards | undefined,
  mission: CampusMapPointMission | undefined,
  quiz: CampusMapPointQuiz | undefined
): { profile: StudentProfile; claimed: boolean } {
  const cur = loadStudentProfile();
  const entry = cur.mapPointProgressBySlug[slug] ?? {};
  if (!rewards) return { profile: cur, claimed: false };
  if (entry.rewardsClaimedAt) return { profile: cur, claimed: false };
  if (!isMapPointBundleComplete(mission, quiz, entry)) return { profile: cur, claimed: false };

  const xpGain = Math.max(0, Math.floor(rewards.xp));
  const coinGain = Math.max(0, Math.floor(rewards.greenCoins));
  const gmGain = Math.max(0, Math.floor(rewards.growerMasterProgress));
  const xp = cur.xp + xpGain;
  const credits = cur.credits + coinGain;
  const growerMasterScore = cur.growerMasterScore + gmGain;
  const badgeId = rewards.badge.id.trim().slice(0, 120);
  const badges =
    badgeId && !cur.badges.includes(badgeId) ? [...cur.badges, badgeId] : cur.badges;
  const claimedAt = new Date().toISOString();

  let unlockedSouvenirs = cur.unlockedSouvenirs;
  let souvenirAdded = false;
  if (
    slug === "souvenirs" &&
    SOUVENIR_CATALOG["pin-loja-campus"] &&
    !unlockedSouvenirs.includes("pin-loja-campus")
  ) {
    unlockedSouvenirs = [...unlockedSouvenirs, "pin-loja-campus"];
    souvenirAdded = true;
  }

  const next = saveStudentProfile({
    xp,
    credits,
    growerMasterScore,
    badges,
    unlockedSouvenirs,
    mapPointProgressBySlug: {
      [slug]: {
        ...entry,
        rewardsClaimedAt: claimedAt
      }
    }
  });

  if (typeof window !== "undefined" && next.xp >= 20) {
    void import("@/lib/campusMissionsPhase2Storage").then(({ completeCampusMissionPhase2IfNeeded }) => {
      completeCampusMissionPhase2IfNeeded("campus-p2-xp-twenty");
    });
  }

  void import("@/stores/liveCampusHudFeedStore").then(({ pushLiveCampusHudNotification }) => {
    let msg = `Mapa: +${xpGain} XP · +${coinGain} cr · selo «${rewards.badge.name}»`;
    if (souvenirAdded) {
      msg += ` · souvenir «${SOUVENIR_CATALOG["pin-loja-campus"]?.title ?? "Pin"}»`;
    }
    pushLiveCampusHudNotification(msg);
  });

  return { profile: next, claimed: true };
}

/** Contrato útil para futura sincronização com API (corpo mínimo). */
export type CampusMapProgressSyncPayloadV1 = Pick<
  StudentProfile,
  | "mapPointProgressBySlug"
  | "growerMasterScore"
  | "xp"
  | "credits"
  | "badges"
  | "unlockedSouvenirs"
>;
