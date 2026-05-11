"use client";

import { useEffect, useRef, useState } from "react";
import { CampusLiveStreamOfflinePoster } from "@/components/campus/CampusLiveStreamOfflinePoster";
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
      <CampusLiveStreamOfflinePoster
        className={className}
        title="Não foi possível reproduzir esta pré-visualização"
        subtitle="Transmissão do campus offline no momento. Volta mais tarde ou consulta a programação."
      />
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
        <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-950/88 to-black/85 px-3">
          <span className="text-[11px] font-medium text-white/55">A preparar pré-visualização…</span>
          <span className="text-center text-[10px] text-white/38">Interage com o painel para carregar o vídeo</span>
        </div>
      )}
    </div>
  );
}
