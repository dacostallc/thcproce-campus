"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Area } from "@/data/courses";
import { getCampusAreaVisual, getCampusAreaVisualFallback } from "@/lib/campusWorldPlan";
import { useCampusSkyStore } from "@/stores/campusSkyStore";

const colorMap = {
  canna: {
    ring: "ring-glow-canna",
    dot: "bg-canna-400",
    halo: "from-canna-400/40",
    labelNight: "text-emerald-100",
    labelDay: "text-slate-800/88",
    iconDay: "text-emerald-700/85",
    accentRgb: "74, 222, 128"
  },
  purple: {
    ring: "ring-glow-purple",
    dot: "bg-purple-400",
    halo: "from-purple-400/40",
    labelNight: "text-purple-100",
    labelDay: "text-slate-800/88",
    iconDay: "text-violet-700/85",
    accentRgb: "192, 132, 252"
  },
  amber: {
    ring: "ring-glow-amber",
    dot: "bg-amber-400",
    halo: "from-amber-400/40",
    labelNight: "text-amber-100",
    labelDay: "text-slate-800/88",
    iconDay: "text-amber-800/85",
    accentRgb: "251, 191, 36"
  },
  cyan: {
    ring: "ring-glow-cyan",
    dot: "bg-cyan-400",
    halo: "from-cyan-400/40",
    labelNight: "text-cyan-100",
    labelDay: "text-slate-800/88",
    iconDay: "text-cyan-800/85",
    accentRgb: "103, 232, 249"
  },
  rose: {
    ring: "ring-glow-amber",
    dot: "bg-rose-400",
    halo: "from-rose-400/40",
    labelNight: "text-rose-100",
    labelDay: "text-slate-800/88",
    iconDay: "text-rose-700/85",
    accentRgb: "251, 113, 133"
  }
} as const;

type Props = {
  area: Area;
  onSelect: (area: Area) => void;
  active?: boolean;
  /** Área marcada como concluída (progresso Moodle / demo). */
  completed?: boolean;
  /** Se true, o nome do curso fica sempre visível (além da bolinha). */
  showCourseLabels?: boolean;
};

export function Hotspot({
  area,
  onSelect,
  active,
  completed,
  showCourseLabels = true
}: Props) {
  const sky = useCampusSkyStore((s) => s.sky);
  const isDay = sky === "day";
  const c = colorMap[area.color];
  const vis = getCampusAreaVisual(area.id) ?? getCampusAreaVisualFallback();
  const { Icon, mapHint, haloScale = 1 } = vis;
  const hoverTitle = `${area.mapLabel ?? area.name} — ${mapHint}`;

  const haloInset = `${-1.5 * haloScale}rem`;

  return (
    <motion.button
      type="button"
      title={hoverTitle}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(area);
      }}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none rounded-2xl",
        isDay
          ? "focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white/55"
          : "focus-visible:ring-2 focus-visible:ring-emerald-400/75 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
      )}
      style={{ left: `${area.position.x}%`, top: `${area.position.y}%` }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + Math.random() * 0.6, duration: 0.6 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`${area.mapLabel ?? area.name} — ${mapHint}`}
    >
      {/* Coluna: nome sempre ou no hover */}
      <div className="flex flex-col items-center gap-1 w-[min(200px,max(112px,24vw))]">
        <span
          className={cn(
            "glass-hotspot",
            isDay ? "glass-hotspot--day" : "glass-hotspot--night",
            active && "glass-hotspot--active",
            "order-first w-full text-center px-1.5 py-0.5 rounded-lg text-[9px] sm:text-[11px] font-semibold leading-tight tracking-wide uppercase",
            "pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]",
            "flex items-center justify-center gap-1",
            isDay ? "text-shadow-hotspot-day" : "text-shadow-hotspot-night",
            isDay ? c.labelDay : c.labelNight,
            showCourseLabels
              ? "opacity-100 max-h-[2.35rem] line-clamp-2"
              : "opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-h-[2.35rem] line-clamp-2"
          )}
          style={
            {
              "--hotspot-accent-rgb": c.accentRgb
            } as CSSProperties
          }
        >
          <Icon
            className={cn(
              "size-3 sm:size-3.5 shrink-0 opacity-95",
              isDay ? c.iconDay : "",
              isDay
                ? "drop-shadow-[0_1px_2px_rgba(255,255,255,0.35)]"
                : "drop-shadow-[0_0_6px_rgba(0,0,0,0.35)]"
            )}
            strokeWidth={2.2}
            aria-hidden
          />
          <span className="min-w-0 line-clamp-2">{area.mapLabel ?? area.name}</span>
        </span>

        {/* Pin */}
        <div className="relative flex shrink-0 items-center justify-center">
          <span
            className={cn(
              "absolute rounded-full bg-gradient-to-br opacity-35 blur-xl pointer-events-none",
              c.halo,
              "to-transparent"
            )}
            style={{ inset: haloInset }}
            aria-hidden
          />
          <span
            className={cn(
              "absolute inset-0 -m-2 rounded-full motion-reduce:animate-none",
              "opacity-[0.12] animate-[ping_4.2s_cubic-bezier(0,0,0.2,1)_infinite]",
              c.dot
            )}
            style={{ animationDuration: "2.8s" }}
            aria-hidden
          />
          <span
            className={cn(
              "relative block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-transform duration-300",
              c.dot,
              c.ring,
              completed &&
                cn(
                  "ring-2 ring-amber-200/55 ring-offset-2 shadow-[0_0_10px_rgba(180,155,92,0.22)]",
                  isDay ? "ring-offset-white/85" : "ring-offset-ink-900/80"
                ),
              active && "scale-125"
            )}
            aria-hidden
          />
        </div>
      </div>
    </motion.button>
  );
}
