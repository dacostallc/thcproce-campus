"use client";

import { memo } from "react";
import { Users, DoorOpen, Presentation } from "lucide-react";
import type { CampusPresenceBreakdown } from "@/hooks/useCampusPresenceBreakdown";
import { cn } from "@/lib/utils";

type Props = { presence: CampusPresenceBreakdown; className?: string };

/**
 * Presence breakdown UX — valores “em salas / em aulas” são MOCK derivados
 * (ver `useCampusPresenceBreakdown`).
 */
export const CampusPresencePanel = memo(function CampusPresencePanel({
  presence,
  className
}: Props) {
  const t = presence.totalOnCampus;
  const r = presence.inRooms;
  const l = presence.inLessons;

  return (
    <div
      className={cn(
        "rounded-xl border border-white/12 bg-black/35 px-2.5 py-1.5 text-[10px] text-white/80 shadow-md shadow-black/25 sm:text-[11px]",
        className
      )}
    >
      <p className="mb-1 flex items-center gap-1 font-bold uppercase tracking-[0.14em] text-emerald-200/90">
        <Users size={12} className="opacity-95" aria-hidden />
        Presença (demo)
      </p>
      <ul className="space-y-0.5 tabular-nums">
        <li className="flex justify-between gap-4">
          <span className="text-white/50">Campus todo</span>
          <span className="font-semibold text-white">
            {t != null ? t : "~"}
          </span>
        </li>
        <li className="flex justify-between gap-4">
          <span className="flex items-center gap-1 text-white/48">
            <DoorOpen size={11} aria-hidden /> Em salas
          </span>
          <span className="font-semibold text-white/88">{r != null ? r : "—"}</span>
        </li>
        <li className="flex justify-between gap-4">
          <span className="flex items-center gap-1 text-white/48">
            <Presentation size={11} aria-hidden /> Em aulas agora
          </span>
          <span className="font-semibold text-white/88">{l != null ? l : "—"}</span>
        </li>
      </ul>
    </div>
  );
});
