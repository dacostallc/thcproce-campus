"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { isCampusAutoOnboardingUxEnabled } from "@/config/campusMapStability";
import { CAMPUS_WELCOME_MODAL_SEEN_LS_KEY } from "@/lib/campusOnboardingLs";

type Props = {
  /** Mapa explorável avançado (sem tour bem-vindo estável aqui). */
  advancedMap: boolean;
  onStartTour: () => void;
};

function readLs(key: string): boolean {
  try {
    return typeof localStorage !== "undefined" && localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeLs(key: string): void {
  try {
    localStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
}

export function CampusWelcomeModal({ advancedMap, onStartTour }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isCampusAutoOnboardingUxEnabled()) {
      setOpen(false);
      return;
    }
    if (advancedMap || typeof window === "undefined") {
      setOpen(false);
      return;
    }
    setOpen(!readLs(CAMPUS_WELCOME_MODAL_SEEN_LS_KEY));
  }, [advancedMap]);

  const dismiss = () => {
    writeLs(CAMPUS_WELCOME_MODAL_SEEN_LS_KEY);
    setOpen(false);
  };

  /** Começar tour: fecha o modal sem marcar welcome resolvido (abandono permite ver de novo no próximo acesso). */
  const start = () => {
    setOpen(false);
    onStartTour();
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[72] bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={dismiss}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="campus-welcome-title"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={cn(
              "pointer-events-auto fixed z-[73] mx-auto max-h-[min(88dvh,520px)] w-[min(calc(100vw-2rem),22rem)] overflow-y-auto rounded-2xl border border-white/12",
              "left-4 right-4 top-[calc(0.75rem+env(safe-area-inset-top))] sm:left-1/2 sm:right-auto sm:top-[18%] sm:-translate-x-1/2 sm:translate-y-0"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="campus-hud-glass p-4 text-sm text-white/85 shadow-[0_20px_50px_rgba(0,0,0,0.45)] sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-canna-400/35 bg-canna-500/15">
                  <Compass size={22} className="text-canna-200" aria-hidden />
                </span>
                <div className="min-w-0">
                  <button
                    type="button"
                    className="float-right ml-2 rounded-lg px-2 py-1 text-[11px] font-medium text-white/50 transition hover:bg-white/10 hover:text-white"
                    onClick={dismiss}
                  >
                    Fechar
                  </button>
                  <h2 id="campus-welcome-title" className="pr-14 text-lg font-bold leading-tight text-white">
                    Bem-vindo ao Campus THCProce
                  </h2>
                  <ul className="mt-4 list-none space-y-3 text-[13px] leading-snug text-white/82">
                    <li className="flex gap-2">
                      <span className="mt-0.5 font-bold text-canna-300">1.</span>
                      <span>Escolha seu curso</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 font-bold text-canna-300">2.</span>
                      <span>Complete aulas e missões</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 font-bold text-canna-300">3.</span>
                      <span>Ganhe créditos, souvenirs e certificados</span>
                    </li>
                  </ul>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse sm:flex-wrap sm:justify-end">
                    <button
                      type="button"
                      className="rounded-xl bg-gradient-to-br from-canna-500/35 to-emerald-600/28 py-3 text-center text-sm font-bold text-white ring-2 ring-canna-400/40 transition hover:from-canna-500/42 hover:to-emerald-600/35 sm:min-w-[9.5rem] sm:py-2.5"
                      onClick={start}
                    >
                      Começar tour
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-white/16 bg-white/[0.04] py-3 text-center text-sm font-semibold text-white/75 transition hover:bg-white/[0.07] sm:min-w-[6.5rem] sm:py-2.5"
                      onClick={dismiss}
                    >
                      Pular
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
