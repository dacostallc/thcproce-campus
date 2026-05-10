"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** URL absoluta (CDN) ou path público válido. */
  src: string;
  className?: string;
};

/**
 * Pré-visualização no cartão HUD «Cinema e ao vivo» — sem autoplay; carrega sob intersecção.
 */
export function CampusCinemaHudPreview({ src, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setShouldLoad(true);
      },
      { threshold: 0.12, rootMargin: "32px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (broken) {
    return (
      <div
        className={cn(
          "flex aspect-video flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-slate-900/90 to-black/80 px-4 text-center text-[11px] leading-snug text-white/58",
          className
        )}
        role="status"
      >
        <p>Não foi possível carregar o vídeo.</p>
        <p className="max-w-[14rem] text-[10px] text-white/38">
          Confirma o ficheiro na Bunny Storage e o hostname da Pull Zone em{" "}
          <code className="rounded bg-white/10 px-1 font-mono text-[9px]">NEXT_PUBLIC_CAMPUS_CDN_BASE_URL</code>.
        </p>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={cn("relative aspect-video overflow-hidden rounded-xl bg-black", className)}>
      {shouldLoad ? (
        <video
          key={src}
          src={src}
          className="h-full w-full object-cover"
          controls
          playsInline
          preload="metadata"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="flex h-full min-h-[120px] items-center justify-center bg-gradient-to-br from-slate-900/90 to-black/80">
          <span className="text-[11px] text-white/42">Pré-visualização — carrega ao deslocares até aqui</span>
        </div>
      )}
    </div>
  );
}
