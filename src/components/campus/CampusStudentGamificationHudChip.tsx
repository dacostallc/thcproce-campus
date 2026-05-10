"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AvatarPreview } from "@/components/campus/AvatarPreview";
import { useStudentGamification } from "@/hooks/useStudentGamification";
import { getEffectiveHudAvatarVariant } from "@/lib/campusStoreClient";
import { xpToNextLevel } from "@/lib/studentGamificationStorage";
import { getStudentTitleForProfile } from "@/lib/studentTitleCatalog";
import { cn } from "@/lib/utils";

export function CampusStudentGamificationHudChip({
  className,
  onOpenProfile
}: {
  className?: string;
  onOpenProfile?: () => void;
}) {
  const g = useStudentGamification();
  const toNext = xpToNextLevel(g.xp);
  const title = useMemo(() => getStudentTitleForProfile(g).label, [g.xp]);

  const face = (
    <>
      <AvatarPreview
        variant={getEffectiveHudAvatarVariant(g)}
        size="sm"
        className="origin-bottom scale-[0.82]"
        visualCosmetics={g.visualCosmeticsV1}
      />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-[10px] font-semibold text-white/92">{g.displayName}</p>
        <p className="truncate text-[10px] font-semibold text-amber-200/82">{title}</p>
        <p className="truncate text-[11px] font-bold tabular-nums text-white">
          Nv. {g.level} · {g.xp} XP · {g.credits} cr
          <span className="ml-1 font-medium text-white/45">(−{toNext} próx.)</span>
        </p>
      </div>
    </>
  );

  return (
    <div
      className={cn(
        "pointer-events-auto flex max-w-[min(100%,22rem)] items-center gap-2 rounded-xl border border-white/14 px-2.5 py-1.5 campus-hud-glass shadow-md shadow-black/25",
        className
      )}
    >
      {onOpenProfile ? (
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg text-left transition hover:bg-white/8"
          title="Meu perfil (neste dispositivo)"
          onClick={onOpenProfile}
        >
          {face}
        </button>
      ) : (
        <Link
          href="/campus/perfil"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg transition hover:bg-white/8"
          title="Meu perfil campus (progresso local)"
        >
          {face}
        </Link>
      )}
    </div>
  );
}