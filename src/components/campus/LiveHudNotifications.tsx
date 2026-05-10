"use client";

import { useEffect, useRef } from "react";
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
 * Discrete stack of HUD toasts — mock interval + realtime visitor count deltas.
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
    }, 58_400);
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
      {items.map((item) => (
        <article
          key={item.id}
          className={cn(
            "animate-hudToastIn rounded-xl border border-white/22 bg-black/62 px-3 py-2 text-[11px] font-medium leading-snug text-white shadow-lg shadow-black/45 backdrop-blur-md motion-reduce:animate-none"
          )}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300/92">
            Campus vivo
          </span>
          <p className="mt-1 text-white/88">{item.message}</p>
        </article>
      ))}
    </div>
  );
}
