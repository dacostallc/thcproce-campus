import {
  readMergedLiveBroadcastFromEnv,
  type MergedLiveBroadcast
} from "@/lib/campusLiveBroadcast";

export type { CampusStreamState, MergedLiveBroadcast } from "@/lib/campusLiveBroadcast";

/**
 * Live do Cine THCProce — hoje só env público; futuro: fundir com Prisma / Bunny assinado no servidor.
 */
export async function getMergedLiveBroadcast(): Promise<MergedLiveBroadcast> {
  return readMergedLiveBroadcastFromEnv();
}
