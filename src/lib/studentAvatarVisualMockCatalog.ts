/**
 * Mock cosmetics catalog for HUD / profile visuals only.
 * TODO Prisma: `StudentCosmeticEquip` etc.
 */

export type AvatarVisualRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type AvatarVisualCosmeticStub = {
  id: string;
  labelPt: string;
  rarity?: AvatarVisualRarity;
};

export const AVATAR_FRAME_CATALOG: Record<string, AvatarVisualCosmeticStub> = {
  "frame-none": { id: "frame-none", labelPt: "Sem moldura", rarity: "common" },
  "frame-jade": { id: "frame-jade", labelPt: "Jade campus", rarity: "uncommon" },
  "frame-prism": {
    id: "frame-prism",
    labelPt: "Prisma holográfica",
    rarity: "legendary"
  },
  "frame-labcoat": { id: "frame-labcoat", labelPt: "Contorno laboratório", rarity: "rare" }
};

export const AVATAR_AURA_CATALOG: Record<string, AvatarVisualCosmeticStub> = {
  "aura-none": { id: "aura-none", labelPt: "Sem aura" },
  "aura-moss": { id: "aura-moss", labelPt: "Névoa musgo", rarity: "common" },
  "aura-ion": {
    id: "aura-ion",
    labelPt: "Íons verdes",
    rarity: "rare"
  },
  "aura-solar-flare": {
    id: "aura-solar-flare",
    labelPt: "Onda solar THC",
    rarity: "epic"
  }
};

export const AVATAR_BADGE_VISUAL_CATALOG: Record<string, AvatarVisualCosmeticStub> = {
  "badge-vis-none": { id: "badge-vis-none", labelPt: "Sem pin holográfico" },
  "badge-vis-leaf": { id: "badge-vis-leaf", labelPt: "Folha luminescente", rarity: "uncommon" },
  "badge-vis-lab": { id: "badge-vis-lab", labelPt: "Microscópio", rarity: "rare" }
};

export const AVATAR_HOLOGRAM_FX_CATALOG: Record<string, AvatarVisualCosmeticStub> = {
  "holofx-off": { id: "holofx-off", labelPt: "FX desligado" },
  "holofx-scanlines": {
    id: "holofx-scanlines",
    labelPt: "Scanlines sutis",
    rarity: "uncommon"
  },
  "holofx-chromatic": {
    id: "holofx-chromatic",
    labelPt: "Cromático leve",
    rarity: "epic"
  }
};

/** Effective rarity for CSS: cosmetic-specific or explicit profile rarity. */
export function resolveEquippedVisualRarity(
  explicitRarity: AvatarVisualRarity,
  frameId: string,
  auraId: string
): AvatarVisualRarity {
  const order: AvatarVisualRarity[] = [
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary"
  ];
  const rank = (r: AvatarVisualRarity) => order.indexOf(r);
  let best = explicitRarity;
  const f = AVATAR_FRAME_CATALOG[frameId]?.rarity;
  const a = AVATAR_AURA_CATALOG[auraId]?.rarity;
  if (f && rank(f) > rank(best)) best = f;
  if (a && rank(a) > rank(best)) best = a;
  return best;
}
