"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";

type Props = { videoId: string; courseSlug?: string | null };

/**
 * Bunny Stream: modo público (só NEXT_PUBLIC_*), ou modo assinado (BUNNY_STREAM_TOKEN_AUTH_KEY
 * no servidor) — só alunos logados recebem iframe com token via tRPC.
 */
export function BunnyLessonPlayer({ videoId, courseSlug }: Props) {
  const { status } = useSession();
  const lib =
    typeof process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID === "string"
      ? process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID.trim()
      : "";

  const { data: flags } = trpc.campus.streamFlags.useQuery(undefined, {
    staleTime: 60_000
  });

  const signedNeeded = Boolean(flags?.bunnySigningEnabled);

  const signedQuery = trpc.campus.bunnyEmbedUrl.useQuery(
    { videoId },
    {
      enabled: signedNeeded && status === "authenticated" && videoId.length >= 4,
      retry: 1,
      staleTime: 600_000
    }
  );

  const unsignedSrc =
    !signedNeeded && lib && videoId
      ? `https://iframe.mediadelivery.net/embed/${lib}/${videoId}?autoplay=false&preload=true`
      : "";

  let iframeSrc: string | null = null;
  if (signedNeeded) {
    if (signedQuery.data?.url) iframeSrc = signedQuery.data.url;
  } else {
    iframeSrc = unsignedSrc || null;
  }

  if (signedNeeded && status !== "authenticated") {
    return (
      <div className="min-h-screen bg-ink-900 text-white flex flex-col">
        <header className="px-6 py-4 border-b border-white/10 glass-strong flex justify-between gap-4">
          <Link href={CAMPUS_HOME_PATH} className="text-sm font-semibold text-canna-300">
            ← Voltar ao campus
          </Link>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6 max-w-md mx-auto">
          <p className="text-white/85 text-lg">
            Este vídeo usa <strong className="text-canna-200">protecção Bunny</strong> —
            entrar para gerar iframe assinado.
          </p>
          <Button asChild>
            <Link href={`/entrar?callbackUrl=${encodeURIComponent(`/aula/${encodeURIComponent(videoId)}?provider=bunny`)}`}>
              Ir para entrada
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (signedNeeded && status === "authenticated" && signedQuery.isLoading) {
    return (
      <div className="min-h-screen bg-ink-900 text-white flex items-center justify-center gap-3">
        <Loader2 className="animate-spin text-canna-300" />
        <span>Gerando acesso ao vídeo…</span>
      </div>
    );
  }

  if (signedNeeded && status === "authenticated" && !signedQuery.data?.url) {
    return (
      <div className="min-h-screen bg-ink-900 text-white p-8 max-w-xl mx-auto pt-24">
        <p className="text-rose-200 border border-rose-500/40 rounded-xl p-4">
          Bunny assinado indisponível: confira{" "}
          <code className="text-gold-200">BUNNY_STREAM_TOKEN_AUTH_KEY</code>,{" "}
          <code className="text-gold-200">BUNNY_STREAM_LIBRARY_ID</code> ou{" "}
          <code className="text-gold-200">NEXT_PUBLIC_BUNNY_LIBRARY_ID</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-900 text-white flex flex-col">
      <header className="px-6 py-4 border-b border-white/10 glass-strong flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-canna-300 font-semibold">
            THCProce · Bunny Stream
          </p>
          <p className="text-sm text-white/70">{courseSlug ? `Curso: ${courseSlug}` : "Demonstração"}</p>
        </div>
        <Link
          href={CAMPUS_HOME_PATH}
          className="text-sm font-semibold text-canna-300 hover:text-canna-200"
        >
          ← Voltar ao campus
        </Link>
      </header>
      <div className="flex-1 w-full max-w-5xl mx-auto p-6">
        {!iframeSrc ? (
          <div className="rounded-2xl border border-rose-400/35 bg-black/35 p-6 text-sm text-white/85">
            Defina{" "}
            <code className="text-gold-200">NEXT_PUBLIC_BUNNY_LIBRARY_ID</code> (modo público) ou{" "}
            <code className="text-gold-200">BUNNY_STREAM_TOKEN_AUTH_KEY</code> + library (modo
            assinado).
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-canna-400/25 shadow-xl bg-black aspect-video">
            <iframe
              title="Aula Bunny Stream"
              src={iframeSrc}
              className="size-full border-0"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        <p className="mt-4 text-xs text-white/50">
          Documentação da assinatura:{" "}
          <span className="text-canna-300/90">bunny.net/stream/token-authentication</span>
        </p>
      </div>
    </div>
  );
}
