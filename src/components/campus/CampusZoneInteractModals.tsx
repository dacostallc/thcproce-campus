"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { CampusZone } from "@/data/campusZones";
import type { Area } from "@/data/courses";
import { cn } from "@/lib/utils";
import { CAMPUS_ZONE_ICON_MAP } from "@/lib/campusZoneIcons";

type PickerProps = {
  zone: CampusZone | null;
  areas: Area[];
  onClose: () => void;
  onPickArea: (area: Area) => void;
};

/**
 * Painel quando a zona tem mais do que um curso (`courseIds`).
 */
export function CampusZoneCoursePicker({
  zone,
  areas,
  onClose,
  onPickArea
}: PickerProps) {
  const Icon = zone
    ? CAMPUS_ZONE_ICON_MAP[zone.icon] ?? CAMPUS_ZONE_ICON_MAP["map-pin"]!
    : null;

  return (
    <AnimatePresence>
      {zone && (
        <>
          <motion.button
            type="button"
            aria-label="Fechar"
            className="fixed inset-0 z-[56] bg-black/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="zone-picker-title"
            className={cn(
              "fixed left-1/2 top-1/2 z-[57] w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2",
              "rounded-2xl border border-white/12 bg-ink-900/96 p-4 shadow-2xl shadow-black/50"
            )}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {Icon ? (
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5"
                    style={{ color: zone.color }}
                  >
                    <Icon className="size-5" strokeWidth={2} />
                  </span>
                ) : null}
                <div>
                  <p
                    id="zone-picker-title"
                    className="text-xs font-bold uppercase tracking-wider text-white/50"
                  >
                    Zona {zone.number}
                  </p>
                  <h2 className="text-lg font-semibold text-white">
                    {zone.label}
                  </h2>
                  <p className="mt-1 text-sm text-white/65 leading-snug">
                    {zone.description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-white/55 hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-amber-200/85">
              Cursos nesta área
            </p>
            <ul className="mt-2 max-h-[min(50vh,280px)] space-y-2 overflow-y-auto pr-1">
              {areas.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onPickArea(a)}
                    className={cn(
                      "w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-left text-sm font-medium text-white",
                      "transition-colors hover:border-canna-400/40 hover:bg-canna-500/10"
                    )}
                  >
                    {a.mapLabel ?? a.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

type StatusProps = {
  zone: CampusZone | null;
  kind: "locked" | "comingSoon" | null;
  onClose: () => void;
};

export function CampusZoneStatusModal({
  zone,
  kind,
  onClose
}: StatusProps) {
  return (
    <AnimatePresence>
      {zone && kind ? (
        <>
          <motion.button
            type="button"
            aria-label="Fechar"
            className="fixed inset-0 z-[56] bg-black/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn(
              "fixed left-1/2 top-1/2 z-[57] w-[min(90vw,380px)] -translate-x-1/2 -translate-y-1/2",
              "rounded-2xl border border-amber-400/35 bg-amber-950/95 p-5 shadow-xl"
            )}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
          >
            <div className="flex justify-between gap-2">
              <h2 className="text-base font-semibold text-amber-100">
                {kind === "locked" ? "Área bloqueada" : "Em breve"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-amber-200/80 hover:bg-black/25"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-2 text-sm font-medium text-white">
              {zone.number} · {zone.label}
            </p>
            <p className="mt-2 text-sm leading-snug text-amber-100/85">
              {kind === "locked"
                ? "Esta área ainda não está disponível na tua conta. Explora outras zonas ou vê os planos de acesso."
                : "Estamos a preparar conteúdo para esta área. Fica atento às novidades."}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-amber-400/20 py-2.5 text-sm font-semibold text-amber-100 hover:bg-amber-400/30"
            >
              Percebi
            </button>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
