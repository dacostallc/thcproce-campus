"use client";

/**
 * Conteúdo da aula: **Cannabis 101** usa primeiro Markdown em `content/courses/cannabis-101/lessons`
 * (sem `lessonFromDb`). Demais áreas: blocos Prisma quando existem; senão Markdown estático se houver
 * ficheiro; senão repositório (`lessonContent`); senão Moodle (legado); senão placeholder de sincronização.
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, HardHat } from "lucide-react";
import { useSession } from "next-auth/react";
import type { Area } from "@/data/courses";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "@/components/campus/blocks/BlockRenderer";
import { LessonExamPanel } from "@/components/campus/LessonExamPanel";
import { CampusLessonVideo } from "./CampusLessonVideo";
import { ClassroomLessonView } from "./ClassroomLessonView";
import { getLessonTitlesForArea } from "@/data/lessonOutline";
import { areaUsesMoodleLessonSnippet } from "@/content/courses";
import {
  buildPanelLessonRichContent,
  type PanelLessonContentResult,
} from "@/lib/campus/buildPanelLessonRichContent";
import { lessonStreamToRich, tryGetManualLessonsForCourse } from "@/data/lessonContent";
import { LessonStaticReadingShell } from "@/components/campus/LessonStaticReadingShell";
import type {
  LessonCinematicHudModel,
  LessonProgressionSnapshot
} from "@/components/campus/lesson-cinema/lessonCinematicTypes";
import { setLastLessonIndex } from "@/lib/campusLastLesson";
import {
  persistLessonMarkUpdate,
  persistLessonPanelVisit,
  CAMPUS_LESSON_MARKS_LS_KEY,
  sumDistinctLocalLessonMarksAcrossAreas,
  computeLocalCoursePctFromMarks
} from "@/lib/campusProgressStorage";
import { markCannabis101FirstLessonBegun, notifyCannabis101StartHintListeners } from "@/lib/campusCannabis101Hint";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { getCampusPanelAccent } from "@/lib/campusAccent";
import { grantLessonCompletionReward } from "@/lib/studentLessonCompletionRewards";
import { grantCampusAreaCompletionCollectibleIfNeeded } from "@/lib/campusModuleCertificateRewards";
import { useRewardToastStore } from "@/stores/rewardToastStore";
import { isCampusAreaConstruction } from "@/config/campusAreaRollout";
import { isCampusAdminEmail } from "@/lib/campusAdmin";
import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101";
import { isCinematicCourse } from "@/content/courses/coursesRegistry";
import {
  persistLessonDwellAccumulatedMs,
  readLessonDwellAccumulatedMs,
  persistLessonVisit
} from "@/lib/lessonAcademicPersistence";
import { recordAcademicStudyMsDelta } from "@/lib/campusAcademicHistoryStorage";
import {
  computeLessonMinimumDwellMs,
  getLessonEstimatedMinutesForArea
} from "@/lib/lessonAcademicRules";
import { completeCampusMissionPhase2IfNeeded } from "@/lib/campusMissionsPhase2Storage";
import {
  buildLessonExperienceSlots,
  resolveLessonExperienceKind
} from "@/components/campus/lesson-experience/buildLessonExperienceSlots";
import { LessonExperienceShell } from "@/components/campus/lesson-experience/LessonExperienceShell";
import { LessonContentSkeleton } from "@/components/campus/lesson-experience/LessonContentSkeleton";
import { XP_REWARD_COMPLETE_LESSON } from "@/lib/progression/xp";

function formatDwellRemaining(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${r}s`;
  return `${m}:${String(r).padStart(2, "0")}`;
}

type LsShape = Record<string, number[]>;

function readLs(): LsShape {
  if (typeof window === "undefined") return {};
  try {
    const j = JSON.parse(localStorage.getItem(CAMPUS_LESSON_MARKS_LS_KEY) ?? "{}") as unknown;
    if (!j || typeof j !== "object" || Array.isArray(j)) return {};
    const o: LsShape = {};
    for (const [k, v] of Object.entries(j)) {
      if (!Array.isArray(v)) continue;
      o[k] = v.filter((x): x is number => typeof x === "number");
    }
    return o;
  } catch {
    return {};
  }
}

function mergeLs(areaId: string, lessonIdx: number): number[] {
  const m = readLs();
  const s = new Set(m[areaId] ?? []);
  s.add(lessonIdx);
  m[areaId] = [...s].sort((a, b) => a - b);
  try {
    localStorage.setItem(CAMPUS_LESSON_MARKS_LS_KEY, JSON.stringify(m));
  } catch {
    /* noop */
  }
  return m[areaId]!;
}

type Props = {
  open: boolean;
  area: Area | null;
  lessonIndex: number;
  allAreas: Area[];
  onClose: () => void;
  onSelectArea: (area: Area) => void;
  onSelectLesson: (idx: number) => void;
};

export function LessonPanel({
  open,
  area,
  lessonIndex,
  allAreas: _allAreas,
  onClose,
  onSelectArea: _onSelectArea,
  onSelectLesson
}: Props) {
  const { status, data: session } = useSession();
  const campusAdmin = isCampusAdminEmail(session?.user?.email ?? null);
  const utils = trpc.useUtils();

  const { data: serverLp } = trpc.campus.lessonProgressMine.useQuery(undefined, {
    enabled: open && status === "authenticated",
    staleTime: 30_000
  });

  const { data: myProg } = trpc.campus.myProgress.useQuery(undefined, {
    enabled: open && status === "authenticated",
    staleTime: 30_000
  });

  const markSeen = trpc.campus.lessonMarkSeen.useMutation({
    onSuccess: () => {
      void utils.campus.lessonProgressMine.invalidate();
      void utils.campus.myProgress.invalidate();
    }
  });

  const lessonFirstOpen = trpc.campus.lessonFirstOpen.useMutation({
    onSuccess: () => {
      void utils.campus.myProgress.invalidate();
    }
  });

  const lessonFirstOpenOnceKeyRef = useRef<string | null>(null);
  const [localTick, setLocalTick] = useState(0);
  const [markCelebration, setMarkCelebration] = useState(false);
  useEffect(() => {
    if (!markCelebration) return;
    const t = window.setTimeout(() => setMarkCelebration(false), 820);
    return () => window.clearTimeout(t);
  }, [markCelebration]);

  const titles = useMemo(() => (area ? getLessonTitlesForArea(area) : []), [area]);

  const serverDone = useMemo(() => {
    if (!area || !serverLp?.byArea) return [] as number[];
    return serverLp.byArea[area.id] ?? [];
  }, [area, serverLp?.byArea]);

  const localDoneAll = readLs();

  const doneSet = useMemo(() => {
    if (!area) return new Set<number>();
    const a = [...(localDoneAll[area.id] ?? [])];
    if (status === "authenticated") a.push(...serverDone);
    return new Set(a);
  }, [area, serverDone, localDoneAll, localTick, status]);

  const clampedLesson = titles.length ? Math.min(Math.max(0, lessonIndex), titles.length - 1) : 0;
  // Layout cinematográfico: sidebar, HUD de XP, botão "Concluir Aula".
  // Ativado via `usesCinematicLayout: true` em coursesRegistry.ts — qualquer curso pode usar.
  const isCannabis101Room = area?.id === CANNABIS101_AREA_ID || isCinematicCourse(area?.id);

  const trailProgressPct =
    titles.length > 0 ? Math.min(100, Math.round((doneSet.size / titles.length) * 100)) : 0;

  useEffect(() => {
    if (!open || !area) return;
    setLastLessonIndex(area.id, clampedLesson);
  }, [open, area?.id, clampedLesson]);

  useEffect(() => {
    if (!open || !area) return;
    persistLessonPanelVisit(area.id, clampedLesson);
    persistLessonVisit(area.id, clampedLesson);
  }, [open, area?.id, clampedLesson]);

  useEffect(() => {
    if (!open || !area) return;
    if (area.id === CANNABIS101_AREA_ID) {
      completeCampusMissionPhase2IfNeeded("campus-p2-cannabis101");
    }
  }, [open, area]);

  useEffect(() => {
    if (!open || !area || area.id !== CANNABIS101_AREA_ID) return;
    if (clampedLesson !== 0) return;
    markCannabis101FirstLessonBegun();
  }, [open, area?.id, clampedLesson]);

  useEffect(() => {
    if (!open || !area || area.id !== CANNABIS101_AREA_ID) return;
    if (clampedLesson <= 0) return;
    notifyCannabis101StartHintListeners();
  }, [open, area?.id, clampedLesson]);

  useEffect(() => {
    if (!open || !area || status !== "authenticated") return;
    const key = `${area.id}:${clampedLesson}`;
    if (lessonFirstOpenOnceKeyRef.current === key) return;
    lessonFirstOpenOnceKeyRef.current = key;
    lessonFirstOpen.mutate({ areaId: area.id, lessonIndex: clampedLesson });
  }, [open, area, clampedLesson, status, lessonFirstOpen]);

  const dwellRef = useRef(0);
  const [dwellLiveMs, setDwellLiveMs] = useState(0);

  const lessonEstimatedMinutes = useMemo(
    () => (area ? getLessonEstimatedMinutesForArea(area.id, clampedLesson) : null),
    [area, clampedLesson]
  );

  const requiredDwellMs = useMemo(
    () => computeLessonMinimumDwellMs(lessonEstimatedMinutes),
    [lessonEstimatedMinutes]
  );

  useEffect(() => {
    if (!area || typeof window === "undefined") return;
    const initial = readLessonDwellAccumulatedMs(area.id, clampedLesson);
    dwellRef.current = initial;
    setDwellLiveMs(initial);
  }, [area, clampedLesson]);

  useEffect(() => {
    if (!open || !area) return;
    let last = Date.now();
    const id = window.setInterval(() => {
      const now = Date.now();
      const delta = now - last;
      last = now;
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      const prevAcc = dwellRef.current;
      dwellRef.current += delta;
      recordAcademicStudyMsDelta(area.id, clampedLesson, prevAcc, dwellRef.current);
      persistLessonDwellAccumulatedMs(area.id, clampedLesson, dwellRef.current);
      setDwellLiveMs(dwellRef.current);
    }, 1000);
    return () => {
      window.clearInterval(id);
      const now = Date.now();
      const delta = now - last;
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        const prevAcc = dwellRef.current;
        dwellRef.current += delta;
        recordAcademicStudyMsDelta(area.id, clampedLesson, prevAcc, dwellRef.current);
        persistLessonDwellAccumulatedMs(area.id, clampedLesson, dwellRef.current);
      }
    };
  }, [open, area, clampedLesson]);

  useEffect(() => {
    if (open) setLocalTick((t) => t + 1);
  }, [open, area?.id]);

  const markCurrent = useCallback(() => {
    if (!area) return;
    const wasNewLocalMark = !doneSet.has(clampedLesson);
    if (!doneSet.has(clampedLesson)) setMarkCelebration(true);
    const mergedMarks = mergeLs(area.id, clampedLesson);
    persistLessonMarkUpdate(area.id);
    if (titles.length > 0 && computeLocalCoursePctFromMarks(area.id) >= 100) {
      grantCampusAreaCompletionCollectibleIfNeeded(area.id);
    }
    const distinctMarkedTotal = sumDistinctLocalLessonMarksAcrossAreas();
    if (distinctMarkedTotal >= 1) completeCampusMissionPhase2IfNeeded("campus-p2-first-lesson-complete");
    if (distinctMarkedTotal >= 3) completeCampusMissionPhase2IfNeeded("campus-p2-three-lessons");
    setLocalTick((t) => t + 1);
    if (wasNewLocalMark) {
      const reward = grantLessonCompletionReward({
        isFirstLocalMarkForThisLesson: true,
        totalLessonsInArea: titles.length,
        lessonsDoneCountAfterMark: mergedMarks.length
      });
      if (reward.applied) {
        useRewardToastStore.getState().showRewardToast({
          credits: reward.creditsAdded,
          xp: reward.xpAdded,
          progressPercent: reward.coursePercentApprox
        });
        void import("@/stores/liveCampusHudFeedStore").then(({ pushLiveCampusHudNotification }) => {
          pushLiveCampusHudNotification("Aula concluída");
        });
      }
    }
    if (area.id === CANNABIS101_AREA_ID) notifyCannabis101StartHintListeners();
    if (status === "authenticated") {
      markSeen.mutate({ areaId: area.id, lessonIndex: clampedLesson });
    }
  }, [area, clampedLesson, status, markSeen, doneSet, titles.length]);

  const already = doneSet.has(clampedLesson);

  /** Título só para casar módulos no WS (outline local); não é corpo da aula. */
  const moodleMatchTitle = titles[clampedLesson] ?? `Aula ${clampedLesson + 1}`;

  const dbLessonQ = trpc.campus.lessonFromDb.useQuery(
    { areaId: area?.id ?? "", lessonIndex: clampedLesson },
    { enabled: open && Boolean(area) && !isCannabis101Room, staleTime: 60_000 },
  );

  const moodleSnippetSupported = Boolean(area && areaUsesMoodleLessonSnippet(area.id));

  const moodleSnippetQ = trpc.campus.moodleLessonSnippet.useQuery(
    { areaId: area?.id ?? "", lessonIndex: clampedLesson, lessonTitle: moodleMatchTitle },
    {
      enabled: open && Boolean(area) && moodleSnippetSupported && !isCannabis101Room,
      staleTime: 60_000,
    },
  );

  /** Cannabis 101: Markdown estático ganha a blocos Prisma; restantes cursos mantêm DB primeiro. */
  const showDbBlockRenderer =
    !isCannabis101Room &&
    !dbLessonQ.isFetching &&
    !dbLessonQ.isError &&
    Boolean(dbLessonQ.data?.blocks?.length);

  const staticLessonLoadEnabled =
    open &&
    Boolean(area) &&
    (isCannabis101Room || (!dbLessonQ.isFetching && !showDbBlockRenderer));

  const staticLessonQ = trpc.campus.staticLessonMarkdown.useQuery(
    { areaId: area?.id ?? "", lessonIndex: clampedLesson },
    { enabled: staticLessonLoadEnabled, staleTime: 300_000 },
  );

  const staticPrefetchOpts = useMemo(
    () => ({ staleTime: 300_000 }) as const,
    [],
  );

  useEffect(() => {
    if (!open || !area || !staticLessonLoadEnabled || titles.length === 0) return;
    if (!staticLessonQ.isSuccess) return;
    const id = area.id;
    if (clampedLesson > 0) {
      void utils.campus.staticLessonMarkdown.prefetch(
        { areaId: id, lessonIndex: clampedLesson - 1 },
        staticPrefetchOpts,
      );
    }
    if (clampedLesson < titles.length - 1) {
      void utils.campus.staticLessonMarkdown.prefetch(
        { areaId: id, lessonIndex: clampedLesson + 1 },
        staticPrefetchOpts,
      );
    }
  }, [
    area,
    clampedLesson,
    open,
    staticLessonLoadEnabled,
    staticLessonQ.isSuccess,
    staticPrefetchOpts,
    titles.length,
    utils,
  ]);

  const staticLessonPayload = staticLessonQ.data?.found ? staticLessonQ.data : null;

  const displayLessonTitle =
    staticLessonPayload?.title.trim() ||
    (isCannabis101Room
      ? ""
      : dbLessonQ.data?.title?.trim() || "") ||
    (moodleSnippetQ.data?.ok === true ? moodleSnippetQ.data.moduleName?.trim() : "") ||
    moodleMatchTitle;

  const cinematicHud = useMemo((): LessonCinematicHudModel | undefined => {
    if (!isCannabis101Room || !area || !staticLessonPayload) return undefined;

    const remainingMs = Math.max(0, requiredDwellMs - dwellLiveMs);
    const dwellMet = dwellLiveMs >= requiredDwellMs;
    const dwellPct =
      requiredDwellMs > 0 ? Math.min(100, (dwellLiveMs / requiredDwellMs) * 100) : 100;
    const completeBlocked = !already && !dwellMet;
    const dwellRemainingLabel = dwellMet
      ? "Permanência mínima cumprida — podes concluir."
      : `Faltam ${formatDwellRemaining(remainingMs)} · o tempo acumula se você sair e voltar`;

    const progression: LessonProgressionSnapshot | null =
      status === "authenticated" && myProg
        ? {
            xp: myProg.xp,
            levelLabel: myProg.levelLabel,
            souvenirCredits: myProg.souvenirCredits,
            progressPercent: myProg.progressPercent,
            nextTierLabel: myProg.nextTierLabel,
            nextTierMinXp: myProg.nextTierMinXp,
            streak: myProg.streak
          }
        : null;

    return {
      areaName: area.name,
      lessonTitleForCrumb: displayLessonTitle,
      isAuthenticated: status === "authenticated",
      progression,
      trailProgressPct,
      doneInArea: doneSet.size,
      totalLessons: titles.length,
      dwellLiveMs,
      dwellRequiredMs: requiredDwellMs,
      dwellPct,
      dwellRemainingLabel,
      alreadyComplete: already,
      completeBlocked,
      onMarkComplete: markCurrent,
      markCompletePending: markSeen.isPending
    };
  }, [
    isCannabis101Room,
    area,
    staticLessonPayload,
    displayLessonTitle,
    status,
    myProg,
    trailProgressPct,
    doneSet,
    titles.length,
    dwellLiveMs,
    requiredDwellMs,
    already,
    markCurrent,
    markSeen.isPending
  ]);

  const manualLessonStream = useMemo(() => {
    if (!area) return undefined;
    const manual = tryGetManualLessonsForCourse(area.id);
    if (!manual || clampedLesson < 0 || clampedLesson >= manual.length) return undefined;
    return manual[clampedLesson];
  }, [area, clampedLesson]);

  const panelLesson = useMemo((): PanelLessonContentResult | null => {
    if (!area) return null;
    const manual = tryGetManualLessonsForCourse(area.id);
    if (manual && clampedLesson >= 0 && clampedLesson < manual.length) {
      const stream = manual[clampedLesson]!;
      const rich = lessonStreamToRich(stream);
      const charCount =
        (rich.intro?.length ?? 0) +
        (rich.body?.length ?? 0) +
        (rich.summary?.length ?? 0) +
        rich.objectives.join("").length +
        rich.materials.join("").length +
        rich.references.join("").length +
        (rich.professorNotes?.length ?? 0);
      return {
        content: rich,
        source: "repository",
        charCount,
      };
    }
    return buildPanelLessonRichContent({
      moodleSnippet: moodleSnippetQ.data ?? null,
      moodleSnippetEnabledForArea: moodleSnippetSupported,
    });
  }, [area, clampedLesson, moodleSnippetQ.data, moodleSnippetSupported]);

  const accent = area?.color ?? "canna";
  const panel = getCampusPanelAccent(accent);
  const underConstruction =
    area != null && isCampusAreaConstruction(area.id) && !campusAdmin;

  const renderMarkLessonToolbar = (_courseArea: Area) => {
    const dwellMet = dwellLiveMs >= requiredDwellMs;
    const remainingMs = Math.max(0, requiredDwellMs - dwellLiveMs);
    const dwellPct = requiredDwellMs > 0 ? Math.min(100, (dwellLiveMs / requiredDwellMs) * 100) : 100;
    const completeBlocked = !already && !dwellMet;

    return (
      <div className="flex flex-col gap-2 border-b border-white/10 pb-3">
        {!already && !dwellMet ? (
          <div
            className={cn(
              "space-y-2 rounded-xl border px-3 py-2.5",
              isCannabis101Room
                ? "border-amber-500/25 bg-[#121c18]"
                : "border-white/12 bg-[#0d1412]"
            )}
            role="status"
          >
            <p className="text-[11px] leading-snug text-white/70">
              Continue estudando para liberar a conclusão.
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-[#1a2220]">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-300",
                  isCannabis101Room ? "bg-amber-500/85" : "bg-emerald-500/85"
                )}
                style={{ width: `${dwellPct}%` }}
              />
            </div>
            <p className="text-[10px] tabular-nums text-white/45">
              Faltam{" "}
              <span className="font-semibold text-white/65">{formatDwellRemaining(remainingMs)}</span>
              {" "}· o tempo acumula se você sair e voltar
            </p>
          </div>
        ) : null}

        <div
          className={cn(
            "rounded-xl border px-3 py-2 backdrop-blur-sm",
            isCannabis101Room
              ? "border-amber-500/15 bg-[#0f1814]/85"
              : "border-white/[0.07] bg-black/20"
          )}
        >
          <p className="text-[10px] leading-relaxed text-white/55">
            {already ? (
              <>
                Esta aula já entrou no teu progresso. A primeira conclusão contou como base{" "}
                <span className="font-semibold tabular-nums text-white/70">
                  +{XP_REWARD_COMPLETE_LESSON} XP
                </span>{" "}
                (mais possíveis bónus de sequência na conta).
              </>
            ) : (
              <>
                Primeira marcação nesta aula:&nbsp;
                <span className="font-semibold tabular-nums text-white/70">
                  +{XP_REWARD_COMPLETE_LESSON} XP
                </span>{" "}
                na progressão quando a conta estiver ligada — fora da sessão, o campus mantém este valor
                localmente até sincronizar.
              </>
            )}
          </p>
        </div>

        <motion.div
          animate={
            markCelebration
              ? { scale: [1, 1.06, 1], boxShadow: ["0 0 0 0 rgba(245, 158, 11, 0)", "0 0 0 8px rgba(245, 158, 11, 0.12)", "0 0 0 0 rgba(245, 158, 11, 0)"] }
              : { scale: 1 }
          }
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex flex-wrap gap-2"
        >
          <Button
            type="button"
            size="sm"
            disabled={already || markSeen.isPending || completeBlocked}
            onClick={markCurrent}
            className={cn(
              "font-bold transition-all",
              already ? "opacity-80" : "",
              isCannabis101Room &&
                !already &&
                dwellMet &&
                "shadow-md shadow-amber-950/40 ring-1 ring-amber-500/30 hover:ring-amber-400/50"
            )}
            title={
              already
                ? "Esta aula já está concluída no seu progresso."
                : completeBlocked
                  ? `Permanência mínima na aula antes de concluir (faltam ${formatDwellRemaining(remainingMs)}).`
                  : `Concluir e registar +${XP_REWARD_COMPLETE_LESSON} XP de base ao marcar pela primeira vez.`
            }
          >
            {already ? (
              <>
                <CheckCircle2 size={16} /> Concluída
              </>
            ) : (
              <>
                <CheckCircle2 size={16} /> Concluir
              </>
            )}
          </Button>
        </motion.div>
      </div>
    );
  };

  const slots = area
    ? buildLessonExperienceSlots(
      resolveLessonExperienceKind(
        underConstruction,
        isCannabis101Room,
        Boolean(staticLessonPayload)
      ),
      {
        area,
        headerBarClassName: panel.headerBar,
        trailProgressPct,
        doneCount: doneSet.size,
        totalLessons: titles.length,
        lessonOrdinalOneBased: clampedLesson + 1,
        isCannabis101Room,
        displayLessonTitle,
        onClose
      },
      {
        constructionNotice: underConstruction ? (
          <div
            className={cn(
              "mb-3 flex shrink-0 items-start gap-2 rounded-xl border px-3 py-2.5 text-xs leading-relaxed text-white/85",
              isCannabis101Room
                ? "border-amber-500/25 bg-amber-950/20"
                : "border-white/12 bg-[#0a100e]"
            )}
            role="status"
          >
            <HardHat className="mt-0.5 size-4 shrink-0 text-amber-200/90" aria-hidden />
            <p>
              <span className="font-semibold text-white">Área em construção colaborativa.</span>{" "}
              O conteúdo deste curso entra em calendário durante o pré-lançamento fundador — use o
              que já está liberado e acompanhe novidades na sala oficial de formação.
            </p>
          </div>
        ) : null,
        srHeading: (
          <h1 id="campus-lesson-heading" className="sr-only">
            {displayLessonTitle}
          </h1>
        ),
        markToolbarSlot: !underConstruction ? (
          <div className="shrink-0">
            {isCannabis101Room && staticLessonPayload ? null : renderMarkLessonToolbar(area)}
          </div>
        ) : null,
        dbSyncLine:
          dbLessonQ.isFetching && !isCannabis101Room ? (
            <LessonContentSkeleton variant="content" className="mb-2" />
          ) : null,
        dbBlockRenderer:
          !dbLessonQ.isFetching && showDbBlockRenderer ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08120e]/92 p-3 shadow-inner backdrop-blur-sm sm:p-4">
              <div className="mt-0 min-h-0 flex-1 overflow-y-auto scrollbar-thin pr-1">
                <BlockRenderer blocks={dbLessonQ.data!.blocks} />
              </div>
            </div>
          ) : null,
        staticLoadingLine:
          staticLessonLoadEnabled &&
          staticLessonQ.isFetching &&
          !(isCannabis101Room && panelLesson) ? (
            <LessonContentSkeleton
              variant={isCannabis101Room ? "cinema" : "content"}
              className="mb-2"
            />
          ) : null,
        staticReadingShell:
          staticLessonLoadEnabled &&
          staticLessonPayload &&
          (isCannabis101Room || !dbLessonQ.isFetching) ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <LessonStaticReadingShell
                key={`static-${area.id}-${clampedLesson}`}
                markdown={staticLessonPayload.markdownContent}
                accent={accent}
                audioId={
                  // Aula de exame não tem narração
                  staticLessonPayload.metadata?.type === "exam"
                    ? undefined
                    : { courseId: staticLessonPayload.courseId, lessonId: staticLessonPayload.lessonId }
                }
                quiz={manualLessonStream?.quiz}
                quizContext={{ areaId: area.id, lessonIndex: clampedLesson }}
                lessonOrdinal={{ current: clampedLesson + 1, total: titles.length }}
                onPrevLesson={() => clampedLesson >= 1 && onSelectLesson(clampedLesson - 1)}
                onNextLesson={() =>
                  clampedLesson < titles.length - 1 && onSelectLesson(clampedLesson + 1)
                }
                prevLessonDisabled={clampedLesson < 1}
                nextLessonDisabled={titles.length === 0 || clampedLesson >= titles.length - 1}
                onExitLesson={onClose}
                isCannabis101Room={isCannabis101Room}
                lessonFrameTitle={displayLessonTitle}
                lessonNav={
                  isCannabis101Room
                    ? {
                        titles,
                        currentIndex: clampedLesson,
                        onSelectLesson,
                        doneIndices: doneSet
                      }
                    : undefined
                }
                cinematicHud={cinematicHud}
                supplement={
                  staticLessonPayload.metadata?.type === "exam" ? (
                    <LessonExamPanel
                      courseId={area.id}
                      lessonId={null}
                      timeLimitSecs={0}
                    />
                  ) : (
                    <CampusLessonVideo
                      areaId={area.id}
                      areaName={area.name}
                      lessonTitle={displayLessonTitle}
                      lessonVisual="compact"
                      hideFallback
                      whenNone={isCannabis101Room ? "large" : "compact"}
                    />
                  )
                }
              />
            </div>
          ) : null,
        classroomLessonView:
          (isCannabis101Room || !dbLessonQ.isFetching) &&
          !showDbBlockRenderer &&
          (!staticLessonQ.isFetching || isCannabis101Room) &&
          !staticLessonPayload &&
          panelLesson ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <ClassroomLessonView
                key={`${area.id}-${clampedLesson}`}
                content={panelLesson.content}
                accent={accent}
                quizContext={{ areaId: area.id, lessonIndex: clampedLesson }}
                lessonQuizCinematic={false}
                lessonOrdinal={{ current: clampedLesson + 1, total: titles.length }}
                onPrevLesson={() => clampedLesson >= 1 && onSelectLesson(clampedLesson - 1)}
                onNextLesson={() =>
                  clampedLesson < titles.length - 1 && onSelectLesson(clampedLesson + 1)
                }
                prevLessonDisabled={clampedLesson < 1}
                nextLessonDisabled={titles.length === 0 || clampedLesson >= titles.length - 1}
                onExitLesson={onClose}
                supplement={
                  <CampusLessonVideo
                    areaId={area.id}
                    areaName={area.name}
                    lessonTitle={displayLessonTitle}
                    lessonVisual="compact"
                    hideFallback
                    whenNone="compact"
                  />
                }
              />
            </div>
          ) : null
      }
    )
    : null;

  return (
    <LessonExperienceShell
      open={Boolean(open && area)}
      onClose={onClose}
      frameClassName={panel.dialog}
      chromeHeader={slots ? slots.chromeHeader : null}
      body={slots ? slots.body : null}
    />
  );
}
