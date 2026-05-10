/**
 * MOCK ONLY — coleção offline de itens por categoria.
 * TODO Prisma: substituir por tabelas `StudentInventory`, `CosmeticCatalog`, etc.,
 * mantendo estas categorias ou um mapa servidor → UI.
 */

export type InventoryCategory =
  | "avatars"
  | "outfits"
  | "accessories"
  | "certificates"
  | "campus_items"
  | "special_items"
  | "course_souvenirs"
  /** Fase 3 — coleccionáveis (sem slot de equipamento por defeito). */
  | "posters"
  /** Fase 3 — sementes fictícias / coleccionáveis educativos. */
  | "special_seeds";

export type BonusInventoryMeta = {
  id: string;
  title: string;
  subtitle?: string;
  category: InventoryCategory;
  /** Se `false`, só aparece no inventário (sem equipar slot). Predefinição: equipável. */
  equippable?: boolean;
};

/**
 * IDs começam com `mock-bonus-` para não colidir com souvenirs reais nem futuros IDs Prisma.
 */
export const BONUS_INVENTORY_MOCK_CATALOG: Record<string, BonusInventoryMeta> = {
  "mock-bonus-avatar-frame": {
    id: "mock-bonus-avatar-frame",
    title: "Moldura holográfica β",
    subtitle: "Futuro: aplicar sobre o avatar.",
    category: "avatars"
  },
  "mock-bonus-outfit-labcoat": {
    id: "mock-bonus-outfit-labcoat",
    title: "Sobrepeliz laboratório",
    subtitle: "Visual técnico (demo).",
    category: "outfits"
  },
  "mock-bonus-acc-vis": {
    id: "mock-bonus-acc-vis",
    title: "Visor de campo",
    subtitle: "Futuro slot de acessório.",
    category: "accessories"
  },
  "mock-bonus-cert-welcome": {
    id: "mock-bonus-cert-welcome",
    title: "Certificado de boas-vindas",
    subtitle: "Emitido apenas no modo demo local.",
    category: "certificates"
  },
  "mock-bonus-campus-pin": {
    id: "mock-bonus-campus-pin",
    title: "Pin do mapa THCProce",
    subtitle: "Colecionável de campus.",
    category: "campus_items"
  },
  "mock-bonus-medal-seed": {
    id: "mock-bonus-medal-seed",
    title: "Medalha semente (demo)",
    subtitle: "Reconhecimento simbólico offline.",
    category: "certificates"
  },
  /** Fase 3 — drops de missão (IDs estáveis para migração Prisma). */
  "p3-drop-campus-map-mini": {
    id: "p3-drop-campus-map-mini",
    title: "Mini mapa do campus",
    subtitle: "Recompensa de missão — primeira visita.",
    category: "posters",
    equippable: false
  },
  "p3-drop-seed-starter-pack": {
    id: "p3-drop-seed-starter-pack",
    title: "Pack sementes THCProce · demo",
    subtitle: "Recompensa de missão — três aulas completas.",
    category: "special_seeds",
    equippable: false
  },
  /** Certificado local ao marcar todas as aulas de uma área (Cannabis 101). */
  "p3-cert-cannabis101-complete": {
    id: "p3-cert-cannabis101-complete",
    title: "Certificado · Cannabis 101 (local)",
    subtitle: "Todos os episódios marcados neste dispositivo.",
    category: "certificates"
  }
};

/** Itens MOCK desbloqueados por defeito ao migrar perfil ou criar conta local nova. */
export const DEFAULT_BONUS_INVENTORY_IDS: readonly string[] = [
  "mock-bonus-cert-welcome",
  "mock-bonus-campus-pin",
  "mock-bonus-avatar-frame",
  "mock-bonus-medal-seed"
];

export const CATEGORY_LABELS: Record<InventoryCategory, string> = {
  avatars: "Avatares",
  outfits: "Roupas",
  accessories: "Acessórios",
  certificates: "Certificados e medalhas",
  campus_items: "Itens de campus",
  special_items: "Itens especiais",
  course_souvenirs: "Souvenirs de curso",
  posters: "Posters",
  special_seeds: "Sementes especiais"
};

export const CATEGORY_ORDER: InventoryCategory[] = [
  "avatars",
  "outfits",
  "accessories",
  "course_souvenirs",
  "special_items",
  "posters",
  "special_seeds",
  "certificates",
  "campus_items"
];
