"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/react";
import { useEffect, useMemo, useState } from "react";
import { AvatarPreview } from "@/components/campus/AvatarPreview";
import { CampusProfileInventoryTab } from "@/components/campus/CampusProfileInventoryTab";
import { CampusMissionsPhase2Panel } from "@/components/campus/missions/CampusMissionsPhase2Panel";
import { Button } from "@/components/ui/button";
import { areas } from "@/data/courses";
import { getLessonTitlesForArea } from "@/data/lessonOutline";
import { useCampusProgressClient } from "@/hooks/useCampusProgressClient";
import { useClientHydrated } from "@/hooks/useClientHydrated";
import { useStudentGamification } from "@/hooks/useStudentGamification";
import {
  areaByCampusId,
  CAMPUS_PROGRESS_UPDATED_EVENT
} from "@/lib/campusProgressStorage";
import { cn } from "@/lib/utils";
import {
  countLessonsOpenedOnce,
  listOpenedLessonCountsByCourse
} from "@/lib/campusVisitedLessonsSummary";
import { getEffectiveHudAvatarVariant } from "@/lib/campusStoreClient";
import {
  DEFAULT_LOCAL_STUDENT_DISPLAY_NAME,
  STUDENT_GAMIFICATION_UPDATED_EVENT
} from "@/lib/studentGamificationStorage";
import { getStudentTitleForProfile } from "@/lib/studentTitleCatalog";

type Props = {
  onContinueLastLesson: () => void;
  className?: string;
};

export function CampusLocalProfileModalBody({ onContinueLastLesson, className }: Props) {
  const hydrated = useClientHydrated();
  const g = useStudentGamification();
  const campus = useCampusProgressClient();
  const { status } = useSession();
  const { data: campusPersist } = trpc.campus.campusPersistenceSummary.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 60_000
  });
  const studentTitle = useMemo(() => getStudentTitleForProfile(g).label, [g.xp]);
  const [visitTick, setVisitTick] = useState(0);
  const [modalMainTab, setModalMainTab] = useState<"resumo" | "campus" | "inventario">("resumo");

  useEffect(() => {
    const bump = () => setVisitTick((t) => t + 1);
    window.addEventListener(STUDENT_GAMIFICATION_UPDATED_EVENT, bump);
    window.addEventListener(CAMPUS_PROGRESS_UPDATED_EVENT, bump);
    return () => {
      window.removeEventListener(STUDENT_GAMIFICATION_UPDATED_EVENT, bump);
      window.removeEventListener(CAMPUS_PROGRESS_UPDATED_EVENT, bump);
    };
  }, []);

  const visitedTotal = useMemo(() => {
    if (!hydrated) return 0;
    return countLessonsOpenedOnce();
  }, [visitTick, hydrated]);

  const visitRows = useMemo(() => {
    if (!hydrated) return [];
    return listOpenedLessonCountsByCourse().slice(0, 8);
  }, [visitTick, hydrated]);

  const lastSnap = useMemo(() => {
    const areaId = campus.lastAreaId;
    if (!areaId) return null;
    const area = areaByCampusId(areaId) ?? areas.find((a) => a.id === areaId);
    const idx =
      typeof campus.lastLessonIndex === "number" && Number.isFinite(campus.lastLessonIndex)
        ? Math.max(0, Math.floor(campus.lastLessonIndex))
        : 0;
    const titles = area ? getLessonTitlesForArea(area) : [];
    const label = titles[idx]?.trim() ?? `Aula ${idx + 1}`;
    return { courseName: area?.name ?? areaId, lessonOrdinal: idx + 1, lessonTitle: label };
  }, [campus.lastAreaId, campus.lastLessonIndex]);

  return (
    <div className={cn("space-y-5 text-sm text-white/88", className)}>
      <div
        className="flex gap-1 rounded-xl border border-white/12 bg-black/22 p-1"
        role="tablist"
        aria-label="Perfil rápido no modal"
      >
        <button
          type="button"
          role="tab"
          aria-selected={modalMainTab === "resumo"}
          onClick={() => setModalMainTab("resumo")}
          className={cn(
            "flex-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition sm:text-xs",
            modalMainTab === "resumo"
              ? "bg-canna-500/25 text-canna-50"
              : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
          )}
        >
          Resumo
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={modalMainTab === "campus"}
          onClick={() => setModalMainTab("campus")}
          className={cn(
            "flex-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition sm:text-xs",
            modalMainTab === "campus"
              ? "bg-sky-500/22 text-sky-50"
              : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
          )}
        >
          Meu perfil
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={modalMainTab === "inventario"}
          onClick={() => setModalMainTab("inventario")}
          className={cn(
            "flex-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition sm:text-xs",
            modalMainTab === "inventario"
              ? "bg-emerald-500/22 text-emerald-50"
              : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
          )}
        >
          Inventário
        </button>
      </div>

      {modalMainTab === "inventario" ? (
        <CampusProfileInventoryTab density="modal" hydrated={hydrated} />
      ) : modalMainTab === "campus" ? (
        <div className="space-y-4 rounded-xl border border-white/12 bg-white/[0.03] p-4">
          <div>
            <h3 className="text-base font-bold text-white">Campus persistente</h3>
            <p className="mt-1 text-[12px] leading-snug text-white/55">
              Progresso sincronizado com a tua conta neste mapa (zonas, microaulas, XP de campus).
            </p>
          </div>
          {status !== "authenticated" ? (
            <p className="text-[13px] text-white/58">
              Inicia sessão para ver XP, nível, badges e zonas descobertas no servidor.
            </p>
          ) : !campusPersist ? (
            <p className="text-[13px] text-white/58">A carregar o teu perfil de campus…</p>
          ) : (
            <>
              <dl className="grid gap-3 text-[13px] sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/45">
                    XP total (servidor)
                  </dt>
                  <dd className="font-semibold tabular-nums text-canna-200/95">{campusPersist.xpTotal}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Nível</dt>
                  <dd className="font-semibold text-white">{campusPersist.levelLabel}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/45">
                    Zonas descobertas
                  </dt>
                  <dd className="font-semibold tabular-nums text-white">{campusPersist.zonesDiscovered}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/45">
                    Microaulas concluídas
                  </dt>
                  <dd className="font-semibold tabular-nums text-white">{campusPersist.microLessonsCompleted}</dd>
                </div>
              </dl>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-white/42">Badges</p>
                {campusPersist.badges.length === 0 ? (
                  <p className="mt-2 text-[12px] text-white/52">
                    Ainda sem badges de campus — explora zonas e completa microaulas.
                  </p>
                ) : (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {campusPersist.badges.map((b) => (
                      <li
                        key={`${b.badgeCode}-${b.unlockedAt}`}
                        className="rounded-full border border-white/14 bg-black/25 px-3 py-1 text-[11px] font-medium text-emerald-100/95"
                      >
                        {b.badgeCode}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {campusPersist.topZones.length > 0 ? (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/42">
                    Zonas mais visitadas
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {campusPersist.topZones.map((z) => (
                      <li
                        key={z.zoneLabel}
                        className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.07] bg-black/15 px-3 py-2 text-[12px]"
                      >
                        <span className="min-w-0 truncate font-medium text-white/88">{z.zoneLabel}</span>
                        <span className="shrink-0 tabular-nums text-sky-200/90">{z.visitCount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : (
        <>
      <div className="flex flex-wrap items-start gap-4 rounded-xl border border-white/12 bg-white/[0.04] p-4">
        <AvatarPreview
          variant={getEffectiveHudAvatarVariant(g)}
          size="lg"
          className="shrink-0"
          visualCosmetics={g.visualCosmeticsV1}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-lg font-bold tracking-tight text-white">{g.displayName}</h3>
          <p className="text-[11px] text-amber-200/85">{studentTitle}</p>
          <dl className="mt-2 grid gap-1 text-[12px] sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Nível</dt>
              <dd className="font-semibold tabular-nums text-canna-200/95">{g.level}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/45">XP total</dt>
              <dd className="font-semibold tabular-nums text-white">{g.xp}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Créditos</dt>
              <dd className="font-semibold tabular-nums text-sky-200/95">{g.credits}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Aulas visitadas</dt>
              <dd className="font-semibold tabular-nums text-white">{visitedTotal}</dd>
            </div>
          </dl>
          <p className="pt-1 text-[10px] leading-snug text-white/42">
            Contagem de aulas onde já entraste no painel (XP simbólico aplicado uma vez por aula).
          </p>
        </div>
      </div>

      <CampusMissionsPhase2Panel variant="profile-summary" title="Missões do campus" />

      {lastSnap ? (
        <div className="rounded-xl border border-emerald-400/22 bg-emerald-950/15 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-200/75">Última aula</p>
          <p className="mt-1 text-[13px] font-semibold text-white">{lastSnap.courseName}</p>
          <p className="text-[12px] text-white/72">
            {lastSnap.lessonOrdinal}. {lastSnap.lessonTitle}
          </p>
          <Button
            type="button"
            variant="glass"
            size="sm"
            className="mt-3 gap-1.5 text-[11px]"
            onClick={onContinueLastLesson}
          >
            <Play size={14} className="shrink-0 text-teal-200/95" aria-hidden />
            Continuar última aula
          </Button>
        </div>
      ) : (
        <p className="rounded-xl border border-white/10 bg-black/18 px-4 py-3 text-[13px] text-white/58">
          Abre uma aula no campus para registar o teu ponto de retoma aqui.
        </p>
      )}

      {visitRows.length > 0 ? (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-white/42">Por curso</p>
          <ul className="mt-2 space-y-1.5">
            {visitRows.map((row) => (
              <li
                key={row.areaId}
                className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.07] bg-black/15 px-3 py-2 text-[12px]"
              >
                <span className="min-w-0 truncate font-medium text-white/88">{row.courseName}</span>
                <span className="shrink-0 tabular-nums text-canna-200/90">
                  {row.distinctLessonsVisited}{" "}
                  {row.distinctLessonsVisited === 1 ? "aula" : "aulas"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
        <Button type="button" variant="glass" size="sm" className="text-xs" asChild>
          <Link href="/campus/perfil">Nome, avatar e inventário</Link>
        </Button>
        <p className="w-full text-[11px] leading-relaxed text-white/48">
          Perfil local neste navegador (nome predefinido{" "}
          <strong className="text-white/65">{DEFAULT_LOCAL_STUDENT_DISPLAY_NAME}</strong>). No futuro pode sincronizar
          com o servidor.
        </p>
      </div>
        </>
      )}
    </div>
  );
}
