"use client";

import { memo } from "react";
import { Users, Presentation, Armchair, MessageSquareQuote, ShoppingBag } from "lucide-react";
import type { CampusPresenceBreakdown } from "@/hooks/useCampusPresenceBreakdown";
import type { CampusActivityKind } from "@/lib/campusPresenceActivity";
import { campusActivityLabelPt } from "@/lib/campusPresenceActivity";
import { cn } from "@/lib/utils";

type Props = { presence: CampusPresenceBreakdown; className?: string };

function ActivityIcon({ kind }: { kind: CampusActivityKind }) {
  switch (kind) {
    case "cinema":
      return <Armchair size={11} className="text-violet-200/90" aria-hidden />;
    case "lesson":
      return <Presentation size={11} className="text-teal-200/90" aria-hidden />;
    case "mural":
      return <MessageSquareQuote size={11} className="text-sky-200/90" aria-hidden />;
    case "shop":
      return <ShoppingBag size={11} className="text-amber-200/90" aria-hidden />;
    default:
      return <Users size={11} className="text-emerald-200/85" aria-hidden />;
  }
}

function histogramRows(counts: CampusPresenceBreakdown["activityCounts"]) {
  const rows: { kind: CampusActivityKind; n: number }[] = [
    { kind: "studying", n: counts.studying },
    { kind: "lesson", n: counts.lesson },
    { kind: "cinema", n: counts.cinema },
    { kind: "mural", n: counts.mural },
    { kind: "shop", n: counts.shop }
  ];
  return rows.filter((r) => r.n > 0);
}

/**
 * Presença ao vivo — contagem real (`totalOnCampus`) + lista derivada dos peers no canal `campus-map`.
 * Quando não há Supabase, a lista fica vazia (estrutura pronta para realtime).
 */
export const CampusPresencePanel = memo(function CampusPresencePanel({
  presence,
  className
}: Props) {
  const t = presence.totalOnCampus;
  const hist = histogramRows(presence.activityCounts);

  return (
    <div
      className={cn(
        "rounded-xl border border-white/12 bg-black/35 px-2.5 py-1.5 text-[10px] text-white/80 shadow-md shadow-black/25 sm:text-[11px]",
        className
      )}
    >
      <p className="mb-1 flex items-center gap-1 font-bold uppercase tracking-[0.14em] text-emerald-200/90">
        <Users size={12} className="opacity-95" aria-hidden />
        Presença ao vivo
      </p>
      <ul className="space-y-0.5 tabular-nums">
        <li className="flex justify-between gap-4">
          <span className="text-white/50">Alunos online (campus)</span>
          <span className="font-semibold text-white">{t != null ? t : "—"}</span>
        </li>
        <li className="flex justify-between gap-4">
          <span className="flex items-center gap-1 text-white/48">
            <Presentation size={11} aria-hidden /> Em salas / hotspots
          </span>
          <span className="font-semibold text-white/88">{presence.inRooms ?? "—"}</span>
        </li>
        <li className="flex justify-between gap-4">
          <span className="flex items-center gap-1 text-white/48">
            <Users size={11} aria-hidden /> Em aula agora
          </span>
          <span className="font-semibold text-white/88">{presence.inLessons ?? "—"}</span>
        </li>
      </ul>

      {hist.length ? (
        <div className="mt-2 rounded-lg border border-white/[0.07] bg-black/[0.2] px-2 py-1.5">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40">
            Mapa (tempo real)
          </p>
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {hist.map(({ kind, n }) => (
              <li
                key={kind}
                className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-white/78"
              >
                <ActivityIcon kind={kind} />
                <span>{campusActivityLabelPt(kind)}</span>
                <span className="font-bold text-white">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-2 border-t border-white/[0.06] pt-2">
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40">
          Visitantes activos
        </p>
        {presence.localVisitorRow ? (
          <div className="mb-1 flex items-center justify-between gap-2 rounded-md border border-emerald-400/20 bg-emerald-950/25 px-2 py-1">
            <span className="truncate font-medium text-emerald-50/95">
              {presence.localVisitorRow.displayName}
            </span>
            <span className="inline-flex shrink-0 items-center gap-0.5 text-[9px] text-emerald-100/85">
              <ActivityIcon kind={presence.localVisitorRow.activity} />
              {presence.localVisitorRow.activityLabel}
            </span>
          </div>
        ) : null}
        {!presence.visitors.length ? (
          <p className="text-[10px] leading-snug text-white/45">
            Sem outros visitantes visíveis neste momento — quando o realtime estiver ligado, aparecem aqui com o
            estado actual (cinema, mural, loja, aula…).
          </p>
        ) : (
          <ul className="max-h-[9rem] space-y-1 overflow-y-auto pr-0.5">
            {presence.visitors.map((v) => (
              <li
                key={v.uid}
                className="flex items-center justify-between gap-2 rounded-md border border-white/[0.06] bg-black/[0.15] px-2 py-1 transition-[border-color,background-color] duration-200 ease-campus-out hover:border-white/[0.12] hover:bg-white/[0.06]"
              >
                <span className="truncate font-medium text-white/88">{v.displayName}</span>
                <span className="inline-flex shrink-0 items-center gap-0.5 text-[9px] text-white/58">
                  <ActivityIcon kind={v.activity} />
                  {v.activityLabel}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});
