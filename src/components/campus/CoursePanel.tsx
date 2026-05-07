"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  GraduationCap,
  Clock,
  PlayCircle,
  Award,
  ChevronRight
} from "lucide-react";
import type { Area } from "@/data/courses";
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

const MOODLE_ESCOLA = "https://thcproce.com.br/escola";
const MUX_DEMO =
  typeof process.env.NEXT_PUBLIC_MUX_DEMO_PLAYBACK_ID === "string"
    ? process.env.NEXT_PUBLIC_MUX_DEMO_PLAYBACK_ID.trim()
    : "";
const BUNNY_LIB =
  typeof process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID === "string"
    ? process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID.trim()
    : "";
const BUNNY_DEMO_VIDEO =
  typeof process.env.NEXT_PUBLIC_BUNNY_DEMO_VIDEO_ID === "string"
    ? process.env.NEXT_PUBLIC_BUNNY_DEMO_VIDEO_ID.trim()
    : "";

export function CoursePanel({
  area,
  onClose,
  onOpenCampusLesson
}: Props) {
  const sky = useCampusSkyStore((s) => s.sky);
  return (
    <AnimatePresence>
      {area && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className={cn(
              "fixed inset-0 z-30 backdrop-blur-[2px]",
              sky === "day"
                ? "bg-sky-950/20"
                : "bg-black/35"
            )}
          />

          <motion.aside
            initial={{ x: 480, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 480, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px] z-40 flex flex-col glass-strong border-l border-canna-400/20"
          >
            <header
              className={cn(
                "relative px-6 pt-6 pb-5 border-b border-white/10 bg-gradient-to-br",
                colorAccent[area.color]
              )}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/70">
                <span className={cn("px-2 py-0.5 rounded-full border text-[10px]", colorBadge[area.color])}>
                  {area.category}
                </span>
                <span className="opacity-60">·</span>
                <span>{area.level}</span>
              </div>

              <h2 className="mt-3 text-3xl font-bold text-white text-shadow-soft leading-tight">
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
                  Sobre essa área
                </h3>
                <p className="text-white/85 leading-relaxed">{area.description}</p>
              </section>

              <section>
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-canna-300 mb-3 font-semibold">
                  O que você vai aprender
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

              <section className="rounded-xl glass p-4 flex items-center gap-3 border-canna-400/30">
                <Award size={22} className="text-gold-400 shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold">Certificado ao concluir</div>
                  <div className="text-white/65 text-xs">
                    Emitido em PDF + verificação online
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-canna-300 mb-3 font-semibold">
                  Prévia das aulas
                </h3>
                <div className="space-y-2">
                  {[
                    `Introdução à ${area.name.toLowerCase()}`,
                    `${area.highlights[0]}`,
                    `${area.highlights[1] ?? "Aplicação prática"}`,
                    "Estudos de caso e exemplos reais"
                  ].map((title, idx) => (
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
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-canna-400/70"
                    >
                      <span className="w-7 h-7 rounded-full bg-canna-500/20 text-canna-300 flex items-center justify-center text-xs font-bold border border-canna-400/30">
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

            <footer className="border-t border-white/10 px-6 py-4 flex flex-col gap-3 glass-strong">
              <button
                type="button"
                onClick={() => onOpenCampusLesson?.()}
                className="w-full px-4 py-3 rounded-xl bg-canna-500 hover:bg-canna-400 text-ink-900 font-bold tracking-wide transition-colors shadow-lg shadow-canna-500/30 text-center"
              >
                Aulas aqui na sala virtual
              </button>
              <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={MOODLE_ESCOLA}
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-4 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-sm font-semibold text-center"
              >
                Moodle (nova aba)
              </Link>
              {MUX_DEMO ? (
                <Link
                  href={`/aula/${encodeURIComponent(MUX_DEMO)}?course=${encodeURIComponent(area.id)}`}
                  className="flex-1 px-4 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-sm font-semibold text-center border border-white/10"
                  onClick={onClose}
                >
                  Player Mux (página)
                </Link>
              ) : null}
              {BUNNY_LIB && BUNNY_DEMO_VIDEO ? (
                <Link
                  href={`/aula/${encodeURIComponent(BUNNY_DEMO_VIDEO)}?course=${encodeURIComponent(area.id)}&provider=bunny`}
                  className="flex-1 px-4 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-sm font-semibold text-center border border-sky-400/25 text-sky-100"
                  onClick={onClose}
                >
                  Bunny (página)
                </Link>
              ) : null}
              </div>
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
    <div className="rounded-lg glass px-2.5 py-2 text-center">
      <div className="flex items-center justify-center gap-1 text-canna-300 mb-0.5">
        {icon}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
      <div className="text-sm font-semibold text-white truncate">{value}</div>
    </div>
  );
}
