"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  HardHat
} from "lucide-react";
import { useSession } from "next-auth/react";
import type { Area } from "@/data/courses";
import { cn } from "@/lib/utils";
import { CampusLessonVideo } from "./CampusLessonVideo";
import { LessonRichTabs } from "./LessonRichTabs";
import { Cannabis101LessonList } from "./Cannabis101LessonList";
import { Cannabis101LessonRail } from "./Cannabis101LessonRail";
import { Cannabis101LessonFooter } from "./Cannabis101LessonFooter";
import { CourseMicroBrandBar } from "./CourseMicroBrandBar";
import { getLessonTitlesForArea } from "@/data/lessonOutline";
import { getLessonRichContent } from "@/data/lessonRichContent";
import { setLastLessonIndex } from "@/lib/campusLastLesson";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { getCampusPanelAccent, getRailAccent } from "@/lib/campusAccent";
import { isCampusAreaConstruction } from "@/config/campusAreaRollout";
import { isCampusAdminEmail } from "@/lib/campusAdmin";

const LS_KEY = "thc_campus_lesson_v1";

type LsShape = Record<string, number[]>;

function readLs(): LsShape {
  if (typeof window === "undefined") return {};
  try {
    const j = JSON.parse(localStorage.getItem(LS_KEY) ?? "{}") as unknown;
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
    localStorage.setItem(LS_KEY, JSON.stringify(m));
  } catch {
    /* noop */
  }
  return m[areaId]!;
}

function getMuxDemoId(): string {
  return (
    (typeof process.env.NEXT_PUBLIC_MUX_DEMO_PLAYBACK_ID === "string"
      ? process.env.NEXT_PUBLIC_MUX_DEMO_PLAYBACK_ID.trim()
      : "") || ""
  );
}

function getBunnyIds(): { lib: string; vid: string } {
  const lib =
    (typeof process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID === "string"
      ? process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID.trim()
      : "") || "";
  const vid =
    (typeof process.env.NEXT_PUBLIC_BUNNY_DEMO_VIDEO_ID === "string"
      ? process.env.NEXT_PUBLIC_BUNNY_DEMO_VIDEO_ID.trim()
      : "") || "";
  return { lib, vid };
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
  allAreas,
  onClose,
  onSelectArea,
  onSelectLesson
}: Props) {
  const { status, data: session } = useSession();
  const campusAdmin = isCampusAdminEmail(session?.user?.email ?? null);
  const utils = trpc.useUtils();

  const MUX_DEMO = getMuxDemoId();
  const BUNNY_DEMO = getBunnyIds();

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
  const [mobileDrawer, setMobileDrawer] = useState<null | "lessons" | "progress">(null);
  useEffect(() => {
    if (!open) setMobileDrawer(null);
  }, [open]);

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
    if (!open || !area) return;
    setLastLessonIndex(area.id, clampedLesson);
  }, [open, area?.id, clampedLesson]);

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
    mergeLs(area.id, clampedLesson);
    setLocalTick((t) => t + 1);
    if (status === "authenticated") {
      markSeen.mutate({ areaId: area.id, lessonIndex: clampedLesson });
    }
  }, [area, clampedLesson, status, markSeen]);

  const already = doneSet.has(clampedLesson);

  const lessonTitle = titles[clampedLesson] ?? "Conteúdo";

  const richContent = useMemo(
    () => (area ? getLessonRichContent(area, clampedLesson, lessonTitle) : null),
    [area, clampedLesson, lessonTitle]
  );

  const coursePct = titles.length
    ? Math.min(100, Math.round((doneSet.size / titles.length) * 100))
    : 0;

  const notesStorageKey = `thc_lesson_notes_v2_${area?.id ?? "_"}_${clampedLesson}`;
  const accent = area?.color ?? "canna";
  const panel = getCampusPanelAccent(accent);
  const railTokens = getRailAccent(accent);
  const underConstruction =
    area != null && isCampusAreaConstruction(area.id) && !campusAdmin;
  const richVariant = area?.id === "cannabis-101" ? "cannabis101" : "campus";

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

  return (
    <AnimatePresence>
      {open && area ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[44] pointer-events-auto bg-black/55 backdrop-blur-[2px]"
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
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/40">
                    Aula {clampedLesson + 1} de {titles.length || "—"}
                  </p>
                  <h2
                    id="lesson-panel-title"
                    className="mt-1 text-base font-semibold leading-snug text-white sm:text-lg"
                  >
                    {lessonTitle}
                  </h2>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-black/30 p-0.5 sm:flex">
                    <button
                      type="button"
                      disabled={!prevArea}
                      onClick={() => prevArea && onSelectArea(prevArea)}
                      className="rounded-md p-2 text-white hover:bg-white/10 disabled:opacity-30"
                      aria-label="Curso anterior"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      disabled={!nextArea}
                      onClick={() => nextArea && onSelectArea(nextArea)}
                      className="rounded-md p-2 text-white hover:bg-white/10 disabled:opacity-30"
                      aria-label="Próximo curso"
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
                  <Cannabis101LessonList
                    areaId={area.id}
                    courseName={area.name}
                    accent={accent}
                    {...lessonListProps}
                    className="h-full min-h-0"
                  />
                </aside>

                <main className="relative order-first min-h-0 min-w-0 flex-1 overflow-y-auto scrollbar-thin px-4 py-3 sm:px-6 sm:py-4 md:order-none">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-950/[0.06] to-transparent"
                  />

                  <div className="relative space-y-4">
                    <CourseMicroBrandBar area={area} />

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
                          use o que já está liberado e acompanhe novidades no Moodle.
                        </p>
                      </div>
                    ) : null}

                    <div>
                      <h1
                        id="campus-lesson-heading"
                        className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
                      >
                        {lessonTitle}
                      </h1>
                      <p className="mt-1.5 text-[13px] text-white/45">{area.short}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
                      <Button
                        type="button"
                        size="sm"
                        disabled={already || markSeen.isPending}
                        onClick={markCurrent}
                        className={cn("font-bold", already ? "opacity-70" : "")}
                      >
                        {already ? (
                          <>
                            <CheckCircle2 size={16} /> Aula registada
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} /> Marcar como vista (+8 XP)
                          </>
                        )}
                      </Button>
                      {MUX_DEMO ? (
                        <Button type="button" variant="glass" size="sm" asChild>
                          <Link
                            href={`/aula/${encodeURIComponent(MUX_DEMO)}?course=${encodeURIComponent(area.id)}`}
                          >
                            Mux (página)
                          </Link>
                        </Button>
                      ) : null}
                      {BUNNY_DEMO.lib && BUNNY_DEMO.vid ? (
                        <Button type="button" variant="glass" size="sm" asChild>
                          <Link
                            href={`/aula/${encodeURIComponent(BUNNY_DEMO.vid)}?course=${encodeURIComponent(area.id)}&provider=bunny`}
                          >
                            Bunny (página)
                          </Link>
                        </Button>
                      ) : null}
                    </div>

                    <CampusLessonVideo
                      areaId={area.id}
                      areaName={area.name}
                      lessonTitle={lessonTitle}
                      lessonVisual="compact"
                      hideFallback
                    />

                    {richContent ? (
                      <LessonRichTabs
                        storageKey={notesStorageKey}
                        content={richContent}
                        variant={richVariant}
                        layout="stream"
                        streamAccent={accent}
                      />
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
                  <Cannabis101LessonList
                    areaId={area.id}
                    courseName={area.name}
                    accent={accent}
                    {...lessonListProps}
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
