"use client";

import { useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion
} from "framer-motion";
import { CheckCircle2, Coins, Gift, Sparkles, X } from "lucide-react";
import { useMissionRewardToastStore } from "@/stores/missionRewardToastStore";
import { playCampusMissionCompleteChime } from "@/lib/campusUiSounds";
import { cn } from "@/lib/utils";

const DISMISS_MS = 5600;

export function MissionRewardToast({ className }: { className?: string }) {
  const toast = useMissionRewardToastStore((s) => s.toast);
  const dismiss = useMissionRewardToastStore((s) => s.dismissMissionRewardToast);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!toast) return;
    playCampusMissionCompleteChime();
    const t = window.setTimeout(() => dismiss(), DISMISS_MS);
    return () => window.clearTimeout(t);
  }, [toast, dismiss]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed left-0 right-0 z-[72] flex justify-center px-4 pt-[4.25rem]",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {toast ? (
          <motion.div
            key="mission-reward"
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
            className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-amber-400/26 bg-gradient-to-br from-amber-500/16 via-emerald-950/36 to-black/52 p-4 shadow-[0_12px_48px_rgba(251,191,36,0.14)] backdrop-blur-md"
          >
            {!reduceMotion ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
                initial={{ x: "-55%", skewX: -14 }}
                animate={{ x: "155%", skewX: -14 }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  repeatDelay: 2.4,
                  ease: "easeInOut"
                }}
              />
            ) : null}

            <button
              type="button"
              onClick={() => dismiss()}
              className="pointer-events-auto absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-black/35 text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
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
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/38 bg-amber-500/14 shadow-[0_0_20px_rgba(251,191,36,0.12)]"
              >
                <CheckCircle2 size={22} className="text-amber-100" />
              </motion.div>
              <div className="min-w-0 flex-1 space-y-2">
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 6 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="text-sm font-bold tracking-tight text-white"
                >
                  Missão resgatada
                </motion.p>
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 6 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="text-[11px] font-medium leading-snug text-white/72"
                >
                  {toast.missionTitle}
                </motion.p>
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1 }
                  }}
                  className="space-y-1.5 text-[12px] text-white/85"
                >
                  {toast.credits > 0 ? (
                    <p className="flex items-center gap-2">
                      <Coins size={14} className="shrink-0 text-sky-200/95" aria-hidden />+
                      <span className="font-bold tabular-nums text-sky-100">{toast.credits}</span>
                      créditos
                    </p>
                  ) : null}
                  {toast.xp > 0 ? (
                    <p className="flex items-center gap-2">
                      <Sparkles size={14} className="shrink-0 text-amber-200/95" aria-hidden />+
                      <span className="font-bold tabular-nums text-amber-100">{toast.xp}</span> XP
                    </p>
                  ) : null}
                  {toast.itemLabel ? (
                    <p className="flex items-center gap-2">
                      <Gift size={14} className="shrink-0 text-canna-200/95" aria-hidden />
                      <span className="text-white/90">{toast.itemLabel}</span>
                    </p>
                  ) : null}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
