/**
 * Tabela editorial única: bandas de XP / moedas / GM alinhadas à raridade.
 * Valores são referência para copy nos pacotes — persistência real virá depois.
 */

import type { CampusMapPointRewardRarity } from "@/lib/campus/campusMapPointBundle.types";

export type CampusMapPointProgressionTierKey =
  | "campus"
  | "info"
  | "pratica"
  | "tecnica"
  | "mestre";

export const CAMPUS_MAP_POINT_REWARD_TABLE: Record<
  CampusMapPointProgressionTierKey,
  { xp: number; greenCoins: number; growerMasterProgress: number; rarity: CampusMapPointRewardRarity }
> = {
  /** Serviços do campus, avisos rápidos */
  campus: { xp: 5, greenCoins: 2, growerMasterProgress: 1, rarity: "comum" },
  /** Conteúdo informativo simples (ex.: legislação introdutória) */
  info: { xp: 5, greenCoins: 3, growerMasterProgress: 1, rarity: "comum" },
  /** Hotspots práticos observáveis na bancada */
  pratica: { xp: 15, greenCoins: 5, growerMasterProgress: 2, rarity: "raro" },
  /** Integração técnica (IPM, calendário, nutrientes avançados) */
  tecnica: { xp: 30, greenCoins: 8, growerMasterProgress: 3, rarity: "épico" },
  /** Módulos âncora da jornada Grower Master */
  mestre: { xp: 45, greenCoins: 12, growerMasterProgress: 4, rarity: "lendário" }
};
