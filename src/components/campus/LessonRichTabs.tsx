"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Library,
  StickyNote,
  Target
} from "lucide-react";
import type { LessonRichContent } from "@/data/lessonRichTypes";
import type { AreaColor } from "@/data/courses";
import { cn } from "@/lib/utils";

type StreamPal = {
  articleBorder: string;
  sectionBorder: string;
  sectionTitle: string;
  summaryKicker: string;
  badgeNum: string;
  refBorder: string;
  profBox: string;
  textareaFocus: string;
};

/** Stream layout: Cannabis 101 = âmbar (`amber`); demais cursos = `streamAccent`. */
const STREAM_PALETTE: Record<AreaColor, StreamPal> = {
  amber: {
    articleBorder: "border-amber-500/15",
    sectionBorder: "border-amber-500/10",
    sectionTitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200/55 mb-3",
    summaryKicker: "text-[10px] font-bold uppercase tracking-widest text-amber-200/70",
    badgeNum: "bg-amber-500/15 text-[11px] font-bold text-amber-200",
    refBorder: "border-l-2 border-amber-500/25",
    profBox: "border border-amber-500/15 bg-amber-950/10",
    textareaFocus: "focus:ring-amber-500/35"
  },
  canna: {
    articleBorder: "border-canna-500/15",
    sectionBorder: "border-canna-500/10",
    sectionTitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-canna-200/55 mb-3",
    summaryKicker: "text-[10px] font-bold uppercase tracking-widest text-canna-200/70",
    badgeNum: "bg-canna-500/15 text-[11px] font-bold text-canna-200",
    refBorder: "border-l-2 border-canna-500/25",
    profBox: "border border-canna-500/15 bg-canna-950/10",
    textareaFocus: "focus:ring-canna-500/35"
  },
  purple: {
    articleBorder: "border-purple-500/15",
    sectionBorder: "border-purple-500/10",
    sectionTitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-purple-200/55 mb-3",
    summaryKicker: "text-[10px] font-bold uppercase tracking-widest text-purple-200/70",
    badgeNum: "bg-purple-500/15 text-[11px] font-bold text-purple-200",
    refBorder: "border-l-2 border-purple-500/25",
    profBox: "border border-purple-500/15 bg-purple-950/10",
    textareaFocus: "focus:ring-purple-500/35"
  },
  cyan: {
    articleBorder: "border-cyan-500/15",
    sectionBorder: "border-cyan-500/10",
    sectionTitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200/55 mb-3",
    summaryKicker: "text-[10px] font-bold uppercase tracking-widest text-cyan-200/70",
    badgeNum: "bg-cyan-500/15 text-[11px] font-bold text-cyan-200",
    refBorder: "border-l-2 border-cyan-500/25",
    profBox: "border border-cyan-500/15 bg-cyan-950/10",
    textareaFocus: "focus:ring-cyan-500/35"
  },
  rose: {
    articleBorder: "border-rose-500/15",
    sectionBorder: "border-rose-500/10",
    sectionTitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-rose-200/55 mb-3",
    summaryKicker: "text-[10px] font-bold uppercase tracking-widest text-rose-200/70",
    badgeNum: "bg-rose-500/15 text-[11px] font-bold text-rose-200",
    refBorder: "border-l-2 border-rose-500/25",
    profBox: "border border-rose-500/15 bg-rose-950/10",
    textareaFocus: "focus:ring-rose-500/35"
  }
};

const TABS = [
  { id: "conteudo" as const, label: "Aula", icon: BookOpen },
  { id: "objetivos" as const, label: "Objetivos", icon: Target },
  { id: "materiais" as const, label: "Materiais", icon: ClipboardList },
  { id: "refs" as const, label: "Referências", icon: Library },
  { id: "prof" as const, label: "Professor", icon: GraduationCap },
  { id: "notas" as const, label: "Suas notas", icon: StickyNote }
];

type TabId = (typeof TABS)[number]["id"];

type Props = {
  storageKey: string;
  content: LessonRichContent;
  /** Tema âmbar / ouro para sala Cannabis 101 */
  variant?: "default" | "cannabis101" | "campus";
  /**
   * `stream`: uma coluna contínua (estilo Notion/LMS) — sem barra de tabs dominando.
   * `tabs`: navegação por abas (default).
   */
  layout?: "tabs" | "stream";
  /** Com `variant="campus"` + `layout="stream"`: acento visual do curso. */
  streamAccent?: AreaColor;
};

export function LessonRichTabs({
  storageKey,
  content,
  variant = "default",
  layout = "tabs",
  streamAccent = "canna"
}: Props) {
  const [tab, setTab] = useState<TabId>("conteudo");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setTab("conteudo");
  }, [storageKey]);

  useEffect(() => {
    try {
      setNotes(localStorage.getItem(storageKey) ?? "");
    } catch {
      setNotes("");
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, notes);
    } catch {
      /* noop */
    }
  }, [storageKey, notes]);

  const c = variant === "cannabis101";
  const campusStream = variant === "campus" && layout === "stream";
  const stream = layout === "stream" && (c || campusStream);
  const pal = c ? STREAM_PALETTE.amber : STREAM_PALETTE[streamAccent];
  const wrap = c ? "border-amber-500/25 bg-[#050d0a]/80 shadow-[0_0_40px_rgba(0,0,0,0.35)]" : "border-white/10 bg-black/20";
  const tabBar = c ? "border-amber-500/20" : "border-white/10";
  const activeTab = c
    ? "bg-amber-500/20 text-amber-100 border border-amber-400/40"
    : "bg-canna-500/25 text-canna-100 border border-canna-400/35";
  const idleTab = c
    ? "text-white/50 hover:bg-amber-500/10 hover:text-white/90 border border-transparent"
    : "text-white/55 hover:bg-white/5 hover:text-white/90 border border-transparent";

  const bodyProse = "text-[15px] leading-[1.65] text-white/[0.88]";

  if (stream) {
    return (
      <article
        className={cn(
          "rounded-xl border px-4 py-5 sm:px-6 sm:py-6",
          pal.articleBorder,
          "bg-[#030806]/60 max-w-[70ch] mx-auto w-full"
        )}
      >
        <section className={cn("border-b pb-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>Conteúdo</h2>
          <div className={cn("space-y-4", bodyProse)}>
            <p>{content.intro}</p>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className={cn("mb-2", pal.summaryKicker)}>Resumo técnico</p>
              <p className="text-[14px] leading-relaxed text-white/80">{content.summary}</p>
            </div>
          </div>
        </section>

        <section className={cn("border-b py-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>Objetivos</h2>
          <ul className="space-y-2.5 text-[14px] leading-snug text-white/85">
            {content.objectives.map((o, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md",
                    pal.badgeNum
                  )}
                >
                  {i + 1}
                </span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={cn("border-b py-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>Materiais</h2>
          <ul className="space-y-2 text-[14px] text-white/85 list-none">
            {content.materials.map((m, i) => (
              <li key={i} className="rounded-md border border-white/10 bg-black/25 px-3 py-2">
                {m}
              </li>
            ))}
          </ul>
        </section>

        <section className={cn("border-b py-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>Referências</h2>
          <ul className="space-y-2 text-[14px] text-white/90 list-none">
            {content.references.map((r, i) => (
              <li key={i} className={cn("pl-3", pal.refBorder)}>
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className={cn("border-b py-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>Notas do professor</h2>
          <div
            className={cn(
              "rounded-lg px-4 py-3 text-[14px] leading-relaxed text-white/85",
              pal.profBox
            )}
          >
            {content.professorNotes}
          </div>
        </section>

        <section className="pt-8">
          <h2 className={pal.sectionTitle}>Suas notas</h2>
          <p className="mb-2 text-xs text-white/45">
            Guardadas neste dispositivo — para revisão rápida.
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            className={cn(
              "w-full rounded-lg border border-white/12 bg-black/35 px-3 py-2.5 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2",
              pal.textareaFocus
            )}
            placeholder="Anotações, dúvidas, próximos passos…"
          />
        </section>
      </article>
    );
  }

  return (
    <div className={cn("rounded-2xl border shadow-inner", wrap)}>
      <div className={cn("flex flex-wrap gap-1 border-b p-2", tabBar)}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors",
                active ? activeTab : idleTab
              )}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[240px] p-4 sm:min-h-[280px] sm:p-5">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3 text-white/85"
        >
          {tab === "conteudo" && (
            <div className="space-y-4 text-sm leading-relaxed">
              <p className="text-white/90">{content.intro}</p>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-widest text-canna-300/90 font-bold mb-2">
                  Resumo técnico
                </p>
                <p className="text-white/80">{content.summary}</p>
              </div>
            </div>
          )}
          {tab === "objetivos" && (
            <ul className="space-y-2 text-sm">
              {content.objectives.map((o, i) => (
                <li key={i} className="flex gap-2 rounded-lg border border-canna-400/15 bg-canna-500/5 px-3 py-2">
                  <span className="font-bold text-canna-300">{i + 1}.</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === "materiais" && (
            <ul className="space-y-2 text-sm list-none">
              {content.materials.map((m, i) => (
                <li key={i} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                  {m}
                </li>
              ))}
            </ul>
          )}
          {tab === "refs" && (
            <ul className="space-y-2 text-sm list-none">
              {content.references.map((r, i) => (
                <li key={i} className="rounded-lg border border-white/10 px-3 py-2 text-canna-100/90">
                  {r}
                </li>
              ))}
            </ul>
          )}
          {tab === "prof" && (
            <div className="rounded-xl border border-amber-400/20 bg-amber-950/20 p-4 text-sm leading-relaxed text-white/85">
              {content.professorNotes}
            </div>
          )}
          {tab === "notas" && (
            <div className="space-y-2">
              <p className="text-xs text-white/50">
                Guardadas neste dispositivo. Use para anotar insights da aula.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-canna-500/40"
                placeholder="Suas anotações, dúvidas para o fórum…"
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
