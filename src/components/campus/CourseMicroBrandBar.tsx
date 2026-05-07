"use client";

import Link from "next/link";
import { ExternalLink, Leaf } from "lucide-react";
import type { Area } from "@/data/courses";
import { cn } from "@/lib/utils";
import { getCourseLessonTheme } from "@/data/courseLessonThemes";
import { Cannabis101MicroBrandBar } from "./Cannabis101MicroBrandBar";

const MOODLE = "https://thcproce.com.br/escola";

const LEAF: Record<
  Area["color"],
  string
> = {
  amber: "text-amber-400/80",
  canna: "text-canna-400/85",
  purple: "text-purple-300/85",
  cyan: "text-cyan-300/85",
  rose: "text-rose-300/85"
};

const BAR: Record<Area["color"], string> = {
  amber: "border-amber-500/10",
  canna: "border-canna-500/10",
  purple: "border-purple-500/10",
  cyan: "border-cyan-500/10",
  rose: "border-rose-500/10"
};

const LABEL: Record<Area["color"], string> = {
  amber: "text-amber-200/80",
  canna: "text-canna-200/80",
  purple: "text-purple-200/80",
  cyan: "text-cyan-200/80",
  rose: "text-rose-200/80"
};

type Props = {
  area: Area;
  className?: string;
};

/**
 * Faixa fina acima do conteúdo — marca do curso sem competir com a aula.
 * Cannabis 101 mantém trailer / stream dedicados em `Cannabis101MicroBrandBar`.
 */
export function CourseMicroBrandBar({ area, className }: Props) {
  if (area.id === "cannabis-101") {
    return <Cannabis101MicroBrandBar className={className} />;
  }

  const theme = getCourseLessonTheme(area.id);
  const c = area.color;

  return (
    <div
      className={cn(
        "flex min-h-[2.25rem] flex-wrap items-center justify-between gap-2 border-b bg-black/35 px-2 py-1.5 sm:px-3",
        BAR[c],
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Leaf className={cn("size-3.5 shrink-0", LEAF[c])} aria-hidden />
        <span
          className={cn("truncate text-[10px] font-bold uppercase tracking-[0.18em]", LABEL[c])}
        >
          {area.name}
        </span>
        <span className="text-white/20">·</span>
        <span className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-white/45">
          {theme.tagline}
        </span>
      </div>
      <Link
        href={MOODLE}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white/65 transition-colors hover:border-white/25 hover:text-white"
      >
        Moodle
        <ExternalLink className="size-3 opacity-70" />
      </Link>
    </div>
  );
}
