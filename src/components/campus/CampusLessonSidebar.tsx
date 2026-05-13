"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Eye,
  Lock,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCampusLessonGate } from "@/config/campusLessonGate";
import type { LessonGateStatus } from "@/content/courses/cannabis-101/gating";
import {
  CANNABIS101_AREA_ID,
  getCannabis101StreamChapter,
} from "@/content/courses/cannabis-101";
import type { AreaColor } from "@/data/courses";
import { getLessonListAccent } from "@/lib/campusAccent";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LessonFilter = "all" | "available" | "visited" | "completed" | "soon";

type LessonRow = {
  idx: number;
  title: string;
  /** Apenas o rótulo da aula, sem o prefixo de categoria. */
  label: string;
  gate: LessonGateStatus;
};

type LessonGroup = {
  /** Nome da categoria (ex.: "Fundamentos"). Vazio = títulos sem prefixo. */
  category: string;
  /** Chave estável para controle de estado. */
  key: string;
  rows: LessonRow[];
};

// ─── Constantes ───────────────────────────────────────────────────────────────

const CATEGORY_SEP = " · ";

const STATUS_LABEL: Record<LessonGateStatus, string> = {
  completed: "Concluída",
  visited: "Visitada",
  available: "Disponível",
  locked: "Bloqueada",
  soon: "Em breve",
};

const FILTER_CHIPS: { id: LessonFilter; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "available", label: "Disponíveis" },
  { id: "visited", label: "Visitadas" },
  { id: "completed", label: "Concluídas" },
  { id: "soon", label: "Em breve" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Divide "Categoria · Label da aula" em partes. Títulos sem separador ficam com category="". */
function parseTitleParts(title: string): { category: string; label: string } {
  const i = title.indexOf(CATEGORY_SEP);
  if (i === -1) return { category: "", label: title };
  return { category: title.slice(0, i), label: title.slice(i + CATEGORY_SEP.length) };
}

/** Detecta se o array de títulos usa o padrão "Categoria · Label". */
function hasCategoryPrefix(titles: readonly string[]): boolean {
  return titles.some((t) => t.includes(CATEGORY_SEP));
}

/** Monta grupos preservando a ordem de aparição das categorias. */
function buildGroups(rows: LessonRow[]): LessonGroup[] {
  const map = new Map<string, LessonGroup>();
  for (const row of rows) {
    const { category } = parseTitleParts(row.title);
    const key = category || "__ungrouped__";
    if (!map.has(key)) {
      map.set(key, { category, key, rows: [] });
    }
    map.get(key)!.rows.push(row);
  }
  return [...map.values()];
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  areaId: string;
  accent: AreaColor;
  titles: string[];
  activeIndex: number;
  doneSet: Set<number>;
  /** Painéis de aula já abertos (localStorage), independente de conclusão. */
  visitedSet: Set<number>;
  onSelectLesson: (idx: number) => void;
  className?: string;
  /** Rodapé: botão "Próxima aula". */
  onNextLesson?: () => void;
  nextLessonDisabled?: boolean;
};

// ─── Componente principal ─────────────────────────────────────────────────────

export function CampusLessonSidebar({
  areaId,
  accent,
  titles,
  activeIndex,
  doneSet,
  visitedSet,
  onSelectLesson,
  className,
  onNextLesson,
  nextLessonDisabled,
}: Props) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<LessonFilter>("all");
  const A = getLessonListAccent(accent);

  const useGrouped = useMemo(() => hasCategoryPrefix(titles), [titles]);

  // Chave da categoria da aula ativa — garante auto-expansão correta
  const activeCategoryKey = useMemo(
    () => parseTitleParts(titles[activeIndex] ?? "").category || "__ungrouped__",
    [titles, activeIndex],
  );

  // Estado de categorias abertas — começa com todas abertas
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(titles.map((t) => parseTitleParts(t).category || "__ungrouped__")),
  );

  // Garante que a categoria da aula ativa sempre fique aberta ao trocar de lição
  useEffect(() => {
    setOpenCategories((prev) => {
      if (prev.has(activeCategoryKey)) return prev;
      return new Set([...prev, activeCategoryKey]);
    });
  }, [activeCategoryKey]);

  function toggleCategory(key: string) {
    setOpenCategories((prev) => {
      // Não permite fechar a categoria da aula ativa
      if (key === activeCategoryKey) return prev;
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Rows com gate + label extraído
  const rows = useMemo<LessonRow[]>(
    () =>
      titles.map((title, idx) => {
        const gate = getCampusLessonGate(areaId, idx, titles.length, doneSet, visitedSet);
        const { label } = parseTitleParts(title);
        return { idx, title, label, gate };
      }),
    [titles, doneSet, visitedSet, areaId],
  );

  // Filtragem (busca + chip)
  const filtered = useMemo<LessonRow[]>(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(({ idx, title, gate }) => {
      const matchSearch =
        !needle ||
        title.toLowerCase().includes(needle) ||
        String(idx + 1).includes(needle) ||
        `aula ${idx + 1}`.includes(needle);
      if (!matchSearch) return false;
      if (filter === "all") return true;
      if (filter === "completed") return gate === "completed";
      if (filter === "visited") return gate === "visited";
      if (filter === "soon") return gate === "soon";
      if (filter === "available") return gate === "available";
      return true;
    });
  }, [rows, q, filter]);

  // Agrupamento: apenas quando sem busca ativa e sem filtro específico
  const groups = useMemo<LessonGroup[] | null>(() => {
    if (!useGrouped || q.trim() || filter !== "all") return null;
    return buildGroups(filtered);
  }, [filtered, useGrouped, q, filter]);

  const activeChapter = useMemo(() => {
    if (areaId !== CANNABIS101_AREA_ID) return null;
    return getCannabis101StreamChapter(activeIndex);
  }, [areaId, activeIndex]);

  const activeLabelForFooter = parseTitleParts(titles[activeIndex] ?? "").label
    || titles[activeIndex]
    || "—";

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>

      {/* ── Cabeçalho + busca + filtros ────────────────────────────────────── */}
      <div className={cn("shrink-0 px-3 py-3", A.headerBottom)}>
        <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", A.kicker)}>
          {areaId === CANNABIS101_AREA_ID ? "Trilha do Cannabis 101" : "Programa da aula"}
        </p>
        <p className="mt-1 text-xs text-white/55">
          {areaId === CANNABIS101_AREA_ID
            ? "Aulas agrupadas por categoria — busca por tema ou número."
            : "Índice do curso — busque por tema ou número da aula."}
        </p>

        <label
          className={cn(
            "mt-3 flex items-center gap-2 rounded-xl border bg-black/40 px-3 py-2",
            A.search,
          )}
        >
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
                filter === c.id ? A.chipOn : A.chipOff,
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Lista de aulas ──────────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
        {groups ? (
          // ── Modo agrupado (accordion) ──────────────────────────────────
          <div className="space-y-1.5 p-2">
            {groups.map(({ category, key, rows: groupRows }) => {
              const isOpen = openCategories.has(key);
              const isActive = key === activeCategoryKey;
              const doneCount = groupRows.filter((r) => r.gate === "completed").length;
              const progressPct = groupRows.length
                ? Math.round((doneCount / groupRows.length) * 100)
                : 0;

              return (
                <div key={key} className="rounded-xl">
                  {/* Cabeçalho da categoria */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(key)}
                    aria-expanded={isOpen}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
                      isActive
                        ? "border-amber-500/30 bg-amber-950/40 hover:bg-amber-950/50"
                        : "border-white/8 bg-white/[0.04] hover:bg-white/[0.07]",
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "size-3.5 shrink-0 transition-transform duration-200",
                        isOpen ? "rotate-0" : "-rotate-90",
                        isActive ? "text-amber-300/75" : "text-white/35",
                      )}
                      aria-hidden
                    />

                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-[11px] font-bold leading-snug tracking-wide",
                          isActive ? "text-amber-200/90" : "text-white/80",
                        )}
                      >
                        {category || "Aulas"}
                      </span>
                      <span className="mt-0.5 block text-[9px] text-white/35">
                        {doneCount}/{groupRows.length}{" "}
                        concluída{groupRows.length !== 1 ? "s" : ""}
                      </span>
                    </span>

                    {/* Mini barra de progresso da categoria */}
                    <span className="h-1 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
                      <span
                        className={cn("block h-full rounded-full transition-all", A.barFill)}
                        style={{ width: `${progressPct}%` }}
                      />
                    </span>
                  </button>

                  {/* Aulas da categoria */}
                  {isOpen && (
                    <ul className="mt-1 space-y-1 pl-2">
                      {groupRows.map((row) => (
                        <LessonItem
                          key={row.idx}
                          row={row}
                          active={row.idx === activeIndex}
                          total={titles.length}
                          A={A}
                          onSelect={onSelectLesson}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // ── Modo flat (busca ativa, filtro específico ou sem prefixo) ───
          <ul className="space-y-1 p-2">
            {filtered.map((row) => (
              <LessonItem
                key={row.idx}
                row={row}
                active={row.idx === activeIndex}
                total={titles.length}
                A={A}
                onSelect={onSelectLesson}
              />
            ))}
          </ul>
        )}

        {filtered.length === 0 && (
          <div className="space-y-2 px-3 py-8 text-center">
            <p className="text-xs font-medium text-white/55">Nenhuma aula com esse filtro.</p>
            <p className="text-[11px] text-white/35">
              Experimente &ldquo;Todas&rdquo; ou limpe a pesquisa.
            </p>
          </div>
        )}
      </div>

      {/* ── Rodapé: módulo atual + botão próxima ───────────────────────────── */}
      <div className={cn("shrink-0 p-3", A.footerTop)}>
        <p className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", A.modKicker)}>
          {activeChapter ? `Módulo · capítulo ${activeChapter.moduleOrdinal}` : "Módulo atual"}
        </p>
        {activeChapter && (
          <p className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-snug text-amber-100/75">
            {activeChapter.moduleTitle}
          </p>
        )}
        <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-white">
          {activeLabelForFooter}
        </p>
        <div className={cn("mt-2 h-1.5 overflow-hidden rounded-full", A.barTrack)}>
          <div
            className={cn("h-full rounded-full transition-all", A.barFill)}
            style={{
              width: `${
                titles.length
                  ? Math.min(100, ((activeIndex + 1) / titles.length) * 100)
                  : 0
              }%`,
            }}
          />
        </div>
        {onNextLesson && (
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
        )}
      </div>
    </div>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

type LessonItemProps = {
  row: LessonRow;
  active: boolean;
  total: number;
  A: ReturnType<typeof getLessonListAccent>;
  onSelect: (idx: number) => void;
};

function LessonItem({ row, active, total, A, onSelect }: LessonItemProps) {
  const { idx, label, title, gate } = row;
  const disabled = gate === "locked" || gate === "soon";

  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        aria-label={`Aula ${idx + 1} de ${total}: ${title}. Estado: ${STATUS_LABEL[gate]}.${
          active ? " Aula atual." : ""
        }`}
        onClick={() => !disabled && onSelect(idx)}
        className={cn(
          "flex w-full items-start gap-2 rounded-xl border px-2.5 py-2.5 text-left text-sm transition-all duration-200",
          active ? A.lessonOn : A.lessonOff,
          disabled && "cursor-not-allowed opacity-[0.58]",
          gate === "locked" && "border-dashed border-white/12",
          gate === "completed" && !active && "border-emerald-500/15 bg-emerald-950/10",
          gate === "visited" && !active && "border-sky-500/15 bg-sky-950/10",
          !disabled && !active && "hover:-translate-y-px",
        )}
      >
        <span
          className={cn(
            "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold",
            active ? A.numOn : A.numOff,
          )}
        >
          {idx + 1}
        </span>

        <span className="min-w-0 flex-1">
          <span className="line-clamp-3 leading-snug">{label}</span>
          <span className="mt-1 flex flex-wrap items-center gap-1">
            <StatusPill gate={gate} />
            {active && (
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase",
                  A.atual,
                )}
              >
                Atual
              </span>
            )}
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
}

function StatusPill({ gate }: { gate: LessonGateStatus }) {
  const label = STATUS_LABEL[gate];
  const Icon =
    gate === "completed"
      ? CheckCircle2
      : gate === "visited"
        ? Eye
        : gate === "locked"
          ? Lock
          : gate === "soon"
            ? Clock
            : Circle;
  const cls =
    gate === "completed"
      ? "border-emerald-500/35 bg-emerald-500/15 text-emerald-200"
      : gate === "visited"
        ? "border-sky-500/35 bg-sky-500/12 text-sky-200"
        : gate === "soon"
          ? "border-amber-500/30 bg-amber-500/10 text-amber-200/90"
          : gate === "locked"
            ? "border-white/15 bg-white/5 text-white/45"
            : "border-canna-500/25 bg-canna-500/10 text-canna-200";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
        cls,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {label}
    </span>
  );
}
