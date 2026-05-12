"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createBrowserLessonTextReader,
  isBrowserSpeechSynthesisSupported,
  type LessonReaderPlaybackState,
} from "@/lib/lessonTextReader";

type Props = {
  /** Texto do passo atual (já normalizado no serviço quando aplicável). */
  text: string;
  /** Identificador estável do passo: mudança cancela a leitura. */
  stepKey: string;
  className?: string;
};

export function LessonTextReaderControls({ text, stepKey, className }: Props) {
  const [playback, setPlayback] = useState<LessonReaderPlaybackState>("stopped");

  const reader = useMemo(
    () => createBrowserLessonTextReader({ onStateChange: setPlayback }),
    [],
  );

  useEffect(() => () => reader.dispose(), [reader]);

  useEffect(() => {
    reader.stop();
  }, [stepKey, reader]);

  const supported = isBrowserSpeechSynthesisSupported() && reader.isSupported;
  const hasText = text.trim().length > 0;

  return (
    <div
      role="group"
      aria-label="Leitor de texto da aula"
      className={cn(
        "flex flex-wrap items-center justify-center gap-1.5 rounded-xl border px-2 py-1.5 sm:justify-start",
        playback === "reading" && "border-emerald-500/35 bg-emerald-500/[0.07]",
        playback === "paused" && "border-amber-500/35 bg-amber-500/[0.07]",
        playback === "stopped" && "border-white/12 bg-[#0f1714]",
        className,
      )}
    >
      <span className="sr-only">
        {playback === "reading"
          ? "Estado: a ler em voz alta"
          : playback === "paused"
            ? "Estado: leitura em pausa"
            : "Estado: parado"}
      </span>
      {!supported ? (
        <p className="px-1 text-[10px] text-white/50">Leitor de voz indisponível neste navegador.</p>
      ) : !hasText ? (
        <p className="px-1 text-[10px] text-white/50">Sem texto para ler neste passo.</p>
      ) : (
        <>
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={!supported || !hasText}
            onClick={() => reader.speak(text)}
            className="h-8 border border-white/12 bg-[#141d1a] px-2.5 text-[11px] text-white hover:bg-[#1a2622]"
            aria-label="Ouvir texto deste passo"
          >
            <Volume2 className="mr-1 size-3.5" aria-hidden />
            Ouvir
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={playback !== "reading"}
            onClick={() => reader.pause()}
            className="h-8 border border-white/12 bg-[#141d1a] px-2.5 text-[11px] text-white hover:bg-[#1a2622]"
            aria-label="Pausar leitura"
          >
            <Pause className="mr-1 size-3.5" aria-hidden />
            Pausar
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={playback !== "paused"}
            onClick={() => reader.resume()}
            className="h-8 border border-white/12 bg-[#141d1a] px-2.5 text-[11px] text-white hover:bg-[#1a2622]"
            aria-label="Continuar leitura"
          >
            <Play className="mr-1 size-3.5" aria-hidden />
            Continuar
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={playback === "stopped"}
            onClick={() => reader.stop()}
            className="h-8 border border-white/12 bg-[#141d1a] px-2.5 text-[11px] text-white hover:bg-[#1a2622]"
            aria-label="Parar leitura"
          >
            <Square className="mr-1 size-3.5" aria-hidden />
            Parar
          </Button>
        </>
      )}
    </div>
  );
}
