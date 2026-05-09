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
import type { LessonGateStatus } from "@/content/courses/cannabis-101/gating";
import {
  CANNABIS101_AREA_ID,
  CANNABIS101_MODULES,
  getCannabis101StreamChapter
} from "@/content/courses/cannabis-101";
import type { AreaColor } from "@/data/courses";
import { getLessonListAccent } from "@/lib/campusAccent";

export type LessonFilter = "all" | "available" | "seen" | "soon";

type Props = {
  areaId: string;
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

export function CampusLessonSidebar({
  areaId,
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

  const moduleChapterStarts = useMemo(() => {
    if (areaId !== CANNABIS101_AREA_ID) return [] as { idx: number; title: string; ordinal: number }[];
    let off = 0;
    return CANNABIS101_MODULES.map((m, i) => {
      const start = off;
      off += m.lessons.length;
      return { idx: start, title: m.title, ordinal: i + 1 };
    });
  }, [areaId]);

  const activeChapter = useMemo(() => {
    if (areaId !== CANNABIS101_AREA_ID) return null;
    return getCannabis101StreamChapter(activeIndex);
  }, [areaId, activeIndex]);

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className={cn("shrink-0 px-3 py-3", A.headerBottom)}>
        <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", A.kicker)}>
          {areaId === CANNABIS101_AREA_ID ? "Trilha do Cannabis 101" : "Programa da aula"}
        </p>
        <p className="mt-1 text-xs text-white/55">
          {areaId === CANNABIS101_AREA_ID
            ? "Todo o rolê em capítulos — busca por tema, número ou palavra que te lembra a cena."
            : "Índice do curso — busque por tema ou número da aula."}
        </p>
        <p className="mt-2 text-[11px] text-white/45 leading-relaxed">
          {areaId === CANNABIS101_AREA_ID ? (
            <>
              <span className="font-semibold text-white/55">Disponível</span> — entra na hora.{" "}
              <span className="font-semibold text-white/55">Vista</span> — você já marcou que estudou.{" "}
              <span className="font-semibold text-white/55">Bloqueada</span> — fecha a anterior primeiro (modo
              sequência ligado). <span className="font-semibold text-white/55">Em breve</span> — ainda não entrou no
              calendário publicado.
            </>
          ) : (
            <>
              Disponível: pode abrir. Vista: já marcou conclusão. Bloqueada: complete a aula anterior (sequência
              ativa). Em breve: fora do calendário publicado.
            </>
          )}
        </p>
        <label className={cn("mt-3 flex items-center gap-2 rounded-xl border bg-black/40 px-3 py-2", A.search)}>
          <Search className={cn("size-4 shrink-0", A.searchIcon)} aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              areaId === CANNABIS101_AREA_ID ? "Buscar episódio ou tema…" : "Buscar aula"
            }
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
          const chapterHead = moduleChapterStarts.find((s) => s.idx === idx);
          return (
            <li key={idx} className="space-y-1">
              {chapterHead ? (
                <div
                  className="rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-950/50 to-transparent px-2.5 py-2"
                  role="presentation"
                >
                  <p className={cn("text-[9px] font-bold uppercase tracking-[0.22em]", A.modKicker)}>
                    Capítulo {chapterHead.ordinal}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold leading-snug text-white/90">
                    {chapterHead.title}
                  </p>
                </div>
              ) : null}
              <button
                type="button"
                disabled={disabled}
                aria-label={`Aula ${idx + 1} de ${titles.length}: ${title}. Estado: ${STATUS_LABEL[gate]}.${active ? " Aula atual." : ""}`}
                onClick={() => !disabled && onSelectLesson(idx)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-xl border px-2.5 py-2.5 text-left text-sm transition-all duration-200",
                  active ? A.lessonOn : A.lessonOff,
                  disabled && "cursor-not-allowed opacity-[0.58]",
                  gate === "locked" && "border-dashed border-white/12",
                  gate === "seen" && !active && "border-emerald-500/15 bg-emerald-950/10",
                  !disabled && !active && "hover:-translate-y-px"
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
                  <span className="line-clamp-3 leading-snug">{title}</span>
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
        <div className="space-y-2 px-3 py-8 text-center">
          <p className="text-xs font-medium text-white/55">Nenhuma aula com esse filtro.</p>
          <p className="text-[11px] text-white/35">Experimente “Todas” ou limpe a pesquisa.</p>
        </div>
      ) : null}

      <div className={cn("shrink-0 p-3", A.footerTop)}>
        <p className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", A.modKicker)}>
          {activeChapter ? `Módulo · capítulo ${activeChapter.moduleOrdinal}` : "Módulo atual"}
        </p>
        {activeChapter ? (
          <p className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-snug text-amber-100/75">
            {activeChapter.moduleTitle}
          </p>
        ) : null}
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
