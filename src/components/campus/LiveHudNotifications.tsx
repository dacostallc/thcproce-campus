"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { pushLiveCampusHudNotification } from "@/stores/liveCampusHudFeedStore";
import { useLiveCampusHudFeedStore } from "@/stores/liveCampusHudFeedStore";
import { cn } from "@/lib/utils";

const MOCK_COMPLETION_HINTS = [
  "Álvaro Silva concluiu a trilha introdutória do Cannabis 101",
  "Mariana L. avançou no módulo de cultivo greenhouse",
  "João mantém ritmo de estudo no campus",
  "Coorte remota desbloqueou souvenir da temporada"
] as const;

/**
 * Pilha discreta de toasts no HUD — menos frequência em modo demo para reduzir ruído visual.
 */
export function LiveHudNotifications({
  campusNavActive
}: {
  campusNavActive: boolean;
}) {
  const items = useLiveCampusHudFeedStore((s) => s.items);
  const visitorCount = useCampusHudStore((s) => s.campusVisitorCount);
  const prevCount = useRef<number | null>(null);

  useEffect(() => {
    if (!campusNavActive || typeof visitorCount !== "number") return;
    if (prevCount.current === null) {
      prevCount.current = visitorCount;
      return;
    }
    if (prevCount.current === visitorCount) return;
    prevCount.current = visitorCount;
    pushLiveCampusHudNotification(`${visitorCount} alunos ligados ao campus ao vivo`);
  }, [campusNavActive, visitorCount]);

  useEffect(() => {
    if (!campusNavActive) return;
    const id = window.setInterval(() => {
      const hint = MOCK_COMPLETION_HINTS[Math.floor(Math.random() * MOCK_COMPLETION_HINTS.length)];
      if (hint) pushLiveCampusHudNotification(hint, 5_200);
    }, 82_000);
    return () => window.clearInterval(id);
  }, [campusNavActive]);

  if (!campusNavActive || items.length === 0) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[21] flex max-w-[18rem] flex-col gap-2",
        "max-sm:top-[calc(3.5rem+env(safe-area-inset-top))] max-sm:right-3 sm:top-[4.25rem] sm:right-4"
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => {
          const missionTone = item.message.includes("Missão concluída");
          return (
            <motion.article
              layout
              key={item.id}
              role="status"
              initial={{ opacity: 0, x: 14, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.94, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className={cn(
                "rounded-xl border px-3 py-2 text-[11px] font-medium leading-snug text-white shadow-lg backdrop-blur-md motion-reduce:transition-none",
                missionTone
                  ? "border-amber-400/28 bg-gradient-to-br from-amber-950/55 to-black/68 shadow-black/50 ring-1 ring-amber-400/12"
                  : "border-white/18 bg-black/58 shadow-black/45 ring-1 ring-white/[0.04]"
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-[0.12em]",
                  missionTone ? "text-amber-200/95" : "text-emerald-300/92"
                )}
              >
                {missionTone ? "Missão" : "Campus vivo"}
              </span>
              <p className="mt-1 text-white/[0.9]">{item.message}</p>
            </motion.article>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
