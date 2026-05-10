/**
 * Persistência local das missões Fase 2 (`localStorage`).
 * Recompensas aplicadas no primeiro cumprimento apenas — não duplica XP/créditos.
 */

import { CAMPUS_MISSIONS_PHASE2_CATALOG } from "@/lib/campusMissionsPhase2Catalog";
import type {
  CampusMissionPhase2Id,
  CampusMissionPhase2Record,
  CampusMissionPhase2UiRow
} from "@/lib/campusMissionsPhase2Types";
import { awardCredits, awardXp, grantBadge, grantBonusInventoryItemIfNeeded } from "@/lib/studentGamificationStorage";

export const CAMPUS_MISSIONS_PHASE2_LS_KEY = "thc_campus_missions_phase2_v1" as const;

export const CAMPUS_MISSIONS_PHASE2_UPDATED_EVENT =
  "thc-campus-missions-phase2-v1-changed" as const;

const SNAP_VERSION = 1 as const;

type StoredBlob = {
  version: typeof SNAP_VERSION;
  missions: Partial<Record<CampusMissionPhase2Id, CampusMissionPhase2Record>>;
};

function emptyBlob(): StoredBlob {
  return { version: SNAP_VERSION, missions: {} };
}

function readBlob(): StoredBlob {
  if (typeof window === "undefined") return emptyBlob();
  try {
    const raw = window.localStorage.getItem(CAMPUS_MISSIONS_PHASE2_LS_KEY);
    if (!raw) return emptyBlob();
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return emptyBlob();
    const o = j as Partial<StoredBlob>;
    if (o.version !== SNAP_VERSION || !o.missions || typeof o.missions !== "object") {
      return emptyBlob();
    }
    return { version: SNAP_VERSION, missions: { ...o.missions } };
  } catch {
    return emptyBlob();
  }
}

function writeBlob(blob: StoredBlob): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CAMPUS_MISSIONS_PHASE2_LS_KEY, JSON.stringify(blob));
  } catch {
    /* noop */
  }
}

function emitPhase2Updated(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new Event(CAMPUS_MISSIONS_PHASE2_UPDATED_EVENT));
  } catch {
    /* noop */
  }
}

export function getCampusMissionPhase2Record(id: CampusMissionPhase2Id): CampusMissionPhase2Record {
  const cur = readBlob().missions[id];
  if (cur?.status === "completed") {
    return {
      status: "completed",
      completedAt: typeof cur.completedAt === "string" ? cur.completedAt : null
    };
  }
  return { status: "pending", completedAt: null };
}

export function isCampusMissionPhase2Completed(id: CampusMissionPhase2Id): boolean {
  return getCampusMissionPhase2Record(id).status === "completed";
}

/**
 * Conclui a missão uma única vez: grava estado, soma XP/créditos e notificação discreta.
 * @returns `true` se acabou de concluir agora.
 */
export function completeCampusMissionPhase2IfNeeded(id: CampusMissionPhase2Id): boolean {
  if (typeof window === "undefined") return false;
  const blob = readBlob();
  const prev = blob.missions[id];
  if (prev?.status === "completed") return false;

  const def = CAMPUS_MISSIONS_PHASE2_CATALOG.find((m) => m.id === id);
  if (!def) return false;

  if (def.rewardBadgeId) grantBadge(def.rewardBadgeId);
  if (def.rewardXp > 0) awardXp(def.rewardXp, `campus_mission_phase2:${id}`);
  if (def.rewardCredits > 0) awardCredits(def.rewardCredits, `campus_mission_phase2:${id}`);
  for (const invId of def.rewardInventoryIds ?? []) {
    grantBonusInventoryItemIfNeeded(invId);
  }

  const completedAt = new Date().toISOString();
  blob.missions[id] = { status: "completed", completedAt };
  writeBlob(blob);
  emitPhase2Updated();
  if (typeof window !== "undefined") {
    void import("@/lib/campusUiSounds").then(({ playCampusMissionCompleteChime }) => {
      playCampusMissionCompleteChime();
    });
    void import("@/stores/liveCampusHudFeedStore").then(({ pushLiveCampusHudNotification }) => {
      pushLiveCampusHudNotification("Missão concluída", 3_800);
    });
  }
  return true;
}

export function listCampusMissionsPhase2Ui(): CampusMissionPhase2UiRow[] {
  const blob = readBlob();
  return CAMPUS_MISSIONS_PHASE2_CATALOG.map((def) => {
    const r = blob.missions[def.id];
    if (r?.status === "completed") {
      return {
        ...def,
        status: "completed",
        completedAt: typeof r.completedAt === "string" ? r.completedAt : null
      };
    }
    return { ...def, status: "pending", completedAt: null };
  });
}

export function clearCampusMissionsPhase2Storage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CAMPUS_MISSIONS_PHASE2_LS_KEY);
  } catch {
    /* noop */
  }
  emitPhase2Updated();
}
