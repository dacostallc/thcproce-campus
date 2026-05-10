/**
 * Camada cliente da Loja THCProce Campus — nomes estáveis para futura migração Prisma.
 * TODO Prisma: estas funções devem delegar para mutations servidor + reconciliar inventário;
 * esta implementação só persiste em `studentGamificationStorage` (offline).
 */

import { CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG } from "@/lib/campusStoreMockCatalog";
import { BONUS_INVENTORY_MOCK_CATALOG } from "@/lib/studentGamificationMockCatalog";
import type { InventoryCategory } from "@/lib/studentGamificationMockCatalog";
import {
  SOUVENIR_CATALOG,
  buySouvenir,
  loadStudentProfile,
  saveStudentProfile,
  setEquippedSouvenir,
  levelFromXp,
  type StudentProfile,
  type EquippedCampusStoreSlots
} from "@/lib/studentGamificationStorage";

export type CampusStorePurchaseResult = { ok: true } | { ok: false; error: string };

export type CampusStoreEquipResult = { ok: true } | { ok: false; error: string };

/** TODO Prisma: saldo servidor (`User.campusCredits`) em vez de localStorage só. */
export function getStudentCreditBalance(): number {
  return loadStudentProfile().credits;
}

/** Variante efectiva no mapa HUD — igual a `profile.avatarVariant`, sincronizada ao equipar itens «avatar». */
export function getEffectiveHudAvatarVariant(profile: StudentProfile): StudentProfile["avatarVariant"] {
  return profile.avatarVariant;
}

export function isSouvenirEarnedOrOwned(profile: StudentProfile, id: string): boolean {
  const m = SOUVENIR_CATALOG[id];
  if (!m) return false;
  if (profile.unlockedSouvenirs.includes(id)) return true;
  const level = levelFromXp(profile.xp);
  if (m.freeAtLevel != null && level >= m.freeAtLevel) return true;
  return id === "bone-thcproce" && profile.xp > 0;
}

export function isCampusStoreItemOwned(profile: StudentProfile, itemId: string): boolean {
  if (SOUVENIR_CATALOG[itemId]) {
    return isSouvenirEarnedOrOwned(profile, itemId);
  }
  if (BONUS_INVENTORY_MOCK_CATALOG[itemId]) {
    return profile.bonusInventoryIds.includes(itemId);
  }
  if (CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[itemId]) {
    return profile.purchasedStoreItemIds.includes(itemId);
  }
  return false;
}

/** Posters/sementes Fase 3 são coleccionáveis sem slot de equipamento. */
export function isCampusInventoryItemEquippable(itemId: string): boolean {
  const storeMeta = CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[itemId];
  const bonusMeta = BONUS_INVENTORY_MOCK_CATALOG[itemId];
  if (storeMeta && storeMeta.equippable === false) return false;
  if (bonusMeta && bonusMeta.equippable === false) return false;
  return true;
}

function slotFieldForCategory(
  category: InventoryCategory
): keyof EquippedCampusStoreSlots | "souvenir" {
  switch (category) {
    case "avatars":
      return "avatarItemId";
    case "outfits":
      return "outfitItemId";
    case "accessories":
      return "accessoryItemId";
    case "special_items":
    case "campus_items":
      return "specialItemId";
    case "certificates":
      return "certificateItemId";
    case "course_souvenirs":
      return "souvenir";
    default:
      return "specialItemId";
  }
}

export function purchaseCampusStoreItem(itemId: string): CampusStorePurchaseResult {
  if (SOUVENIR_CATALOG[itemId]) {
    const r = buySouvenir(itemId);
    if (r.ok) return { ok: true };
    return { ok: false, error: r.error ?? "purchase_failed" };
  }

  const meta = CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[itemId];
  if (!meta) return { ok: false, error: "unknown_item" };

  const p = loadStudentProfile();
  if (p.purchasedStoreItemIds.includes(itemId)) return { ok: false, error: "already_owned" };
  if (p.credits < meta.costCredits) return { ok: false, error: "insufficient_credits" };

  saveStudentProfile({
    credits: p.credits - meta.costCredits,
    purchasedStoreItemIds: [...p.purchasedStoreItemIds, itemId]
  });
  return { ok: true };
}

export function equipCampusInventoryItem(itemId: string): CampusStoreEquipResult {
  const p = loadStudentProfile();

  if (SOUVENIR_CATALOG[itemId]) {
    if (!isSouvenirEarnedOrOwned(p, itemId)) return { ok: false, error: "not_owned" };
    setEquippedSouvenir(itemId);
    return { ok: true };
  }

  const storeMeta = CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[itemId];
  const bonusMeta = BONUS_INVENTORY_MOCK_CATALOG[itemId];
  if (!storeMeta && !bonusMeta) {
    return { ok: false, error: "unknown_item" };
  }

  if (!isCampusInventoryItemEquippable(itemId)) {
    return { ok: false, error: "collectible_only" };
  }

  if (!isCampusStoreItemOwned(p, itemId)) {
    return { ok: false, error: "not_owned" };
  }

  const category = storeMeta?.category ?? bonusMeta!.category;
  const slot = slotFieldForCategory(category);
  if (slot === "souvenir") {
    return { ok: false, error: "wrong_kind" };
  }

  const nextSlots: EquippedCampusStoreSlots = {
    ...p.equippedStoreSlots,
    [slot]: itemId
  };

  const patch: Partial<StudentProfile> = { equippedStoreSlots: nextSlots };
  if (category === "avatars" && storeMeta?.mapsToAvatarVariant) {
    patch.avatarVariant = storeMeta.mapsToAvatarVariant;
  }

  saveStudentProfile(patch);
  return { ok: true };
}

export function unequipCampusInventoryItem(itemId: string): CampusStoreEquipResult {
  const p = loadStudentProfile();

  if (SOUVENIR_CATALOG[itemId]) {
    if (p.equippedSouvenir !== itemId) return { ok: false, error: "not_equipped" };
    setEquippedSouvenir(null);
    return { ok: true };
  }

  const storeMeta = CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[itemId];
  const bonusMeta = BONUS_INVENTORY_MOCK_CATALOG[itemId];
  if (!storeMeta && !bonusMeta) {
    return { ok: false, error: "unknown_item" };
  }

  const category = storeMeta?.category ?? bonusMeta!.category;
  const slot = slotFieldForCategory(category);
  if (slot === "souvenir") {
    return { ok: false, error: "wrong_kind" };
  }

  if (p.equippedStoreSlots[slot] !== itemId) {
    return { ok: false, error: "not_equipped" };
  }

  saveStudentProfile({
    equippedStoreSlots: { ...p.equippedStoreSlots, [slot]: null }
  });
  return { ok: true };
}

export function isCampusStoreItemEquipped(profile: StudentProfile, itemId: string): boolean {
  if (SOUVENIR_CATALOG[itemId]) {
    return profile.equippedSouvenir === itemId;
  }
  if (!isCampusInventoryItemEquippable(itemId)) return false;
  const storeMeta = CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[itemId];
  const bonusMeta = BONUS_INVENTORY_MOCK_CATALOG[itemId];
  if (!storeMeta && !bonusMeta) return false;
  const category = storeMeta?.category ?? bonusMeta!.category;
  const slot = slotFieldForCategory(category);
  if (slot === "souvenir") return profile.equippedSouvenir === itemId;
  return profile.equippedStoreSlots[slot] === itemId;
}

export function equipErrorMessagePt(code: string | undefined): string {
  switch (code) {
    case "not_owned":
      return "Item ainda não desbloqueado.";
    case "collectible_only":
      return "Item de coleção — não equipável.";
    case "unknown_item":
      return "Item não reconhecido.";
    case "wrong_kind":
      return "Tipo de item inválido.";
    case "not_equipped":
      return "Não está equipado.";
    default:
      return "Não foi possível aplicar.";
  }
}

export function purchaseErrorMessagePt(code: string | undefined): string {
  switch (code) {
    case "unknown_souvenir":
      return "Souvenir desconhecido.";
    case "already_owned":
      return "Já possui.";
    case "not_purchasable":
      return "Não vendido por créditos.";
    case "insufficient_credits":
      return "Créditos insuficientes.";
    case "unknown_item":
      return "Item não disponível.";
    default:
      return "Compra falhou.";
  }
}
