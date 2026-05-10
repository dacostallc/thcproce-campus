import { humanizeCampusMusicFilename } from "@/lib/audio/campusMusicPlayer";

export const HUD_AMBIENT_DEFAULT_VOLUME = 0.65;

export type HudAmbientCategory = "ambience" | "radio" | "cinema" | "legacy";

export type HudAmbientTrackRow = {
  category: HudAmbientCategory;
  filename: string;
  /** Caminho público absoluto (ex.: `/audio/ambience/foo.mp3`). */
  url: string;
};

/**
 * Monta candidatos à playlist **apenas** a partir da API (`/api/campus/audio-tracks`).
 * Pastas `public/audio/mp3` etc. entram só quando o servidor as lista — sem lista hardcoded
 * de nomes inexistentes (evita probes 404 em massa).
 */
export type HudAmbientResolvedTrack = {
  category: HudAmbientCategory;
  src: string;
  title: string;
};

function normalizeSrc(src: string): string {
  try {
    const u = new URL(src, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return u.pathname;
  } catch {
    return src;
  }
}

export function hudAmbientPlaylistFromApiRows(rows: HudAmbientTrackRow[]): HudAmbientResolvedTrack[] {
  const seen = new Set<string>();
  const out: HudAmbientResolvedTrack[] = [];

  const push = (category: HudAmbientCategory, src: string, titleHint?: string) => {
    const key = normalizeSrc(src);
    if (seen.has(key)) return;
    seen.add(key);
    const filenameFromUrl = key.split("/").pop() ?? src;
    const title =
      titleHint ??
      humanizeCampusMusicFilename(filenameFromUrl.replace(/\.[^/.]+$/, ""));
    out.push({ category, src, title });
  };

  for (const row of rows) {
    push(
      row.category,
      row.url,
      humanizeCampusMusicFilename(row.filename.replace(/\.[^/.]+$/, ""))
    );
  }

  return out;
}

/**
 * Verifica existência do ficheiro sem montar `<audio>` (evita erros no console).
 * HEAD primeiro; Range só se HEAD não for OK — respostas 404 tratadas como false, sem throw.
 */
async function probeOnce(src: string, signal?: AbortSignal): Promise<boolean> {
  try {
    const head = await fetch(src, { method: "HEAD", signal, cache: "no-store" });
    if (head.ok) return true;
    if (head.status === 405 || head.status === 501) {
      const range = await fetch(src, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        signal,
        cache: "no-store"
      });
      return range.ok || range.status === 206;
    }
    if (head.status === 404) return false;
    const range = await fetch(src, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      signal,
      cache: "no-store"
    });
    return range.ok || range.status === 206;
  } catch {
    return false;
  }
}

const HUD_PROBE_CONCURRENCY = 6;

export async function probeHudAmbientTracks(
  tracks: HudAmbientResolvedTrack[],
  signal?: AbortSignal
): Promise<HudAmbientResolvedTrack[]> {
  const ok: HudAmbientResolvedTrack[] = [];
  let i = 0;

  async function worker(): Promise<void> {
    while (i < tracks.length) {
      const idx = i++;
      const t = tracks[idx];
      if (!t) continue;
      const alive = await probeOnce(t.src, signal);
      if (alive) ok.push(t);
    }
  }

  await Promise.all(Array.from({ length: Math.min(HUD_PROBE_CONCURRENCY, tracks.length) }, () => worker()));
  return ok;
}

export function campusHudAmbientProbeSrc(src: string): Promise<boolean> {
  return probeOnce(src);
}

export const CAMPUS_HUD_AMBIENT_VOLUME_LS_KEY = "thcproce.campus.hudAmbient.volume.v1";
export const CAMPUS_HUD_AMBIENT_MUTED_LS_KEY = "thcproce.campus.hudAmbient.muted.v1";
export const CAMPUS_HUD_AMBIENT_TRACK_INDEX_LS_KEY = "thcproce.campus.hudAmbient.trackIndex.v1";
/** Intent de autoplay — usuário deve dar play ao menos uma vez para browsers permitirem som. */
export const CAMPUS_HUD_AMBIENT_AUTOPLAY_INTENT_LS_KEY = "thcproce.campus.hudAmbient.autoplayIntent.v1";

export function readHudAmbientVolume01(): number {
  if (typeof window === "undefined") return 0.65;
  try {
    const raw = window.localStorage.getItem(CAMPUS_HUD_AMBIENT_VOLUME_LS_KEY);
    const n = raw == null ? NaN : Number(raw);
    if (!Number.isFinite(n)) return 0.65;
    return Math.min(1, Math.max(0, n));
  } catch {
    return 0.65;
  }
}

export function writeHudAmbientVolume01(v: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CAMPUS_HUD_AMBIENT_VOLUME_LS_KEY, String(Math.min(1, Math.max(0, v))));
  } catch {
    /* quota */
  }
}

export function readHudAmbientMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CAMPUS_HUD_AMBIENT_MUTED_LS_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeHudAmbientMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CAMPUS_HUD_AMBIENT_MUTED_LS_KEY, muted ? "1" : "0");
  } catch {
    /* quota */
  }
}

export function readHudAmbientTrackIndex(maxExclusive: number): number {
  if (typeof window === "undefined" || maxExclusive <= 0) return 0;
  try {
    const raw = window.localStorage.getItem(CAMPUS_HUD_AMBIENT_TRACK_INDEX_LS_KEY);
    const n = raw == null ? NaN : Number(raw);
    if (!Number.isFinite(n)) return 0;
    const idx = Math.floor(n);
    if (idx < 0 || idx >= maxExclusive) return 0;
    return idx;
  } catch {
    return 0;
  }
}

export function writeHudAmbientTrackIndex(idx: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CAMPUS_HUD_AMBIENT_TRACK_INDEX_LS_KEY, String(Math.max(0, Math.floor(idx))));
  } catch {
    /* quota */
  }
}

export function readHudAmbientAutoplayIntent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CAMPUS_HUD_AMBIENT_AUTOPLAY_INTENT_LS_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeHudAmbientAutoplayIntent(on: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CAMPUS_HUD_AMBIENT_AUTOPLAY_INTENT_LS_KEY, on ? "1" : "0");
  } catch {
    /* quota */
  }
}
