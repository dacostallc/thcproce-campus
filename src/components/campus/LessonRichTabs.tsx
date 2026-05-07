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
import { cn } from "@/lib/utils";

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
};

export function LessonRichTabs({ storageKey, content }: Props) {
  const [tab, setTab] = useState<TabId>("conteudo");
  const [notes, setNotes] = useState("");

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

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 shadow-inner">
      <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
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
                active
                  ? "bg-canna-500/25 text-canna-100 border border-canna-400/35"
                  : "text-white/55 hover:bg-white/5 hover:text-white/90 border border-transparent"
              )}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-5 min-h-[200px]">
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
