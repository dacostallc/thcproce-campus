import type { LessonMediaHints } from "@/data/lessonContent/types";

/**
 * Chaves de ambiente usadas pelo player / trailer deste curso (documentação + tipagem implícita).
 */
export const CANNABIS101_MEDIA_ENV = {
  primaryMux: "NEXT_PUBLIC_CANNABIS101_PRIMARY_MUX_PLAYBACK_ID",
  trailerMux: "NEXT_PUBLIC_CANNABIS101_TRAILER_MUX_PLAYBACK_ID",
  trailerYoutube: "NEXT_PUBLIC_CANNABIS101_TRAILER_YOUTUBE_ID",
  /** Vídeo YouTube público incorporado na sala quando o Mux principal não está definido. */
  lessonYoutube: "NEXT_PUBLIC_CANNABIS101_LESSON_YOUTUBE_ID",
  /** Abertura cinematográfica (MP4/WebM ou URL Bunny/CDN). String vazia = só poster. */
  openingVideo: "NEXT_PUBLIC_CANNABIS101_OPENING_VIDEO_SRC",
  openingPoster: "NEXT_PUBLIC_CANNABIS101_OPENING_POSTER_SRC"
} as const;

/** Textos da abertura oficial Cannabis 101 («Cannabis Sem Mito»). */
export const CANNABIS101_OPENING_COPY = {
  filmEyebrow: "Cannabis Sem Mito",
  title: "Cannabis 101",
  subtitle: "Ciência, história, medicina e cultivo responsável da cannabis.",
  cta: "Entrar na Aula"
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

/**
 * ID YouTube (`v=` da URL) para embed na sala, quando `NEXT_PUBLIC_CANNABIS101_PRIMARY_MUX_PLAYBACK_ID` está vazio.
 * Prioridade: `NEXT_PUBLIC_CANNABIS101_LESSON_YOUTUBE_ID` → trailer (`NEXT_PUBLIC_CANNABIS101_TRAILER_YOUTUBE_ID`).
 */
export function getCannabis101LessonEmbedYoutubeId(): string {
  const explicit =
    typeof process.env.NEXT_PUBLIC_CANNABIS101_LESSON_YOUTUBE_ID === "string"
      ? process.env.NEXT_PUBLIC_CANNABIS101_LESSON_YOUTUBE_ID.trim()
      : "";
  if (explicit) return explicit;
  return getCannabis101TrailerYoutubeId();
}

/**
 * Vídeo da abertura cinematográfica (primeira aula).
 * Prioridade: env → `/video/cannabis-sem-mito.mp4`.
 * `NEXT_PUBLIC_CANNABIS101_OPENING_VIDEO_SRC=""` desativa o vídeo (só poster).
 */
export function getCannabis101OpeningVideoSrc(): string | null {
  const raw = process.env.NEXT_PUBLIC_CANNABIS101_OPENING_VIDEO_SRC;
  if (raw === "") return null;
  const trimmed =
    typeof raw === "string"
      ? raw.trim()
      : "";
  if (trimmed.length > 0) return trimmed;
  return "/video/cannabis-sem-mito.mp4";
}

export function getCannabis101OpeningPosterSrc(): string {
  const t =
    typeof process.env.NEXT_PUBLIC_CANNABIS101_OPENING_POSTER_SRC === "string"
      ? process.env.NEXT_PUBLIC_CANNABIS101_OPENING_POSTER_SRC.trim()
      : "";
  return t.length > 0 ? t : CANNABIS101_HERO_POSTER_SRC;
}
