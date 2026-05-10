"use client";

import { memo, useMemo, useState } from "react";
import {
  Users,
  Presentation,
  Armchair,
  MessageSquareQuote,
  ShoppingBag,
  Hand,
  MessageSquare,
  SmilePlus,
  ShieldCheck
} from "lucide-react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import type { CampusPresenceBreakdown } from "@/hooks/useCampusPresenceBreakdown";
import type { CampusActivityKind } from "@/lib/campusPresenceActivity";
import { campusActivityLabelPt } from "@/lib/campusPresenceActivity";
import {
  CAMPUS_SOCIAL_STATUS_LABELS_PT,
  CAMPUS_SOCIAL_VISIBILITY_LABELS_PT,
  type CampusSocialStatusLight,
  type CampusSocialVisibility
} from "@/types/campusSocialPresence";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/react";
import { useCampusSocialZoneStore } from "@/stores/campusSocialZoneStore";

type SocialPoll = inferRouterOutputs<AppRouter>["campus"]["campusSocialPoll"];

type Props = {
  presence: CampusPresenceBreakdown;
  /** Presença com conta — atualizada por polling leve. */
  social?: SocialPoll | null;
  className?: string;
};

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

function TinyOutlineBtn({
  title,
  onClick,
  disabled,
  children
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md border border-white/[0.12] bg-black/[0.18] text-white/78 transition hover:border-emerald-400/35 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
      )}
    >
      {children}
    </button>
  );
}

/**
 * Presença ao vivo — contagem Supabase + lista tempo real + camada social leve (polling BD).
 */
export const CampusPresencePanel = memo(function CampusPresencePanel({
  presence,
  social,
  className
}: Props) {
  const utils = trpc.useUtils();
  const [interactionNote, setInteractionNote] = useState<string | null>(null);
  const zoneLabel = useCampusSocialZoneStore((s) => s.zoneLabel);

  const quickHbMut = trpc.campus.campusSocialHeartbeat.useMutation({
    onSuccess: () => void utils.campus.campusSocialPoll.invalidate()
  });

  const gestureMut = trpc.campus.campusSocialSendGesture.useMutation({
    onSuccess: (_, vars) => {
      void utils.campus.campusSocialPoll.invalidate();
      const verb =
        vars.kind === "wave"
          ? "Aceno enviado."
          : vars.kind === "salve"
            ? "Salve enviado."
            : "Reacção enviada.";
      setInteractionNote(verb);
      window.setTimeout(() => setInteractionNote(null), 4200);
    },
    onError: () => setInteractionNote("Não foi possível enviar agora.")
  });

  const prefsMut = trpc.campus.campusSocialUpdatePrefs.useMutation({
    onSuccess: async () => {
      await quickHbMut.mutateAsync({ currentZoneLabel: zoneLabel }).catch(() => {});
      void utils.campus.campusSocialPoll.invalidate();
    }
  });

  const t = presence.totalOnCampus;
  const hist = histogramRows(presence.activityCounts);

  const visibilityDraft = social?.myVisibility ?? "name";
  const statusDraft = social?.myStatusLight ?? "exploring";

  const zonePreview = useMemo(() => social?.zoneSummary.slice(0, 6) ?? [], [social?.zoneSummary]);

  return (
    <div
      className={cn(
        "rounded-xl border border-white/12 bg-black/35 px-2.5 py-1.5 text-[10px] text-white/80 shadow-md shadow-black/25 sm:text-[11px]",
        className
      )}
    >
      <p className="mb-1 flex items-center gap-1 font-bold uppercase tracking-[0.14em] text-emerald-200/90">
        <Users size={12} className="opacity-95" aria-hidden />
        Presença no campus
      </p>
      <ul className="space-y-0.5 tabular-nums">
        <li className="flex justify-between gap-4">
          <span className="text-white/50">Visitantes online (tempo real)</span>
          <span className="font-semibold text-white">{t != null ? t : "—"}</span>
        </li>
        <li className="flex justify-between gap-4">
          <span className="flex items-center gap-1 text-white/48">
            <ShieldCheck size={11} aria-hidden /> Alunos com sessão visível
          </span>
          <span className="font-semibold text-white/88">
            {social ? social.registeredOnlineCount : "—"}
          </span>
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
        {presence.peerMetrics ? (
          <>
            <li className="flex justify-between gap-4 border-t border-white/[0.06] pt-1">
              <span className="flex items-center gap-1 text-white/48">
                <Users size={11} className="text-emerald-300/80" aria-hidden /> Avatares no mapa (TTL)
              </span>
              <span className="font-semibold text-emerald-100/90">{presence.peerMetrics.mapPeersOnline}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="flex items-center gap-1 text-white/48">
                <Armchair size={11} className="text-violet-300/75" aria-hidden /> No cinema
              </span>
              <span className="font-semibold text-white/88">{presence.peerMetrics.mapInCinema}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="flex items-center gap-1 text-white/48">
                <Presentation size={11} className="text-sky-300/75" aria-hidden /> Em aula (mapa)
              </span>
              <span className="font-semibold text-white/88">{presence.peerMetrics.mapInLesson}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="flex items-center gap-1 text-white/48">
                <Users size={11} className="text-emerald-300/70" aria-hidden /> A estudar
              </span>
              <span className="font-semibold text-white/88">{presence.peerMetrics.mapStudying}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="flex items-center gap-1 text-white/48">
                <MessageSquareQuote size={11} className="text-amber-200/55" aria-hidden /> Hotspots / sala
              </span>
              <span className="font-semibold text-white/88">{presence.peerMetrics.mapInHotspots}</span>
            </li>
          </>
        ) : null}
      </ul>

      {social?.incomingGestures?.length ? (
        <div className="mt-2 rounded-lg border border-sky-400/18 bg-sky-950/22 px-2 py-1.5">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-sky-200/55">
            Interacções recebidas
          </p>
          <ul className="space-y-1">
            {social.incomingGestures.slice(0, 5).map((g) => (
              <li key={g.id} className="text-[10px] leading-snug text-white/78">
                <span className="font-medium text-white/90">{g.fromLabel}</span>{" "}
                <span className="text-white/55">{g.verbPt}</span>
                {g.emoji ? (
                  <span className="ml-1 text-[11px]" aria-hidden>
                    {g.emoji}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {zonePreview.length ? (
        <div className="mt-2 rounded-lg border border-white/[0.07] bg-black/[0.2] px-2 py-1.5">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40">
            Por zona (conta)
          </p>
          <ul className="space-y-0.5">
            {zonePreview.map((z) => (
              <li key={z.zoneLabel} className="flex justify-between gap-3 text-[10px]">
                <span className="truncate text-white/72">{z.zoneTitlePt}</span>
                <span className="shrink-0 font-semibold tabular-nums text-white/88">{z.count}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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
          Colegas visíveis (conta)
        </p>
        {interactionNote ? (
          <p className="mb-1 text-[10px] text-emerald-100/75" role="status">
            {interactionNote}
          </p>
        ) : null}
        {!social?.peers?.length ? (
          <p className="text-[10px] leading-snug text-white/45">
            Sem outros alunos visíveis com sessão neste momento — aparecem quando exploram o mapa com a
            privacidade activa.
          </p>
        ) : (
          <ul className="max-h-[11rem] space-y-1 overflow-y-auto pr-0.5">
            {social.peers.map((v) => (
              <li
                key={v.peerToken}
                className="rounded-md border border-white/[0.06] bg-black/[0.15] px-2 py-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white/88">{v.displayLabel}</p>
                    <p className="truncate text-[9px] text-white/48">{v.zoneTitlePt}</p>
                    <p className="text-[9px] text-white/42">
                      {v.statusLabelPt} · {v.levelLabel}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-0.5 pt-0.5">
                    <TinyOutlineBtn
                      title="Acenar"
                      disabled={gestureMut.isPending}
                      onClick={() =>
                        gestureMut.mutate({ targetPeerToken: v.peerToken, kind: "wave" })
                      }
                    >
                      <Hand size={13} strokeWidth={2.2} aria-hidden />
                    </TinyOutlineBtn>
                    <TinyOutlineBtn
                      title="Mandar salve"
                      disabled={gestureMut.isPending}
                      onClick={() =>
                        gestureMut.mutate({ targetPeerToken: v.peerToken, kind: "salve" })
                      }
                    >
                      <MessageSquare size={13} strokeWidth={2.2} aria-hidden />
                    </TinyOutlineBtn>
                    <TinyOutlineBtn
                      title="Reagir com emoji"
                      disabled={gestureMut.isPending}
                      onClick={() =>
                        gestureMut.mutate({
                          targetPeerToken: v.peerToken,
                          kind: "emoji",
                          emoji: "👋"
                        })
                      }
                    >
                      <SmilePlus size={13} strokeWidth={2.2} aria-hidden />
                    </TinyOutlineBtn>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-2 border-t border-white/[0.06] pt-2">
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40">
          Visitantes activos (tempo real)
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
            Sem outros visitantes visíveis neste momento no canal do mapa — quando o realtime estiver
            ligado, aparecem aqui com o estado actual (cinema, mural, loja, aula…).
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

      <fieldset className="mt-2 rounded-lg border border-white/[0.06] bg-black/[0.14] px-2 py-1.5">
        <legend className="px-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/38">
          Privacidade na conta
        </legend>
        <div className="space-y-1 pt-0.5">
          {(Object.keys(CAMPUS_SOCIAL_VISIBILITY_LABELS_PT) as CampusSocialVisibility[]).map(
            (key) => (
              <label
                key={key}
                className="flex cursor-pointer items-start gap-2 rounded-md px-1 py-0.5 hover:bg-white/[0.04]"
              >
                <input
                  type="radio"
                  name="campus-social-visibility"
                  className="mt-[3px]"
                  checked={visibilityDraft === key}
                  disabled={prefsMut.isPending || !social}
                  onChange={() => prefsMut.mutate({ visibility: key })}
                />
                <span className="text-[10px] leading-snug text-white/72">
                  {CAMPUS_SOCIAL_VISIBILITY_LABELS_PT[key]}
                </span>
              </label>
            )
          )}
        </div>
        <label className="mt-2 block text-[9px] font-semibold uppercase tracking-[0.12em] text-white/38">
          Estado leve
          <select
            className="mt-1 w-full rounded-md border border-white/[0.12] bg-black/[0.22] px-2 py-1 text-[11px] font-normal text-white/85 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/45"
            disabled={prefsMut.isPending || !social}
            value={statusDraft}
            onChange={(e) =>
              prefsMut.mutate({
                statusLight: e.target.value as CampusSocialStatusLight
              })
            }
          >
            {(Object.keys(CAMPUS_SOCIAL_STATUS_LABELS_PT) as CampusSocialStatusLight[]).map((k) => (
              <option key={k} value={k}>
                {CAMPUS_SOCIAL_STATUS_LABELS_PT[k]}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-1 text-[9px] leading-snug text-white/38">
          Sem mensagens livres — apenas nome público (se permitires), zona actual no campus e interacções
          guiadas. Email e dados sensíveis nunca são mostrados.
        </p>
      </fieldset>
    </div>
  );
});
