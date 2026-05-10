"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { CampusStoreItemCard } from "@/components/campus/CampusStoreItemCard";
import { CreditBalanceChip } from "@/components/campus/CreditBalanceChip";
import {
  CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG,
  type CampusStorePurchasableMeta
} from "@/lib/campusStoreMockCatalog";
import {
  equipCampusInventoryItem,
  equipErrorMessagePt,
  isCampusInventoryItemEquippable,
  isCampusStoreItemEquipped,
  isSouvenirEarnedOrOwned,
  unequipCampusInventoryItem
} from "@/lib/campusStoreClient";
import {
  BONUS_INVENTORY_MOCK_CATALOG,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type BonusInventoryMeta,
  type InventoryCategory
} from "@/lib/studentGamificationMockCatalog";
import { cn } from "@/lib/utils";
import {
  SOUVENIR_CATALOG,
  studentProfilePerfilHydrationPlaceholder,
  type SouvenirMeta,
  type StudentProfile
} from "@/lib/studentGamificationStorage";
import { useStudentGamification } from "@/hooks/useStudentGamification";

type Density = "modal" | "page";

type StudentInventoryProps = {
  density?: Density;
  /** Predefinição `true`. Em `/campus/perfil` usar `useClientHydrated()`. */
  hydrated?: boolean;
};

type InvRow =
  | { kind: "souvenir"; meta: SouvenirMeta }
  | { kind: "bonus"; meta: BonusInventoryMeta }
  | { kind: "store"; meta: CampusStorePurchasableMeta };

function collectOwnedInventoryByCategory(profile: StudentProfile): Map<InventoryCategory, InvRow[]> {
  const map = new Map<InventoryCategory, InvRow[]>();
  for (const c of CATEGORY_ORDER) {
    map.set(c, []);
  }

  for (const meta of Object.values(SOUVENIR_CATALOG)) {
    if (!isSouvenirEarnedOrOwned(profile, meta.id)) continue;
    map.get(meta.category)?.push({ kind: "souvenir", meta });
  }

  for (const id of profile.bonusInventoryIds) {
    const meta = BONUS_INVENTORY_MOCK_CATALOG[id];
    if (!meta) continue;
    map.get(meta.category)?.push({ kind: "bonus", meta });
  }

  for (const id of profile.purchasedStoreItemIds) {
    const meta = CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[id];
    if (!meta) continue;
    map.get(meta.category)?.push({ kind: "store", meta });
  }

  for (const [, list] of map) {
    list.sort((a, b) => a.meta.title.localeCompare(b.meta.title, "pt"));
  }

  return map;
}

function originForRow(row: InvRow): string {
  const id = rowId(row);
  if (id.startsWith("p3-drop-")) return "Missão / evento do campus";
  if (id.startsWith("p3-cert-")) return "Curso completo (progresso local)";
  switch (row.kind) {
    case "souvenir":
      return "Ganhou no curso (neste navegador)";
    case "bonus":
      return "Bónus inicial do campus";
    case "store":
      return "Comprado na Loja";
    default:
      return "Campus";
  }
}

function rowId(row: InvRow): string {
  return row.meta.id;
}

/**
 * Inventário do perfil — só **itens já possuídos**; mesmo `campusStoreClient` da Loja para equip/desequip.
 */
export function StudentInventory({ density = "page", hydrated = true }: StudentInventoryProps) {
  const gLive = useStudentGamification();
  const snapshot = useMemo(
    () => (hydrated ? gLive : studentProfilePerfilHydrationPlaceholder()),
    [hydrated, gLive]
  );
  const compact = density === "modal";
  const [banner, setBanner] = useState<string | null>(null);

  const showBanner = useCallback((msg: string) => {
    setBanner(msg);
    window.setTimeout(() => setBanner(null), 3800);
  }, []);

  const byCategory = useMemo(() => collectOwnedInventoryByCategory(snapshot), [snapshot]);
  const totalOwned = useMemo(
    () => [...byCategory.values()].reduce((acc, rows) => acc + rows.length, 0),
    [byCategory]
  );

  const tryEquip = (id: string) => {
    const r = equipCampusInventoryItem(id);
    showBanner(r.ok ? "Item equipado." : equipErrorMessagePt(r.ok ? undefined : r.error));
  };

  const tryUnequip = (id: string) => {
    const r = unequipCampusInventoryItem(id);
    showBanner(r.ok ? "Item removido do slot." : equipErrorMessagePt(r.ok ? undefined : r.error));
  };

  const renderRow = (row: InvRow) => {
    const id = rowId(row);
    const equippable = row.kind === "souvenir" ? true : isCampusInventoryItemEquippable(id);
    const equipped = equippable && isCampusStoreItemEquipped(snapshot, id);
    const origin = originForRow(row);

    return (
      <CampusStoreItemCard
        key={id}
        title={row.meta.title}
        subtitle={"subtitle" in row.meta && row.meta.subtitle ? row.meta.subtitle : undefined}
        rarity={"rarity" in row.meta ? row.meta.rarity : undefined}
        idHint={`${id} · inventário`}
        originLabel={origin}
        costCredits={null}
        owned
        equipped={equipped}
        canPurchaseWithCredits={false}
        insufficientCredits={false}
        presentation="inventory"
        compactLayout={compact}
        statusHint={equippable ? undefined : "Colecção — só visual neste inventário."}
        onEquip={equippable ? () => tryEquip(id) : undefined}
        onUnequip={equippable && equipped ? () => tryUnequip(id) : undefined}
      />
    );
  };

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 backdrop-blur-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/55">
            Saldo (local)
          </p>
          <CreditBalanceChip
            compact
            className="mt-1"
            displayCredits={hydrated ? undefined : snapshot.credits}
          />
        </div>
        <Link
          href="/campus/loja"
          className="rounded-lg border border-canna-400/25 bg-canna-500/10 px-2.5 py-1 text-[11px] font-semibold text-canna-50 transition hover:bg-canna-500/20"
        >
          Abrir loja
        </Link>
      </div>

      {banner ? (
        <p className="text-xs text-sky-200/95" role="status">
          {banner}
        </p>
      ) : null}

      {totalOwned === 0 ? (
        <div className="rounded-2xl border border-white/14 bg-gradient-to-br from-white/[0.06] via-canna-500/[0.04] to-transparent px-6 py-10 text-center backdrop-blur-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-canna-400/28 bg-canna-500/10">
            <Sparkles className="text-canna-200" size={22} aria-hidden />
          </div>
          <p className="mt-4 text-sm font-semibold text-white">O inventário está vazio</p>
          <p className="mt-2 mx-auto max-w-md text-[13px] leading-relaxed text-white/55">
            Ao concluíres aulas e missões aparecem recompensas aqui e na Loja. Os itens ficam apenas neste
            telemóvel ou computador.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link
              href="/campus/loja"
              className="inline-flex rounded-xl border border-canna-400/35 bg-canna-500/15 px-4 py-2 text-xs font-bold text-canna-50 transition hover:bg-canna-500/25"
            >
              Abrir loja do campus
            </Link>
          </div>
        </div>
      ) : null}

      {CATEGORY_ORDER.map((cat) => {
        const rows = byCategory.get(cat) ?? [];
        if (rows.length === 0) return null;

        return (
          <section
            key={cat}
            className={cn(
              "rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md",
              compact && "rounded-xl p-3"
            )}
          >
            <h3 className="text-sm font-semibold text-white">{CATEGORY_LABELS[cat]}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">{rows.map((row) => renderRow(row))}</div>
          </section>
        );
      })}
    </div>
  );
}
