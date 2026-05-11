"use client";

import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Quando falso (ex.: área alta no Cine), não força proporção 16:9. */
  aspectVideo?: boolean;
  title?: string;
  subtitle?: string;
};

/**
 * Estado premium quando não há stream / vídeo configurado — sem nomes de env ou mensagens técnicas.
 */
export function CampusLiveStreamOfflinePoster({
  className,
  aspectVideo = true,
  title = "Transmissão do campus offline no momento",
  subtitle = "Próxima live em breve — fica atento à programação do dia."
}: Props) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-white/18 px-4 py-8 text-center backdrop-blur-[2px]",
        "bg-transparent shadow-none",
        aspectVideo && "aspect-video",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% -5%, rgba(52,211,153,0.12), transparent 58%)"
        }}
      />
      <Radio
        className="relative mb-3 h-9 w-9 text-emerald-300/75 sm:h-10 sm:w-10 drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]"
        strokeWidth={1.35}
        aria-hidden
      />
      <p className="relative z-[1] max-w-[17rem] text-[13px] font-semibold leading-snug text-white/92 drop-shadow-[0_1px_10px_rgba(0,0,0,0.65)]">
        {title}
      </p>
      <p className="relative z-[1] mt-2 max-w-[16rem] text-[11px] leading-relaxed text-white/65 drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
        {subtitle}
      </p>
    </div>
  );
}
