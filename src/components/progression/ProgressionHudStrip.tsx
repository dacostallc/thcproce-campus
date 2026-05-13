"use client";

import { XpAvatarImg } from "@/components/profile/XpAvatarImg";
import { getAvatarByXp } from "@/lib/progression/avatars";
import { cn } from "@/lib/utils";

export type ProgressionHudStripProps = {
  xp: number;
  levelLabel: string;
  souvenirCredits: number;
  progressPercent: number;
  nextTierLabel: string | null;
  nextTierMinXp?: number | null;
  compact?: boolean;
  className?: string;
};

/**
 * Avatar + XP tier summary for perfil and campus HUD (server-backed fields from `campus.myProgress`).
 */
export function ProgressionHudStrip({
  xp,
  levelLabel,
  souvenirCredits,
  progressPercent,
  nextTierLabel,
  nextTierMinXp,
  compact,
  className,
}: ProgressionHudStripProps) {
  const avatarTier = getAvatarByXp(xp);
  const pct = Math.min(100, Math.max(0, progressPercent));
  const nextLine =
    nextTierLabel && nextTierMinXp != null
      ? `Próximo avatar: ${nextTierLabel} (${nextTierMinXp} XP)`
      : nextTierLabel
        ? `Próximo avatar: ${nextTierLabel}`
        : "Patamar máximo atual";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-2 sm:gap-3",
        compact ? "text-[10px] sm:text-[11px]" : "text-xs sm:text-sm",
        className,
      )}
    >
      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <div
          className={cn(
            "relative flex items-center justify-center rounded-lg p-0.5 ring-1 ring-white/15",
            compact ? "h-11 w-9 sm:h-12 sm:w-10" : "h-14 w-10 sm:h-16 sm:w-11"
          )}
        >
          <XpAvatarImg xp={xp} className="h-full w-full" alt="" />
        </div>
        <span
          className="max-w-[4.25rem] truncate text-center text-[8px] font-semibold leading-tight text-amber-100/90 sm:max-w-[5rem] sm:text-[9px]"
          title={avatarTier.label}
        >
          {avatarTier.label}
        </span>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-semibold text-white">
          <span className="tabular-nums">{xp} XP</span>
          <span className="text-gold-200/95">{levelLabel}</span>
          <span className="font-medium text-sky-200/90 tabular-nums">{souvenirCredits} créditos souvenir</span>
        </div>
        <p className="truncate text-[10px] font-medium leading-tight text-white/58 sm:text-[11px]">
          {nextLine} · {pct}% até ao próximo patamar
        </p>
        <div className="h-1 max-w-full overflow-hidden rounded-full bg-white/10 sm:h-1.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-canna-600 to-amber-400/90"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
