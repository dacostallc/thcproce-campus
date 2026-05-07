/**
 * Bunny Stream = infraestrutura: vocês fazem upload dos vídeos na biblioteca Bunny;
 * o campus apenas consome playback via Mux/Bunny embed conforme env.
 *
 * Cannabis 101 — vídeo “principal” do curso (quando existir upload):
 *   NEXT_PUBLIC_CANNABIS101_PRIMARY_MUX_PLAYBACK_ID
 *
 * Trailer opcional (botão “Assistir trailer” na sala):
 *   NEXT_PUBLIC_CANNABIS101_TRAILER_MUX_PLAYBACK_ID
 *   ou NEXT_PUBLIC_CANNABIS101_TRAILER_YOUTUBE_ID (embed no-cookie)
 */

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
