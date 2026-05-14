"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Loader2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/react";

type Props = {
  courseId: string;
  lessonId: string;
  lessonTitle?: string;
  className?: string;
};

const SPEEDS = [1, 1.5, 2] as const;
type Speed = (typeof SPEEDS)[number];

function formatTime(secs: number): string {
  if (!Number.isFinite(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Player de narração ElevenLabs — faz query ao DB imediatamente ao montar.
 *
 * Estados:
 *  ① Carregando URL do DB   → botão desabilitado com spinner
 *  ② URL disponível         → botão "Ouvir aula" → expande para player completo
 *  ③ Sem URL (não gerado)   → botão "Gerar narração" → chama /api/tts/generate-lesson
 *  ④ Gerando                → spinner "Gerando narração…"
 *  ⑤ Erro de geração        → mensagem + botão tentar novamente
 */
export function LessonAudioPlayer({ courseId, lessonId, lessonTitle, className }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playerOpen, setPlayerOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState<Speed>(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);

  // URL local do áudio — pode vir do DB ou ser gerada inline
  const [localUrl, setLocalUrl] = useState<string | null>(null);

  // Estado de geração inline
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Query imediata ao DB (staleTime 86400000ms = 24h — URL não muda após gerada)
  const utils = trpc.useUtils();
  const { data: audioData, isLoading: dbLoading } = trpc.campus.lessonAudioUrl.useQuery(
    { courseId, lessonId },
    { staleTime: 86400000, retry: false },
  );

  // Quando a query do DB retornar URL, popula localUrl
  useEffect(() => {
    if (audioData?.url && !localUrl) {
      setLocalUrl(audioData.url);
    }
  }, [audioData?.url, localUrl]);

  // Configura o elemento de áudio quando a URL muda
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !localUrl) return;
    if (audio.src !== localUrl) {
      audio.src = localUrl;
      audio.load();
      setAudioLoaded(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [localUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !localUrl) return;
    if (playing) audio.pause();
    else void audio.play().catch(() => setPlaying(false));
  }, [playing, localUrl]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) * duration;
  }, [duration]);

  // Gera narração chamando a API → salva no DB → atualiza URL local
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
      setLocalUrl(json.audioUrl);
      setPlayerOpen(true);
      // Invalida o cache do tRPC para que a próxima sessão use o DB
      void utils.campus.lessonAudioUrl.invalidate({ courseId, lessonId });
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : "Falha ao gerar narração.");
    } finally {
      setGenerating(false);
    }
  }

  // ── Renderização ──────────────────────────────────────────────────────────

  const hasAudio = Boolean(localUrl);
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ① Carregando — query do DB em andamento
  if (dbLoading && !localUrl) {
    return (
      <div className={cn("flex items-center gap-2 text-[11px] text-white/30", className)}>
        <Loader2 className="size-3.5 animate-spin" />
        <span>Verificando narração…</span>
      </div>
    );
  }

  // ② URL disponível → player nativo com identidade THCProce (sempre visível)
  if (hasAudio && localUrl) {
    return (
      <div
        className={cn(
          "my-1 rounded-xl border border-lime-500/30 bg-slate-900 p-4",
          className,
        )}
        role="region"
        aria-label="Narração do Prof. Sergio"
      >
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-lime-500">
          Ouça a explicação do Prof. Sergio
        </p>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          controls
          src={localUrl}
          preload="metadata"
          className="h-10 w-full accent-lime-500"
          aria-label="Narração da aula"
        />
      </div>
    );
  }

  // ③ Sem URL → botão "Gerar narração"
  if (!playerOpen) {
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

  // ④ Estado: gerando (URL chegou via handleGenerate → dispara o player nativo acima)
  // Fallback: nunca deve chegar aqui, mas mantém como guarda
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[11px] text-white/30",
        className,
      )}
      role="status"
      aria-label="Player de narração da aula"
    >
      <Loader2 className="size-3.5 animate-spin" />
      <span>Carregando…</span>
    </div>
  );
}
