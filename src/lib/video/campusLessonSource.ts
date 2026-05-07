/** Origem das aulas — Mux/Bunny opcionais. YouTube só se `NEXT_PUBLIC_DEFAULT_DEMO_YOUTUBE_VIDEO_ID` estiver definido (conteúdo explícito THCProce). Sem vídeo configurado → experiência cinematográfica no painel (sem fallback genérico). */

export type CampusLessonSource =
  | { kind: "mux"; playbackId: string }
  | { kind: "youtube"; videoId: string }
  | { kind: "bunny"; embedUrl: string }
  | { kind: "none" };

export function getMuxDemoIdPublic(): string {
  return (
    (typeof process.env.NEXT_PUBLIC_MUX_DEMO_PLAYBACK_ID === "string"
      ? process.env.NEXT_PUBLIC_MUX_DEMO_PLAYBACK_ID.trim()
      : "") || ""
  );
}

export function getDefaultYoutubeDemoId(): string {
  return (
    (typeof process.env.NEXT_PUBLIC_DEFAULT_DEMO_YOUTUBE_VIDEO_ID === "string"
      ? process.env.NEXT_PUBLIC_DEFAULT_DEMO_YOUTUBE_VIDEO_ID.trim()
      : "") || ""
  );
}

export function getBunnyDemoVideoIdPublic(): string {
  return (
    (typeof process.env.NEXT_PUBLIC_BUNNY_DEMO_VIDEO_ID === "string"
      ? process.env.NEXT_PUBLIC_BUNNY_DEMO_VIDEO_ID.trim()
      : "") || ""
  );
}

export function getPublicBunnyEmbedUrl(videoId: string): string | null {
  const lib =
    typeof process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID === "string"
      ? process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID.trim()
      : "";
  const id = typeof videoId === "string" ? videoId.trim() : "";
  if (!lib || !id) return null;
  return `https://iframe.mediadelivery.net/embed/${lib}/${id}?autoplay=false&preload=true`;
}

/** Mux → Bunny público → YouTube (só se env) → none (hero THCProce no client). */
export function pickCampusLessonSourcePublic(options?: {
  /** Se true (p.ex. Bunny com token obrigatório sem sessão iframe assinado), só Mux ou YouTube. */
  omitBunnyIframe?: boolean;
}): CampusLessonSource {
  const omit = Boolean(options?.omitBunnyIframe);
  const mux = getMuxDemoIdPublic();
  if (mux) return { kind: "mux", playbackId: mux };

  if (!omit) {
    const bv = getBunnyDemoVideoIdPublic();
    const bunnyUrl = bv ? getPublicBunnyEmbedUrl(bv) : null;
    if (bunnyUrl) return { kind: "bunny", embedUrl: bunnyUrl };
  }

  const yId = getDefaultYoutubeDemoId();
  if (yId) return { kind: "youtube", videoId: yId };

  return { kind: "none" };
}
