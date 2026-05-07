/** Centro visual do anfiteatro / Cine THCProce no mapa (%, mesmo sistema dos hotspots). */
export const CAMPUS_CINE_POSITION = { x: 76, y: 80 } as const;

export function campusCineYoutubeUrlFromEnv(): string {
  return (process.env.NEXT_PUBLIC_CAMPUS_LIVE_YOUTUBE_URL ?? "").trim();
}
