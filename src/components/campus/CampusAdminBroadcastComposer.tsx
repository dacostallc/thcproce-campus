"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Megaphone, Send, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { useCampusStore } from "@/stores/campusStore";
import { CAMPUS_ADMIN_BROADCAST_MAX_LEN } from "@/lib/campusAdminBroadcast";

type Props = {
  isCampusAdmin: boolean;
};

export function CampusAdminBroadcastComposer({ isCampusAdmin }: Props) {
  const open = useCampusHudStore((s) => s.adminBroadcastComposerOpen);
  const setOpen = useCampusHudStore((s) => s.setAdminBroadcastComposerOpen);
  const fireAdminBroadcast = useCampusStore((s) => s.fireAdminBroadcast);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isCampusAdmin && open) setOpen(false);
  }, [isCampusAdmin, open, setOpen]);

  useEffect(() => {
    if (open && inputRef.current) {
      const el = inputRef.current;
      queueMicrotask(() => {
        el.focus();
        el.select();
      });
    }
  }, [open]);

  if (!isCampusAdmin) return null;

  function submit() {
    const v = inputRef.current?.value.trim();
    if (!v) {
      setOpen(false);
      return;
    }
    fireAdminBroadcast(v);
    if (inputRef.current) inputRef.current.value = "";
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[46] bg-black/25 backdrop-blur-[1px] pointer-events-auto"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Mensagem do Prof THC — aviso em destaque no campus"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="fixed bottom-6 left-1/2 z-[48] w-[min(94vw,440px)] -translate-x-1/2 rounded-2xl campus-hud-glass border-amber-400/35 p-3 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-100">
                <Megaphone size={18} className="text-amber-300" aria-hidden />
                <div>
                  <p className="text-sm font-bold leading-tight">Mensagem em destaque</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/60">
                    Balão dourado por 5s sobre o teu avatar • acima do Cine THC •{" "}
                    <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 font-mono text-[10px]">
                      Ctrl
                    </kbd>{" "}
                    +{" "}
                    <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 font-mono text-[10px]">
                      Shift
                    </kbd>{" "}
                    +{" "}
                    <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 font-mono text-[10px]">
                      B
                    </kbd>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                maxLength={CAMPUS_ADMIN_BROADCAST_MAX_LEN}
                placeholder='Ex.: "Intervalo 5 min"'
                className="min-w-0 flex-1 rounded-xl border border-amber-400/28 bg-[rgba(6,18,12,0.28)] px-3 py-2 text-sm text-amber-50 outline-none ring-0 placeholder:text-white/35 focus:border-amber-300/55 backdrop-blur-[12px]"
                aria-label="Texto do aviso"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpen(false);
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submit();
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                className="shrink-0 border border-amber-400/40 bg-amber-600/90 text-black hover:bg-amber-500"
                onClick={submit}
              >
                <Send size={16} />
              </Button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
