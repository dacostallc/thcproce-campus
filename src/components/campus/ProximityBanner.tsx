"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  areaName: string | null;
  onOpen: () => void;
  onDismiss: () => void;
};

/**
 * Opcional: só quando `NEXT_PUBLIC_CAMPUS_ZONE_ENTRY_PROMPT=true`.
 * Ao aproximar do edifício no mapa, sugere abrir a sala; «Depois» / fechar persistem na sessão por zona.
 */
export function ProximityBanner({ areaName, onOpen, onDismiss }: Props) {
  return (
    <AnimatePresence mode="wait">
      {areaName ? (
        <motion.div
          key={areaName}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="pointer-events-none fixed bottom-24 left-1/2 z-[35] w-full max-w-md -translate-x-1/2 px-4"
        >
          <div className="pointer-events-auto relative flex flex-col gap-3 rounded-2xl p-4 glass-hud sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onDismiss}
              className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Fechar sugestão de zona"
            >
              <X className="size-4" strokeWidth={2.2} aria-hidden />
            </button>
            <p className="flex-1 pr-8 text-sm leading-snug text-white/[0.92] sm:pr-6">
              Quase lá — você entrou na zona de{" "}
              <span className="font-semibold text-canna-200">{areaName}</span>.
              <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-white/55">
                Dá pra abrir direto, sem precisar mirar no mapa.
              </span>
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-full px-3.5 py-2 text-xs font-medium text-white/75 transition-transform glass-hud hover:scale-[1.02] hover:text-white active:scale-[0.98]"
              >
                Depois
              </button>
              <button
                type="button"
                onClick={onOpen}
                className="rounded-full bg-gradient-to-r from-canna-500 to-canna-400 px-4 py-2 text-xs font-bold text-ink-900 shadow-md shadow-canna-900/30 transition-all hover:scale-[1.02] hover:from-canna-400 hover:to-canna-300 active:scale-[0.98]"
              >
                Entrar na sala
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
