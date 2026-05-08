"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Lock,
  Search,
  Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCampusLessonGate } from "@/config/campusLessonGate";
import type { LessonGateStatus } from "@/config/cannabis101LessonGate";
import type { AreaColor } from "@/data/courses";
import { getLessonListAccent } from "@/lib/campusAccent";

export type LessonFilter = "all" | "available" | "seen" | "soon";

type Props = {
  areaId: string;
  /** Nome do curso — mostrado no topo do índice para alinhar com o header e «Outras áreas». */
  courseName?: string;
  accent: AreaColor;
  titles: string[];
  activeIndex: number;
  doneSet: Set<number>;
  onSelectLesson: (idx: number) => void;
  className?: string;
  /** Rodapé: módulo atual + avançar aula */
  onNextLesson?: () => void;
  nextLessonDisabled?: boolean;
};

const STATUS_LABEL: Record<LessonGateStatus, string> = {
  seen: "Vista",
  available: "Disponível",
  locked: "Bloqueada",
  soon: "Em breve"
};

const FILTER_CHIPS: { id: LessonFilter; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "available", label: "Disponíveis" },
  { id: "seen", label: "Vistas" },
  { id: "soon", label: "Em breve" }
];

export function Cannabis101LessonList({
  areaId,
  courseName,
  accent,
  titles,
  activeIndex,
  doneSet,
  onSelectLesson,
  className,
  onNextLesson,
  nextLessonDisabled
}: Props) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<LessonFilter>("all");
  const A = getLessonListAccent(accent);

  const rows = useMemo(() => {
    return titles.map((title, idx) => {
      const gate = getCampusLessonGate(areaId, idx, titles.length, doneSet);
      return { idx, title, gate };
    });
  }, [titles, doneSet, areaId]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(({ idx, title, gate }) => {
      const matchSearch =
        !needle ||
        title.toLowerCase().includes(needle) ||
        String(idx + 1).includes(needle) ||
        `aula ${idx + 1}`.includes(needle);
      if (!matchSearch) return false;
      if (filter === "all") return true;
      if (filter === "seen") return gate === "seen";
      if (filter === "soon") return gate === "soon";
      if (filter === "available") return gate === "available";
      return true;
    });
  }, [rows, q, filter]);

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className={cn("shrink-0 px-3 py-3", A.headerBottom)}>
        <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", A.kicker)}>Programa da aula</p>
        {courseName ? (
          <p className="mt-1 text-[11px] font-semibold leading-snug text-white/75">{courseName}</p>
        ) : null}
        <p className="mt-1 text-xs text-white/55">Índice das aulas deste curso</p>
        <label className={cn("mt-3 flex items-center gap-2 rounded-xl border bg-black/40 px-3 py-2", A.search)}>
          <Search className={cn("size-4 shrink-0", A.searchIcon)} aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar aula"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            autoComplete="off"
          />
        </label>
        <div className="mt-2 flex flex-wrap gap-1">
          {FILTER_CHIPS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors",
                filter === c.id ? A.chipOn : A.chipOff
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto scrollbar-thin p-2">
        {filtered.map(({ idx, title, gate }) => {
          const active = idx === activeIndex;
          const disabled = gate === "locked" || gate === "soon";
          return (
            <li key={idx}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onSelectLesson(idx)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-xl border px-2.5 py-2.5 text-left text-sm transition-all",
                  active ? A.lessonOn : A.lessonOff,
                  disabled && "cursor-not-allowed opacity-55"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold",
                    active ? A.numOn : A.numOff
                  )}
                >
                  {idx + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 leading-snug">{title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-1">
                    <StatusPill gate={gate} />
                    {active ? (
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold uppercase", A.atual)}>
                        Atual
                      </span>
                    ) : null}
                  </span>
                </span>
                {!disabled ? (
                  <ChevronRight className="mt-1 size-4 shrink-0 text-white/25" aria-hidden />
                ) : gate === "locked" ? (
                  <Lock className="mt-1 size-4 shrink-0 text-white/35" aria-hidden />
                ) : (
                  <Clock className="mt-1 size-4 shrink-0 text-white/40" aria-hidden />
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {filtered.length === 0 ? (
        <p className="px-3 py-6 text-center text-xs text-white/40">Nenhuma aula com esse filtro.</p>
      ) : null}

      <div className={cn("shrink-0 p-3", A.footerTop)}>
        <p className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", A.modKicker)}>Módulo atual</p>
        <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-white">
          {titles[activeIndex] ?? "—"}
        </p>
        <div className={cn("mt-2 h-1.5 overflow-hidden rounded-full", A.barTrack)}>
          <div
            className={cn("h-full rounded-full transition-all", A.barFill)}
            style={{
              width: `${titles.length ? Math.min(100, ((activeIndex + 1) / titles.length) * 100) : 0}%`
            }}
          />
        </div>
        {onNextLesson ? (
          <Button
            type="button"
            size="sm"
            className={cn("mt-3 w-full", A.nextBtn)}
            disabled={nextLessonDisabled}
            onClick={onNextLesson}
          >
            Próxima aula
            <ChevronRight className="ml-1 size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function StatusPill({ gate }: { gate: LessonGateStatus }) {
  const label = STATUS_LABEL[gate];
  const Icon =
    gate === "seen"
      ? CheckCircle2
      : gate === "locked"
        ? Lock
        : gate === "soon"
          ? Clock
          : Circle;
  const cls =
    gate === "seen"
      ? "border-emerald-500/35 bg-emerald-500/15 text-emerald-200"
      : gate === "soon"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-200/90"
        : gate === "locked"
          ? "border-white/15 bg-white/5 text-white/45"
          : "border-canna-500/25 bg-canna-500/10 text-canna-200";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
        cls
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {label}
    </span>
  );
}
