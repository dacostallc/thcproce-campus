/**
 * Client-only campus gamification (localStorage). Separate from server `myProgress` —
 * label UI as "Campus offline progress" where both may appear.
 *
 * LS keys:
 * - `thc_student_gamification_v1` — versioned profile blob
 * - `thc_local_watch_awarded_${areaId}_${lessonIndex}` — one-shot XP per lesson open (spec)
 * - `thc_campus_first_visit_awarded_v1` — first campus entry credits (spec)
 * - onboarding (ver `campusOnboardingLs`): `thc_campus_welcome_modal_seen_v1` (fechar/pular bem-vindo ou tour concluído;
 *   não só "Começar tour"), `thc_campus_tour_seen_v1`, `thc_campus_guided_tour_done_v1`,
 *   `thc_campus_tour_nudge_dismissed_v1` · **sessionStorage** `thc_campus_start_here_hide_session_v1` (ver `campusOnboardingLs`)
 */

import type { InventoryCategory } from "@/lib/studentGamificationMockCatalog";
import {
  BONUS_INVENTORY_MOCK_CATALOG,
  DEFAULT_BONUS_INVENTORY_IDS
} from "@/lib/studentGamificationMockCatalog";
import type { AvatarVisualRarity } from "@/lib/studentAvatarVisualMockCatalog";

export const STUDENT_GAMIFICATION_LS_KEY = "thc_student_gamification_v1" as const;

/** Nome inicial do perfil local (Fase 1 gamificação) — migrável para servidor. */
export const DEFAULT_LOCAL_STUDENT_DISPLAY_NAME = "Aluno THC" as const;

export const STUDENT_GAMIFICATION_UPDATED_EVENT =
  "thc-student-gamification-v1-changed" as const;

/** One-shot localStorage flag per area + lesson (spec: `thc_local_watch_awarded_${area}_${idx}`). */
export function watchAwardStorageKey(areaId: string, lessonIndex: number): string {
  return `thc_local_watch_awarded_${areaId}_${lessonIndex}`;
}

/** Award tour XP / badge at most once per browser profile (optional UX guard). */
export const CAMPUS_TOUR_OFFLINE_XP_AWARD_LS_KEY = "thc_local_tour_xp_awarded_v1" as const;

export type StudentAvatarVariant =
  | "visitor"
  | "student"
  | "cultivator"
  | "researcher"
  | "chef";

/** Base + futuras camadas cosméticas persistidas no mesmo perfil local. */
export type StudentAvatarState = {
  baseVariant: StudentAvatarVariant;
  /** IDs de cosméticos equipados (Futuro / Prisma); hoje normalmente vazio. */
  cosmeticLayerIds: string[];
};

/** Visual HUD layer persisted locally — mock IDs from `studentAvatarVisualMockCatalog.ts`. */
export type StudentVisualCosmeticsV1 = {
  rarity: AvatarVisualRarity;
  frameId: string;
  auraId: string;
  badgeVisualId: string;
  hologramFx: string;
};

export type EquippedCampusStoreSlots = {
  avatarItemId: string | null;
  outfitItemId: string | null;
  accessoryItemId: string | null;
  specialItemId: string | null;
  certificateItemId: string | null;
};

/** Local calendar day for mission counters (`YYYY-MM-DD`, device timezone). */
export function getLocalCalendarDayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export type MissionTelemetry = {
  localDayKey: string;
  /** Aulas cuja recompensa de conclusão foi aplicada hoje (contador diário). */
  lessonsMarkedOnLocalDay: number;
  campusEnteredOnceEver: boolean;
  storeEnteredOnceEver: boolean;
  /** Painel HUD «Missões» foi aberto ao menos uma vez neste navegador. */
  missionsPanelOpenedOnceEver: boolean;
};

export type StudentProfile = {
  displayName: string;
  avatarVariant: StudentAvatarVariant;
  /** Reservado para skins, acessórios e roupas quando o catálogo servidor existir. */
  avatarState: StudentAvatarState;
  /** Molduras / aura holográfica mock (só cliente). TODO Prisma. */
  visualCosmeticsV1: StudentVisualCosmeticsV1;
  /** Denormalized from `xp` on each save — keep in sync in storage helpers. */
  level: number;
  xp: number;
  credits: number;
  badges: string[];
  unlockedSouvenirs: string[];
  equippedSouvenir: string | null;
  /**
   * Itens MOCK de inventário (prefixo `mock-bonus-`).
   * TODO Prisma: unificar com inventário real; ver `studentGamificationMockCatalog.ts`.
   */
  bonusInventoryIds: string[];
  /**
   * Compras na loja MOCK (`store-mock-*`). TODO Prisma: `StudentPurchase` / inventário servidor.
   */
  purchasedStoreItemIds: string[];
  /** Slots cosméticos equipados (fora de souvenirs de curso). */
  equippedStoreSlots: EquippedCampusStoreSlots;
  /** Missões MOCK: recompensas já resgatadas (ids do catálogo local). */
  claimedMissionIds: string[];
  /** Telemetria leve para missões MOCK (sem servidor). */
  missionTelemetry: MissionTelemetry;
  /**
   * Reputação MOCK no browser — servidor ignorado.
   * TODO Prisma: `StudentCommunityStats` ou campos derivados.
   */
  helpfulPoints: number;
  communityRank: number;
  mentorLevel: number;
};

type StoredV1 = { version: 1 } & StudentProfile;

const STORAGE_VERSION = 1 as const;

/** Simple curve: each level needs +120 XP over the previous threshold (triangular numbers × 60). */
export function xpRequiredCumulativeForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return 60 * n * (n + 1);
}

/** Minimum XP to be considered `level` (1-indexed). */
export function xpFloorForLevel(level: number): number {
  return xpRequiredCumulativeForLevel(level);
}

/** Current level from total XP (minimum 1). */
export function levelFromXp(xp: number): number {
  const x = Math.max(0, Math.floor(xp));
  let level = 1;
  while (x >= xpRequiredCumulativeForLevel(level + 1)) {
    level++;
    if (level > 9999) break;
  }
  return level;
}

/** XP still needed to reach the next level (0 if already past formula cap sanity). */
export function xpToNextLevel(xp: number): number {
  const lv = levelFromXp(xp);
  const nextFloor = xpRequiredCumulativeForLevel(lv + 1);
  return Math.max(0, nextFloor - xp);
}

/** Alias — XP distance to next level from current total. */
export function xpToLevel(currentXp: number): number {
  return xpToNextLevel(currentXp);
}

export type SouvenirMeta = {
  id: string;
  title: string;
  rarity?: string;
  category: InventoryCategory;
  /** Credits to unlock via `buySouvenir`. Ignored if freeByLevel met first. */
  costCredits: number;
  /** Auto-unlock when level reaches this value (inclusive). */
  freeAtLevel: number | null;
};

/**
 * Souvenir unlock policy (deterministic):
 * - bone-thcproce: first XP gain auto-unlocks (see `awardXp`).
 * - Others: spend `costCredits` via `buySouvenir`, OR reach `freeAtLevel` (checked after XP changes).
 */
export const SOUVENIR_CATALOG: Record<string, SouvenirMeta> = {
  "bone-thcproce": {
    id: "bone-thcproce",
    title: "Boné THCProce",
    rarity: "Comum",
    category: "course_souvenirs",
    /** No auto milestone — unlocked on first XP gain (`xp > 0`) in storage helpers. */
    costCredits: 0,
    freeAtLevel: null
  },
  regador: {
    id: "regador",
    title: "Regador",
    rarity: "Comum",
    category: "course_souvenirs",
    costCredits: 12,
    freeAtLevel: 4
  },
  "livro-cultivo": {
    id: "livro-cultivo",
    title: "Livro de Cultivo",
    rarity: "Incomum",
    category: "course_souvenirs",
    costCredits: 18,
    freeAtLevel: 6
  },
  "gota-resina": {
    id: "gota-resina",
    title: "Gota de Resina",
    rarity: "Raro",
    category: "course_souvenirs",
    costCredits: 22,
    freeAtLevel: 8
  },
  "jaleco-medicinal": {
    id: "jaleco-medicinal",
    title: "Jaleco Medicinal",
    rarity: "Épico",
    category: "course_souvenirs",
    costCredits: 30,
    freeAtLevel: 11
  }
};

const DEFAULT_EQUIPPED_SLOTS: EquippedCampusStoreSlots = {
  avatarItemId: null,
  outfitItemId: null,
  accessoryItemId: null,
  specialItemId: null,
  certificateItemId: null
};

const DEFAULT_MISSION_TELEMETRY: MissionTelemetry = {
  localDayKey: "",
  lessonsMarkedOnLocalDay: 0,
  campusEnteredOnceEver: false,
  storeEnteredOnceEver: false,
  missionsPanelOpenedOnceEver: false
};

const DEFAULT_VISUAL_COSMETICS_V1: StudentVisualCosmeticsV1 = {
  rarity: "common",
  frameId: "frame-none",
  auraId: "aura-none",
  badgeVisualId: "badge-vis-none",
  hologramFx: "holofx-off"
};

const DEFAULT_PROFILE: StudentProfile = {
  displayName: DEFAULT_LOCAL_STUDENT_DISPLAY_NAME,
  avatarVariant: "student",
  avatarState: { baseVariant: "student", cosmeticLayerIds: [] },
  visualCosmeticsV1: { ...DEFAULT_VISUAL_COSMETICS_V1 },
  level: 1,
  xp: 0,
  credits: 0,
  badges: [],
  unlockedSouvenirs: [],
  equippedSouvenir: null,
  bonusInventoryIds: [...DEFAULT_BONUS_INVENTORY_IDS],
  purchasedStoreItemIds: [],
  equippedStoreSlots: { ...DEFAULT_EQUIPPED_SLOTS },
  claimedMissionIds: [],
  missionTelemetry: { ...DEFAULT_MISSION_TELEMETRY },
  helpfulPoints: 0,
  communityRank: 0,
  mentorLevel: 0
};

function emitUpdated(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new Event(STUDENT_GAMIFICATION_UPDATED_EVENT));
  } catch {
    /* noop */
  }
}

/** Exposed for UI: debug reset control only in development or when explicitly enabled. */
export function isStudentProfileDebugResetEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEBUG_PROFILE_RESET === "true"
  );
}

function parseMissionTelemetry(raw: unknown, calendarDay: string): MissionTelemetry {
  const base: MissionTelemetry = { ...DEFAULT_MISSION_TELEMETRY, localDayKey: calendarDay };
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...base, lessonsMarkedOnLocalDay: 0 };
  }
  const t = raw as Record<string, unknown>;
  const lessons =
    typeof t.lessonsMarkedOnLocalDay === "number" && Number.isFinite(t.lessonsMarkedOnLocalDay)
      ? Math.max(0, Math.floor(t.lessonsMarkedOnLocalDay))
      : 0;
  const storedDay =
    typeof t.localDayKey === "string" && /^\d{4}-\d{2}-\d{2}$/.test(t.localDayKey)
      ? t.localDayKey
      : "";
  const campusEnteredOnceEver = t.campusEnteredOnceEver === true;
  const storeEnteredOnceEver = t.storeEnteredOnceEver === true;
  const missionsPanelOpenedOnceEver =
    typeof t.missionsPanelOpenedOnceEver === "boolean" ? t.missionsPanelOpenedOnceEver : false;
  const rolledLessons = storedDay === calendarDay ? lessons : 0;
  return {
    localDayKey: calendarDay,
    lessonsMarkedOnLocalDay: rolledLessons,
    campusEnteredOnceEver,
    storeEnteredOnceEver,
    missionsPanelOpenedOnceEver
  };
}

function normalizeProfile(raw: unknown): StudentProfile {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_PROFILE };
  const o = raw as Record<string, unknown>;
  const calendarDay = getLocalCalendarDayKey();
  const avatarVariant = (["visitor", "student", "cultivator", "researcher", "chef"] as const).includes(
    o.avatarVariant as StudentAvatarVariant
  )
    ? (o.avatarVariant as StudentAvatarVariant)
    : DEFAULT_PROFILE.avatarVariant;
  const xp = typeof o.xp === "number" && Number.isFinite(o.xp) ? Math.max(0, Math.floor(o.xp)) : 0;
  const credits =
    typeof o.credits === "number" && Number.isFinite(o.credits)
      ? Math.max(0, Math.floor(o.credits))
      : 0;
  const displayName =
    typeof o.displayName === "string" && o.displayName.trim()
      ? o.displayName.trim().slice(0, 80)
      : DEFAULT_PROFILE.displayName;
  const badges = Array.isArray(o.badges)
    ? o.badges.filter((x): x is string => typeof x === "string").slice(0, 64)
    : [];
  const unlockedSouvenirs = Array.isArray(o.unlockedSouvenirs)
    ? o.unlockedSouvenirs.filter((x): x is string => typeof x === "string").slice(0, 64)
    : [];
  const equippedSouvenir =
    o.equippedSouvenir === null
      ? null
      : typeof o.equippedSouvenir === "string"
        ? o.equippedSouvenir
        : null;

  const rawState = o.avatarState;
  let cosmeticLayerIds: string[] = [];
  if (rawState && typeof rawState === "object" && !Array.isArray(rawState)) {
    const cl = (rawState as Record<string, unknown>).cosmeticLayerIds;
    if (Array.isArray(cl)) {
      cosmeticLayerIds = cl.filter((x): x is string => typeof x === "string").slice(0, 32);
    }
  }
  const avatarState: StudentAvatarState = {
    baseVariant: avatarVariant,
    cosmeticLayerIds
  };

  const bonusRaw = o.bonusInventoryIds;
  let bonusInventoryIds: string[];
  if (bonusRaw === undefined) {
    bonusInventoryIds = [...DEFAULT_BONUS_INVENTORY_IDS];
  } else if (Array.isArray(bonusRaw)) {
    bonusInventoryIds = [...new Set(bonusRaw.filter((x): x is string => typeof x === "string").slice(0, 64))].filter(
      (id) => Boolean(BONUS_INVENTORY_MOCK_CATALOG[id])
    );
  } else {
    bonusInventoryIds = [...DEFAULT_BONUS_INVENTORY_IDS];
  }

  const purchasedRaw = o.purchasedStoreItemIds;
  const purchasedStoreItemIds = Array.isArray(purchasedRaw)
    ? [...new Set(purchasedRaw.filter((x): x is string => typeof x === "string").slice(0, 96))]
    : [];

  const slotsRaw = o.equippedStoreSlots;
  let equippedStoreSlots: EquippedCampusStoreSlots = { ...DEFAULT_EQUIPPED_SLOTS };
  if (slotsRaw && typeof slotsRaw === "object" && !Array.isArray(slotsRaw)) {
    const s = slotsRaw as Record<string, unknown>;
    const pick = (k: keyof EquippedCampusStoreSlots): string | null => {
      const v = s[k];
      if (v === null) return null;
      if (typeof v === "string" && v.trim()) return v.trim().slice(0, 80);
      return null;
    };
    equippedStoreSlots = {
      avatarItemId: pick("avatarItemId"),
      outfitItemId: pick("outfitItemId"),
      accessoryItemId: pick("accessoryItemId"),
      specialItemId: pick("specialItemId"),
      certificateItemId: pick("certificateItemId")
    };
  }

  const claimedRaw = o.claimedMissionIds;
  const claimedMissionIds = Array.isArray(claimedRaw)
    ? [...new Set(claimedRaw.filter((x): x is string => typeof x === "string").slice(0, 64))]
    : [];

  const missionTelemetry = parseMissionTelemetry(o.missionTelemetry, calendarDay);

  const helpPts =
    typeof o.helpfulPoints === "number" && Number.isFinite(o.helpfulPoints)
      ? Math.max(0, Math.floor(o.helpfulPoints))
      : DEFAULT_PROFILE.helpfulPoints;
  const commRank =
    typeof o.communityRank === "number" && Number.isFinite(o.communityRank)
      ? Math.max(0, Math.floor(o.communityRank))
      : DEFAULT_PROFILE.communityRank;
  const mentorLv =
    typeof o.mentorLevel === "number" && Number.isFinite(o.mentorLevel)
      ? Math.max(0, Math.floor(o.mentorLevel))
      : DEFAULT_PROFILE.mentorLevel;

  let visualCosmeticsV1: StudentVisualCosmeticsV1 = {
    ...DEFAULT_VISUAL_COSMETICS_V1
  };
  const rawVis = o.visualCosmeticsV1;
  if (rawVis && typeof rawVis === "object" && !Array.isArray(rawVis)) {
    const vc = rawVis as Record<string, unknown>;
    const rarityPool = ["common", "uncommon", "rare", "epic", "legendary"] as const;
    const rarity = rarityPool.includes(vc.rarity as AvatarVisualRarity)
      ? (vc.rarity as AvatarVisualRarity)
      : DEFAULT_VISUAL_COSMETICS_V1.rarity;
    const pickStr = (k: keyof StudentVisualCosmeticsV1): string => {
      const v = vc[k];
      return typeof v === "string" && v.trim()
        ? v.trim().slice(0, 64)
        : DEFAULT_VISUAL_COSMETICS_V1[k];
    };
    visualCosmeticsV1 = {
      rarity,
      frameId: pickStr("frameId"),
      auraId: pickStr("auraId"),
      badgeVisualId: pickStr("badgeVisualId"),
      hologramFx: pickStr("hologramFx")
    };
  }

  const level = levelFromXp(xp);
  let mergedSouvenirs = [...new Set(unlockedSouvenirs)];
  mergedSouvenirs = applyFreeSouvenirsForLevel(mergedSouvenirs, level);
  if (xp > 0 && !mergedSouvenirs.includes("bone-thcproce")) {
    mergedSouvenirs.push("bone-thcproce");
  }
  return {
    displayName,
    avatarVariant,
    avatarState,
    visualCosmeticsV1,
    level,
    xp,
    credits,
    badges,
    unlockedSouvenirs: mergedSouvenirs,
    equippedSouvenir:
      equippedSouvenir && mergedSouvenirs.includes(equippedSouvenir) ? equippedSouvenir : null,
    bonusInventoryIds,
    purchasedStoreItemIds,
    equippedStoreSlots,
    claimedMissionIds,
    missionTelemetry,
    helpfulPoints: helpPts,
    communityRank: commRank,
    mentorLevel: mentorLv
  };
}

function applyFreeSouvenirsForLevel(unlocked: string[], level: number): string[] {
  const set = new Set(unlocked);
  for (const meta of Object.values(SOUVENIR_CATALOG)) {
    if (meta.freeAtLevel != null && level >= meta.freeAtLevel) {
      set.add(meta.id);
    }
  }
  return [...set];
}

/**
 * Estado inicial alinhado com `loadStudentProfile()` quando `window` está indisponível (SSR).
 * Usar como `useState` inicial no cliente para a primeira pintura coincidir com o HTML do servidor.
 */
export function studentProfileHydrationSeed(): StudentProfile {
  return { ...DEFAULT_PROFILE };
}

/**
 * Placeholder estável para `/campus/perfil` (e inventário no modal) antes de `useClientHydrated`.
 * Sem XP/créditos/itens/badges persistidos — evita mismatch com SSR quando o cliente lê LS indirectamente
 * (ex.: `computeLocalCoursePctFromMarks` na lista de cursos).
 */
export function studentProfilePerfilHydrationPlaceholder(): StudentProfile {
  const seed = studentProfileHydrationSeed();
  return {
    ...seed,
    xp: 0,
    credits: 0,
    level: 1,
    badges: [],
    unlockedSouvenirs: [],
    equippedSouvenir: null,
    bonusInventoryIds: [],
    purchasedStoreItemIds: [],
    /** Slots só aparecem após ler LS — placeholder igual ao seed SSR para texto estável. */
    equippedStoreSlots: { ...seed.equippedStoreSlots },
    helpfulPoints: 0,
    communityRank: 0,
    mentorLevel: 0
  };
}

export function loadStudentProfile(): StudentProfile {
  if (typeof window === "undefined") return studentProfileHydrationSeed();
  try {
    const raw = JSON.parse(window.localStorage.getItem(STUDENT_GAMIFICATION_LS_KEY) ?? "null") as unknown;
    if (!raw || typeof raw !== "object") return normalizeProfile({ ...DEFAULT_PROFILE });
    const o = raw as Record<string, unknown> & Partial<StoredV1>;
    const { version: _version, ...rest } = o;
    void _version;
    const merged: Record<string, unknown> = { ...DEFAULT_PROFILE, ...rest };
    return normalizeProfile(merged);
  } catch {
    return normalizeProfile({ ...DEFAULT_PROFILE });
  }
}

export function saveStudentProfile(patch: Partial<StudentProfile>): StudentProfile {
  if (typeof window === "undefined") return { ...DEFAULT_PROFILE };
  const cur = loadStudentProfile();
  const mergedTelemetry: MissionTelemetry =
    patch.missionTelemetry != null
      ? { ...cur.missionTelemetry, ...patch.missionTelemetry }
      : cur.missionTelemetry;
  const mergedCosmetics =
    patch.visualCosmeticsV1 != null
      ? { ...cur.visualCosmeticsV1, ...patch.visualCosmeticsV1 }
      : cur.visualCosmeticsV1;

  const next: StudentProfile = normalizeProfile({
    ...cur,
    ...patch,
    badges: patch.badges ?? cur.badges,
    unlockedSouvenirs: patch.unlockedSouvenirs ?? cur.unlockedSouvenirs,
    bonusInventoryIds: patch.bonusInventoryIds ?? cur.bonusInventoryIds,
    purchasedStoreItemIds: patch.purchasedStoreItemIds ?? cur.purchasedStoreItemIds,
    equippedStoreSlots: patch.equippedStoreSlots
      ? { ...cur.equippedStoreSlots, ...patch.equippedStoreSlots }
      : cur.equippedStoreSlots,
    avatarState: patch.avatarState ?? cur.avatarState,
    avatarVariant: patch.avatarVariant ?? cur.avatarVariant,
    visualCosmeticsV1: mergedCosmetics,
    helpfulPoints:
      patch.helpfulPoints !== undefined && patch.helpfulPoints !== null
        ? patch.helpfulPoints
        : cur.helpfulPoints,
    communityRank:
      patch.communityRank !== undefined && patch.communityRank !== null
        ? patch.communityRank
        : cur.communityRank,
    mentorLevel:
      patch.mentorLevel !== undefined && patch.mentorLevel !== null ? patch.mentorLevel : cur.mentorLevel,
    claimedMissionIds: patch.claimedMissionIds ?? cur.claimedMissionIds,
    missionTelemetry: mergedTelemetry
  });
  next.level = levelFromXp(next.xp);
  next.unlockedSouvenirs = applyFreeSouvenirsForLevel(next.unlockedSouvenirs, next.level);
  if (next.xp > 0 && !next.unlockedSouvenirs.includes("bone-thcproce")) {
    next.unlockedSouvenirs = [...next.unlockedSouvenirs, "bone-thcproce"];
  }
  if (
    next.equippedSouvenir &&
    !next.unlockedSouvenirs.includes(next.equippedSouvenir)
  ) {
    next.equippedSouvenir = null;
  }
  const blob: StoredV1 = { version: STORAGE_VERSION, ...next };
  try {
    window.localStorage.setItem(STUDENT_GAMIFICATION_LS_KEY, JSON.stringify(blob));
  } catch {
    /* noop */
  }
  emitUpdated();
  return next;
}

export function resetStudentProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STUDENT_GAMIFICATION_LS_KEY);
  } catch {
    /* noop */
  }
  emitUpdated();
}

export function awardXp(amount: number, _reason?: string): StudentProfile {
  const p = loadStudentProfile();
  const xp = p.xp + Math.max(0, Math.floor(amount));
  const level = levelFromXp(xp);
  let unlocked = [...p.unlockedSouvenirs];
  if (amount > 0 && !unlocked.includes("bone-thcproce")) {
    unlocked.push("bone-thcproce");
  }
  unlocked = applyFreeSouvenirsForLevel(unlocked, level);
  const next = saveStudentProfile({ xp, level, unlockedSouvenirs: unlocked });
  if (typeof window !== "undefined" && next.xp >= 20) {
    void import("@/lib/campusMissionsPhase2Storage").then(({ completeCampusMissionPhase2IfNeeded }) => {
      completeCampusMissionPhase2IfNeeded("campus-p2-xp-twenty");
    });
  }
  return next;
}

export function awardCredits(amount: number, _reason?: string): StudentProfile {
  const p = loadStudentProfile();
  const credits = p.credits + Math.max(0, Math.floor(amount));
  return saveStudentProfile({ credits });
}

/** Ajusta créditos por delta (positivo ou negativo), sem saldo negativo — ex.: quiz na aula. */
export function adjustCreditsByWithApplied(
  delta: number,
  _reason?: string
): { profile: StudentProfile; appliedDelta: number } {
  const p = loadStudentProfile();
  const truncated = Math.trunc(delta);
  const next = Math.max(0, p.credits + truncated);
  const appliedDelta = next - p.credits;
  return { profile: saveStudentProfile({ credits: next }), appliedDelta };
}

export function adjustCreditsBy(delta: number, reason?: string): StudentProfile {
  return adjustCreditsByWithApplied(delta, reason).profile;
}

export function grantBadge(id: string): StudentProfile {
  const p = loadStudentProfile();
  if (p.badges.includes(id)) return p;
  return saveStudentProfile({ badges: [...p.badges, id] });
}

/**
 * Inventário MOCK (`bonusInventoryIds`) — uma vez por `itemId`; migrável para Prisma `StudentCollectible`.
 */
export function grantBonusInventoryItemIfNeeded(itemId: string): boolean {
  if (typeof window === "undefined") return false;
  if (!BONUS_INVENTORY_MOCK_CATALOG[itemId]) return false;
  const p = loadStudentProfile();
  if (p.bonusInventoryIds.includes(itemId)) return false;
  saveStudentProfile({ bonusInventoryIds: [...p.bonusInventoryIds, itemId] });
  return true;
}

export function unlockSouvenir(id: string): StudentProfile {
  const p = loadStudentProfile();
  if (!SOUVENIR_CATALOG[id]) return p;
  if (p.unlockedSouvenirs.includes(id)) return p;
  const label = SOUVENIR_CATALOG[id]?.title ?? id;
  const next = saveStudentProfile({ unlockedSouvenirs: [...p.unlockedSouvenirs, id] });
  if (typeof window !== "undefined") {
    void import("@/stores/liveCampusHudFeedStore").then(({ pushLiveCampusHudNotification }) => {
      pushLiveCampusHudNotification(`Souvenir desbloqueado: ${label}`);
    });
  }
  return next;
}

export function setEquippedSouvenir(id: string | null): StudentProfile {
  const p = loadStudentProfile();
  if (id != null && !p.unlockedSouvenirs.includes(id)) return p;
  return saveStudentProfile({ equippedSouvenir: id });
}

/** Spend credits to unlock a souvenir not yet owned (level-free path already handled elsewhere). */
export function buySouvenir(id: string): { ok: boolean; error?: string } {
  const meta = SOUVENIR_CATALOG[id];
  if (!meta) return { ok: false, error: "unknown_souvenir" };
  const p = loadStudentProfile();
  if (p.unlockedSouvenirs.includes(id)) return { ok: false, error: "already_owned" };
  if (meta.costCredits <= 0) return { ok: false, error: "not_purchasable" };
  if (p.credits < meta.costCredits) return { ok: false, error: "insufficient_credits" };
  saveStudentProfile({
    credits: p.credits - meta.costCredits,
    unlockedSouvenirs: [...p.unlockedSouvenirs, id]
  });
  return { ok: true };
}

/** First campus map visit — idempotent via dedicated LS flag (spec). */
export const CAMPUS_FIRST_VISIT_AWARD_LS_KEY = "thc_campus_first_visit_awarded_v1" as const;

/** Completing the guided tour — XP/badge at most once per browser storage (UX guard). */
export function grantTourOfflineRewardsIfNeeded(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(CAMPUS_TOUR_OFFLINE_XP_AWARD_LS_KEY) === "1") return;
    window.localStorage.setItem(CAMPUS_TOUR_OFFLINE_XP_AWARD_LS_KEY, "1");
  } catch {
    return;
  }
  awardXp(15, "guided_tour");
  grantBadge("tour_guide");
}

export function grantFirstCampusVisitCreditsIfNeeded(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(CAMPUS_FIRST_VISIT_AWARD_LS_KEY) === "1") return;
    window.localStorage.setItem(CAMPUS_FIRST_VISIT_AWARD_LS_KEY, "1");
  } catch {
    return;
  }
  awardCredits(5, "first_campus_visit");
}
