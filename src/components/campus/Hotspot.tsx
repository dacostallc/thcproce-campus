"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Area } from "@/data/courses";

const colorMap = {
  canna: {
    ring: "ring-glow-canna",
    dot: "bg-canna-400",
    halo: "from-canna-400/40",
    text: "text-canna-100",
    border: "border-canna-400/45",
    badge: "bg-ink-900/82"
  },
  purple: {
    ring: "ring-glow-purple",
    dot: "bg-purple-400",
    halo: "from-purple-400/40",
    text: "text-purple-100",
    border: "border-purple-400/45",
    badge: "bg-ink-900/82"
  },
  amber: {
    ring: "ring-glow-amber",
    dot: "bg-amber-400",
    halo: "from-amber-400/40",
    text: "text-amber-100",
    border: "border-amber-400/45",
    badge: "bg-ink-900/82"
  },
  cyan: {
    ring: "ring-glow-cyan",
    dot: "bg-cyan-400",
    halo: "from-cyan-400/40",
    text: "text-cyan-100",
    border: "border-cyan-400/45",
    badge: "bg-ink-900/82"
  },
  rose: {
    ring: "ring-glow-amber",
    dot: "bg-rose-400",
    halo: "from-rose-400/40",
    text: "text-rose-100",
    border: "border-rose-400/45",
    badge: "bg-ink-900/82"
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
  const c = colorMap[area.color];

  return (
    <motion.button
      type="button"
      title={area.short}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(area);
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-canna-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 rounded-2xl"
      style={{ left: `${area.position.x}%`, top: `${area.position.y}%` }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + Math.random() * 0.6, duration: 0.6 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`${area.mapLabel ?? area.name} — ${area.short}`}
    >
      {/* Coluna: nome sempre ou no hover */}
      <div className="flex flex-col items-center gap-1.5 w-[min(200px,max(112px,24vw))]">
        <span
          className={cn(
            "order-first w-full text-center px-2 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-semibold leading-tight tracking-wide uppercase",
            "border shadow-lg backdrop-blur-md pointer-events-none",
            c.badge,
            c.border,
            c.text,
            "text-shadow-soft",
            showCourseLabels
              ? "opacity-100 max-h-[3.75rem] line-clamp-3"
              : "opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-h-[4rem] line-clamp-3"
          )}
        >
          {area.mapLabel ?? area.name}
        </span>

        {/* Pin */}
        <div className="relative flex shrink-0 items-center justify-center">
          <span
            className={cn(
              "absolute -inset-6 rounded-full bg-gradient-to-br opacity-60 blur-xl pointer-events-none",
              c.halo,
              "to-transparent"
            )}
            aria-hidden
          />
          <span
            className={cn(
              "absolute inset-0 -m-2 rounded-full animate-ping opacity-50",
              c.dot
            )}
            style={{ animationDuration: "2.6s" }}
            aria-hidden
          />
          <span
            className={cn(
              "relative block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-transform duration-300",
              c.dot,
              c.ring,
              completed && "ring-2 ring-gold-400/90 ring-offset-2 ring-offset-ink-900/80 shadow-[0_0_14px_rgba(250,204,21,0.55)]",
              active && "scale-125"
            )}
            aria-hidden
          />
        </div>
      </div>
    </motion.button>
  );
}
