"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Clock,
  Crown,
  Flame,
  MapPin,
  Sparkles,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { levelNumberFromKey } from "@/data/gamificationLevels";
import { useSession } from "next-auth/react";
import { isCampusAdminEmail } from "@/lib/campusAdmin";

const MOODLE = "https://thcproce.com.br/escola";

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
  progressUi: ProgressUi | null;
  onBackToCampus: () => void;
  className?: string;
};

function formatXp(n: number): string {
  return n.toLocaleString("pt-BR");
}

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

/** Painel direito: progresso, XP, ações — sem lista de aulas (fica à esquerda) */
export function Cannabis101LessonRail({
  coursePct,
  doneCount,
  totalLessons,
  courseHoursLabel,
  progressUi,
  onBackToCampus,
  className
}: Props) {
  const { data: session } = useSession();
  const campusAdmin = isCampusAdminEmail(session?.user?.email ?? null);

  const nextMilestone = 5;
  const towardFive = Math.min(doneCount, nextMilestone);
  const nextPct = Math.round((towardFive / nextMilestone) * 100);

  const xp = progressUi?.xp ?? 0;
  const streak = progressUi?.streak ?? 0;
  const levelN = levelNumberFromKey(progressUi?.levelKey);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {campusAdmin ? (
        <div className="rounded-lg border border-amber-400/40 bg-gradient-to-r from-amber-500/15 to-transparent px-2.5 py-1.5 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-100">
            Admin THCProce
          </span>
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="default"
          size="sm"
          className="w-full bg-canna-600 font-bold text-ink-900 hover:bg-canna-500"
          asChild
        >
          <Link href={MOODLE} target="_blank" rel="noreferrer">
            Entrar no Moodle
          </Link>
        </Button>
        <Button
          type="button"
          variant="glass"
          size="sm"
          className="w-full border-amber-500/35 bg-black/30 font-bold text-amber-100 hover:bg-amber-500/10"
          onClick={onBackToCampus}
        >
          <MapPin className="mr-2 size-4" />
          Voltar ao campus
        </Button>
      </div>

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

      <div className="rounded-2xl border border-amber-500/20 bg-[#081510] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/70">Próxima conquista</p>
        <p className="mt-2 text-sm font-semibold text-white">Completar {nextMilestone} aulas</p>
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
