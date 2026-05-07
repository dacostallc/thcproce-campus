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
          <div className="glass-strong rounded-2xl border border-canna-400/35 p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-xl">
            <p className="text-sm text-white/90 flex-1">
              Você está perto de{" "}
              <span className="font-semibold text-canna-200">{areaName}</span>.
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={onDismiss}
                className="px-3 py-2 rounded-xl text-xs font-medium glass hover:bg-white/10 transition-colors"
              >
                Ignorar
              </button>
              <button
                type="button"
                onClick={onOpen}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-canna-500 hover:bg-canna-400 text-ink-900 transition-colors"
              >
                Abrir sala
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
