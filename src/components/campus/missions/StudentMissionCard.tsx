"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { claimMissionReward, type StudentMissionUi } from "@/lib/studentMissionsClient";
import { BONUS_INVENTORY_MOCK_CATALOG } from "@/lib/studentGamificationMockCatalog";
import { CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG } from "@/lib/campusStoreMockCatalog";
import { SOUVENIR_CATALOG } from "@/lib/studentGamificationStorage";

function rewardItemHint(id: string | undefined): string | null {
  if (!id) return null;
  if (SOUVENIR_CATALOG[id]) return SOUVENIR_CATALOG[id]!.title;
  if (CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[id]) return CAMPUS_STORE_PURCHASABLE_MOCK_CATALOG[id]!.title;
  if (BONUS_INVENTORY_MOCK_CATALOG[id]) return BONUS_INVENTORY_MOCK_CATALOG[id]!.title;
  return id;
}

const TYPE_LABEL: Record<StudentMissionUi["type"], string> = {
  daily: "Diária",
  weekly: "Semanal",
  course: "Curso",
  special: "Especial"
};

type Props = {
  mission: StudentMissionUi;
  compact?: boolean;
};

export function StudentMissionCard({ mission, compact }: Props) {
  const [busy, setBusy] = useState(false);
  const pct = mission.target > 0 ? Math.min(100, (mission.progressCurrent / mission.target) * 100) : 0;
  const itemHint = rewardItemHint(mission.rewardItemId);
  const canClaim = mission.completed && !mission.claimed;

  return (
    <article
      className={cn(
        "rounded-xl border border-white/[0.09] bg-black/18",
        compact ? "p-3" : "p-4"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={cn("font-semibold text-white", compact ? "text-sm" : "text-[15px]")}>
              {mission.title}
            </h3>
            <span className="rounded-md border border-canna-400/25 bg-canna-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-canna-200/90">
              {TYPE_LABEL[mission.type]}
            </span>
          </div>
          <p className={cn("text-white/55 leading-relaxed", compact ? "text-[11px]" : "text-xs")}>
            {mission.description}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {mission.claimed ? (
            <span className="rounded-full border border-amber-400/35 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-100">
              Resgatada
            </span>
          ) : mission.completed ? (
            <span className="rounded-full border border-emerald-400/35 bg-emerald-500/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-100">
              Concluída
            </span>
          ) : (
            <span className="rounded-full border border-white/12 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/45">
              Em curso
            </span>
          )}
        </div>
      </div>

      <div className={cn("mt-3", compact && "mt-2")}>
        <div className="mb-1 flex justify-between text-[10px] tabular-nums text-white/50">
          <span>
            Progresso · {mission.progressCurrent}/{mission.target}
          </span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-black/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-canna-400/90 to-emerald-400/75 transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div
        className={cn(
          "mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/75",
          compact && "mt-2 text-[10px]"
        )}
      >
        {mission.rewardXp > 0 ? (
          <span>
            +<span className="font-bold text-amber-200/95">{mission.rewardXp}</span> XP
          </span>
        ) : null}
        {mission.rewardCredits > 0 ? (
          <span>
            +<span className="font-bold text-sky-200/95">{mission.rewardCredits}</span> créditos
          </span>
        ) : null}
        {itemHint ? (
          <span className="text-canna-200/85">
            Item: <span className="font-medium text-white/90">{itemHint}</span>
          </span>
        ) : null}
      </div>

      <div className={cn("mt-3", compact && "mt-2")}>
        <Button
          type="button"
          size="sm"
          className="w-full sm:w-auto"
          disabled={!canClaim || busy || mission.claimed}
          onClick={() => {
            if (!canClaim || busy) return;
            setBusy(true);
            try {
              claimMissionReward(mission.id);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              A resgatar…
            </>
          ) : mission.claimed ? (
            "Já resgatada"
          ) : mission.completed ? (
            "Resgatar"
          ) : (
            "Conclua para resgatar"
          )}
        </Button>
      </div>
    </article>
  );
}
