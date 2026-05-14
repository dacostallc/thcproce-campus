"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/react";

type Props = {
  courseId: string;
  lessonId: string;
  lessonTitle?: string;
  className?: string;
};

/**
 * Player de narração ElevenLabs.
 *
 * Estratégia de resolução da URL (em ordem de prioridade):
 *  1. HEAD probe na URL local determinística /api/audio/<courseId>/<lessonId>.mp3
 *     → Se o arquivo existir em disco, usa imediatamente (sem depender do DB).
 *  2. Query ao DB via tRPC (fallback para URLs externas como Supabase/CDN).
 *  3. Se nenhuma URL encontrada → botão "Gerar narração" (chama ElevenLabs).
 *
 * Isso garante que após a primeira geração, recarregar a página sempre exibe
 * o player sem disparar nova requisição ao ElevenLabs.
 */
export function LessonAudioPlayer({ courseId, lessonId, className }: Props) {
  const utils = trpc.useUtils();

  // URL resolvida — local (HEAD probe) ou externa (DB)
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);

  // 'probing' → fazendo HEAD | 'done' → probe concluído
  const [probeState, setProbeState] = useState<"probing" | "done">("probing");

  // Estado de geração
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const predictableUrl = `/api/audio/${courseId}/${lessonId}.mp3`;

  // ── 1. HEAD probe na URL local ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(predictableUrl, { method: "HEAD" });
        if (!cancelled && res.ok) {
          setResolvedUrl(predictableUrl);
        }
      } catch {
        // arquivo não existe localmente — cai no fallback DB
      } finally {
        if (!cancelled) setProbeState("done");
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictableUrl]);

  // ── 2. Fallback: query ao DB (apenas se probe não encontrou arquivo local) ──
  const skipDbQuery = resolvedUrl !== null;
  const { data: audioData, isLoading: dbLoading } = trpc.campus.lessonAudioUrl.useQuery(
    { courseId, lessonId },
    {
      enabled: probeState === "done" && !skipDbQuery,
      staleTime: 0,   // sempre busca fresco — o probe é quem faz cache natural
      retry: false,
    },
  );

  useEffect(() => {
    if (audioData?.url && !resolvedUrl) {
      setResolvedUrl(audioData.url);
    }
  }, [audioData?.url, resolvedUrl]);

  // ── 3. Geração via ElevenLabs ──────────────────────────────────────────────
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
      setResolvedUrl(json.audioUrl);
      void utils.campus.lessonAudioUrl.invalidate({ courseId, lessonId });
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : "Falha ao gerar narração.");
    } finally {
      setGenerating(false);
    }
  }

  // ── Renderização ───────────────────────────────────────────────────────────

  // ① Aguardando probe + DB
  const isResolving = probeState === "probing" || (probeState === "done" && !skipDbQuery && dbLoading);
  if (isResolving && !resolvedUrl) {
    return (
      <div className={cn("flex items-center gap-2 text-[11px] text-white/30", className)}>
        <Loader2 className="size-3.5 animate-spin" />
        <span>Verificando narração…</span>
      </div>
    );
  }

  // ② URL resolvida → player nativo
  if (resolvedUrl) {
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
          key={resolvedUrl}
          controls
          src={resolvedUrl}
          preload="metadata"
          className="h-10 w-full accent-lime-500"
          aria-label="Narração da aula"
          onError={() => {
            // Arquivo sumiu do disco ou URL expirou → volta para geração
            setResolvedUrl(null);
          }}
        />
      </div>
    );
  }

  // ③ Sem URL → botão "Gerar narração"
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
