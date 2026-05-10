"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type FeedMsg = {
  id: string;
  t: number;
  text: string;
};

const SEED_MESSAGES = [
  "Aluno · explorou o mapa holográfico",
  "Aluna · iniciou a sala Cannábica",
  "Visitante · abriu o mural do campus",
  "Turma remota · 12 ligadas ao campus",
  "Novo souvenir raro aparece no inventário",
  "Laboratório · filas curtas esta hora",
  "Ao vivo · sala de perguntas reaberta em breve"
] as const;

function pickMessage(): string {
  return SEED_MESSAGES[Math.floor(Math.random() * SEED_MESSAGES.length)] ?? SEED_MESSAGES[0];
}

/**
 * Canal social mock — entradas suaves e throttle mais calmo (menos ruído).
 */
export function LiveCampusFeed({ className }: { className?: string }) {
  const [rows, setRows] = useState<FeedMsg[]>(() => []);
  const lastEmitAt = useRef(0);

  const pushRow = useCallback((text: string) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `feed-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setRows((prev) =>
      [{ id, t: Date.now(), text }, ...prev].slice(0, 8).filter(Boolean)
    );
  }, []);

  useEffect(() => {
    pushRow(`Campus vivo · feed local · ${pickMessage()}`);
  }, [pushRow]);

  useEffect(() => {
    const throttleMs = 14_000;
    const id = window.setInterval(() => {
      const now = Date.now();
      if (now - lastEmitAt.current < throttleMs) return;
      lastEmitAt.current = now;
      pushRow(pickMessage());
    }, 19_000);
    return () => window.clearInterval(id);
  }, [pushRow]);

  return (
    <aside
      className={cn(
        "rounded-xl border border-white/14 bg-black/38 px-3 py-2 backdrop-blur-sm transition-[border-color,background-color] duration-300 ease-campus-out hover:border-white/[0.18]",
        className
      )}
      aria-live="polite"
      aria-label="Feed vivo do campus (demonstração)"
    >
      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/56">
        Atividade ao vivo (demonstração)
      </p>
      <div className="max-h-[7.75rem] space-y-1 overflow-y-auto pr-1 text-[11px] leading-snug scrollbar-thin text-white/80">
        <AnimatePresence initial={false}>
          {rows.map((r) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="truncate border-l border-emerald-300/35 pl-2 text-emerald-100/88 transition-colors duration-200 hover:text-white/92"
              title={r.text}
            >
              {r.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
