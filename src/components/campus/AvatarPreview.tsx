"use client";

import { CampusPlayerAvatar } from "@/components/campus/CampusPlayerAvatar";
import { cn } from "@/lib/utils";
import { resolveEquippedVisualRarity } from "@/lib/studentAvatarVisualMockCatalog";
import type { StudentAvatarVariant, StudentVisualCosmeticsV1 } from "@/lib/studentGamificationStorage";

export type AvatarPreviewSize = "sm" | "md" | "lg";

const SCALE: Record<AvatarPreviewSize, string> = {
  sm: "scale-[0.78]",
  md: "scale-[1.02]",
  lg: "scale-[1.2]"
};

function rarityFrameClass(effective: ReturnType<typeof resolveEquippedVisualRarity>): string {
  if (effective === "legendary") return "campus-rarity-frame campus-rarity-frame--legendary";
  if (effective === "epic" || effective === "rare") {
    return `campus-rarity-frame campus-rarity-frame--${effective}`;
  }
  if (effective === "uncommon") {
    return "campus-rarity-frame ring-1 ring-canna-300/52 shadow-[0_0_22px_rgba(52,211,153,0.16)]";
  }
  return "ring-1 ring-white/22";
}

type Props = {
  variant: StudentAvatarVariant;
  size?: AvatarPreviewSize;
  className?: string;
  /** Anel holográfico suave opcional — destaque em cards e HUD. */
  halo?: boolean;
  /** HUD mock cosméticos (localStorage). */
  visualCosmetics?: StudentVisualCosmeticsV1;
};

export function AvatarPreview({
  variant,
  size = "md",
  className,
  halo = false,
  visualCosmetics
}: Props) {
  const cosmetics = visualCosmetics;
  const eff = cosmetics
    ? resolveEquippedVisualRarity(cosmetics.rarity, cosmetics.frameId, cosmetics.auraId)
    : "common";
  const frameRing = rarityFrameClass(eff);
  const holoFx = cosmetics?.hologramFx;

  return (
    <div
      className={cn(
        "relative z-[1] flex shrink-0 items-end justify-center overflow-visible rounded-2xl",
        frameRing,
        halo &&
          "border border-canna-300/20 bg-gradient-to-b from-white/[0.07] to-canna-500/[0.06] p-2 shadow-[0_0_28px_rgba(52,211,153,0.12)]",
        className
      )}
    >
      <div className="relative isolate z-[1] flex flex-col justify-end">
        {holoFx === "holofx-scanlines" ? (
          <span className="campus-holo-scanlines-overlay pointer-events-none absolute inset-1 z-[2] rounded-lg" />
        ) : null}
        {holoFx === "holofx-chromatic" ? (
          <span className="campus-holo-chroma-overlay pointer-events-none absolute inset-1 z-[2] rounded-lg" />
        ) : null}
        <CampusPlayerAvatar variant={variant} className={cn("origin-bottom", SCALE[size])} />
      </div>
    </div>
  );
}
