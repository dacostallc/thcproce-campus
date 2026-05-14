"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { Loader2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/react";

type Props = {
  courseId: string;
  lessonId: string;
  lessonTitle?: string;
  className?: string;
  /**
   * Chamado assim que o player de áudio está pronto.
   * Recebe a função `seekTo(seconds)` que o pai pode armazenar e chamar
   * quando o utilizador clicar num parágrafo com timestamp.
   */
  onSeekReady?: (seekTo: (seconds: number) => void) => void;
};

type PlayerState = "loading" | "ready" | "generate";

const getAudioUrl = (courseId: string, lessonId: string) =>
  `/api/audio/${courseId}/${lessonId}.mp3`;

/**
 * Player de narração — resolve a URL do áudio em três etapas sequenciais:
 *
 *  1. HEAD probe na URL determinística /api/audio/<courseId>/<lessonId>.mp3
 *     → instantâneo, sem DB, sem ElevenLabs.
 *  2. Fallback: query ao DB via tRPC (URLs externas como Supabase/CDN).
 *  3. Nada encontrado → estado "generate" (botão ElevenLabs aparece SÓ aqui).
 */
export function LessonAudioPlayer({ courseId, lessonId, className, onSeekReady }: Props) {
  const utils = trpc.useUtils();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>("loading");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // ── Resolução sequencial da URL ────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    async function resolveAudio() {
      if (!courseId || !lessonId) return;
      setPlayerState("loading");

      // 1. HEAD probe — verifica o arquivo local sem baixá-lo
      const targetUrl = getAudioUrl(courseId, lessonId);
      try {
        const res = await fetch(targetUrl, { method: "HEAD" });
        if (!isMounted) return;
        if (res.ok) {
          setAudioUrl(targetUrl);
          setPlayerState("ready");
          return;
        }
      } catch {
        // arquivo não existe localmente, continua para o fallback
      }

      if (!isMounted) return;

      // 2. Fallback DB — busca URL externa (Supabase/CDN) via tRPC imperativo
      try {
        const data = await utils.campus.lessonAudioUrl.fetch(
          { courseId, lessonId },
          { staleTime: 0 },
        );
        if (!isMounted) return;
        if (data?.url) {
          setAudioUrl(data.url);
          setPlayerState("ready");
          return;
        }
      } catch {
        // DB inacessível — cai para geração
      }

      if (!isMounted) return;

      // 3. Nada encontrado → exibe botão de geração
      setPlayerState("generate");
    }

    void resolveAudio();
    return () => { isMounted = false; };
  }, [courseId, lessonId, utils.campus.lessonAudioUrl]);

  // Expõe seekTo ao pai quando o player está pronto
  const seekTo = useCallback((seconds: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = seconds;
    void el.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (playerState === "ready" && onSeekReady) {
      onSeekReady(seekTo);
    }
  }, [playerState, onSeekReady, seekTo]);

  // ── Geração via ElevenLabs ─────────────────────────────────────────────────
  async function handleGenerate() {
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/tts/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId }),
      });
      const json = await res.json() as { audioUrl?: string; error?: string };
      if (!res.ok || !json.audioUrl) {
        throw new Error(json.error ?? `Erro ${res.status}`);
      }
      setAudioUrl(json.audioUrl);
      setPlayerState("ready");
      void utils.campus.lessonAudioUrl.invalidate({ courseId, lessonId });
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : "Falha ao gerar narração.");
    } finally {
      setGenerating(false);
    }
  }

  // ── Renderização ───────────────────────────────────────────────────────────

  if (playerState === "loading") {
    return (
      <div className={cn("flex items-center gap-2 text-[11px] text-white/30", className)}>
        <Loader2 className="size-3.5 animate-spin" />
        <span>Verificando narração…</span>
      </div>
    );
  }

  if (playerState === "ready" && audioUrl) {
    return (
      <div
        className={cn("my-1 rounded-xl border border-lime-500/30 bg-slate-900 p-4", className)}
        role="region"
        aria-label="Narração do Prof. Sergio"
      >
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-lime-500">
          Ouça a explicação do Prof. Sergio
        </p>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          ref={audioRef}
          key={audioUrl}
          controls
          src={audioUrl}
          preload="metadata"
          className="h-10 w-full accent-lime-500"
          aria-label="Narração da aula"
          onError={() => setPlayerState("generate")}
        />
      </div>
    );
  }

  // playerState === "generate" — SÓ aqui o ElevenLabs pode ser acionado
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        disabled={generating}
        onClick={() => void handleGenerate()}
        className={cn(
          "group flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all",
          generating
            ? "cursor-not-allowed border-white/8 bg-white/[0.04] text-white/30"
            : "border-[#4a7060]/35 bg-[#0a110d]/80 text-[#6ab896]/85 hover:border-[#4a7060]/65 hover:bg-[#0c160f] hover:text-[#8dd4b4]",
        )}
        aria-label="Gerar narração em áudio com a voz do Professor Sergio"
      >
        {generating ? (
          <Loader2 className="size-3.5 shrink-0 animate-spin" />
        ) : (
          <Mic className="size-3.5 shrink-0" aria-hidden />
        )}
        {generating ? "Gerando narração…" : "Gerar narração · Prof. Sergio"}
      </button>
      {generateError && (
        <span className="text-[10px] text-rose-400/80">{generateError}</span>
      )}
    </div>
  );
}
