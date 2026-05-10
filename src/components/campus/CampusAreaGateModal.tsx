"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Construction, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Area } from "@/data/courses";

export type CampusGateKind = "enroll" | "construction";

type Props = {
  open: boolean;
  kind: CampusGateKind | null;
  area: Area | null;
  onClose: () => void;
  sky: "day" | "night";
};

export function CampusAreaGateModal({ open, kind, area, onClose, sky }: Props) {
  const title =
    kind === "construction"
      ? "Área em construção"
      : "Acesso ao pré-lançamento fundador";
  const body =
    kind === "construction" ? (
      <>
        <Construction className="mx-auto mb-3 size-12 text-amber-300/90" aria-hidden />
        <p className="text-sm leading-relaxed text-white/85">
          Área em construção — o conteúdo deste curso será liberado progressivamente durante o
          pré-lançamento.
        </p>
      </>
    ) : (
      <>
        <Lock className="mx-auto mb-3 size-11 text-canna-300" aria-hidden />
        <p className="text-sm leading-relaxed text-white/85">
          Esta área faz parte do pré-lançamento fundador. Inscreva-se para liberar o acesso às salas de
          aula e ao progresso no campus.
        </p>
      </>
    );

  return (
    <AnimatePresence>
      {open && kind && area ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-[55] backdrop-blur-sm",
              sky === "day" ? "bg-sky-950/35" : "bg-black/55"
            )}
            aria-label="Fechar"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="gate-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed left-1/2 top-[45%] z-[56] w-[min(96%,440px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl campus-hud-glass border-amber-500/28 p-6"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/75">
              {area.mapLabel ?? area.name}
            </p>
            <h2 id="gate-title" className="mt-2 text-xl font-bold text-white">
              {title}
            </h2>
            <div className="mt-4 text-center">{body}</div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="glass" onClick={onClose}>
                Fechar
              </Button>
              {kind === "enroll" ? (
                <Button type="button" className="bg-canna-500 font-bold text-ink-900 hover:bg-canna-400" asChild>
                  <Link href="/inscrever">Inscrever-se</Link>
                </Button>
              ) : null}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
