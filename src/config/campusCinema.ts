/** Centro visual do Cine THCProce no mapa (%) — refinamento ~40px esq./baixo vs arte 1536×1024. */
export const CAMPUS_CINE_POSITION = { x: 21, y: 80 } as const;

export function campusCineYoutubeUrlFromEnv(): string {
  return (process.env.NEXT_PUBLIC_CAMPUS_LIVE_YOUTUBE_URL ?? "").trim();
}
