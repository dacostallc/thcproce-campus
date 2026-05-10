"use client";

import { useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion
} from "framer-motion";
import { CheckCircle2, Coins, Sparkles, TrendingUp, X } from "lucide-react";
import { useRewardToastStore } from "@/stores/rewardToastStore";
import { playCampusRewardToastChime } from "@/lib/campusUiSounds";
import { cn } from "@/lib/utils";

const DISMISS_MS = 5600;

export function StudentRewardToast({ className }: { className?: string }) {
  const toast = useRewardToastStore((s) => s.toast);
  const dismiss = useRewardToastStore((s) => s.dismissRewardToast);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!toast) return;
    playCampusRewardToastChime();
    const t = window.setTimeout(() => dismiss(), DISMISS_MS);
    return () => window.clearTimeout(t);
  }, [toast, dismiss]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed left-0 right-0 z-[70] flex justify-center px-4 pt-20",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {toast ? (
          <motion.div
            key="reward"
            role="status"
            aria-live="polite"
            layout
            initial={{ y: -18, opacity: 0, scale: 0.94, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ y: -14, opacity: 0, scale: 0.96, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 34,
              mass: 0.85
            }}
            className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-canna-400/24 bg-gradient-to-br from-canna-500/18 via-emerald-950/38 to-black/52 p-4 shadow-[0_12px_52px_rgba(52,211,153,0.14)] backdrop-blur-md"
          >
            {!reduceMotion ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
                initial={{ x: "-55%", skewX: -12 }}
                animate={{ x: "155%", skewX: -12 }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  repeatDelay: 2.2,
                  ease: "easeInOut"
                }}
              />
            ) : null}

            <button
              type="button"
              onClick={() => dismiss()}
              className="pointer-events-auto absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-black/35 text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canna-400/65"
              aria-label="Fechar notificação"
            >
              <X size={15} strokeWidth={2.4} />
            </button>

            <motion.div
              className="relative flex items-start gap-3 pr-8"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: reduceMotion ? 0 : 0.06, delayChildren: 0.04 }
                }
              }}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.85 },
                  show: { opacity: 1, scale: 1 }
                }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-canna-300/38 bg-canna-500/14 shadow-[0_0_22px_rgba(74,222,128,0.12)]"
              >
                <CheckCircle2 size={22} className="text-canna-100" />
              </motion.div>
              <div className="min-w-0 flex-1 space-y-2">
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 6 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="text-sm font-bold tracking-tight text-white"
                >
                  Progresso registado
                </motion.p>
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1 }
                  }}
                  className="space-y-1.5 text-[12px] leading-snug text-white/85"
                >
                  <p className="flex items-center gap-2">
                    <Coins size={14} className="shrink-0 text-sky-200/95" aria-hidden />+
                    <span className="font-bold tabular-nums text-sky-100">{toast.credits}</span>
                    créditos recebidos
                  </p>
                  <p className="flex items-center gap-2">
                    <Sparkles size={14} className="shrink-0 text-amber-200/95" aria-hidden />+
                    <span className="font-bold tabular-nums text-amber-100">{toast.xp}</span> XP
                  </p>
                  <p className="flex items-center gap-2">
                    <TrendingUp size={14} className="shrink-0 text-emerald-200/95" aria-hidden />
                    Progresso do curso atualizado (~{toast.progressPercent}%)
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
