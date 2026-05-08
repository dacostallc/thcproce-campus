export type MergedLiveBroadcast = {
  liveActive: boolean;
  youtubeUrl: string;
};

/**
 * Live do Cine THCProce só via env público (`NEXT_PUBLIC_*`).
 * Retirado Prisma/CampusLiveConfig para deploy estável sem migração obrigatória —
 * quando quiser persistir na BD de novo, reintroduz modelo + migrate e liga aqui.
 */
export async function getMergedLiveBroadcast(): Promise<MergedLiveBroadcast> {
  const youtubeUrl = (process.env.NEXT_PUBLIC_CAMPUS_LIVE_YOUTUBE_URL ?? "").trim();
  const liveActive = process.env.NEXT_PUBLIC_CAMPUS_LIVE_ACTIVE === "true";
  return { liveActive, youtubeUrl };
}
