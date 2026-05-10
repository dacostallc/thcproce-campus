/**
 * Catálogo MOCK da «Loja do Campus» — compras só com `localStorage`.
 * TODO Prisma: mover preços, stock e proprietário para o servidor (`purchaseCampusStoreItem` vira mutation).
 */

import type { InventoryCategory } from "@/lib/studentGamificationMockCatalog";
import type { StudentAvatarVariant } from "@/lib/studentGamificationStorage";

export type CampusStorePurchasableMeta = {
  id: string;
  title: string;
  subtitle?: string;
  category: InventoryCategory;
  costCredits: number;
  /** Ao equipar, define o preset do avatar simples no mapa. */
  mapsToAvatarVariant?: StudentAvatarVariant;
};

/** IDs prefix `store-mock-` para distinguir de bonus/souvenir. */
export const CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG: Record<string, CampusStorePurchasableMeta> = {
  "store-mock-avatar-student-shell": {
    id: "store-mock-avatar-student-shell",
    title: "Casulo visual · Aluno",
    subtitle: "Equipa o estilo «Aluno».",
    category: "avatars",
    costCredits: 12,
    mapsToAvatarVariant: "student"
  },
  "store-mock-avatar-cult-shell": {
    id: "store-mock-avatar-cult-shell",
    title: "Casulo visual · Cultivador",
    subtitle: "Equipa o estilo «Cultivador».",
    category: "avatars",
    costCredits: 18,
    mapsToAvatarVariant: "cultivator"
  },
  "store-mock-outfit-neverwind": {
    id: "store-mock-outfit-neverwind",
    title: "Capa Neverwind THC",
    subtitle: "Cosmético de torso (preview futuro).",
    category: "outfits",
    costCredits: 16
  },
  "store-mock-acc-chip-holo": {
    id: "store-mock-acc-chip-holo",
    title: "Chip holográfico Ω",
    subtitle: "Slot de acessório de ombro.",
    category: "accessories",
    costCredits: 9
  },
  "store-mock-special-aurora": {
    id: "store-mock-special-aurora",
    title: "Relíquia Aurora Verde",
    subtitle: "Item especial de evento fictício.",
    category: "special_items",
    costCredits: 22
  },
  "store-mock-cert-micro": {
    id: "store-mock-cert-micro",
    title: "Mini diploma THCProce β",
    subtitle: "Certificado coleccionável MOCK.",
    category: "certificates",
    costCredits: 7
  },
  /** Pin comprável (diferente do bonus grátis) para testar duplicados de categoria. */
  "store-mock-campus-lanyard": {
    id: "store-mock-campus-lanyard",
    title: "Cordão campus premium",
    subtitle: "Variante comprável do pin.",
    category: "campus_items",
    costCredits: 11
  }
};

export const CAMPUS_STORE_TAB_ORDER = [
  "avatars",
  "outfits",
  "accessories",
  "course_souvenirs",
  "special_items",
  "certificates"
] as const satisfies readonly InventoryCategory[];

export type CampusStoreTabId = (typeof CAMPUS_STORE_TAB_ORDER)[number];

export const CAMPUS_STORE_TAB_LABELS: Record<CampusStoreTabId, string> = {
  avatars: "Avatares",
  outfits: "Roupas",
  accessories: "Acessórios",
  course_souvenirs: "Souvenirs de curso",
  special_items: "Itens especiais",
  certificates: "Certificados e medalhas"
};

export function campusStoreItemMatchesTab(
  category: InventoryCategory,
  tab: CampusStoreTabId
): boolean {
  if (tab === "special_items") {
    return category === "special_items" || category === "campus_items";
  }
  return category === tab;
}
