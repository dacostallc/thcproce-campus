"use client";

import { AvatarPreview } from "@/components/campus/AvatarPreview";
import { useStudentGamification } from "@/hooks/useStudentGamification";
import { getEffectiveHudAvatarVariant } from "@/lib/campusStoreClient";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  onOpenProfile: () => void;
};

/** Resumo local compacto no topo do campus — não altera grid principal; só mais um chip clicável. */
export function CampusLocalGamificationHudPill({ className, onOpenProfile }: Props) {
  const g = useStudentGamification();

  return (
    <button
      type="button"
      onClick={onOpenProfile}
      title="Meu perfil (neste dispositivo)"
      className={cn(
        "pointer-events-auto flex max-w-[min(52vw,13.5rem)] cursor-pointer items-center gap-1.5 rounded-xl border border-white/[0.14] bg-black/[0.18] px-2 py-1 text-left shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition hover:border-emerald-300/35 hover:bg-white/[0.08] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-black/55 sm:max-w-[15rem] sm:gap-2 sm:px-2.5 sm:py-1.5",
        className
      )}
    >
      <AvatarPreview
        variant={getEffectiveHudAvatarVariant(g)}
        size="sm"
        className="origin-bottom shrink-0 scale-[0.72] sm:scale-[0.82]"
        visualCosmetics={g.visualCosmeticsV1}
      />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-[9px] font-semibold text-white/95 sm:text-[10px]">{g.displayName}</p>
        <p className="truncate text-[9px] tabular-nums text-canna-200/95 sm:text-[10px]">
          Nv.{g.level} · {g.xp} XP · {g.credits} cr
        </p>
      </div>
    </button>
  );
}
