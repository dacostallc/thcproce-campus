"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  Anchor,
  CheckCircle2,
  Compass,
  Crosshair,
  Dumbbell,
  Flame,
  Hammer,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "canna101" | "campus";

function toneShell(tone: Tone, variant: "soft" | "solid"): string {
  if (tone === "canna101") {
    return variant === "solid"
      ? "border-amber-400/35 bg-gradient-to-br from-amber-500/15 to-black/40 shadow-inner shadow-black/30 ring-1 ring-amber-500/15"
      : "border-amber-500/25 bg-black/35 backdrop-blur-sm ring-1 ring-amber-500/10";
  }
  return variant === "solid"
    ? "border-emerald-500/28 bg-gradient-to-br from-emerald-500/12 to-black/45 shadow-inner ring-1 ring-emerald-400/12"
    : "border-white/12 bg-black/35 backdrop-blur-sm ring-1 ring-white/[0.06]";
}

export function TipBlock({
  tone,
  title = "Dica de campo",
  icon,
  children,
  className
}: {
  tone: Tone;
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3.5 sm:px-5 sm:py-4",
        toneShell(tone, "soft"),
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border text-white shadow-inner",
            tone === "canna101"
              ? "border-amber-400/35 bg-amber-500/12 text-amber-100"
              : "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
          )}
        >
          {icon ?? <Lightbulb className="size-4 shrink-0 opacity-95" aria-hidden />}
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.22em]",
              tone === "canna101" ? "text-amber-200/85" : "text-emerald-200/80"
            )}
          >
            {title}
          </p>
          <div className="mt-2 text-[14px] leading-relaxed text-white/[0.92] sm:text-[15px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function WarningBlock({
  tone,
  title = "Cuidado — erro típico",
  children,
  className
}: {
  tone: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-red-400/35 bg-gradient-to-br from-red-950/55 via-black/45 to-black/35 px-4 py-3.5 sm:px-5 sm:py-4 shadow-[0_0_32px_rgba(239,68,68,0.06)] ring-1 ring-red-400/15",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-red-400/45 bg-red-950/55 text-red-100 shadow-inner">
          <AlertTriangle className="size-4 shrink-0" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-100/88">{title}</p>
          <div className="mt-2 text-[14px] leading-relaxed text-red-50/[0.94] sm:text-[15px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function MissionBlock({
  tone,
  title,
  subtitle,
  children,
  className
}: {
  tone: Tone;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.15rem] border px-4 py-4 sm:px-6 sm:py-5",
        tone === "canna101"
          ? "border-amber-500/35 bg-gradient-to-br from-[#142019]/98 via-[#0d1614]/96 to-black/88 shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-amber-400/18"
          : "border-white/14 bg-gradient-to-br from-emerald-950/35 via-black/55 to-black/70 ring-1 ring-emerald-500/12",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 size-40 rounded-full blur-3xl",
          tone === "canna101" ? "bg-amber-400/12" : "bg-emerald-400/10"
        )}
        aria-hidden
      />
      <div className="relative flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-inner",
            tone === "canna101"
              ? "border-amber-400/45 bg-black/45 text-amber-200"
              : "border-emerald-400/35 bg-black/40 text-emerald-100"
          )}
        >
          <Crosshair className="size-[18px] shrink-0" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.26em]",
              tone === "canna101" ? "text-amber-200/82" : "text-emerald-200/78"
            )}
          >
            {title}
          </p>
          {subtitle ? (
            <p className="mt-2 text-[14px] font-semibold leading-snug text-white/[0.95] sm:text-[15px]">
              {subtitle}
            </p>
          ) : null}
          <div className={cn("text-[14px] leading-relaxed text-white/[0.88] sm:text-[15px]", subtitle ? "mt-3" : "mt-2")}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExerciseBlock({
  tone,
  title = "Exercício — fecha o ciclo",
  children,
  className
}: {
  tone: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3.5 sm:px-5 sm:py-4",
        tone === "canna101"
          ? "border-violet-400/30 bg-gradient-to-br from-violet-950/40 via-black/45 to-black/55 ring-1 ring-violet-400/14"
          : "border-sky-400/28 bg-gradient-to-br from-sky-950/38 via-black/45 to-black/55 ring-1 ring-sky-400/12",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/14 bg-black/35 text-white/92 shadow-inner">
          <Dumbbell className="size-4 shrink-0" aria-hidden />
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.22em]",
              tone === "canna101" ? "text-violet-200/85" : "text-sky-200/82"
            )}
          >
            {title}
          </p>
          <div className="mt-2 text-[14px] leading-relaxed text-white/[0.9] sm:text-[15px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ToolBlock({
  tone,
  label,
  children,
  className
}: {
  tone: Tone;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3",
        toneShell(tone, "soft"),
        className
      )}
    >
      <span className="mt-0.5 shrink-0 text-white/55">
        <Wrench className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/55">{label}</p>
        <div className="mt-1.5 text-[13px] leading-relaxed text-white/[0.88] sm:text-[14px]">{children}</div>
      </div>
    </div>
  );
}

export function ProfessionalObservationBlock({
  tone,
  children,
  className
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3.5 sm:px-5 sm:py-4",
        tone === "canna101"
          ? "border-cyan-400/28 bg-gradient-to-br from-cyan-950/38 via-black/42 to-black/52 ring-1 ring-cyan-400/12"
          : "border-teal-400/26 bg-gradient-to-br from-teal-950/34 via-black/42 to-black/52 ring-1 ring-teal-400/12",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/14 bg-black/35 text-teal-100 shadow-inner">
          <Stethoscope className="size-4 shrink-0" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-100/88">
            Observação profissional
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-white/48">
            Tom de bastidor: direto, técnico, como na cabine — sem dramatizar nem moralizar.
          </p>
          <div className="mt-2 text-[14px] leading-relaxed text-white/[0.88] sm:text-[15px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

export type StreamPaletteSlice = {
  sectionBorder: string;
  sectionTitle: string;
  badgeNum: string;
};

/** Separador respirável entre blocos cinematográficos. */
export function PedagogySeparator({ tone, className }: { tone: Tone; className?: string }) {
  return (
    <div className={cn("-mx-1 py-5 sm:py-6", className)} role="presentation">
      <div
        className={cn(
          "h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent",
          tone === "canna101" && "via-amber-400/28"
        )}
      />
    </div>
  );
}

/** Lista escaneável — checkpoints / bullets com hierarquia clara. */
export function CheckpointBulletList({
  tone,
  items,
  numbered = false,
  startIndex = 0
}: {
  tone: Tone;
  items: string[];
  numbered?: boolean;
  startIndex?: number;
}) {
  return (
    <ul className="grid gap-2 sm:gap-2.5">
      {items.map((line, i) => (
        <li
          key={`${line.slice(0, 28)}-${i}`}
          className={cn(
            "flex gap-3 rounded-xl border px-3.5 py-2.5 sm:px-4 sm:py-3 text-[14px] sm:text-[15px] leading-snug text-white/[0.9]",
            tone === "canna101"
              ? "border-amber-500/22 bg-black/32 ring-1 ring-amber-500/08"
              : "border-white/11 bg-black/26 ring-1 ring-white/[0.04]"
          )}
        >
          <span className="mt-0.5 shrink-0 text-emerald-300/90">
            {numbered ? (
              <span className="flex size-7 items-center justify-center rounded-lg border border-white/14 bg-black/35 text-[11px] font-bold tabular-nums text-white/85">
                {startIndex + i + 1}
              </span>
            ) : (
              <CheckCircle2 className="size-[18px]" aria-hidden />
            )}
          </span>
          <span className="min-w-0">{line}</span>
        </li>
      ))}
    </ul>
  );
}

/** Topo da aula: briefing de missão em três batidas curtas. */
export function MissionBriefingHero({
  tone,
  impact,
  humanContext,
  discovery,
  className
}: {
  tone: Tone;
  impact: string;
  humanContext: string;
  discovery: string;
  className?: string;
}) {
  const beats = [
    { label: "Impacto", text: impact, Icon: Flame },
    { label: "Contexto humano", text: humanContext, Icon: Users },
    { label: "Descoberta", text: discovery, Icon: Compass }
  ] as const;

  return (
    <div className={cn("grid gap-3 sm:gap-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]",
            tone === "canna101"
              ? "border-amber-400/35 bg-amber-500/10 text-amber-100/95"
              : "border-emerald-400/28 bg-emerald-500/10 text-emerald-50/95"
          )}
        >
          Briefing de missão
        </span>
        <span className="text-[11px] font-medium text-white/45">não é capítulo de manual</span>
      </div>
      <div className="grid gap-3">
        {beats.map(({ label, text, Icon }) => (
          <div
            key={label}
            className={cn(
              "relative overflow-hidden rounded-[1rem] border px-4 py-3.5 sm:px-5 sm:py-4",
              tone === "canna101"
                ? "border-amber-500/28 bg-gradient-to-br from-black/55 via-[#101814]/96 to-black/88 shadow-inner shadow-black/40 ring-1 ring-amber-500/10"
                : "border-white/12 bg-gradient-to-br from-black/52 via-black/42 to-black/62 ring-1 ring-white/[0.06]"
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute left-0 top-0 h-full w-[3px]",
                tone === "canna101" ? "bg-gradient-to-b from-amber-400/55 to-amber-600/18" : "bg-gradient-to-b from-emerald-400/45 to-emerald-700/15"
              )}
              aria-hidden
            />
            <div className="relative flex gap-3 pl-1">
              <span
                className={cn(
                  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border shadow-inner",
                  tone === "canna101"
                    ? "border-amber-400/35 bg-black/40 text-amber-100"
                    : "border-emerald-400/28 bg-black/38 text-emerald-100"
                )}
              >
                <Icon className="size-[17px] shrink-0 opacity-95" aria-hidden />
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.22em]",
                    tone === "canna101" ? "text-amber-200/78" : "text-emerald-200/72"
                  )}
                >
                  {label}
                </p>
                <p className="mt-2 text-[15px] font-semibold leading-snug tracking-tight text-white/[0.94] sm:text-[16px]">
                  {text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LessonMissionRibbon({
  tone,
  pal,
  xp,
  minutes,
  difficulty,
  category,
  evolution
}: {
  tone: Tone;
  pal: StreamPaletteSlice;
  xp: number;
  minutes: number;
  difficulty: string;
  category: string;
  evolution: string;
}) {
  return (
    <section className={cn("border-b pb-7 sm:pb-9", pal.sectionBorder)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border px-4 py-4 sm:px-5 sm:py-5",
          tone === "canna101"
            ? "border-amber-500/38 bg-gradient-to-br from-[#162922]/98 via-[#0e1715]/96 to-black/88 shadow-[0_20px_50px_rgba(0,0,0,0.48)] ring-1 ring-amber-500/18"
            : "border-emerald-500/26 bg-gradient-to-br from-emerald-950/38 via-black/55 to-black/72 ring-1 ring-emerald-400/14"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -left-10 bottom-0 size-44 rounded-full blur-3xl",
            tone === "canna101" ? "bg-amber-400/14" : "bg-emerald-400/12"
          )}
          aria-hidden
        />
        <div className="relative flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75 shadow-inner">
            <Sparkles className="size-3.5 shrink-0 opacity-90" aria-hidden />
            Briefing operativo
          </span>
          <span className={cn("rounded-full px-3 py-1 text-[11px] font-bold tabular-nums shadow-inner", pal.badgeNum)}>
            +{xp} XP alvo
          </span>
          <span className="rounded-full border border-white/12 bg-black/28 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/60">
            ~{minutes} min estimados
          </span>
          <span className="rounded-full border border-white/10 bg-black/22 px-2.5 py-1 text-[10px] font-semibold text-white/72">
            {difficulty}
          </span>
        </div>
        <ToolBlock tone={tone} label="Categoria · foco deste módulo" className="mt-4 border-0 bg-black/22 ring-0">
          <span className="font-medium text-white/[0.92]">{category}</span>
        </ToolBlock>
        <div className="mt-3 flex items-start gap-2 text-[11px] leading-snug text-white/52">
          <Hammer className="mt-0.5 size-3.5 shrink-0 text-white/38" aria-hidden />
          <span>{evolution}</span>
        </div>
      </div>
    </section>
  );
}

export function OperationalDigestCard({
  tone,
  children,
  className
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border px-5 py-5 sm:px-7 sm:py-6",
        tone === "canna101"
          ? "border-amber-400/42 bg-gradient-to-br from-[#1a2823] via-[#101c18] to-[#070f0d] shadow-[0_0_48px_rgba(180,120,50,0.08)]"
          : "border-white/14 bg-black/42 shadow-inner",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute right-0 top-0 size-32 bg-gradient-to-bl to-transparent blur-2xl",
          tone === "canna101" ? "from-amber-400/12" : "from-emerald-400/10"
        )}
        aria-hidden
      />
      <div className="relative flex items-start gap-2">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-200/85" aria-hidden />
        <div className="min-w-0 text-[14px] leading-relaxed text-white/[0.9] sm:text-[15px]">{children}</div>
      </div>
    </div>
  );
}

export function LessonClosingCeremony({
  tone,
  pal,
  children,
  className
}: {
  tone: Tone;
  pal: StreamPaletteSlice;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b py-8 sm:py-11", pal.sectionBorder, className)}>
      <h2 className={cn("flex flex-wrap items-start gap-2 sm:gap-3", pal.sectionTitle)}>
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg border shadow-inner",
            tone === "canna101"
              ? "border-amber-400/35 bg-amber-500/12 text-amber-100"
              : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
          )}
        >
          <Anchor className="size-3.5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1 border-l border-white/12 pl-3 leading-tight">
          Conquista registada · ponte para a próxima missão
        </span>
      </h2>
      <TipBlock tone={tone} title="Continuidade" icon={<Sparkles className="size-4" aria-hidden />} className="mt-5">
        {children}
      </TipBlock>
    </section>
  );
}
