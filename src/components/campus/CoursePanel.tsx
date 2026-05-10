"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  GraduationCap,
  Clock,
  PlayCircle,
  Award,
  ChevronRight
} from "lucide-react";
import type { Area } from "@/data/courses";
import { coursePreviewLessonTitlesForArea } from "@/content/courses";
import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";
import { completeCampusMissionPhase2IfNeeded } from "@/lib/campusMissionsPhase2Storage";
import { cn } from "@/lib/utils";
import { useCampusSkyStore } from "@/stores/campusSkyStore";

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
  onClose: () => void;
  /** Abre a sala no mapa; sem `lessonIndex` retoma a última aula (localStorage). */
  onOpenCampusLesson?: (lessonIndex?: number) => void;
};

export function CoursePanel({
  area,
  onClose,
  onOpenCampusLesson
}: Props) {
  const sky = useCampusSkyStore((s) => s.sky);

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
    if (!area || area.id !== CANNABIS101_AREA_ID) return;
    completeCampusMissionPhase2IfNeeded("campus-p2-cannabis101");
  }, [area]);

  useEffect(() => {
    if (!area) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [area, onClose]);

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
