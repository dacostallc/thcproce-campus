import type { LessonMediaHints } from "@/data/lessonContent/types";

/**
 * Chaves de ambiente usadas pelo player / trailer deste curso (documentação + tipagem implícita).
 */
export const CANNABIS101_MEDIA_ENV = {
  primaryMux: "NEXT_PUBLIC_CANNABIS101_PRIMARY_MUX_PLAYBACK_ID",
  trailerMux: "NEXT_PUBLIC_CANNABIS101_TRAILER_MUX_PLAYBACK_ID",
  trailerYoutube: "NEXT_PUBLIC_CANNABIS101_TRAILER_YOUTUBE_ID"
} as const;

/** Hero / poster fallback usado pelos componentes Cannabis 101. */
export const CANNABIS101_HERO_POSTER_SRC = "/campus/themes/cannabis101-hero.svg";

/** Hints editoriais por aula (stream / tabs). */
export const CANNABIS101_LESSON_MEDIA_HINTS: LessonMediaHints = {
  needsVideo: false,
  needsImage: false,
  needsInfographic: false,
  needsSupportMaterial: true
};

export function getCannabis101PrimaryMuxPlaybackId(): string {
  return (
    (typeof process.env.NEXT_PUBLIC_CANNABIS101_PRIMARY_MUX_PLAYBACK_ID === "string"
      ? process.env.NEXT_PUBLIC_CANNABIS101_PRIMARY_MUX_PLAYBACK_ID.trim()
      : "") || ""
  );
}

export function getCannabis101TrailerMuxPlaybackId(): string {
  return (
    (typeof process.env.NEXT_PUBLIC_CANNABIS101_TRAILER_MUX_PLAYBACK_ID === "string"
      ? process.env.NEXT_PUBLIC_CANNABIS101_TRAILER_MUX_PLAYBACK_ID.trim()
      : "") || ""
  );
}

export function getCannabis101TrailerYoutubeId(): string {
  return (
    (typeof process.env.NEXT_PUBLIC_CANNABIS101_TRAILER_YOUTUBE_ID === "string"
      ? process.env.NEXT_PUBLIC_CANNABIS101_TRAILER_YOUTUBE_ID.trim()
      : "") || ""
  );
}

export function hasCannabis101TrailerConfigured(): boolean {
  return Boolean(getCannabis101TrailerMuxPlaybackId() || getCannabis101TrailerYoutubeId());
}
