"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Sparkles,
  ExternalLink,
  ChevronDown as CourseNavIcon,
  NotebookText,
  Trophy,
  Flame,
  TrendingUp
} from "lucide-react";
import { useSession } from "next-auth/react";
import type { Area } from "@/data/courses";
import { cn } from "@/lib/utils";
import { CampusLessonVideo } from "./CampusLessonVideo";
import { LessonRichTabs } from "./LessonRichTabs";
import { Cannabis101LessonRail } from "./Cannabis101LessonRail";
import { Cannabis101LessonFooter } from "./Cannabis101LessonFooter";
import { getLessonTitlesForArea } from "@/data/lessonOutline";
import { getLessonRichContent } from "@/data/lessonRichContent";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { useCampusSkyStore } from "@/stores/campusSkyStore";

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

const colorAccent = {
  canna: "from-canna-500/25 to-canna-800/10 border-canna-400/35",
  purple: "from-purple-500/25 to-purple-900/10 border-purple-400/35",
  amber: "from-amber-500/25 to-amber-900/10 border-amber-400/35",
  cyan: "from-cyan-500/25 to-cyan-900/10 border-cyan-400/35",
  rose: "from-rose-500/25 to-rose-900/10 border-rose-400/35"
} as const;

const MOODLE_ESCOLA = "https://thcproce.com.br/escola";

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
  const sky = useCampusSkyStore((s) => s.sky);
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
  const { data: badgeData } = trpc.campus.myBadges.useQuery(undefined, {
    enabled: open && status === "authenticated",
    staleTime: 60_000
  });

  const markSeen = trpc.campus.lessonMarkSeen.useMutation({
    onSuccess: () => {
      void utils.campus.lessonProgressMine.invalidate();
      void utils.campus.myProgress.invalidate();
    }
  });

  const [localTick, setLocalTick] = useState(0);
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

  const areaIdx = useMemo(() => {
    if (!area) return -1;
    return allAreas.findIndex((x) => x.id === area.id);
  }, [area, allAreas]);

  const prevArea = area && areaIdx > 0 ? allAreas[areaIdx - 1]! : null;
  const nextArea =
    area && areaIdx >= 0 && areaIdx < allAreas.length - 1
      ? allAreas[areaIdx + 1]!
      : null;

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
  const isCannabis101 = area?.id === "cannabis-101";

  return (
    <AnimatePresence>
      {open && area ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-[44] pointer-events-auto backdrop-blur-[2px]",
              sky === "day"
                ? "bg-gradient-to-b from-sky-100/15 via-slate-900/30 to-slate-950/55"
                : "bg-gradient-to-b from-black/25 via-ink-950/50 to-black/45"
            )}
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
              isCannabis101
                ? "border-amber-500/35 bg-[#040a07]/98 backdrop-blur-md"
                : "border-canna-400/25 glass-strong"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <header
              className={cn(
                "shrink-0 border-b px-4 py-3 sm:px-6 sm:py-4",
                isCannabis101
                  ? "border-amber-500/20 bg-gradient-to-r from-[#0a1810] via-[#06120d] to-[#040807]"
                  : cn("border-white/10 bg-gradient-to-br", colorAccent[area.color])
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/70 font-semibold flex items-center gap-2">
                    <NotebookText size={14} className="text-canna-300" />
                    Sala virtual · no campus
                  </p>
                  <h2
                    id="lesson-panel-title"
                    className="mt-1 text-xl sm:text-2xl font-bold text-white text-shadow-soft truncate"
                  >
                    {area.name}
                  </h2>
                  <p className="text-sm text-white/75 line-clamp-2">{area.short}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-1 rounded-xl border border-white/15 bg-black/20 p-1">
                    <button
                      type="button"
                      disabled={!prevArea}
                      onClick={() => prevArea && onSelectArea(prevArea)}
                      className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 text-white"
                      aria-label="Curso anterior"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      disabled={!nextArea}
                      onClick={() => nextArea && onSelectArea(nextArea)}
                      className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 text-white"
                      aria-label="Próximo curso"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 text-white"
                    aria-label="Fechar aulas"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 space-y-4">
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-2 text-xs",
                    isCannabis101 ? "text-amber-100/55" : "text-white/60"
                  )}
                >
                  <span>
                    Aula {clampedLesson + 1} / {titles.length || "—"}
                  </span>
                  <span className="text-white/25">·</span>
                  <span
                    className={cn(
                      "font-medium",
                      isCannabis101 ? "text-amber-200/90" : "text-canna-200/90"
                    )}
                  >
                    {lessonTitle}
                  </span>
                </div>

                {status === "authenticated" && progressUi && !isCannabis101 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-3 justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 text-canna-200 font-semibold">
                        <TrendingUp size={14} /> {progressUi.levelLabel} · {progressUi.xp} XP
                      </span>
                      {badgeData?.badges?.length ? (
                        <span className="inline-flex items-center gap-1 text-amber-200/90">
                          <Trophy size={14} />
                          {badgeData.badges.map((b) => b.label).join(" · ")}
                        </span>
                      ) : null}
                      {typeof badgeData?.streakDays === "number" && badgeData.streakDays > 0 ? (
                        <span className="inline-flex items-center gap-1 text-orange-200/90">
                          <Flame size={14} /> Streak {badgeData.streakDays}d
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] uppercase tracking-wider text-white/45 mb-1">
                        <span>Progresso neste curso</span>
                        <span className="text-canna-300 font-bold">{coursePct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-canna-600 to-amber-400 transition-all duration-500"
                          style={{ width: `${coursePct}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-[10px] text-white/40">
                        {doneSet.size} de {titles.length} aulas com vista registada neste curso
                      </p>
                    </div>
                  </div>
                ) : null}

                {!isCannabis101 && status !== "authenticated" ? (
                  <p className="text-[11px] text-white/45">
                    Entre com sua conta para ver nível, XP, conquistas e progresso global.
                  </p>
                ) : null}

                <CampusLessonVideo
                  areaId={area.id}
                  areaName={area.name}
                  lessonTitle={lessonTitle}
                />

                {richContent ? (
                  <LessonRichTabs
                    storageKey={notesStorageKey}
                    content={richContent}
                    variant={isCannabis101 ? "cannabis101" : "default"}
                  />
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={already || markSeen.isPending}
                    onClick={markCurrent}
                    className={already ? "opacity-70" : ""}
                  >
                    {already ? (
                      <>
                        <CheckCircle2 size={16} /> Aula registada
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Marcar vista (+8 XP)
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="glass" size="sm" asChild>
                    <Link href={MOODLE_ESCOLA} target="_blank" rel="noreferrer">
                      Moodle <ExternalLink size={14} />
                    </Link>
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

                <div className="flex gap-2 sm:hidden">
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
              </div>

              {isCannabis101 ? (
                <aside className="flex max-h-[min(52vh,520px)] w-full shrink-0 flex-col border-t border-amber-500/20 bg-[#030806]/90 md:max-h-none md:h-auto md:max-h-[calc(100svh-8rem)] md:w-[380px] md:border-l md:border-t-0">
                  <div className="shrink-0 border-b border-amber-500/20 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200/80">
                      Painel do aluno
                    </p>
                    <p className="text-sm font-bold text-white">Cannabis 101</p>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin p-3">
                    <Cannabis101LessonRail
                      coursePct={coursePct}
                      doneCount={doneSet.size}
                      totalLessons={titles.length}
                      courseHoursLabel={area.hours}
                      titles={titles}
                      clampedLesson={clampedLesson}
                      doneSet={doneSet}
                      onSelectLesson={onSelectLesson}
                      progressUi={
                        status === "authenticated" && progressUi
                          ? {
                              xp: progressUi.xp,
                              levelLabel: progressUi.levelLabel,
                              levelKey: progressUi.levelKey,
                              streak: progressUi.streak
                            }
                          : null
                      }
                    />
                    <div className="mt-6 border-t border-amber-500/15 pt-4">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-amber-200/50 px-1 py-2 font-semibold">
                        Outras áreas
                      </div>
                      <ul className="space-y-0.5">
                        {allAreas.map((a) => (
                          <li key={a.id}>
                            <button
                              type="button"
                              onClick={() => onSelectArea(a)}
                              className={cn(
                                "w-full truncate rounded-lg px-3 py-2 text-left text-xs transition-colors",
                                a.id === area.id
                                  ? "bg-amber-500/20 font-semibold text-white"
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
              ) : (
                <aside className="w-full shrink-0 border-t border-white/10 md:w-80 md:border-l md:border-t-0 flex flex-col max-h-[42vh] md:max-h-none min-h-[180px]">
                  <div className="px-4 py-3 border-b border-white/10 text-[11px] uppercase tracking-[0.2em] text-canna-300 font-semibold flex items-center gap-2 shrink-0">
                    <CourseNavIcon size={14} /> Este curso
                  </div>
                  <ul className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5 min-h-0">
                    {titles.map((t, idx) => {
                      const checked = doneSet.has(idx);
                      const active = idx === clampedLesson;
                      return (
                        <li key={idx}>
                          <button
                            type="button"
                            onClick={() => onSelectLesson(idx)}
                            className={cn(
                              "w-full flex items-start gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                              active
                                ? "bg-canna-500/20 text-white border border-canna-400/40"
                                : "hover:bg-white/5 text-white/85 border border-transparent"
                            )}
                          >
                            <span className="mt-0.5 shrink-0 text-canna-300">
                              {checked ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                            </span>
                            <span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-white/45 block">
                                {idx + 1}
                              </span>
                              {t}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="p-2 border-t border-white/10 overflow-y-auto scrollbar-thin max-h-48 shrink-0">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/45 px-2 py-2 font-semibold">
                      Outras áreas
                    </div>
                    <ul className="space-y-0.5">
                      {allAreas.map((a) => (
                        <li key={a.id}>
                          <button
                            type="button"
                            onClick={() => onSelectArea(a)}
                            className={cn(
                              "w-full text-left truncate rounded-lg px-3 py-2 text-xs transition-colors",
                              a.id === area.id
                                ? "bg-white/15 text-white font-semibold"
                                : "text-white/65 hover:bg-white/8 hover:text-white"
                            )}
                          >
                            {a.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              )}
            </div>

            {isCannabis101 ? (
              <Cannabis101LessonFooter
                userName={session?.user?.name}
                levelLabel={progressUi?.levelLabel}
              />
            ) : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}