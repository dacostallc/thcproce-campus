"use client";

import { LayoutGrid } from "lucide-react";
import { StudentInventory } from "@/components/campus/StudentInventory";
import { useStudentGamification } from "@/hooks/useStudentGamification";
import { CAMPUS_PROFILE_BADGE_LABELS_PT } from "@/lib/campusProfileBadgeLabels";
import { studentProfilePerfilHydrationPlaceholder } from "@/lib/studentGamificationStorage";
import { cn } from "@/lib/utils";

export type CampusProfileInventoryDensity = "page" | "modal";

type Props = {
  density?: CampusProfileInventoryDensity;
  className?: string;
  /** Predefinição `true`. Em `/campus/perfil` passar `useClientHydrated()`. */
  hydrated?: boolean;
};

/**
 * Fase 3 — Inventário unificado no perfil (badges + souvenirs + loja + drops locais).
 */
export function CampusProfileInventoryTab({
  density = "page",
  className,
  hydrated = true
}: Props) {
  const gLive = useStudentGamification();
  const g = hydrated ? gLive : studentProfilePerfilHydrationPlaceholder();
  const compact = density === "modal";

  return (
    <div className={cn("space-y-4", compact && "space-y-3", className)}>
      <section
        className={cn(
          "rounded-2xl border border-emerald-400/18 bg-emerald-950/[0.08] p-4 backdrop-blur-md",
          compact && "rounded-xl p-3"
        )}
      >
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-4 shrink-0 text-emerald-200/85" aria-hidden />
          <h2 className={cn("font-semibold text-white", compact ? "text-sm" : "text-base")}>Insígnias</h2>
        </div>
        <p className={cn("mt-1 text-white/48", compact ? "text-[10px]" : "text-[11px]")}>
          Conquistas simbólicas — migráveis para conta escolar depois.
        </p>
        {g.badges.length === 0 ? (
          <p className={cn("mt-3 text-white/52", compact ? "text-xs" : "text-sm")}>
            Completa missões e aulas para veres as primeiras insígnias aqui.
          </p>
        ) : (
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {g.badges.map((id) => (
              <li
                key={id}
                className="rounded-xl border border-white/12 bg-black/25 px-2.5 py-2 text-center shadow-inner shadow-black/20"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-200/75">Badge</p>
                <p className={cn("mt-1 font-medium leading-snug text-white/92", compact ? "text-[11px]" : "text-xs")}>
                  {CAMPUS_PROFILE_BADGE_LABELS_PT[id] ?? id}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <StudentInventory density={density === "modal" ? "modal" : "page"} hydrated={hydrated} />
    </div>
  );
}
