"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/react";
import {
  pickCampusLessonSourcePublic,
  getBunnyDemoVideoIdPublic,
  type CampusLessonSource
} from "@/lib/video/campusLessonSource";
import {
  areaUsesRegisteredPrimaryMux,
  isCannabis101CourseArea,
  registeredPrimaryMuxPlaybackId
} from "@/content/courses";
import { getCannabis101LessonEmbedYoutubeId } from "@/content/courses/cannabis-101/media";
import { getCourseLessonTheme } from "@/data/courseLessonThemes";
import { cn } from "@/lib/utils";
import { LessonCinematicFallback } from "./LessonCinematicFallback";
import { CampusLessonHero } from "./CampusLessonHero";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

type Props = {
  className?: string;
  areaId: string;
  areaName: string;
  lessonTitle: string;
  /** Sala Cannabis 101: cabeçalho visual compacto quando não há vídeo */
  lessonVisual?: "default" | "compact";
  /**
   * Sem stream (Mux/Bunny/Youtube): não renderizar hero/cinemático automático.
   * Permite colocar CampusLessonHero manualmente (ex.: no fim da coluna).
   */
  hideFallback?: boolean;
  /**
   * Sem URL de vídeo e `hideFallback`: `large` = bloco 16:9; `compact` = cartão discreto (ex.: fim da aula).
   */
  whenNone?: "large" | "compact";
};

/**
 * Vídeo integrado ao campus: Mux / Bunny / YouTube (só com env) → hero cinematográfico THCProce (sem fallback genérico).
 */
export function CampusLessonVideo({
  className = "",
  areaId,
  areaName,
  lessonTitle,
  lessonVisual = "default",
  hideFallback = false,
  whenNone = "large"
}: Props) {
  const { status } = useSession();
  const theme = getCourseLessonTheme(areaId);

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

  let signedIframe: string | null = null;
  if (signedNeeded && status === "authenticated") {
    if (signed.isLoading) {
      if (whenNone === "compact") {
        return (
          <div
            role="status"
            className={cn(
              "flex items-center gap-2.5 rounded-xl border border-amber-500/22 bg-black/28 px-3 py-2.5 backdrop-blur-sm",
              className
            )}
          >
            <Loader2 className="size-4 shrink-0 animate-spin text-amber-200/90" aria-hidden />
            <span className="text-[12px] text-white/65">A preparar o player…</span>
          </div>
        );
      }
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

  const dedicatedMuxPath = areaUsesRegisteredPrimaryMux(areaId);
  const primaryMuxId = registeredPrimaryMuxPlaybackId(areaId);

  let base: CampusLessonSource;
  if (signedIframe !== null && signedIframe.length > 0) {
    base = { kind: "bunny", embedUrl: signedIframe };
  } else if (dedicatedMuxPath) {
    if (primaryMuxId) {
      base = { kind: "mux", playbackId: primaryMuxId };
    } else if (isCannabis101CourseArea(areaId)) {
      const ytFallback = getCannabis101LessonEmbedYoutubeId().trim();
      base =
        ytFallback.length >= 8 ? { kind: "youtube", videoId: ytFallback } : { kind: "none" };
    } else {
      base = { kind: "none" };
    }
  } else {
    base = pickCampusLessonSourcePublic({ omitBunnyIframe: skipUnsignedBunny });
  }

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
          <iframe title="Aula THCProce" src={base.embedUrl} className="size-full border-0" allowFullScreen />
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
            title="Aula THCProce"
            className="size-full border-0"
            src={`https://www.youtube-nocookie.com/embed/${base.videoId}?rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    default:
      if (hideFallback) {
        if (whenNone === "compact") {
          return (
            <div
              role="status"
              className={cn(
                "flex max-w-md flex-col gap-1 rounded-xl border border-amber-500/28 bg-gradient-to-br from-black/50 via-emerald-950/18 to-amber-950/14 px-3 py-2.5 shadow-inner sm:flex-row sm:items-center sm:gap-3 sm:py-2",
                className
              )}
            >
              <div className="flex items-center gap-2 text-amber-200/90">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-amber-400/25 bg-black/35 text-[10px] font-bold uppercase tracking-wide">
                  Vídeo
                </span>
                <p className="text-[12px] font-semibold leading-snug text-white/88">Em preparação</p>
              </div>
              <p className="text-[11px] leading-relaxed text-white/48 sm:min-w-0 sm:flex-1">
                O episódio entra no player em breve — por agora use o texto e os materiais desta página.
              </p>
            </div>
          );
        }
        return (
          <div
            role="status"
            className={
              "flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border border-amber-500/25 bg-gradient-to-br from-black/55 via-emerald-950/25 to-amber-950/20 px-6 text-center shadow-inner " +
              className
            }
          >
            <p className="text-sm font-semibold text-white/90">
              Vídeo da aula em preparação
            </p>
            <p className="max-w-sm text-[13px] leading-relaxed text-white/55">
              Assim que o episódio estiver no player, aparece aqui no mesmo formato — até lá, siga pelo texto e materiais abaixo.
            </p>
          </div>
        );
      }
      return isCannabis101CourseArea(areaId) ? (
        <CampusLessonHero
          theme={theme}
          lessonTitle={lessonTitle}
          areaName={areaName}
          className={className}
          compact={lessonVisual === "compact"}
        />
      ) : (
        <LessonCinematicFallback
          theme={theme}
          lessonTitle={lessonTitle}
          areaName={areaName}
          className={className}
        />
      );
  }
}
