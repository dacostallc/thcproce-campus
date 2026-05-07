"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/react";
import {
  pickCampusLessonSourcePublic,
  getBunnyDemoVideoIdPublic
} from "@/lib/video/campusLessonSource";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

type Props = { className?: string };

/**
 * Vídeo integrado ao campus — nunca falha “seco”: sempre há um fallback público CC (YouTube)
 * se Mux/Bunny não estiverem configurados ou se Bunny assinado não puder gerar iframe.
 */
export function CampusLessonVideo({ className = "" }: Props) {
  const { status } = useSession();

  const bunnyVid = getBunnyDemoVideoIdPublic();

  const { data: flags } = trpc.campus.streamFlags.useQuery(undefined, {
    staleTime: 120_000
  });

  const signedNeeded = Boolean(flags?.bunnySigningEnabled) && bunnyVid.length >= 4;

  const signed = trpc.campus.bunnyEmbedUrl.useQuery(
    { videoId: bunnyVid },
    {
      enabled: signedNeeded && status === "authenticated",
      staleTime: 600_000,
      retry: 1
    }
  );

  /** Bunny assinado: só quando logado + URL válida */
  let signedIframe: string | null = null;
  if (signedNeeded && status === "authenticated") {
    if (signed.isLoading) {
      return (
        <div
          className={
            "flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-canna-400/25 bg-black/40 " +
            className
          }
        >
          <Loader2 className="h-10 w-10 animate-spin text-canna-300" />
          <span className="text-sm text-white/70">Carregando stream seguro…</span>
        </div>
      );
    }
    if (signed.data?.url) signedIframe = signed.data.url;
  }

  const skipUnsignedBunny = Boolean(flags?.bunnySigningEnabled);

  const base =
    signedIframe !== null && signedIframe.length > 0
      ? { kind: "bunny" as const, embedUrl: signedIframe }
      : pickCampusLessonSourcePublic({ omitBunnyIframe: skipUnsignedBunny });

  switch (base.kind) {
    case "mux":
      return (
        <div
          className={
            "aspect-video overflow-hidden rounded-xl border border-canna-400/30 bg-black shadow-xl " +
            className
          }
        >
          <MuxPlayer
            playbackId={base.playbackId}
            streamType="on-demand"
            accentColor="#4ade80"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      );
    case "bunny":
      return (
        <div
          className={
            "aspect-video overflow-hidden rounded-xl border border-canna-400/30 shadow-xl bg-black " +
            className
          }
        >
          <iframe title="Stream" src={base.embedUrl} className="size-full border-0" allowFullScreen />
        </div>
      );
    case "youtube":
      return (
        <div
          className={
            "aspect-video overflow-hidden rounded-xl border border-canna-400/30 shadow-xl bg-black " +
            className
          }
        >
          <iframe
            title="Demonstração THCProce"
            className="size-full border-0"
            src={`https://www.youtube-nocookie.com/embed/${base.videoId}?rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    default:
      return (
        <div
          className={
            "flex aspect-video flex-col items-center justify-center gap-4 rounded-xl border border-white/15 bg-black/45 p-6 text-center " +
            className
          }
        >
          <p className="max-w-md text-sm text-white/80">
            Nenhuma fonte configurada neste momento. Mais tarde podes usar Mux, Bunny ou hospedagem
            própria.
          </p>
          <Link
            href="https://thcproce.com.br/escola"
            className="text-sm font-semibold text-canna-300 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Sala Moodle (conteúdo real)
          </Link>
        </div>
      );
  }
}
