"use client";

import { cn } from "@/lib/utils";
import type { CampusPresenceBreakdown } from "@/hooks/useCampusPresenceBreakdown";

type Phase = "day" | "night";

/** Ambient overlay: legendas fluidas (sem caixas estreitas que cortam texto). */
export function CampusVivoLayer({
  phase,
  presence
}: {
  phase: Phase;
  presence: CampusPresenceBreakdown;
}) {
  const totalLabel = presence.totalOnCampus != null ? String(presence.totalOnCampus) : "●";
  const rooms = presence.inRooms ?? "—";
  const lessons = presence.inLessons ?? "—";

  const ribbonTint =
    phase === "day"
      ? "border-white/25 bg-white/[0.16] text-slate-900/88 shadow-[0_10px_36px_rgba(15,23,42,0.12)] backdrop-blur-xl"
      : "border-emerald-300/26 bg-black/[0.24] text-emerald-100/92 shadow-[0_10px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl";

  const ribbonTintB =
    phase === "day"
      ? "border-white/25 bg-white/[0.15] text-slate-900/86 shadow-[0_10px_36px_rgba(15,23,42,0.11)] backdrop-blur-xl"
      : "border-amber-200/28 bg-black/[0.24] text-amber-100/90 shadow-[0_10px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl";

  return (
    <div
      className={cn("campus-vivo-motion pointer-events-none absolute inset-0 overflow-hidden")}
      data-campus-vivo-phase={phase}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-[12%] h-5 overflow-hidden">
        <div
          className="motion-reduce:!animate-none absolute top-0 opacity-50 motion-reduce:opacity-65 campus-map-vivo-drone-crawl"
          style={{ animationDelay: "-18s" }}
        >
          <svg width="32" height="16" viewBox="0 0 32 16" aria-hidden>
            <ellipse cx="8" cy="8" rx="5" ry="3" fill="#22d3ee" opacity={0.42} />
            <ellipse cx="24" cy="8" rx="5" ry="3" fill="#a855f7" opacity={0.38} />
            <rect x="12" y="6.5" width="8" height="3" rx="1.2" fill="#0f172a" opacity={0.72} />
          </svg>
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute left-[3%] top-[74%] z-[1] max-w-[min(92vw,20rem)] rounded-xl border px-2.5 py-2 sm:left-[6%]",
          ribbonTint
        )}
        aria-hidden
      >
        <p className="text-[9px] font-semibold uppercase tracking-[0.1em] leading-relaxed [overflow-wrap:anywhere]">
          Aulas · sala remota • Biblioteca ocupada • Evento cultural 19h • Missões atualizadas
        </p>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute right-[3%] top-[69%] z-[1] max-w-[min(92vw,20rem)] rounded-xl border px-2.5 py-2 sm:right-[6%]",
          ribbonTintB
        )}
        aria-hidden
      >
        <p className="text-[9px] font-medium leading-relaxed [overflow-wrap:anywhere]">
          Laboratório THC · check-in holográfico · stream ao vivo quando disponível
        </p>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute left-3 top-3 z-[2] max-w-[calc(100vw-7.5rem)] rounded-xl border px-2.5 py-1.5 text-[10px] font-semibold tabular-nums shadow-[0_8px_28px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:left-auto sm:right-40 sm:max-w-[min(22rem,calc(100vw-12rem))] sm:text-[11px]",
          phase === "day"
            ? "border-white/28 bg-white/[0.18] text-slate-900/88"
            : "border-white/[0.12] bg-black/[0.22] text-white/84"
        )}
        aria-live="polite"
      >
        <span className={phase === "day" ? "text-emerald-800/90" : "text-emerald-200/90"}>Campus vivo</span>
        <span className={phase === "day" ? "mx-1 text-slate-600/45" : "mx-1 text-white/35"}>·</span>
        <span className="whitespace-normal [overflow-wrap:anywhere]">
          Total {totalLabel} · Salas {rooms} · Aulas {lessons}
        </span>
      </div>
    </div>
  );
}
