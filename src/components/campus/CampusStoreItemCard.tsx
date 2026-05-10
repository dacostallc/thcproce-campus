"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CampusStoreItemCardMode = "store" | "inventory" | "compact";

type Density = "default" | "compact";

export type CampusStoreItemCardProps = {
  title: string;
  subtitle?: string;
  rarity?: string;
  idHint?: string;
  originLabel?: string;
  costCredits: number | null;
  owned: boolean;
  equipped: boolean;
  canPurchaseWithCredits: boolean;
  insufficientCredits: boolean;
  statusHint?: string;
  onBuy?: () => void;
  onEquip?: () => void;
  onUnequip?: () => void;
  presentation?: CampusStoreItemCardMode;
  /** Quando verdadeiro, reduz paddings mesmo em modo inventário (ex.: modal). */
  compactLayout?: boolean;
};

function resolveLayout(presentation: CampusStoreItemCardMode | undefined): {
  density: Density;
  showPurchase: boolean;
  showUnequip: boolean;
  showOrigin: boolean;
} {
  switch (presentation) {
    case "inventory":
      return {
        density: "default",
        showPurchase: false,
        showUnequip: true,
        showOrigin: true
      };
    case "compact":
      return {
        density: "compact",
        showPurchase: true,
        showUnequip: false,
        showOrigin: false
      };
    default:
      return {
        density: "default",
        showPurchase: true,
        showUnequip: false,
        showOrigin: false
      };
  }
}

export function CampusStoreItemCard({
  title,
  subtitle,
  rarity,
  idHint,
  originLabel,
  costCredits,
  owned,
  equipped,
  canPurchaseWithCredits,
  insufficientCredits,
  statusHint,
  onBuy,
  onEquip,
  onUnequip,
  presentation = "store",
  compactLayout = false
}: CampusStoreItemCardProps) {
  const layout = resolveLayout(presentation);

  const pad =
    compactLayout || layout.density === "compact"
      ? "p-3"
      : "p-4";
  const titleCls =
    compactLayout || layout.density === "compact" ? "text-[13px]" : "text-sm";

  const showPurchase = layout.showPurchase && !owned && canPurchaseWithCredits;
  const showEquip = owned && !equipped;
  const inventoryUnequip = layout.showUnequip && equipped && Boolean(onUnequip);

  return (
    <article
      className={cn(
        "rounded-2xl border backdrop-blur-md transition",
        pad,
        owned
          ? "border-emerald-400/25 bg-emerald-500/[0.05]"
          : "border-white/12 bg-white/[0.03]"
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className={cn("font-semibold text-white", titleCls)}>{title}</h3>
          {layout.showOrigin && originLabel ? (
            <span className="shrink-0 rounded-md border border-white/12 bg-black/25 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/55">
              {originLabel}
            </span>
          ) : null}
        </div>
        {subtitle ? (
          <p
            className={cn(
              "leading-relaxed text-white/50",
              compactLayout || layout.density === "compact" ? "text-[10px]" : "text-[11px]"
            )}
          >
            {subtitle}
          </p>
        ) : null}
        {rarity ? (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">{rarity}</p>
        ) : null}
        {idHint ? <p className="font-mono text-[9px] text-white/30">{idHint}</p> : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!owned &&
        typeof costCredits === "number" &&
        costCredits > 0 &&
        layout.showPurchase ? (
          <span className="rounded-lg border border-amber-400/25 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold tabular-nums text-amber-50">
            {costCredits} créditos
          </span>
        ) : null}
        {owned && equipped ? (
          <span className="rounded-lg border border-canna-400/35 bg-canna-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-canna-50">
            Equipado
          </span>
        ) : null}
      </div>

      {statusHint ? <p className="mt-3 text-[11px] text-white/45">{statusHint}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {inventoryUnequip ? (
          <Button type="button" variant="glass" size="sm" className="text-[11px]" onClick={onUnequip}>
            Desequipar
          </Button>
        ) : null}
        {showEquip ? (
          <Button type="button" variant="glass" size="sm" className="text-xs" onClick={onEquip}>
            Equipar
          </Button>
        ) : null}
        {showPurchase ? (
          <Button
            type="button"
            size="sm"
            variant={insufficientCredits ? "glass" : "default"}
            className={cn("text-xs", insufficientCredits && "pointer-events-none opacity-60")}
            disabled={insufficientCredits}
            onClick={onBuy}
          >
            Comprar
          </Button>
        ) : null}
      </div>
    </article>
  );
}
