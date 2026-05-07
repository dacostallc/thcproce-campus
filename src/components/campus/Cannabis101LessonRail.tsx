"use client";

import type { ReactNode } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Crown,
  Flame,
  Sparkles,
  Star,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { levelNumberFromKey } from "@/data/gamificationLevels";

type ProgressUi = {
  xp: number;
  levelLabel: string;
  levelKey: string;
  streak: number;
};

type Props = {
  coursePct: number;
  doneCount: number;
  totalLessons: number;
  /** Ex.: "9h" para estimativa de tempo */
  courseHoursLabel: string;
  titles: string[];
  clampedLesson: number;
  doneSet: Set<number>;
  onSelectLesson: (idx: number) => void;
  progressUi: ProgressUi | null;
};

function formatXp(n: number): string {
  return n.toLocaleString("pt-BR");
}

/** Estimativa de tempo de estudo a partir das aulas marcadas (rotação ~20 min/aula). */
function estStudyMinutes(doneCount: number, totalLessons: number, courseHoursHint: string): string {
  const hMatch = courseHoursHint.match(/(\d+)\s*h/i);
  const totalH = hMatch ? Number(hMatch[1]) : 9;
  const totalMin = Math.max(totalLessons, 1) > 0 ? totalH * 60 : 540;
  const ratio = totalLessons ? doneCount / totalLessons : 0;
  const m = Math.round(ratio * totalMin);
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  if (hh <= 0) return `${mm} min`;
  return `${hh}h ${mm.toString().padStart(2, "0")}m`;
}

export function Cannabis101LessonRail({
  coursePct,
  doneCount,
  totalLessons,
  courseHoursLabel,
  titles,
  clampedLesson,
  doneSet,
  onSelectLesson,
  progressUi
}: Props) {
  const nextMilestone = 5;
  const towardFive = Math.min(doneCount, nextMilestone);
  const nextPct = Math.round((towardFive / nextMilestone) * 100);

  const xp = progressUi?.xp ?? 0;
  const streak = progressUi?.streak ?? 0;
  const levelN = levelNumberFromKey(progressUi?.levelKey);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#0c1812] to-[#050a08] p-4 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/80">
          <span>Progresso do curso</span>
          <span className="text-amber-300">{coursePct}%</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/50 ring-1 ring-amber-500/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-canna-500 transition-all duration-500"
            style={{ width: `${coursePct}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-white/45">
          {doneCount} / {totalLessons || "—"} aulas com vista registrada
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<Crown className="size-4 text-amber-400" />}
          label="Nível"
          value={String(levelN)}
          sub={progressUi?.levelLabel ?? "—"}
        />
        <StatCard
          icon={<Star className="size-4 text-amber-300" />}
          label="XP"
          value={formatXp(xp)}
          sub="Total"
        />
        <StatCard
          icon={<Flame className="size-4 text-orange-400" />}
          label="Streak"
          value={streak > 0 ? `${streak} dias` : "—"}
          sub="Seguidos"
        />
        <StatCard
          icon={<Clock className="size-4 text-cyan-300/90" />}
          label="Tempo"
          value={estStudyMinutes(doneCount, totalLessons, courseHoursLabel)}
          sub="Estimado"
        />
      </div>

      <div>
        <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/70">
          <TrendingUp className="size-3.5" /> Aulas do curso
        </p>
        <ul className="max-h-[min(52vh,28rem)] space-y-1 overflow-y-auto scrollbar-thin pr-1">
          {titles.map((t, idx) => {
            const checked = doneSet.has(idx);
            const active = idx === clampedLesson;
            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => onSelectLesson(idx)}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                    active
                      ? "border-amber-400/50 bg-amber-500/15 text-white shadow-[0_0_20px_rgba(212,175,55,0.12)]"
                      : "border-white/10 bg-black/20 text-white/80 hover:border-amber-500/25 hover:bg-white/5"
                  )}
                >
                  <span className="mt-0.5 shrink-0 text-amber-300/90">
                    {checked ? <CheckCircle2 className="size-4" /> : <Circle className="size-4 opacity-50" />}
                  </span>
                  <span>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-white/40">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{t}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-[#081510] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/70">Próxima conquista</p>
        <p className="mt-2 text-sm font-semibold text-white">Assistir {nextMilestone} aulas</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-canna-500"
            style={{ width: `${nextPct}%` }}
          />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-200/90">
          <Sparkles className="size-3.5 shrink-0" />
          +250 XP ao completar
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-amber-500/15 bg-black/35 p-3">
      <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/45">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-lg font-extrabold leading-none text-white">{value}</p>
      <p className="mt-0.5 text-[10px] text-white/40">{sub}</p>
    </div>
  );
}
