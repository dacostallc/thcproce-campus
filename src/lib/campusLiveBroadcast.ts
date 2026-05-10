export type CampusStreamState = "live" | "scheduled" | "offline";

export type MergedLiveBroadcast = {
  liveActive: boolean;
  youtubeUrl: string;
  hlsUrl: string;
  muxPlaybackId: string;
  bunnyEmbedUrl: string;
  streamState: CampusStreamState;
  scheduledStartIso: string | null;
};

function trimEnv(key: string): string {
  return (process.env[key] ?? "").trim();
}

function parseStreamState(raw: string): CampusStreamState {
  const s = raw.trim().toLowerCase();
  if (s === "live" || s === "scheduled" || s === "offline") return s;
  return "offline";
}

/** Fonte única de env público — segura para import no cliente (só `process.env` substituído em build). */
export function readMergedLiveBroadcastFromEnv(): MergedLiveBroadcast {
  const youtubeUrl = trimEnv("NEXT_PUBLIC_CAMPUS_LIVE_YOUTUBE_URL");
  const liveActive = process.env.NEXT_PUBLIC_CAMPUS_LIVE_ACTIVE === "true";
  const hlsUrl = trimEnv("NEXT_PUBLIC_CAMPUS_STREAM_HLS_URL");
  const muxPlaybackId = trimEnv("NEXT_PUBLIC_CAMPUS_MUX_PLAYBACK_ID");
  const bunnyEmbedUrl = trimEnv("NEXT_PUBLIC_CAMPUS_BUNNY_EMBED_URL");
  const scheduledStartIsoRaw = trimEnv("NEXT_PUBLIC_CAMPUS_STREAM_SCHEDULED_ISO");
  const scheduledStartIso =
    scheduledStartIsoRaw.length >= 8 ? scheduledStartIsoRaw.slice(0, 48) : null;
  const streamState = parseStreamState(trimEnv("NEXT_PUBLIC_CAMPUS_STREAM_STATE"));

  return {
    liveActive,
    youtubeUrl,
    hlsUrl,
    muxPlaybackId,
    bunnyEmbedUrl,
    streamState,
    scheduledStartIso
  };
}

export function resolveCampusPrimaryPlaybackUrl(live: MergedLiveBroadcast): string | null {
  if (live.bunnyEmbedUrl) return live.bunnyEmbedUrl;
  if (live.muxPlaybackId)
    return `https://stream.mux.com/${live.muxPlaybackId}.m3u8`;
  if (live.hlsUrl) return live.hlsUrl;
  if (live.youtubeUrl) return live.youtubeUrl;
  return null;
}

export function deriveEffectiveCampusStreamState(live: MergedLiveBroadcast): CampusStreamState {
  if (live.liveActive) return "live";
  if (live.streamState === "scheduled") return "scheduled";
  if (live.scheduledStartIso) return "scheduled";
  return "offline";
}
