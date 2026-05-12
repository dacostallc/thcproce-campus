"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, HardHat } from "lucide-react";
import { useSession } from "next-auth/react";
import type { Area } from "@/data/courses";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "@/components/campus/blocks/BlockRenderer";
import { CampusLessonVideo } from "./CampusLessonVideo";
import { Cannabis101CinematicOpening } from "./Cannabis101CinematicOpening";
import { ClassroomLessonView } from "./ClassroomLessonView";
import { getLessonTitlesForArea } from "@/data/lessonOutline";
import { getLessonRichContent } from "@/data/lessonRichContent";
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
import { awardXp, watchAwardStorageKey } from "@/lib/studentGamificationStorage";
import { grantLessonCompletionReward } from "@/lib/studentLessonCompletionRewards";
import { grantCampusAreaCompletionCollectibleIfNeeded } from "@/lib/campusModuleCertificateRewards";
import { useRewardToastStore } from "@/stores/rewardToastStore";
import { isCampusAreaConstruction } from "@/config/campusAreaRollout";
import { isCampusAdminEmail } from "@/lib/campusAdmin";
import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101";
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

const C101_OPENING_SESSION_KEY = "thc-c101-opening-dismissed";

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

  const markSeen = trpc.campus.lessonMarkSeen.useMutation({
    onSuccess: () => {
      void utils.campus.lessonProgressMine.invalidate();
      void utils.campus.myProgress.invalidate();
    }
  });

  const [localTick, setLocalTick] = useState(0);
  const [markCelebration, setMarkCelebration] = useState(false);
  const [c101OpeningDismissed, setC101OpeningDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(C101_OPENING_SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });
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

  useEffect(() => {
    if (!open || area?.id !== CANNABIS101_AREA_ID || clampedLesson !== 0) return;
    try {
      setC101OpeningDismissed(sessionStorage.getItem(C101_OPENING_SESSION_KEY) === "1");
    } catch {
      /* noop */
    }
  }, [open, area?.id, clampedLesson]);

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
    if (!open || !area) return;
    const key = watchAwardStorageKey(area.id, clampedLesson);
    try {
      if (typeof window === "undefined") return;
      if (localStorage.getItem(key) === "1") return;
      localStorage.setItem(key, "1");
    } catch {
      return;
    }
    awardXp(10, "lesson_panel_open");
  }, [open, area?.id, clampedLesson]);

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

  const lessonTitle = titles[clampedLesson] ?? "Conteúdo";

  const richContent = useMemo(
    () => (area ? getLessonRichContent(area, clampedLesson, lessonTitle) : null),
    [area, clampedLesson, lessonTitle],
  );

  const dbLessonQ = trpc.campus.lessonFromDb.useQuery(
    { areaId: area?.id ?? "", lessonIndex: clampedLesson },
    { enabled: open && Boolean(area), staleTime: 60_000 },
  );

  const showDbBlocks =
    !dbLessonQ.isFetching &&
    !dbLessonQ.isError &&
    Boolean(dbLessonQ.data?.blocks?.length);

  const accent = area?.color ?? "canna";
  const panel = getCampusPanelAccent(accent);
  const underConstruction =
    area != null && isCampusAreaConstruction(area.id) && !campusAdmin;
  const isCannabis101Room = area?.id === CANNABIS101_AREA_ID;

  const showC101Cinematic =
    isCannabis101Room && clampedLesson === 0 && !c101OpeningDismissed && !underConstruction;

  const dismissC101Opening = useCallback(() => {
    try {
      sessionStorage.setItem(C101_OPENING_SESSION_KEY, "1");
    } catch {
      /* noop */
    }
    setC101OpeningDismissed(true);
  }, []);

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
                  : "Regista a conclusão da aula e recebe a recompensa de fecho (uma vez)."
            }
          >
            {already ? (
              <>
                <CheckCircle2 size={16} /> Aula concluída
              </>
            ) : (
              <>
                <CheckCircle2 size={16} /> Marcar como concluída
              </>
            )}
          </Button>
        </motion.div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && area ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[44] pointer-events-auto bg-black/70"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="lesson-panel-title"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className={cn(
              "fixed inset-2 sm:inset-4 md:inset-6 z-[45] flex max-h-[calc(100svh-1rem)] min-h-0 flex-col overflow-hidden rounded-2xl border shadow-2xl pointer-events-auto !bg-[#060a08]",
              panel.dialog
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <header
              className={cn(
                "shrink-0 border-b px-4 py-3 sm:px-6 !bg-[#050806]",
                panel.headerBar
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">{area.name}</p>
                  <p
                    className={cn(
                      "mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/38",
                      isCannabis101Room && "tracking-[0.2em] text-amber-200/50"
                    )}
                  >
                    Aula {clampedLesson + 1} de {titles.length || "—"}
                  </p>
                  <h2
                    id="lesson-panel-title"
                    className={cn(
                      "mt-1 text-base font-semibold leading-snug text-white sm:text-lg",
                      isCannabis101Room && "font-semibold tracking-tight text-white sm:text-xl"
                    )}
                  >
                    {lessonTitle}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-[#0a100e] text-white hover:bg-white/10"
                  aria-label="Fechar aula e voltar ao campus"
                >
                  <X size={20} />
                </button>
              </div>
            </header>

            <div
              data-lesson-scroll-root
              className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-5"
            >
              {showC101Cinematic ? (
                <div className="mx-auto mb-3 w-full max-w-3xl shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#080c0a]">
                  <div className="max-h-[min(36svh,320px)] min-h-0 overflow-y-auto scrollbar-thin">
                    <Cannabis101CinematicOpening onEnterLesson={dismissC101Opening} />
                  </div>
                </div>
              ) : null}

              <div id="c101-after-cinematic" className="scroll-mt-3" />

              {underConstruction ? (
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
              ) : null}

              <h1 id="campus-lesson-heading" className="sr-only">
                {lessonTitle}
              </h1>
              {area.short ? (
                <p
                  className={cn(
                    "mb-3 shrink-0 text-center text-[13px] leading-relaxed text-white/45 sm:text-left",
                    isCannabis101Room && "text-amber-100/45"
                  )}
                >
                  {area.short}
                </p>
              ) : null}

              {!underConstruction ? (
                <div className="shrink-0">{renderMarkLessonToolbar(area)}</div>
              ) : null}

              {dbLessonQ.isFetching ? (
                <p className="mb-2 shrink-0 text-xs text-white/45">A sincronizar conteúdo da aula…</p>
              ) : null}

              {showDbBlocks ? (
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-emerald-500/25 bg-[#0a100e] p-3 sm:p-4">
                  <div
                    className="shrink-0 rounded-xl border border-emerald-500/20 bg-[#0a1814] px-3 py-2 text-[11px] text-emerald-100/90"
                    role="status"
                  >
                    Conteúdo desta aula: <strong>CMS</strong> (piloto). Slugs:{" "}
                    <span className="font-mono text-[10px] opacity-90">
                      {dbLessonQ.data!.courseSlug}/{dbLessonQ.data!.moduleSlug}/
                      {dbLessonQ.data!.lessonSlug}
                    </span>
                  </div>
                  <div className="mt-2 min-h-0 flex-1 overflow-y-auto scrollbar-thin pr-1">
                    <BlockRenderer blocks={dbLessonQ.data!.blocks} />
                  </div>
                </div>
              ) : null}

              {!showDbBlocks && richContent ? (
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <ClassroomLessonView
                    key={`${area.id}-${clampedLesson}`}
                    content={richContent}
                    accent={accent}
                    quizContext={{ areaId: area.id, lessonIndex: clampedLesson }}
                    lessonQuizCinematic={isCannabis101Room}
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
                        lessonTitle={lessonTitle}
                        lessonVisual="compact"
                        hideFallback
                        whenNone="compact"
                      />
                    }
                  />
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
