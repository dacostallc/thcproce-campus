"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  GraduationCap,
  Clock,
  PlayCircle,
  Award,
  ChevronRight,
  Sparkles
} from "lucide-react";
import type { Area } from "@/data/courses";
import { coursePreviewLessonTitlesForArea } from "@/content/courses";
import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";
import { completeCampusMissionPhase2IfNeeded } from "@/lib/campusMissionsPhase2Storage";
import { cn } from "@/lib/utils";
import type { CampusMicroLessonOffer } from "@/lib/campusMicroLessonsFromHit";
import { getMicroLessonsForCampusHit } from "@/lib/campusMicroLessonsFromHit";
import { useCampusSkyStore } from "@/stores/campusSkyStore";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/react";
import Link from "next/link";

const colorAccent = {
  canna: "from-canna-500/30 to-canna-700/10 border-canna-400/40",
  purple: "from-purple-500/30 to-purple-800/10 border-purple-400/40",
  amber: "from-amber-500/30 to-amber-700/10 border-amber-400/40",
  cyan: "from-cyan-500/30 to-cyan-700/10 border-cyan-400/40",
  rose: "from-rose-500/30 to-rose-700/10 border-rose-400/40"
} as const;

const colorBadge = {
  canna: "bg-canna-500/20 text-canna-300 border-canna-400/40",
  purple: "bg-purple-500/20 text-purple-300 border-purple-400/40",
  amber: "bg-amber-500/20 text-amber-300 border-amber-400/40",
  cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
  rose: "bg-rose-500/20 text-rose-300 border-rose-400/40"
} as const;

type Props = {
  area: Area | null;
  /**
   * `CampusMapInteractiveArea.id` do hit quando o painel abre a partir do mapa SVG —
   * refinamento da zona pedagógica (ex.: pragas outdoor vs curso outdoor genérico).
   */
  legacyHitId?: string | null;
  /** Progresso persistido no servidor (opcional). */
  microLessonProgressById?: Record<string, { completedAt: string | null }>;
  onClose: () => void;
  /** Abre a sala no mapa; sem `lessonIndex` retoma a última aula (localStorage). */
  onOpenCampusLesson?: (lessonIndex?: number) => void;
};

export function CoursePanel({
  area,
  legacyHitId = null,
  microLessonProgressById,
  onClose,
  onOpenCampusLesson
}: Props) {
  const sky = useCampusSkyStore((s) => s.sky);
  const { status } = useSession();
  const utils = trpc.useUtils();

  const panelOpenedMutation = trpc.campus.campusCoursePanelOpened.useMutation({
    onSuccess: () => {
      void utils.campus.campusWorldSnapshot.invalidate();
      void utils.campus.campusPersistenceSummary.invalidate();
      void utils.campus.myProgress.invalidate();
      void utils.campus.campusGuidedMissions.invalidate();
    }
  });

  const microLessonStartMutation = trpc.campus.campusMicroLessonStart.useMutation({
    onSuccess: () => {
      void utils.campus.campusWorldSnapshot.invalidate();
      void utils.campus.campusPersistenceSummary.invalidate();
      void utils.campus.campusGuidedMissions.invalidate();
    }
  });

  const microLessonCompleteMutation = trpc.campus.campusMicroLessonComplete.useMutation({
    onSuccess: () => {
      void utils.campus.campusWorldSnapshot.invalidate();
      void utils.campus.campusPersistenceSummary.invalidate();
      void utils.campus.myProgress.invalidate();
      void utils.campus.campusGuidedMissions.invalidate();
    }
  });

  const [microLessonLaunch, setMicroLessonLaunch] = useState<CampusMicroLessonOffer | null>(
    null
  );

  const microLessonOffers = useMemo((): CampusMicroLessonOffer[] => {
    if (!area) return [];
    return getMicroLessonsForCampusHit({
      legacyHitId,
      courseId: area.id
    });
  }, [area, legacyHitId]);

  const previewLessonTitles = useMemo((): readonly string[] => {
    if (!area) return [];
    const registryTitles = coursePreviewLessonTitlesForArea(area.id);
    if (registryTitles && registryTitles.length > 0) {
      return registryTitles;
    }
    return [
      `Introdução à ${area.name.toLowerCase()}`,
      `${area.highlights[0]}`,
      `${area.highlights[1] ?? "Aplicação prática"}`,
      "Estudos de caso e exemplos reais"
    ];
  }, [area]);

  useEffect(() => {
    if (!area) setMicroLessonLaunch(null);
  }, [area]);

  useEffect(() => {
    if (!area || status !== "authenticated") return;
    panelOpenedMutation.mutate({
      courseAreaId: area.id,
      legacyHitId
    });
  }, [area, legacyHitId, status]);

  useEffect(() => {
    if (!microLessonLaunch || status !== "authenticated") return;
    microLessonStartMutation.mutate({
      blueprintId: microLessonLaunch.blueprint.id,
      legacyHitId
    });
  }, [microLessonLaunch?.blueprint.id, legacyHitId, status]);

  useEffect(() => {
    if (!area || area.id !== CANNABIS101_AREA_ID) return;
    completeCampusMissionPhase2IfNeeded("campus-p2-cannabis101");
  }, [area]);

  useEffect(() => {
    if (!area) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      if (microLessonLaunch) {
        setMicroLessonLaunch(null);
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [area, microLessonLaunch, onClose]);

  return (
    <AnimatePresence>
      {area && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            role="presentation"
            aria-hidden
            className={cn(
              "fixed inset-0 z-30 cursor-pointer pointer-events-auto backdrop-blur-[2px]",
              sky === "day"
                ? "bg-sky-950/20"
                : "bg-black/35"
            )}
            onClick={onClose}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-panel-title"
            initial={{ x: 480, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 480, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-40 flex w-full flex-col campus-hud-glass border-l border-canna-400/25 ring-1 ring-inset ring-white/[0.06] pointer-events-auto sm:w-[460px]"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <header
              className={cn(
                "relative px-6 pt-6 pb-5 border-b border-white/10 bg-gradient-to-br",
                colorAccent[area.color]
              )}
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex w-fit max-w-full items-center gap-2 rounded-xl border border-white/25 bg-black/25 px-3 py-2 text-left text-[13px] font-semibold text-white shadow-sm backdrop-blur-md transition hover:border-emerald-300/40 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
                  >
                    <ArrowLeft size={17} className="shrink-0 text-emerald-200/95" aria-hidden />
                    <span className="leading-tight">
                      Voltar ao mapa
                      <span className="mt-0.5 block text-[10px] font-normal text-white/60">
                        Fechar painel do curso
                      </span>
                    </span>
                  </button>
                  <p className="text-[10px] leading-snug text-white/58">
                    Feche este painel para acessar o mapa e o cinema.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-md backdrop-blur-md transition hover:border-emerald-300/45 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
                  aria-label="Fechar painel do curso"
                  title="Fechar (Esc)"
                >
                  <X size={18} aria-hidden />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/70">
                <span className={cn("px-2 py-0.5 rounded-full border text-[10px]", colorBadge[area.color])}>
                  {area.category}
                </span>
                <span className="opacity-60">·</span>
                <span>{area.level}</span>
              </div>

              <h2
                id="course-panel-title"
                className="mt-3 text-3xl font-bold text-white text-shadow-soft leading-tight"
              >
                {area.name}
              </h2>
              <p className="mt-1.5 text-white/80 text-sm">{area.short}</p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <Stat icon={<PlayCircle size={14} />} label="Aulas" value={String(area.lessons)} />
                <Stat icon={<Clock size={14} />} label="Duração" value={area.hours} />
                <Stat icon={<GraduationCap size={14} />} label="Professor" value={area.professor} />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-5">
              <section>
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-canna-300 mb-2 font-semibold">
                  O que rola neste canto
                </h3>
                <p className="text-white/85 leading-relaxed">{area.description}</p>
              </section>

              <section>
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-canna-300 mb-3 font-semibold">
                  O que você leva daqui
                </h3>
                <ul className="space-y-2">
                  {area.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 text-sm text-white/85"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-canna-400 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {microLessonOffers.length > 0 ? (
                <section className="rounded-xl border border-white/[0.09] bg-white/[0.03] p-4">
                  <div className="mb-3 flex items-start gap-2">
                    <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-200/85" aria-hidden />
                    <div className="min-w-0">
                      <h3 className="text-[11px] uppercase tracking-[0.2em] text-canna-300 font-semibold">
                        Microaulas desta área
                      </h3>
                      <p className="mt-1 text-[11px] leading-snug text-white/58">
                        Complementos rápidos ligados à zona que clicaste no mapa — não substituem as aulas
                        principais do curso.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {microLessonOffers.map((offer) => (
                      <li
                        key={offer.blueprint.id}
                        data-campus-micro-variant={offer.visualVariant}
                        className="rounded-xl border border-white/[0.08] bg-black/[0.14] p-3.5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            {microLessonProgressById?.[offer.blueprint.id]?.completedAt ? (
                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200/85">
                                Concluída no campus
                              </p>
                            ) : null}
                            <p className="text-sm font-semibold text-white leading-snug">
                              {offer.blueprint.title}
                            </p>
                            <p className="mt-1 text-[12px] leading-relaxed text-white/72">
                              {offer.description}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                              colorBadge[area.color]
                            )}
                          >
                            {offer.difficulty}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/55 tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={11} className="text-canna-300/90" aria-hidden />
                            {offer.enriched.durationMin} min
                          </span>
                          <span>
                            +{offer.enriched.xpReward} XP
                          </span>
                          <span className="text-white/40">
                            {offer.enriched.microCategory}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMicroLessonLaunch(offer)}
                          className="mt-3 w-full rounded-lg border border-emerald-400/35 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:border-emerald-300/55 hover:bg-emerald-500/22 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
                        >
                          {microLessonProgressById?.[offer.blueprint.id]?.completedAt
                            ? "Rever microaula"
                            : "Começar microaula"}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="rounded-xl glass-hud p-4 flex items-center gap-3">
                <Award size={22} className="text-gold-400 shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold">Conquista desbloqueável</div>
                  <div className="text-white/65 text-xs">
                    Certificado em PDF + verificação quando você cruzar a linha de chegada.
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-canna-300 mb-3 font-semibold">
                  Tour pelas aulas
                </h3>
                <div className="space-y-2">
                  {previewLessonTitles.map((title, idx) => (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpenCampusLesson?.(idx)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onOpenCampusLesson?.(idx);
                        }
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/[0.06] hover:shadow-[0_0_18px_rgba(80,255,160,0.05)] transition-all duration-200 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-canna-400/70"
                    >
                      <span className="w-7 h-7 rounded-full bg-canna-500/20 text-canna-300 flex items-center justify-center text-xs font-bold border border-canna-400/35 group-hover:scale-105 transition-transform">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{title}</div>
                        <div className="text-[11px] text-white/50">
                          {6 + idx * 4} min
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-white/30 group-hover:text-canna-300 group-hover:translate-x-0.5 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <footer className="border-t border-white/10 px-6 py-4 flex flex-col gap-3 campus-hud-glass">
              <button
                type="button"
                onClick={() => onOpenCampusLesson?.()}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-canna-500 to-canna-400 hover:from-canna-400 hover:to-canna-300 text-ink-900 font-bold tracking-wide transition-all shadow-lg shadow-canna-500/35 text-center hover:brightness-[1.03] active:scale-[0.99]"
              >
                Entrar na sala virtual
              </button>
            </footer>
          </motion.aside>

          <AnimatePresence>
            {microLessonLaunch ? (
              <>
                <motion.div
                  key="campus-micro-lesson-backdrop"
                  role="presentation"
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[50] bg-black/60 backdrop-blur-[2px]"
                  onClick={() => setMicroLessonLaunch(null)}
                />
                <motion.div
                  key="campus-micro-lesson-dialog"
                  role="dialog"
                  aria-modal
                  aria-labelledby="campus-micro-lesson-title"
                  initial={{ opacity: 0, scale: 0.97, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 10 }}
                  transition={{ type: "spring", stiffness: 320, damping: 34 }}
                  className={cn(
                    "fixed left-1/2 top-[46%] z-[51] w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/14 p-5 shadow-2xl shadow-black/45",
                    sky === "day"
                      ? "bg-gradient-to-br from-slate-950/97 via-slate-900/98 to-slate-950/97"
                      : "bg-gradient-to-br from-[rgb(8_14_12_/0.97)] via-[rgb(12_22_18_/0.98)] to-[rgb(8_14_12_/0.97)]"
                  )}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-lg p-2 text-white/45 hover:bg-white/10 hover:text-white"
                    aria-label="Fechar microaula"
                    onClick={() => setMicroLessonLaunch(null)}
                  >
                    <X size={18} aria-hidden />
                  </button>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/85">
                    Microaula · {microLessonLaunch.educationalThemeTitle}
                  </p>
                  <h3
                    id="campus-micro-lesson-title"
                    className="mt-2 pr-10 text-lg font-semibold leading-snug text-white"
                  >
                    {microLessonLaunch.blueprint.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(microLessonLaunch.enriched.keywords?.length
                      ? microLessonLaunch.enriched.keywords
                      : microLessonLaunch.thematicKeywords
                    )
                      .slice(0, 8)
                      .map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full border border-white/12 bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/75"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-[12px] tabular-nums text-white/70">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={13} className="text-canna-300/90" aria-hidden />
                      {microLessonLaunch.enriched.durationMin} min
                    </span>
                    <span>+{microLessonLaunch.enriched.xpReward} XP</span>
                    <span className="text-white/50">{microLessonLaunch.difficulty}</span>
                  </div>
                  <div className="mt-4 space-y-2 text-[13px] leading-relaxed text-white/82">
                    <p>
                      <span className="font-semibold text-emerald-200/90">Objetivo · </span>
                      {microLessonLaunch.blueprint.objective}
                    </p>
                    {microLessonLaunch.enriched.problem ? (
                      <p>
                        <span className="font-semibold text-white/88">Problema típico · </span>
                        {microLessonLaunch.enriched.problem}
                      </p>
                    ) : null}
                    <p>
                      <span className="font-semibold text-white/88">Explicação · </span>
                      {microLessonLaunch.enriched.explanation}
                    </p>
                    <p>
                      <span className="font-semibold text-amber-200/85">Erro comum · </span>
                      {microLessonLaunch.enriched.commonMistake}
                    </p>
                    <p>
                      <span className="font-semibold text-canna-200/90">Dica THCProce · </span>
                      {microLessonLaunch.enriched.proceTip}
                    </p>
                  </div>
                  {microLessonLaunch.enriched.cta?.label ? (
                    <div className="mt-4">
                      {microLessonLaunch.enriched.cta.courseId &&
                      area?.id === microLessonLaunch.enriched.cta.courseId ? (
                        <button
                          type="button"
                          onClick={() => {
                            onOpenCampusLesson?.(0);
                            setMicroLessonLaunch(null);
                          }}
                          className="inline-flex w-full items-center justify-center rounded-xl border border-white/18 bg-white/[0.07] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/[0.11]"
                        >
                          {microLessonLaunch.enriched.cta.label}
                        </button>
                      ) : microLessonLaunch.enriched.cta.courseId ? (
                        <Link
                          href="/campus"
                          className="inline-flex w-full items-center justify-center rounded-xl border border-white/18 bg-white/[0.07] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/[0.11]"
                        >
                          {microLessonLaunch.enriched.cta.label}
                        </Link>
                      ) : (
                        <span className="block rounded-xl border border-white/14 bg-black/25 px-4 py-2.5 text-center text-[13px] text-white/75">
                          {microLessonLaunch.enriched.cta.label}
                        </span>
                      )}
                    </div>
                  ) : null}
                  <div className="mt-5 flex flex-col gap-2">
                    {status === "authenticated" &&
                    !microLessonProgressById?.[microLessonLaunch.blueprint.id]?.completedAt ? (
                      <button
                        type="button"
                        onClick={() =>
                          microLessonCompleteMutation.mutate(
                            { blueprintId: microLessonLaunch.blueprint.id },
                            {
                              onSuccess: () => setMicroLessonLaunch(null)
                            }
                          )
                        }
                        disabled={microLessonCompleteMutation.isPending}
                        className="w-full rounded-xl bg-gradient-to-r from-canna-500 to-canna-400 px-4 py-2.5 text-sm font-bold text-ink-900 shadow-lg shadow-canna-500/28 transition hover:brightness-[1.03] disabled:opacity-60"
                      >
                        Marcar como concluída (+ XP)
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setMicroLessonLaunch(null)}
                      className="w-full rounded-xl border border-white/16 bg-black/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                    >
                      Voltar ao painel do curso
                    </button>
                  </div>
                </motion.div>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

function Stat({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl glass-hud px-2.5 py-2 text-center transition-shadow duration-200 hover:shadow-[0_0_18px_rgba(80,255,160,0.06)]">
      <div className="flex items-center justify-center gap-1 text-canna-300 mb-0.5">
        {icon}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
      <div className="text-sm font-semibold text-white truncate">{value}</div>
    </div>
  );
}
