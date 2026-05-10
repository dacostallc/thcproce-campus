"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  areaName: string | null;
  onOpen: () => void;
  onDismiss: () => void;
};

/**
 * Quando o avatar chega perto de um hotspot, oferece abrir a sala sem precisar mirar no ponto exato.
 */
export function ProximityBanner({ areaName, onOpen, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {areaName ? (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[35] px-4 w-full max-w-md"
        >
          <div className="glass-hud rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm text-white/[0.92] flex-1 leading-snug">
              Quase lá — você entrou na zona de{" "}
              <span className="font-semibold text-canna-200">{areaName}</span>.
              <span className="text-white/55 text-xs block mt-1 font-normal normal-case tracking-normal">
                Dá pra abrir direto, sem precisar mirar no mapa.
              </span>
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={onDismiss}
                className="px-3.5 py-2 rounded-full text-xs font-medium glass-hud hover:scale-[1.02] active:scale-[0.98] transition-transform text-white/75 hover:text-white"
              >
                Depois
              </button>
              <button
                type="button"
                onClick={onOpen}
                className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-canna-500 to-canna-400 hover:from-canna-400 hover:to-canna-300 text-ink-900 transition-all shadow-md shadow-canna-900/30 hover:scale-[1.02] active:scale-[0.98]"
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
