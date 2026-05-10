/**
 * API cliente para missões MOCK — usar apenas em componentes/paths client-side (`"use client"`).
 */

import { CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG } from "@/lib/campusStoreMockCatalog";
import {
  awardCredits,
  awardXp,
  loadStudentProfile,
  saveStudentProfile,
  SOUVENIR_CATALOG,
  unlockSouvenir
} from "@/lib/studentGamificationStorage";
import { BONUS_INVENTORY_MOCK_CATALOG } from "@/lib/studentGamificationMockCatalog";
import {
  markMissionCampusEntered,
  markMissionStoreEntered,
  bumpMissionLessonMarkedOnce
} from "@/lib/studentMissionsTelemetry";
import {
  computeStudentMockMissionProgressMap,
  getStudentMissionMockDef,
  STUDENT_MISSIONS_MOCK_CATALOG,
  type MissionProgressSlice,
  type StudentMissionMockDef
} from "@/lib/studentMissionsMockCatalog";
import { useMissionRewardToastStore } from "@/stores/missionRewardToastStore";

export type StudentMissionUi = StudentMissionMockDef &
  MissionProgressSlice & { claimed: boolean };

export { bumpMissionLessonMarkedOnce, markMissionCampusEntered, markMissionStoreEntered };

export function getStudentMissions(): StudentMissionUi[] {
  const profile = loadStudentProfile();
  const progress = computeStudentMockMissionProgressMap(profile);
  const claimed = new Set(profile.claimedMissionIds);
  return STUDENT_MISSIONS_MOCK_CATALOG.map((m) => {
    const slice = progress[m.id] ?? { progressCurrent: 0, target: m.target, completed: false };
    return { ...m, ...slice, claimed: claimed.has(m.id) };
  });
}

export function getMissionProgress(id: string): MissionProgressSlice | null {
  const profile = loadStudentProfile();
  const progress = computeStudentMockMissionProgressMap(profile);
  return progress[id] ?? null;
}

export function isMissionCompleted(id: string): boolean {
  return getMissionProgress(id)?.completed === true;
}

export function isMissionClaimed(id: string): boolean {
  return loadStudentProfile().claimedMissionIds.includes(id);
}

function grantMissionRewardItem(itemId: string): { ok: boolean; label?: string } {
  if (SOUVENIR_CATALOG[itemId]) {
    const before = loadStudentProfile().unlockedSouvenirs;
    unlockSouvenir(itemId);
    const after = loadStudentProfile().unlockedSouvenirs;
    const label = SOUVENIR_CATALOG[itemId]?.title;
    return { ok: after.length > before.length || before.includes(itemId), label };
  }
  if (itemId.startsWith("store-mock-")) {
    if (!CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[itemId]) return { ok: false };
    const p = loadStudentProfile();
    if (p.purchasedStoreItemIds.includes(itemId)) {
      return { ok: true, label: CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[itemId]?.title };
    }
    saveStudentProfile({
      purchasedStoreItemIds: [...p.purchasedStoreItemIds, itemId]
    });
    return { ok: true, label: CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[itemId]?.title };
  }
  if (itemId.startsWith("mock-bonus-")) {
    if (!BONUS_INVENTORY_MOCK_CATALOG[itemId]) return { ok: false };
    const p = loadStudentProfile();
    if (p.bonusInventoryIds.includes(itemId)) {
      return { ok: true, label: BONUS_INVENTORY_MOCK_CATALOG[itemId]?.title };
    }
    saveStudentProfile({
      bonusInventoryIds: [...p.bonusInventoryIds, itemId]
    });
    return { ok: true, label: BONUS_INVENTORY_MOCK_CATALOG[itemId]?.title };
  }
  return { ok: false };
}

export function claimMissionReward(id: string): {
  ok: boolean;
  error?: string;
  payload?: { xp: number; credits: number; itemLabel?: string };
} {
  if (typeof window === "undefined") {
    return { ok: false, error: "client_only" };
  }
  const meta = getStudentMissionMockDef(id);
  if (!meta) return { ok: false, error: "unknown_mission" };
  const profile = loadStudentProfile();
  if (profile.claimedMissionIds.includes(id)) {
    return { ok: false, error: "already_claimed" };
  }
  if (!isMissionCompleted(id)) {
    return { ok: false, error: "not_completed" };
  }

  let itemLabel: string | undefined;
  if (meta.rewardXp > 0) awardXp(meta.rewardXp, `mission_claim:${id}`);
  if (meta.rewardCredits > 0) awardCredits(meta.rewardCredits, `mission_claim:${id}`);
  if (meta.rewardItemId) {
    const g = grantMissionRewardItem(meta.rewardItemId);
    if (g.label) itemLabel = g.label;
    if (!g.ok) {
      /* não bloqueia XP/créditos já aplicados; item inválido ignora-se */
    }
  }

  const fresh = loadStudentProfile();
  saveStudentProfile({
    claimedMissionIds: fresh.claimedMissionIds.includes(id)
      ? fresh.claimedMissionIds
      : [...fresh.claimedMissionIds, id]
  });

  const payload = {
    xp: meta.rewardXp,
    credits: meta.rewardCredits,
    itemLabel
  };
  useMissionRewardToastStore.getState().showMissionRewardToast({
    missionTitle: meta.title,
    ...payload
  });

  return { ok: true, payload };
}
