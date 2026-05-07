"use client";

import { motion } from "framer-motion";

type Props = {
  text: string;
};

/** Balão “Prof THC” — só leitura; posicionado pela camada pai. */
export function CampusAdminBroadcastBubble({ text }: Props) {
  return (
    <motion.div
      layout
      lang="pt-BR"
      role="status"
      initial={{ opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className="pointer-events-none mx-auto box-border w-full max-w-[min(calc(100vw-2rem),20rem)] min-w-0 px-2 font-sans antialiased sm:max-w-[min(calc(100vw-3rem),24rem)]"
    >
      <div
        className="min-w-0 rounded-2xl border-2 border-amber-300/95 bg-gradient-to-br from-amber-950/96 via-amber-950/88 to-black/90 px-3 py-2 shadow-[0_0_28px_rgba(251,191,36,0.5),0_8px_28px_rgba(0,0,0,0.45)] ring-2 ring-amber-200/25 sm:px-3.5 sm:py-2.5"
        style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      >
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-200/95 leading-tight">
          Mensagem do Prof THC
        </p>
        <p className="mt-1.5 whitespace-pre-wrap break-words text-left text-sm font-semibold leading-snug tracking-wide text-amber-50 hyphens-auto [overflow-wrap:anywhere] [-webkit-hyphens:auto] sm:text-[15px]">
          {text}
        </p>
      </div>
      <div
        aria-hidden
        className="mx-auto h-0 w-0 shrink-0 border-x-[11px] border-t-[12px] border-x-transparent border-t-amber-300/92 shadow-[0_2px_6px_rgba(0,0,0,0.35)] max-sm:border-x-[10px] max-sm:border-t-[11px]"
      />
    </motion.div>
  );
}
