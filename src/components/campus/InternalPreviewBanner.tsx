"use client";

import { AlertTriangle } from "lucide-react";

export function InternalPreviewBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none flex justify-center pt-[4.5rem] sm:pt-[5rem] px-3">
      <div
        className="pointer-events-auto max-w-2xl w-full rounded-xl border border-amber-500/50 bg-amber-950/90 backdrop-blur-md px-4 py-2.5 flex items-start gap-2 shadow-lg shadow-black/40"
        role="status"
      >
        <AlertTriangle
          className="shrink-0 text-amber-400 mt-0.5"
          size={18}
          aria-hidden
        />
        <div className="text-xs sm:text-sm leading-snug">
          <span className="font-bold text-amber-200 uppercase tracking-wide text-[10px] sm:text-[11px]">
            Ambiente interno · testes
          </span>
          <p className="text-amber-100/95 mt-0.5">
            Esta URL não é divulgada ao público (noindex). Ajuste posições, textos e layout aqui; o campus público continua em{" "}
            <code className="px-1 py-px rounded bg-black/35 text-canna-200 text-[10px] sm:text-xs">
              /campus
            </code>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
