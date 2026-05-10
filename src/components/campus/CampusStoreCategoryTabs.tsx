"use client";

import {
  CAMPUS_STORE_TAB_LABELS,
  CAMPUS_STORE_TAB_ORDER,
  type CampusStoreTabId
} from "@/lib/campusStoreMockCatalog";
import { cn } from "@/lib/utils";

type Props = {
  active: CampusStoreTabId;
  onChange: (tab: CampusStoreTabId) => void;
  className?: string;
};

export function CampusStoreCategoryTabs({ active, onChange, className }: Props) {
  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto scrollbar-thin rounded-xl border border-white/12 bg-black/15 p-1",
        className
      )}
      role="tablist"
      aria-label="Categorias da loja"
    >
      {CAMPUS_STORE_TAB_ORDER.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={cn(
            "shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition sm:px-3 sm:text-[11px]",
            active === tab
              ? "bg-canna-500/25 text-canna-50 shadow-[0_0_16px_rgba(52,211,153,0.12)]"
              : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
          )}
        >
          {CAMPUS_STORE_TAB_LABELS[tab]}
        </button>
      ))}
    </div>
  );
}
