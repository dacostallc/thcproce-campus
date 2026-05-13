"use client";

/**
 * Camada fixa da sala: portal, overlay, viewport da moldura.
 * Não importa conteúdo pedagógico, XP, Moodle nem nomes de cursos.
 */

import { useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getCampusLessonModalRoot,
  mountCampusLessonModalRootToBodyEnd
} from "@/lib/campusLessonModalRoot";

export type LessonExperienceShellProps = {
  open: boolean;
  onClose: () => void;
  /** Ex.: acento do curso (borda/fundo). */
  frameClassName?: string;
  /** Barra superior: progresso da área, títulos, fechar. */
  chromeHeader: ReactNode;
  /** Corpo da sala (scroll + grelha interna). */
  body: ReactNode;
};

export function LessonExperienceShell({
  open,
  onClose,
  frameClassName,
  chromeHeader,
  body
}: LessonExperienceShellProps) {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setHost(getCampusLessonModalRoot());
  }, []);

  useLayoutEffect(() => {
    if (open) mountCampusLessonModalRootToBodyEnd();
  }, [open]);

  const tree = (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1] pointer-events-auto bg-black/70"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="lesson-panel-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed left-1/2 top-1/2 z-[2] flex h-[min(88vh,calc(100dvh-1.25rem))] max-h-[min(88vh,calc(100dvh-1.25rem))] w-[92vw] max-w-[min(92vw,1400px)] min-h-0 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-[#5c4a22]/45 pointer-events-auto shadow-[0_32px_120px_rgba(0,0,0,0.82),0_0_0_1px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[8px] !bg-[#050505]/96",
              frameClassName
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {chromeHeader}
            {body}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );

  if (!host) return null;

  return createPortal(tree, host);
}
