"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Coins, Gift, Sparkles } from "lucide-react";
import { useMissionRewardToastStore } from "@/stores/missionRewardToastStore";
import { cn } from "@/lib/utils";

const DISMISS_MS = 5200;

export function MissionRewardToast({ className }: { className?: string }) {
  const toast = useMissionRewardToastStore((s) => s.toast);
  const dismiss = useMissionRewardToastStore((s) => s.dismissMissionRewardToast);

  useEffect(() => {
    if (!toast) return;
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
      <AnimatePresence>
        {toast ? (
          <motion.div
            key="mission-reward"
            role="status"
            aria-live="polite"
            initial={{ y: -16, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -18, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto w-full max-w-sm rounded-2xl border border-amber-400/28 bg-gradient-to-br from-amber-500/18 via-emerald-950/38 to-black/50 p-4 shadow-[0_0_42px_rgba(251,191,36,0.12)] backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/35 bg-amber-500/12">
                <CheckCircle2 size={22} className="text-amber-100" />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm font-bold text-white">Missão resgatada</p>
                <p className="text-[11px] font-medium text-white/70">{toast.missionTitle}</p>
                <div className="space-y-1.5 text-[12px] text-white/85">
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
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
