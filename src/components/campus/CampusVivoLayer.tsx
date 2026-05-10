"use client";

import { cn } from "@/lib/utils";
import type { CampusPresenceBreakdown } from "@/hooks/useCampusPresenceBreakdown";

type Phase = "day" | "night";

/**
 * Camada leve sobre o mapa: apenas o chip «Campus vivo» com totais.
 * Cartões/legendas decorativos laterais foram removidos — não tinham função para o aluno.
 */
export function CampusVivoLayer({
  phase,
  presence,
  socialRegisteredOnline = null
}: {
  phase: Phase;
  presence: CampusPresenceBreakdown;
  /** Presença com conta visível (polling servidor). */
  socialRegisteredOnline?: number | null;
}) {
  const totalLabel = presence.totalOnCampus != null ? String(presence.totalOnCampus) : "●";
  const rooms = presence.inRooms ?? "—";
  const lessons = presence.inLessons ?? "—";
  const socialBit =
    typeof socialRegisteredOnline === "number"
      ? ` · Conta ${socialRegisteredOnline}`
      : "";

  return (
    <div
      className={cn("campus-vivo-motion pointer-events-none absolute inset-0 overflow-hidden")}
      data-campus-vivo-phase={phase}
    >
      <div
        className={cn(
          "pointer-events-none absolute left-3 top-3 z-[2] max-w-[calc(100vw-7.5rem)] rounded-xl border px-2.5 py-1.5 text-[10px] font-semibold tabular-nums opacity-[0.72] shadow-[0_6px_22px_rgba(0,0,0,0.14)] backdrop-blur-2xl sm:left-auto sm:right-40 sm:max-w-[min(22rem,calc(100vw-12rem))] sm:text-[11px]",
          phase === "day"
            ? "border-white/22 bg-white/[0.12] text-slate-900/82"
            : "border-white/[0.09] bg-black/[0.18] text-white/78"
        )}
        aria-live="polite"
      >
        <span className={phase === "day" ? "text-emerald-800/85" : "text-emerald-200/82"}>Campus vivo</span>
        <span className={phase === "day" ? "mx-1 text-slate-600/40" : "mx-1 text-white/30"}>·</span>
        <span className="whitespace-normal [overflow-wrap:anywhere]">
          Total {totalLabel} · Salas {rooms} · Aulas {lessons}
          {socialBit}
        </span>
      </div>
    </div>
  );
}
