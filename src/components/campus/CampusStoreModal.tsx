"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CampusStoreShell } from "@/components/campus/CampusStoreShell";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CampusStoreModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[54] bg-black/50 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 42, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 38, opacity: 0 }}
            className="pointer-events-auto fixed inset-x-2 sm:inset-x-3 bottom-[max(env(safe-area-inset-bottom),10px)] top-[calc(3.2rem+env(safe-area-inset-top))] z-[58] mx-auto flex max-h-[min(92dvh,calc(100dvh-7.75rem-env(safe-area-inset-bottom)))] max-w-lg flex-col overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(155deg,rgba(255,255,255,0.06)_0%,rgba(6,26,14,0.2)_42%,rgba(8,22,14,0.14)_100%)] p-px shadow-[0_0_54px_rgba(52,211,153,0.1)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-[5.25rem] sm:w-[min(calc(100vw-2rem),32rem)] sm:-translate-x-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex max-h-[inherit] min-h-0 flex-1 flex-col overflow-hidden rounded-[0.9rem] campus-hud-glass">
              <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-white/10 p-4 sm:p-5">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold tracking-tight text-white max-sm:text-base">Loja do Campus</h2>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/52 max-sm:text-xs">
                    Compra com os teus créditos do campus; as alterações ficam guardadas apenas neste dispositivo.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="glass" size="sm" className="text-xs" asChild>
                    <Link href="/campus/loja" onClick={onClose}>
                      Página
                    </Link>
                  </Button>
                  <Button type="button" variant="glass" size="sm" className="text-xs" onClick={onClose}>
                    Fechar
                  </Button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-4 text-sm sm:p-5">
                <CampusStoreShell density="modal" />
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
