"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Coins, Sparkles, TrendingUp } from "lucide-react";
import { useRewardToastStore } from "@/stores/rewardToastStore";
import { cn } from "@/lib/utils";

const DISMISS_MS = 5200;

export function StudentRewardToast({ className }: { className?: string }) {
  const toast = useRewardToastStore((s) => s.toast);
  const dismiss = useRewardToastStore((s) => s.dismissRewardToast);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => dismiss(), DISMISS_MS);
    return () => window.clearTimeout(t);
  }, [toast, dismiss]);

  return (
    <div className={cn("pointer-events-none fixed left-0 right-0 z-[70] flex justify-center px-4 pt-20", className)}>
      <AnimatePresence>
        {toast ? (
          <motion.div
            key="reward"
            role="status"
            aria-live="polite"
            initial={{ y: -16, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -18, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto w-full max-w-sm rounded-2xl border border-canna-400/25 bg-gradient-to-br from-canna-500/20 via-emerald-950/40 to-black/50 p-4 shadow-[0_0_48px_rgba(52,211,153,0.15)] backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-canna-300/35 bg-canna-500/15">
                <CheckCircle2 size={22} className="text-canna-100" />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm font-bold text-white">Progresso registado</p>
                <div className="space-y-1.5 text-[12px] text-white/85">
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
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
