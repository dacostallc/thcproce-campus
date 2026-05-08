"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseLessonTheme } from "@/data/courseLessonThemes";

type Props = {
  theme: CourseLessonTheme;
  lessonTitle: string;
  areaName: string;
  className?: string;
};

/**
 * Hero cinematográfico THCProce quando não há stream Mux/Bunny/YouTube configurado.
 * Substitui qualquer vídeo genérico de demonstração.
 */
export function LessonCinematicFallback({
  theme,
  lessonTitle,
  areaName,
  className = ""
}: Props) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl border border-canna-400/35 shadow-2xl shadow-black/50",
        className
      )}
    >
      <div className={cn("absolute inset-0", theme.heroClass)} />

      <motion.div
        className={cn(
          "absolute -left-1/4 top-1/4 size-[70%] rounded-full blur-3xl opacity-70",
          "bg-gradient-to-br",
          theme.orbClass
        )}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 bottom-0 size-[55%] rounded-full bg-gradient-to-tl from-amber-500/15 to-transparent blur-3xl"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2748%27%20height=%2748%27%3E%3Ccircle%20cx=%272%27%20cy=%272%27%20r=%271%27%20fill=%27rgba(255,255,255,0.04)%27/%3E%3C/svg%3E')] opacity-40" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-canna-400/40 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-canna-200">
            <Sparkles size={12} className="text-amber-300" />
            THCProce
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white/55">{theme.tagline}</span>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
            {areaName}
          </p>
          <h3 className="text-xl font-extrabold leading-tight text-white text-shadow-soft sm:text-2xl md:text-3xl">
            {lessonTitle}
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-white/80">{theme.mood}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/35 px-4 py-2.5 text-sm font-semibold text-white/90">
              <Play size={18} className="text-canna-300" fill="currentColor" />
              Conteúdo em integração — vídeos reais THCProce em Mux/Bunny
            </span>
            <Link
              href="/entrar"
              className="rounded-xl border border-canna-400/40 bg-canna-500/15 px-4 py-2.5 text-sm font-bold text-canna-200 hover:bg-canna-500/25"
            >
              Entrar na conta →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
