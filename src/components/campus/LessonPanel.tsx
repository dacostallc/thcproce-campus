"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  HardHat,
  MapPin
} from "lucide-react";
import { useSession } from "next-auth/react";
import type { Area } from "@/data/courses";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "@/components/campus/blocks/BlockRenderer";
import { CampusLessonVideo } from "./CampusLessonVideo";
import { LessonRichTabs } from "./LessonRichTabs";
import { CampusLessonSidebar } from "./CampusLessonSidebar";
import { Cannabis101LessonRail } from "./Cannabis101LessonRail";
import { Cannabis101LessonFooter } from "./Cannabis101LessonFooter";
import { Cannabis101CinematicOpening } from "./Cannabis101CinematicOpening";
import { CourseMicroBrandBar } from "./CourseMicroBrandBar";
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
import { getCampusPanelAccent, getRailAccent } from "@/lib/campusAccent";
import { awardXp, watchAwardStorageKey } from "@/lib/studentGamificationStorage";
import { grantLessonCompletionReward } from "@/lib/studentLessonCompletionRewards";
import { grantCampusAreaCompletionCollectibleIfNeeded } from "@/lib/campusModuleCertificateRewards";
import { useRewardToastStore } from "@/stores/rewardToastStore";
import { isCampusAreaConstruction } from "@/config/campusAreaRollout";
import { isCampusAdminEmail } from "@/lib/campusAdmin";
import { lessonRichTabsVariantForArea } from "@/content/courses";
import { CANNABIS101_AREA_ID, getCannabis101StreamChapter } from "@/content/courses/cannabis-101";
import {
  persistLessonDwellAccumulatedMs,
  readLessonDwellAccumulatedMs,
  persistLessonVisit,
  readLessonVisitedIndices
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
  allAreas,
  onClose,
  onSelectArea,
  onSelectLesson
}: Props) {
  const { status, data: session } = useSession();
  const campusAdmin = isCampusAdminEmail(session?.user?.email ?? null);
  const utils = trpc.useUtils();

  const { data: serverLp } = trpc.campus.lessonProgressMine.useQuery(undefined, {
    enabled: open && status === "authenticated",
    staleTime: 30_000
  });

  const { data: progressUi } = trpc.campus.myProgress.useQuery(undefined, {
    enabled: open && status === "authenticated",
    staleTime: 20_000
  });
  const markSeen = trpc.campus.lessonMarkSeen.useMutation({
    onSuccess: () => {
      void utils.campus.lessonProgressMine.invalidate();
      void utils.campus.myProgress.invalidate();
    }
  });

  const [localTick, setLocalTick] = useState(0);
  const [visitTick, setVisitTick] = useState(0);
  const [mobileDrawer, setMobileDrawer] = useState<null | "lessons" | "progress">(null);
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
    if (!open) setMobileDrawer(null);
  }, [open]);

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

  const visitedSet = useMemo(() => {
    if (!area) return new Set<number>();
    return readLessonVisitedIndices(area.id);
  }, [area?.id, visitTick, localTick]);

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
    setVisitTick((t) => t + 1);
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

  const areaIdx = useMemo(() => {
    if (!area) return -1;
    return allAreas.findIndex((x) => x.id === area.id);
  }, [area, allAreas]);

  const prevArea = area && areaIdx > 0 ? allAreas[areaIdx - 1]! : null;
  const nextArea =
    area && areaIdx >= 0 && areaIdx < allAreas.length - 1 ? allAreas[areaIdx + 1]! : null;

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

  const coursePct = titles.length
    ? Math.min(100, Math.round((doneSet.size / titles.length) * 100))
    : 0;

  const notesStorageKey = `thc_lesson_notes_v2_${area?.id ?? "_"}_${clampedLesson}`;
  const accent = area?.color ?? "canna";
  const panel = getCampusPanelAccent(accent);
  const railTokens = getRailAccent(accent);
  const underConstruction =
    area != null && isCampusAreaConstruction(area.id) && !campusAdmin;
  const richVariant = lessonRichTabsVariantForArea(area?.id);

  const streamChapter = useMemo(() => {
    if (!area || area.id !== CANNABIS101_AREA_ID) return null;
    return getCannabis101StreamChapter(clampedLesson);
  }, [area?.id, clampedLesson]);

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

  const progressPayload =
    status === "authenticated" && progressUi
      ? {
          xp: progressUi.xp,
          levelLabel: progressUi.levelLabel,
          levelKey: progressUi.levelKey,
          streak: progressUi.streak
        }
      : null;

  const lessonListProps = {
    titles,
    activeIndex: clampedLesson,
    doneSet,
    onSelectLesson,
    onNextLesson: () => {
      if (clampedLesson < titles.length - 1) {
        onSelectLesson(clampedLesson + 1);
      }
    },
    nextLessonDisabled: titles.length === 0 || clampedLesson >= titles.length - 1
  };

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
                ? "border-amber-500/25 bg-amber-950/15"
                : "border-white/12 bg-black/30"
            )}
            role="status"
          >
            <p className="text-[11px] leading-snug text-white/70">
              Continue estudando para liberar a conclusão.
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-black/45">
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

        <p className="text-[10px] text-white/40">
          Ao abrir a aula: +10 XP de visita (uma vez por aula).
          {" "}Concluir vale recompensa separada ao clicar no botão.
        </p>

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
                <Sparkles size={16} /> Marcar como concluída
              </>
            )}
          </Button>
        </motion.div>
      </div>
    );
  };

  const cannabisIntroSnippet = richContent?.intro?.trim();
  const skipCannabisTabsIntro =
    Boolean(isCannabis101Room && cannabisIntroSnippet && cannabisIntroSnippet.length > 0);

  return (
    <AnimatePresence>
      {open && area ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[44] pointer-events-auto bg-black/65 backdrop-blur-[0.5px]"
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
              "fixed inset-2 sm:inset-4 md:inset-6 z-[45] flex max-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl pointer-events-auto",
              panel.dialog
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <header
              className={cn("shrink-0 border-b px-4 py-3 sm:px-6", panel.headerBar)}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/55">{area.name}</p>
                  <p
                    className={cn(
                      "mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/40",
                      isCannabis101Room && "tracking-[0.2em] text-amber-200/55"
                    )}
                  >
                    Aula {clampedLesson + 1} de {titles.length || "—"}
                  </p>
                  <h2
                    id="lesson-panel-title"
                    className={cn(
                      "mt-1 text-base font-semibold leading-snug text-white sm:text-lg",
                      isCannabis101Room &&
                        "font-bold tracking-tight text-[1.05rem] sm:text-xl md:text-2xl bg-gradient-to-r from-white via-white to-amber-100/95 bg-clip-text text-transparent"
                    )}
                  >
                    {lessonTitle}
                  </h2>
                  {titles.length > 0 ? (
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <div
                        className="inline-flex items-center rounded-lg border border-white/12 bg-black/35 p-0.5 shadow-inner"
                        title="Aulas deste curso"
                      >
                        <button
                          type="button"
                          disabled={clampedLesson < 1}
                          onClick={() => clampedLesson >= 1 && onSelectLesson(clampedLesson - 1)}
                          className="rounded-md p-1.5 text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label="Aula anterior"
                        >
                          <ChevronLeft size={17} />
                        </button>
                        <span className="min-w-[3.25rem] px-1.5 text-center text-[11px] font-bold tabular-nums text-white/75">
                          {clampedLesson + 1}/{titles.length}
                        </span>
                        <button
                          type="button"
                          disabled={clampedLesson >= titles.length - 1}
                          onClick={() =>
                            clampedLesson < titles.length - 1 && onSelectLesson(clampedLesson + 1)
                          }
                          className="rounded-md p-1.5 text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label="Próxima aula"
                        >
                          <ChevronRight size={17} />
                        </button>
                      </div>
                      <span className="hidden text-[10px] text-white/38 sm:inline">
                        Aulas deste curso · no canto, setas trocam de curso no mapa
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div
                    className="hidden items-center gap-1 rounded-lg border border-white/10 bg-black/30 p-0.5 sm:flex"
                    title="Navegar para outro curso no mapa do campus"
                  >
                    <button
                      type="button"
                      disabled={!prevArea}
                      onClick={() => prevArea && onSelectArea(prevArea)}
                      className="rounded-md p-2 text-white hover:bg-white/10 disabled:opacity-30"
                      aria-label="Curso anterior no mapa"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      disabled={!nextArea}
                      onClick={() => nextArea && onSelectArea(nextArea)}
                      className="rounded-md p-2 text-white hover:bg-white/10 disabled:opacity-30"
                      aria-label="Próximo curso no mapa"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white hover:bg-white/10"
                    aria-label="Fechar aulas"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex min-h-0 flex-1 flex-col md:flex-row">
                <aside
                  className={cn(
                    "hidden min-h-0 w-[min(100%,272px)] shrink-0 flex-col md:sticky md:top-0 md:z-[1] md:flex md:max-h-[calc(100svh-9rem)] md:self-start md:overflow-hidden",
                    panel.asideLeft
                  )}
                >
                  <CampusLessonSidebar
                    areaId={area.id}
                    accent={accent}
                    {...lessonListProps}
                    visitedSet={visitedSet}
                    className="h-full min-h-0"
                  />
                </aside>

                <main
                  data-lesson-scroll-root
                  className={cn(
                    "relative order-first min-h-0 min-w-0 flex-1 overflow-y-auto scrollbar-thin px-4 py-4 sm:px-7 sm:py-5 md:order-none",
                    /**
                     * Cannabis 101 · mobile: a barra «Voltar ao campus / Próxima aula» é sticky no fundo
                     * do mesmo scrollport — sem este espaço o quiz fica por baixo e os cliques caem na barra.
                     */
                    isCannabis101Room &&
                      "max-md:pb-[calc(12.5rem+env(safe-area-inset-bottom,0px))]"
                  )}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-950/[0.06] to-transparent"
                  />

                  <div className="relative space-y-4">
                    {showC101Cinematic ? (
                      <Cannabis101CinematicOpening onEnterLesson={dismissC101Opening} />
                    ) : null}

                    <div id="c101-after-cinematic" className="scroll-mt-3" />

                    {!showC101Cinematic ? (
                      <CourseMicroBrandBar area={area} lessonIndex={clampedLesson} />
                    ) : null}

                    {underConstruction ? (
                      <div
                        className={cn(
                          "flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs leading-relaxed text-white/85",
                          railTokens.milestoneCard
                        )}
                        role="status"
                      >
                        <HardHat className="mt-0.5 size-4 shrink-0 text-amber-200/90" aria-hidden />
                        <p>
                          <span className="font-semibold text-white">Área em construção colaborativa.</span>{" "}
                          O conteúdo deste curso entra em calendário durante o pré-lançamento fundador —
                          use o que já está liberado e acompanhe novidades na sala oficial de formação.
                        </p>
                      </div>
                    ) : null}

                    {isCannabis101Room ? (
                      <>
                        <h1 id="campus-lesson-heading" className="sr-only">
                          {lessonTitle}
                        </h1>
                        {area.short ? (
                          <p className="text-[13px] leading-relaxed text-amber-100/55">{area.short}</p>
                        ) : null}
                      </>
                    ) : (
                      <div>
                        <h1
                          id="campus-lesson-heading"
                          className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
                        >
                          {lessonTitle}
                        </h1>
                        <p className="mt-1.5 text-[13px] text-white/45">{area.short}</p>
                      </div>
                    )}

                    {isCannabis101Room ? (
                      <>
                        {cannabisIntroSnippet ? (
                          <div
                            className="rounded-xl border border-amber-500/30 bg-[#0c1614] px-3.5 py-3 shadow-inner shadow-black/30 ring-1 ring-amber-500/15 sm:px-4 sm:py-3.5"
                            role="note"
                          >
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200/75">
                              Começa assim
                            </p>
                            <p className="mt-2 text-[14px] leading-relaxed text-white/[0.88] sm:text-[15px]">
                              {cannabisIntroSnippet}
                            </p>
                          </div>
                        ) : null}
                        {titles.length ? (
                          <div
                            className="rounded-xl border border-amber-500/25 bg-[#0c1614] px-3 py-2.5"
                            aria-label={`Progresso: ${doneSet.size} de ${titles.length} aulas concluídas`}
                          >
                            <div className="flex items-center justify-between text-[11px] text-white/55">
                              <span className="font-semibold uppercase tracking-wide text-white/60">
                                Progresso
                              </span>
                              <span className="tabular-nums font-bold text-white/80">
                                {doneSet.size}/{titles.length} concluídas
                              </span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/40">
                              <div
                                className="h-full rounded-full bg-emerald-500/90 transition-[width] duration-300"
                                style={{ width: `${coursePct}%` }}
                              />
                            </div>
                          </div>
                        ) : null}
                        {renderMarkLessonToolbar(area)}
                      </>
                    ) : (
                      <>
                        {renderMarkLessonToolbar(area)}
                        <CampusLessonVideo
                          areaId={area.id}
                          areaName={area.name}
                          lessonTitle={lessonTitle}
                          lessonVisual="compact"
                          hideFallback
                        />
                      </>
                    )}

                    {dbLessonQ.isFetching ? (
                      <p className="text-xs text-white/45">A sincronizar conteúdo da aula…</p>
                    ) : null}

                    {showDbBlocks ? (
                      <>
                        <div
                          className="rounded-xl border border-emerald-500/25 bg-emerald-950/15 px-3 py-2 text-[11px] text-emerald-100/90"
                          role="status"
                        >
                          Conteúdo desta aula: <strong>CMS</strong> (piloto). Slugs:{" "}
                          <span className="font-mono text-[10px] opacity-90">
                            {dbLessonQ.data!.courseSlug}/{dbLessonQ.data!.moduleSlug}/
                            {dbLessonQ.data!.lessonSlug}
                          </span>
                        </div>
                        <BlockRenderer blocks={dbLessonQ.data!.blocks} />
                      </>
                    ) : null}

                    {!showDbBlocks && richContent ? (
                      <LessonRichTabs
                        storageKey={notesStorageKey}
                        content={richContent}
                        variant={richVariant}
                        layout="stream"
                        streamAccent={accent}
                        streamChapter={streamChapter}
                        skipIntroSection={skipCannabisTabsIntro}
                        lessonQuizContext={{ areaId: area.id, lessonIndex: clampedLesson }}
                      />
                    ) : null}

                    {isCannabis101Room ? (
                      <CampusLessonVideo
                        areaId={area.id}
                        areaName={area.name}
                        lessonTitle={lessonTitle}
                        lessonVisual="compact"
                        hideFallback
                        whenNone="compact"
                      />
                    ) : null}

                    {isCannabis101Room ? (
                      <div
                        className={cn(
                          "flex flex-col gap-2 border-t border-white/12 pt-4 sm:flex-row sm:items-center sm:justify-between",
                          "-mx-4 px-4 sm:-mx-7 sm:px-7 md:mx-0 md:px-0",
                          "max-md:sticky max-md:bottom-0 max-md:z-[15] max-md:border-white/20 max-md:bg-black/[0.92] max-md:pb-8 max-md:pt-5 max-md:shadow-[0_-12px_40px_rgba(0,0,0,0.5)] max-md:backdrop-blur-[9px]",
                          "md:border-white/12 md:bg-transparent md:pb-0 md:shadow-none md:backdrop-blur-none md:static"
                        )}
                      >
                        <Button
                          type="button"
                          variant="glass"
                          className="w-full justify-center sm:w-auto sm:min-w-[10rem]"
                          onClick={onClose}
                        >
                          <MapPin className="mr-2 size-4 shrink-0" aria-hidden />
                          Voltar ao campus
                        </Button>
                        <Button
                          type="button"
                          className="w-full justify-center font-bold sm:w-auto sm:min-w-[10rem]"
                          disabled={titles.length === 0 || clampedLesson >= titles.length - 1}
                          onClick={() => {
                            if (clampedLesson < titles.length - 1) {
                              onSelectLesson(clampedLesson + 1);
                            }
                          }}
                        >
                          Próxima aula
                          <ChevronRight className="ml-1 size-4 shrink-0" aria-hidden />
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-white/10 pt-4 sm:hidden">
                    <Button
                      type="button"
                      variant="glass"
                      size="sm"
                      disabled={!prevArea}
                      onClick={() => prevArea && onSelectArea(prevArea)}
                    >
                      <ChevronLeft size={16} /> Curso ant.
                    </Button>
                    <Button
                      type="button"
                      variant="glass"
                      size="sm"
                      disabled={!nextArea}
                      onClick={() => nextArea && onSelectArea(nextArea)}
                    >
                      Próx. curso <ChevronRight size={16} />
                    </Button>
                  </div>
                </main>

                <aside
                  className={cn(
                    "hidden min-h-0 w-[min(100%,268px)] shrink-0 flex-col md:flex",
                    panel.asideRight
                  )}
                >
                  <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin p-2.5">
                    <Cannabis101LessonRail
                      accent={accent}
                      coursePct={coursePct}
                      doneCount={doneSet.size}
                      totalLessons={titles.length}
                      courseHoursLabel={area.hours}
                      progressUi={progressPayload}
                      chapterMeta={streamChapter}
                      onBackToCampus={onClose}
                    />
                    <div className="mt-4 border-t border-white/10 pt-3">
                      <div
                        className={cn(
                          "px-1 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em]",
                          railTokens.outrasKicker
                        )}
                      >
                        Outras áreas
                      </div>
                      <ul className="space-y-0.5">
                        {allAreas.map((a) => (
                          <li key={a.id}>
                            <button
                              type="button"
                              onClick={() => onSelectArea(a)}
                              className={cn(
                                "w-full truncate rounded-lg px-2.5 py-1.5 text-left text-[11px] transition-colors",
                                a.id === area.id
                                  ? panel.railActiveRow
                                  : "text-white/65 hover:bg-white/8 hover:text-white"
                              )}
                            >
                              {a.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>

              <div
                className={cn(
                  "flex shrink-0 gap-2 border-t p-2 md:hidden",
                  panel.mobileDock
                )}
              >
                <Button
                  type="button"
                  variant="glass"
                  className="flex-1 font-bold text-white/90"
                  onClick={() => setMobileDrawer("lessons")}
                >
                  Aulas
                </Button>
                <Button
                  type="button"
                  variant="glass"
                  className="flex-1 font-bold text-white/90"
                  onClick={() => setMobileDrawer("progress")}
                >
                  Progresso
                </Button>
              </div>
            </div>

            {mobileDrawer === "lessons" ? (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-[46] bg-black/70 backdrop-blur-sm md:hidden"
                  aria-label="Fechar menu de aulas"
                  onClick={() => setMobileDrawer(null)}
                />
                <div
                  className={cn(
                    "fixed inset-y-0 left-0 z-[47] flex w-[min(100vw-2.5rem,360px)] max-w-full flex-col border-r shadow-2xl md:hidden",
                    panel.drawer
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between px-3 py-3",
                      panel.drawerHeader
                    )}
                  >
                    <span className="text-sm font-bold text-white">Programa da aula</span>
                    <button
                      type="button"
                      onClick={() => setMobileDrawer(null)}
                      className="rounded-lg p-2 text-white/70 hover:bg-white/10"
                      aria-label="Fechar"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <CampusLessonSidebar
                    areaId={area.id}
                    accent={accent}
                    {...lessonListProps}
                    visitedSet={visitedSet}
                    onSelectLesson={(i) => {
                      onSelectLesson(i);
                      setMobileDrawer(null);
                    }}
                    onNextLesson={() => {
                      if (clampedLesson < titles.length - 1) {
                        onSelectLesson(clampedLesson + 1);
                        setMobileDrawer(null);
                      }
                    }}
                    className="min-h-0 flex-1"
                  />
                </div>
              </>
            ) : null}

            {mobileDrawer === "progress" ? (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-[46] bg-black/70 backdrop-blur-sm md:hidden"
                  aria-label="Fechar progresso"
                  onClick={() => setMobileDrawer(null)}
                />
                <div
                  className={cn(
                    "fixed inset-y-0 right-0 z-[47] flex w-[min(100vw-2.5rem,360px)] max-w-full flex-col border-l shadow-2xl md:hidden",
                    panel.drawer
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between px-3 py-3",
                      panel.drawerHeader
                    )}
                  >
                    <span className="text-sm font-bold text-white">Progresso</span>
                    <button
                      type="button"
                      onClick={() => setMobileDrawer(null)}
                      className="rounded-lg p-2 text-white/70 hover:bg-white/10"
                      aria-label="Fechar"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin p-3">
                    <Cannabis101LessonRail
                      accent={accent}
                      coursePct={coursePct}
                      doneCount={doneSet.size}
                      totalLessons={titles.length}
                      courseHoursLabel={area.hours}
                      progressUi={progressPayload}
                      onBackToCampus={() => {
                        setMobileDrawer(null);
                        onClose();
                      }}
                    />
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <div
                        className={cn(
                          "px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.2em]",
                          railTokens.outrasKicker
                        )}
                      >
                        Outras áreas
                      </div>
                      <ul className="space-y-0.5">
                        {allAreas.map((a) => (
                          <li key={a.id}>
                            <button
                              type="button"
                              onClick={() => {
                                onSelectArea(a);
                                setMobileDrawer(null);
                              }}
                              className={cn(
                                "w-full truncate rounded-lg px-3 py-2 text-left text-xs transition-colors",
                                a.id === area.id
                                  ? panel.railActiveRow
                                  : "text-white/65 hover:bg-white/8 hover:text-white"
                              )}
                            >
                              {a.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            <Cannabis101LessonFooter
              accent={accent}
              userName={session?.user?.name}
              levelLabel={progressUi?.levelLabel}
            />
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
