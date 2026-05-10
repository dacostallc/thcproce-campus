"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Area } from "@/data/courses";

type Props = {
  area: Area;
  sky: "day" | "night";
  visible: boolean;
  onActivate: () => void;
};

/**
 * Destaque mínimo “Começar aqui” no mapa — sem polígonos, sem overlay de arte.
 * O ponto de ancoragem coincide com `area.position` (% do palco).
 */
export function Cannabis101StartBeacon({ area, sky, visible, onActivate }: Props) {
  if (!visible) return null;

  const isDay = sky === "day";

  return (
    <motion.div
      role="presentation"
      className="pointer-events-none absolute inset-0 z-[13]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <button
        type="button"
        className={cn(
          "group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none",
          "touch-manipulation selection:bg-transparent",
          "focus-visible:ring-2 focus-visible:ring-amber-300/50 focus-visible:ring-offset-2",
          isDay ? "focus-visible:ring-offset-white/85" : "focus-visible:ring-offset-ink-900/92"
        )}
        style={{ left: `${area.position.x}%`, top: `${area.position.y}%` }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onActivate();
        }}
        aria-label="Abrir Cannabis 101 · aula inicial"
      >
        <span
          className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-[2] mb-0 min-w-max -translate-x-1/2 rounded-md campus-hud-glass px-2 py-1 text-center text-[10px] font-medium leading-tight text-white/95 text-shadow-soft opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
          role="tooltip"
        >
          Cannabis 101 • Aula inicial
        </span>

        <span className="relative flex flex-col items-center gap-1">
          <span
            className={cn(
              "relative z-[2] max-w-[8.75rem] text-center whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wide shadow backdrop-blur-sm",
              isDay
                ? "bg-white/70 text-slate-800/95 ring-[0.5px] ring-black/12"
                : "campus-hud-glass text-white/95 ring-[0.5px] ring-white/18"
            )}
          >
            Começar aqui
          </span>

          <ChevronDown
            className={cn(
              "relative z-[2] size-3.5 shrink-0",
              isDay ? "text-amber-950/72" : "text-amber-100/76",
              "motion-reduce:animate-none motion-reduce:opacity-85 motion-safe:animate-[beaconArrow_2.65s_ease-in-out_infinite]"
            )}
            strokeWidth={2.35}
            aria-hidden
          />
        </span>
      </button>
    </motion.div>
  );
}
