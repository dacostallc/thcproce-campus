"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/react";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "default" | "compact" | "profile-summary";
  className?: string;
};

/**
 * Painel discreto de orientação — lista simples, progresso linear, sem HUD chamativo.
 */
export function CampusGuidedMissionsPanel({ variant = "default", className }: Props) {
  const { status } = useSession();
  const compact = variant === "compact" || variant === "profile-summary";

  const guided = trpc.campus.campusGuidedMissions.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 20_000
  });

  if (status !== "authenticated") return null;

  const missions = guided.data?.missions ?? [];
  const doneCount = missions.filter((m) => m.done).length;

  return (
    <section
      className={cn(
        "rounded-xl border border-white/[0.09] bg-black/[0.1] p-3 shadow-inner shadow-black/10 backdrop-blur-sm",
        compact ? "text-[11px] leading-snug" : "text-[12px] leading-snug",
        className
      )}
      aria-labelledby="campus-guided-missions-heading"
    >
      <header className="mb-2 flex items-start justify-between gap-2 border-b border-white/[0.08] pb-2">
        <div className="min-w-0">
          <h3
            id="campus-guided-missions-heading"
            className={cn(
              "font-semibold tracking-tight text-white/88",
              compact ? "text-[11px]" : "text-[12px]"
            )}
          >
            Orientação no campus
          </h3>
          <p className="mt-0.5 max-w-prose text-[10px] font-normal text-white/52">
            Sugestões para explorar o mapa, microaulas e espaços úteis — progresso guardado na sua conta.
          </p>
        </div>
        <span className="shrink-0 tabular-nums text-[10px] text-white/45">
          {doneCount}/{missions.length}
        </span>
      </header>

      {guided.isLoading ? (
        <p className="text-[10px] text-white/45">A carregar orientações…</p>
      ) : guided.isError ? (
        <p className="text-[10px] text-rose-300/80">Não foi possível carregar as orientações.</p>
      ) : (
        <ul className="space-y-2">
          {missions.map((m) => {
            const pct = Math.min(
              100,
              m.targetValue > 0
                ? Math.round((m.progressCurrent / m.targetValue) * 100)
                : 0
            );
            return (
              <li
                key={m.id}
                className={cn(
                  "rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-1.5 transition-colors",
                  m.done && "border-emerald-400/14 bg-emerald-500/[0.045]"
                )}
              >
                <div className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-white/55" aria-hidden>
                    {m.done ? (
                      <CheckCircle2 className="text-emerald-300/95" size={14} strokeWidth={2.2} />
                    ) : (
                      <Circle size={14} strokeWidth={2} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                      <span className="font-medium text-white/86">{m.title}</span>
                      <span className="tabular-nums text-[10px] text-white/42">
                        {m.progressCurrent}/{m.targetValue}
                      </span>
                    </div>
                    <p className="text-[10px] leading-snug text-white/55">{m.description}</p>
                    {!m.done && m.suggestedZoneLabel ? (
                      <p className="text-[9px] text-white/38">
                        Sugestão de mapa: zona «{m.suggestedZoneLabel}». Procure estados{" "}
                        <span className="text-white/48">recomendado</span>,{" "}
                        <span className="text-white/48">descoberto</span> ou{" "}
                        <span className="text-white/48">concluído</span> no SVG.
                      </p>
                    ) : null}
                    <div
                      className="h-1 overflow-hidden rounded-full bg-white/[0.06]"
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progresso de ${m.title}`}
                    >
                      <div
                        className={cn(
                          "h-full rounded-full transition-[width] duration-300 ease-out",
                          m.done ? "bg-emerald-400/55" : "bg-sky-400/45"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-x-2 text-[9px] text-white/38">
                      <span>+{m.xpReward} XP ao concluir</span>
                      {m.badgeId ? <span>Inclui um distintivo opcional no perfil.</span> : null}
                      {m.done && m.rewardClaimedAt ? (
                        <span className="text-emerald-400/55">Recompensa registada</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
