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
  getCannabis101PrimaryMuxPlaybackId
} from "@/lib/video/cannabis101Stream";
import { getCourseLessonTheme } from "@/data/courseLessonThemes";
import { LessonCinematicFallback } from "./LessonCinematicFallback";
import { Cannabis101LessonHero } from "./Cannabis101LessonHero";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

type Props = {
  className?: string;
  areaId: string;
  areaName: string;
  lessonTitle: string;
};

/**
 * Vídeo integrado ao campus: Mux / Bunny / YouTube (só com env) → hero cinematográfico THCProce (sem fallback genérico).
 */
export function CampusLessonVideo({
  className = "",
  areaId,
  areaName,
  lessonTitle
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

  const isCannabis101 = areaId === "cannabis-101";
  const c101PrimaryMux = getCannabis101PrimaryMuxPlaybackId();

  let base: CampusLessonSource;
  if (signedIframe !== null && signedIframe.length > 0) {
    base = { kind: "bunny", embedUrl: signedIframe };
  } else if (isCannabis101) {
    if (c101PrimaryMux) {
      base = { kind: "mux", playbackId: c101PrimaryMux };
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
      return isCannabis101 ? (
        <Cannabis101LessonHero
          theme={theme}
          lessonTitle={lessonTitle}
          areaName={areaName}
          className={className}
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
