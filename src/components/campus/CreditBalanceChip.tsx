"use client";

import { Coins } from "lucide-react";
import { useStudentGamification } from "@/hooks/useStudentGamification";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Compacto para barras do HUD. */
  compact?: boolean;
  /**
   * Valor mostrado à força (ex.: 0 antes de hidratar em `/campus/perfil`).
   * Omite para usar o perfil em memória.
   */
  displayCredits?: number;
};

/** Saldo de créditos ganhos no campus (neste navegador). */
export function CreditBalanceChip({ className, compact, displayCredits }: Props) {
  const g = useStudentGamification();
  const n = displayCredits !== undefined ? displayCredits : g.credits;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-sky-400/28 bg-sky-500/[0.09] px-2 py-1 font-bold tabular-nums text-sky-100 shadow-[0_0_16px_rgba(14,165,233,0.12)]",
        compact ? "text-[10px]" : "text-[11px]",
        className
      )}
      title="Créditos ganhos neste dispositivo (campus)"
    >
      <Coins size={compact ? 11 : 13} className="shrink-0 text-sky-200/90" aria-hidden />
      {n}
      <span className="font-semibold text-sky-200/75">cr</span>
    </span>
  );
}
