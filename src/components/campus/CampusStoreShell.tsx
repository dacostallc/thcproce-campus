"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { CampusStoreCategoryTabs } from "@/components/campus/CampusStoreCategoryTabs";
import { CampusStoreItemCard } from "@/components/campus/CampusStoreItemCard";
import { getSouvenirStoreUiState } from "@/lib/campusStoreSouvenirUi";
import { BONUS_INVENTORY_MOCK_CATALOG } from "@/lib/studentGamificationMockCatalog";
import {
  CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG,
  campusStoreItemMatchesTab,
  type CampusStoreTabId
} from "@/lib/campusStoreMockCatalog";
import {
  equipCampusInventoryItem,
  equipErrorMessagePt,
  isCampusInventoryItemEquippable,
  isCampusStoreItemEquipped,
  isCampusStoreItemOwned,
  isSouvenirEarnedOrOwned,
  purchaseCampusStoreItem,
  purchaseErrorMessagePt
} from "@/lib/campusStoreClient";
import { cn } from "@/lib/utils";
import { SOUVENIR_CATALOG } from "@/lib/studentGamificationStorage";
import { useStudentGamification } from "@/hooks/useStudentGamification";
import { markMissionStoreEntered } from "@/lib/studentMissionsTelemetry";
import { isCampusAdminEmail } from "@/lib/campusAdmin";
import { isCampusLocalProgressResetAllowed } from "@/lib/campusLocalProgressReset";

type Density = "modal" | "page";

type CampusStoreShellProps = {
  density?: Density;
  className?: string;
};

/**
 * Loja do campus — catálogo unificado (souvenirs, itens extra, compras por créditos locais).
 */
export function CampusStoreShell({ density = "page", className }: CampusStoreShellProps) {
  const { data: session } = useSession();
  const showTechnicalDevBanner = isCampusLocalProgressResetAllowed(
    isCampusAdminEmail(session?.user?.email ?? null)
  );
  const g = useStudentGamification();
  const [tab, setTab] = useState<CampusStoreTabId>("avatars");
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    markMissionStoreEntered();
  }, []);

  const showBanner = useCallback((msg: string) => {
    setBanner(msg);
    window.setTimeout(() => setBanner(null), 3600);
  }, []);

  const souvenirs = useMemo(
    () => Object.values(SOUVENIR_CATALOG).filter((s) => campusStoreItemMatchesTab(s.category, tab)),
    [tab]
  );

  const bonusItems = useMemo(
    () =>
      Object.values(BONUS_INVENTORY_MOCK_CATALOG).filter((b) =>
        campusStoreItemMatchesTab(b.category, tab)
      ),
    [tab]
  );

  const mockPurchases = useMemo(
    () =>
      Object.values(CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG).filter((x) =>
        campusStoreItemMatchesTab(x.category, tab)
      ),
    [tab]
  );

  const compact = density === "modal";
  const cardPresentation = compact ? ("compact" as const) : ("store" as const);
  const scrollClass = compact
    ? "max-h-[min(52vh,480px)] max-sm:max-h-[min(42dvh,360px)] overflow-y-auto pr-1 scrollbar-thin"
    : "";

  const tryBuy = (id: string) => {
    const r = purchaseCampusStoreItem(id);
    if (r.ok) showBanner("Adicionado ao inventário local.");
    else showBanner(purchaseErrorMessagePt(r.error));
  };

  const tryEquip = (id: string) => {
    const r = equipCampusInventoryItem(id);
    if (r.ok) showBanner("Item equipado.");
    else showBanner(equipErrorMessagePt(r.error));
  };

  return (
    <div className={cn("space-y-4", compact && "space-y-3", className)}>
      <div className="rounded-xl border border-sky-400/16 bg-sky-500/[0.06] px-3 py-2 text-[10px] leading-relaxed text-sky-50/95">
        <p className="font-medium text-white/92">
          Compras nesta loja ficam apenas neste dispositivo até a tua conta da escola passar a guardar estas
          preferências nos servidores.
        </p>
        {showTechnicalDevBanner ? (
          <p className="mt-1.5 border-t border-white/10 pt-1.5 text-[9px] leading-snug text-amber-100/92">
            <span className="font-semibold text-amber-200/95">Painel QA</span> — créditos e itens de teste
            em armazenamento local; migrações de servidor não tratam estas transações como pagamentos de
            referência fiscal.
          </p>
        ) : null}
      </div>

      {banner ? (
        <p className="text-xs text-sky-200/95" role="status">
          {banner}
        </p>
      ) : null}

      <CampusStoreCategoryTabs active={tab} onChange={setTab} />

      <div className={scrollClass}>
        <div className={cn("grid gap-3 sm:grid-cols-2")}>
          {souvenirs.map((meta) => {
            const hints = getSouvenirStoreUiState(g, meta);
            const owned = isSouvenirEarnedOrOwned(g, meta.id);
            const equipped = isCampusStoreItemEquipped(g, meta.id);
            const insufficient =
              typeof hints.costCredits === "number" ? g.credits < hints.costCredits : false;

            return (
              <CampusStoreItemCard
                key={meta.id}
                title={meta.title}
                rarity={meta.rarity}
                idHint={meta.id}
                owned={owned}
                equipped={equipped}
                costCredits={hints.costCredits ?? null}
                canPurchaseWithCredits={hints.canPurchaseWithCredits}
                insufficientCredits={
                  !!(hints.canPurchaseWithCredits && typeof hints.costCredits === "number" && insufficient)
                }
                statusHint={hints.statusHint}
                presentation={cardPresentation}
                onBuy={() => tryBuy(meta.id)}
                onEquip={() => tryEquip(meta.id)}
              />
            );
          })}

          {bonusItems.map((meta) => {
            const owned = isCampusStoreItemOwned(g, meta.id);
            const equipped = isCampusStoreItemEquipped(g, meta.id);
            return (
              <CampusStoreItemCard
                key={meta.id}
                title={meta.title}
                subtitle={meta.subtitle}
                idHint={`${meta.id} · bonus`}
                costCredits={null}
                owned={owned}
                equipped={equipped}
                canPurchaseWithCredits={false}
                insufficientCredits={false}
                presentation={cardPresentation}
                statusHint={
                  owned
                    ? undefined
                    : "Itens extra — podem surgir quando o teu progresso estiver sincronizado com a escola."
                }
                onEquip={
                  isCampusInventoryItemEquippable(meta.id) ? () => tryEquip(meta.id) : undefined
                }
              />
            );
          })}

          {mockPurchases.map((meta) => {
            const owned = isCampusStoreItemOwned(g, meta.id);
            const equipped = isCampusStoreItemEquipped(g, meta.id);
            const insufficient = g.credits < meta.costCredits;

            return (
              <CampusStoreItemCard
                key={meta.id}
                title={meta.title}
                subtitle={meta.subtitle}
                idHint={`${meta.id} · compra`}
                costCredits={meta.costCredits}
                owned={owned}
                equipped={equipped}
                canPurchaseWithCredits={!owned}
                insufficientCredits={!owned && insufficient}
                statusHint={
                  meta.mapsToAvatarVariant
                    ? "Equipar altera o teu visual no campus neste dispositivo."
                    : meta.equippable === false
                      ? "Colecção — compra com créditos locais."
                      : undefined
                }
                presentation={cardPresentation}
                onBuy={() => tryBuy(meta.id)}
                onEquip={
                  owned && isCampusInventoryItemEquippable(meta.id)
                    ? () => tryEquip(meta.id)
                    : undefined
                }
              />
            );
          })}
        </div>

        {souvenirs.length + bonusItems.length + mockPurchases.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/45">Nenhum artigo nesta categoria.</p>
        ) : null}
      </div>
    </div>
  );
}
