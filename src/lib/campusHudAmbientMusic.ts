/**
 * Música ambiente do campus — MP3 (ou WAV legacy) em `/public/audio/`.
 * Ficheiros em falta são ignorados após probe (GET parcial + validação); playlist vazia = botão desactivado.
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

function bufferLooksLikeHtml(buf: ArrayBuffer): boolean {
  const v = new Uint8Array(buf);
  let i = 0;
  while (i < v.length && (v[i] === 9 || v[i] === 10 || v[i] === 13 || v[i] === 32)) i++;
  if (i >= v.length) return false;
  return v[i] === 0x3c; // '<' — páginas de erro Next/HTML
}

function asciiPrefix(v: Uint8Array, n: number): string {
  let s = "";
  for (let j = 0; j < Math.min(n, v.length); j++) s += String.fromCharCode(v[j]!);
  return s;
}

function bufferLooksLikeBinaryAudio(buf: ArrayBuffer): boolean {
  const v = new Uint8Array(buf);
  if (v.length < 2) return false;
  if (v[0] === 0xff && (v[1]! & 0xe0) === 0xe0) return true;
  if (v.length >= 3 && v[0] === 0x49 && v[1] === 0x44 && v[2] === 0x33) return true;
  if (v.length >= 12 && asciiPrefix(v, 4) === "RIFF") return true;
  return false;
}

/**
 * Verifica se o asset existe e parece áudio — um único GET parcial (menos 404 duplicados que HEAD+GET).
 * Rejeita HTML de erro mesmo com status ambíguo.
 */
export async function campusHudAmbientProbeSrc(src: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const url = new URL(src, window.location.origin).href;
    const res = await fetch(url, {
      method: "GET",
      referrerPolicy: "no-referrer",
      headers: { Range: "bytes=0-511" },
      cache: "force-cache"
    });
    if (!(res.ok || res.status === 206)) return false;
    const buf = await res.arrayBuffer();
    if (buf.byteLength === 0) return false;
    if (bufferLooksLikeHtml(buf)) return false;
    const ct = (res.headers.get("Content-Type") ?? "").split(";")[0].trim().toLowerCase();
    if (ct.startsWith("audio/") || ct === "application/octet-stream") return true;
    return bufferLooksLikeBinaryAudio(buf);
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
