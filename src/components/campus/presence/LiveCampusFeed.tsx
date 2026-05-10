"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
 * Canal social mock — atualiza pouco freq. (throttle cliente) para evitar churn de render.
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
    const throttleMs = 11_500;
    const id = window.setInterval(() => {
      const now = Date.now();
      if (now - lastEmitAt.current < throttleMs) return;
      lastEmitAt.current = now;
      pushRow(pickMessage());
    }, 14_800);
    return () => window.clearInterval(id);
  }, [pushRow]);

  const body = useMemo(
    () =>
      rows.map((r) => (
        <div
          key={r.id}
          className="truncate border-l border-emerald-300/38 pl-2 text-emerald-100/88"
          title={r.text}
        >
          {r.text}
        </div>
      )),
    [rows]
  );

  return (
    <aside
      className={cn(
        "rounded-xl border border-white/14 bg-black/38 px-3 py-2 backdrop-blur-sm",
        className
      )}
      aria-live="polite"
      aria-label="Feed vivo do campus (demonstração)"
    >
      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/56">
        Atividade ao vivo (demonstração)
      </p>
      <div className="max-h-[7.75rem] space-y-1.5 overflow-y-auto text-[11px] leading-snug scrollbar-thin pr-1 text-white/80">
        {body}
      </div>
    </aside>
  );
}
