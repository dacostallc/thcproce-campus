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
        "relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-white/12 px-4 py-8 text-center shadow-inner shadow-black/20",
        "bg-[linear-gradient(155deg,rgba(15,23,42,0.94)_0%,rgba(8,14,26,0.9)_42%,rgba(4,8,18,0.96)_100%)]",
        aspectVideo && "aspect-video",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.85]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% -5%, rgba(52,211,153,0.14), transparent 58%), radial-gradient(ellipse 50% 40% at 92% 88%, rgba(250,204,21,0.07), transparent 52%), linear-gradient(118deg, transparent 36%, rgba(255,255,255,0.04) 50%, transparent 64%)"
        }}
      />
      <Radio
        className="relative mb-3 h-9 w-9 text-emerald-300/60 sm:h-10 sm:w-10"
        strokeWidth={1.35}
        aria-hidden
      />
      <p className="relative z-[1] max-w-[17rem] text-[13px] font-semibold leading-snug text-white/90">
        {title}
      </p>
      <p className="relative z-[1] mt-2 max-w-[16rem] text-[11px] leading-relaxed text-white/52">
        {subtitle}
      </p>
    </div>
  );
}
