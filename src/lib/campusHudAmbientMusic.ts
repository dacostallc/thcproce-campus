/**
 * Música ambiente do campus — MP3 (ou WAV legacy) em `/public/audio/`.
 * Ficheiros em falta são ignorados após probe; playlist vazia = UI não renderiza crash.
 */

export type CampusHudAmbientTrack = {
  readonly id: string;
  readonly title: string;
  /** Caminho público (ex.: `/audio/foo.mp3`). */
  readonly src: string;
};

/** Ordem de reprodução — só entram faixas que existirem no servidor. */
export const CAMPUS_HUD_AMBIENT_PLAYLIST: readonly CampusHudAmbientTrack[] = [
  { id: "ambient-01", title: "Ambiente campus · 1", src: "/audio/campus-ambient-01.mp3" },
  { id: "ambient-02", title: "Ambiente campus · 2", src: "/audio/campus-ambient-02.mp3" },
  { id: "ambient-legacy-wav", title: "Ambiente campus", src: "/audio/campus-ambient.wav" }
];

const LS_VOLUME = "thc-campus-hud-music-volume";
const LS_MUTED = "thc-campus-hud-music-muted";
const LS_TRACK = "thc-campus-hud-music-track";
const LS_PLAYING = "thc-campus-hud-music-playing";
const LS_LEGACY_MUTED = "thc-campus-ambient-muted";

/** Volume reprodução (0–1), baixo por defeito. */
export const CAMPUS_HUD_AMBIENT_DEFAULT_VOLUME = 0.12;

export async function campusHudAmbientProbeSrc(src: string): Promise<boolean> {
  try {
    const head = await fetch(src, {
      method: "HEAD",
      cache: "force-cache",
      referrerPolicy: "no-referrer"
    });
    if (head.ok) return true;
    const get = await fetch(src, {
      method: "GET",
      cache: "force-cache",
      referrerPolicy: "no-referrer",
      headers: { Range: "bytes=0-0" }
    });
    return get.ok || get.status === 206;
  } catch {
    return false;
  }
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return CAMPUS_HUD_AMBIENT_DEFAULT_VOLUME;
  return Math.min(1, Math.max(0, n));
}

function parseBool(v: string | null, fallback: boolean): boolean {
  if (v === null) return fallback;
  return v === "1" || v === "true";
}

export function readCampusHudAmbientVolume(): number {
  if (typeof window === "undefined") return CAMPUS_HUD_AMBIENT_DEFAULT_VOLUME;
  try {
    const raw = window.localStorage.getItem(LS_VOLUME);
    if (raw === null) return CAMPUS_HUD_AMBIENT_DEFAULT_VOLUME;
    return clamp01(Number.parseFloat(raw));
  } catch {
    return CAMPUS_HUD_AMBIENT_DEFAULT_VOLUME;
  }
}

export function writeCampusHudAmbientVolume(volume: number): void {
  try {
    window.localStorage.setItem(LS_VOLUME, String(clamp01(volume)));
  } catch {
    /* ignore */
  }
}

export function readCampusHudAmbientMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const v = window.localStorage.getItem(LS_MUTED);
    if (v !== null) return parseBool(v, false);
    const legacy = window.localStorage.getItem(LS_LEGACY_MUTED);
    if (legacy !== null) return parseBool(legacy, true);
    return false;
  } catch {
    return false;
  }
}

export function writeCampusHudAmbientMuted(muted: boolean): void {
  try {
    window.localStorage.setItem(LS_MUTED, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function readCampusHudAmbientTrackIndex(maxExclusive: number): number {
  if (typeof window === "undefined" || maxExclusive <= 0) return 0;
  try {
    const raw = window.localStorage.getItem(LS_TRACK);
    if (raw === null) return 0;
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return 0;
    return Math.min(maxExclusive - 1, Math.max(0, n));
  } catch {
    return 0;
  }
}

export function writeCampusHudAmbientTrackIndex(index: number): void {
  try {
    window.localStorage.setItem(LS_TRACK, String(Math.max(0, index)));
  } catch {
    /* ignore */
  }
}

/** Autoplay desligado por UX; persistimos intenção para não resetar ao mudar de painel. */
export function readCampusHudAmbientPlayingIntent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(LS_PLAYING) === "1";
  } catch {
    return false;
  }
}

export function writeCampusHudAmbientPlayingIntent(playing: boolean): void {
  try {
    window.localStorage.setItem(LS_PLAYING, playing ? "1" : "0");
  } catch {
    /* ignore */
  }
}
