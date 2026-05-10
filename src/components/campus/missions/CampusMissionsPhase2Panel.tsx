"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { useClientHydrated } from "@/hooks/useClientHydrated";
import { CAMPUS_MISSIONS_PHASE2_CATALOG } from "@/lib/campusMissionsPhase2Catalog";
import type { CampusMissionPhase2UiRow } from "@/lib/campusMissionsPhase2Types";
import {
  CAMPUS_MISSIONS_PHASE2_UPDATED_EVENT,
  listCampusMissionsPhase2Ui
} from "@/lib/campusMissionsPhase2Storage";
import { STUDENT_GAMIFICATION_UPDATED_EVENT } from "@/lib/studentGamificationStorage";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "default" | "compact" | "profile-summary";
  className?: string;
  title?: string;
};

function phase2MissionsHydrationPlaceholder(): CampusMissionPhase2UiRow[] {
  return CAMPUS_MISSIONS_PHASE2_CATALOG.map((def) => ({
    ...def,
    status: "pending",
    completedAt: null
  }));
}

export function CampusMissionsPhase2Panel({
  variant = "default",
  className,
  title = "Missões do campus"
}: Props) {
  const hydrated = useClientHydrated();
  const [tick, setTick] = useState(0);
  const compact = variant === "compact" || variant === "profile-summary";
  const summaryOnly = variant === "profile-summary";

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener(CAMPUS_MISSIONS_PHASE2_UPDATED_EVENT, bump);
    window.addEventListener(STUDENT_GAMIFICATION_UPDATED_EVENT, bump);
    return () => {
      window.removeEventListener(CAMPUS_MISSIONS_PHASE2_UPDATED_EVENT, bump);
      window.removeEventListener(STUDENT_GAMIFICATION_UPDATED_EVENT, bump);
    };
  }, []);

  const missions = useMemo(() => {
    if (!hydrated) return phase2MissionsHydrationPlaceholder();
    return listCampusMissionsPhase2Ui();
  }, [hydrated, tick]);

  /** Evitar `toLocaleString` na primeira pintura — só após hidratar no cliente. */
  const formatCompletedAt = (iso: string | null) => {
    if (!hydrated || !iso) return null;
    return new Date(iso).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const doneCount = missions.filter((m) => m.status === "completed").length;
  const total = missions.length;
  const pctRounded = total ? Math.round((doneCount / total) * 100) : 0;
  const pendingList = missions.filter((m) => m.status === "pending");

  if (summaryOnly) {
    return (
      <section
        className={cn(
          "space-y-3 rounded-xl border border-white/12 bg-black/[0.14] p-3 shadow-inner shadow-black/15",
          className
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight text-white">{title} · Fase 2</h2>
            <p className="mt-0.5 text-[10px] leading-snug text-white/48">
              Progresso local neste dispositivo — XP, créditos e insígnias concedidos uma vez por missão.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-emerald-400/28 bg-emerald-950/25 px-2 py-0.5 text-[11px] font-bold tabular-nums text-emerald-200/95">
            {pctRounded}%
          </span>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-white/42">
            <span>Progresso geral</span>
            <span className="tabular-nums">
              {doneCount}/{total} concluídas
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500/88 to-canna-400/78 transition-[width] duration-300"
              style={{ width: `${pctRounded}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] tabular-nums text-white/38">{pctRounded}% do conjunto Fase 2</p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-white/42">Próximas missões</p>
          {pendingList.length === 0 ? (
            <p className="mt-2 text-[12px] leading-snug text-emerald-200/88">
              Todas as missões desta fase foram concluídas neste browser.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {pendingList.slice(0, 4).map((m) => (
                <li
                  key={m.id}
                  className="rounded-lg border border-white/[0.09] bg-black/22 px-2.5 py-2 ring-1 ring-white/[0.03]"
                >
                  <div className="flex gap-2">
                    <span className="text-base leading-none" aria-hidden>
                      {m.badgeEmoji}
                    </span>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-[12px] font-semibold leading-snug text-white">{m.title}</p>
                      <p className="text-[10px] leading-snug text-white/48">{m.description}</p>
                      <p className="text-[10px] tabular-nums text-canna-200/88">
                        +{m.rewardXp} XP · +{m.rewardCredits} créditos · {m.badgeLabel}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {pendingList.length > 4 ? (
            <p className="mt-2 text-[10px] leading-snug text-white/38">
              Mais {pendingList.length - 4} missões na página «Nome, avatar e inventário».
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("space-y-3", className)}>
      <div>
        <h2
          className={cn(
            "font-semibold text-white",
            compact ? "text-sm" : "text-base"
          )}
        >
          {title}
        </h2>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between gap-2 text-[11px] text-white/55">
            <span className="font-semibold uppercase tracking-wide text-white/42">Progresso</span>
            <span className="tabular-nums text-canna-200/88">
              {doneCount}/{total} · {pctRounded}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/[0.05]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500/85 to-canna-400/72"
              initial={false}
              animate={{ width: `${pctRounded}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 38 }}
            />
          </div>
        </div>
        <p className={cn("mt-2 text-white/50", compact ? "text-[10px]" : "text-[11px]")}>
          Missões locais neste dispositivo. Sem duplicar recompensas ao repetir ações — migrável para a conta na escola
          depois.
        </p>
      </div>
      <ul
        className={cn(
          "space-y-2",
          !hydrated &&
            "animate-campusSkeletonPulse motion-reduce:animate-none motion-reduce:opacity-100 rounded-xl opacity-[0.92]"
        )}
        aria-busy={!hydrated}
      >
        {missions.map((m) => {
          const done = m.status === "completed";
          const completedLabel = formatCompletedAt(m.completedAt);
          return (
            <motion.li
              layout="position"
              key={m.id}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className={cn(
                "rounded-xl border px-3 py-2.5 transition-[border-color,background-color,box-shadow] duration-300 ease-campus-out hover:border-white/[0.14]",
                done ? "border-emerald-500/28 bg-emerald-950/18 shadow-[0_0_24px_rgba(52,211,153,0.06)]" : "border-white/10 bg-black/22 hover:bg-black/[0.28]"
              )}
            >
              <div className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-emerald-200/90" aria-hidden>
                  {done ? (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 520, damping: 28 }}
                    >
                      <CheckCircle2 className="size-4" />
                    </motion.span>
                  ) : (
                    <Circle className="size-4 text-white/35" />
                  )}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-base leading-none" aria-hidden>
                      {m.badgeEmoji}
                    </span>
                    <p
                      className={cn(
                        "font-semibold leading-snug text-white",
                        compact ? "text-[12px]" : "text-[13px]"
                      )}
                    >
                      {m.title}
                    </p>
                  </div>
                  <p className={cn("text-white/55", compact ? "text-[10px]" : "text-[11px]")}>{m.description}</p>
                  <p className={cn("text-white/42", compact ? "text-[10px]" : "text-[11px]")}>
                    Insígnia: <span className="text-white/65">{m.badgeLabel}</span>
                  </p>
                  <p className={cn("tabular-nums text-canna-200/88", compact ? "text-[10px]" : "text-[11px]")}>
                    +{m.rewardXp} XP · +{m.rewardCredits} créditos ·{" "}
                    <span className={done ? "text-emerald-200/75" : "text-white/45"}>
                      {done ? "Concluída" : "Pendente"}
                    </span>
                    {done && completedLabel ? (
                      <span className="ml-2 text-white/38">· {completedLabel}</span>
                    ) : null}
                  </p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
