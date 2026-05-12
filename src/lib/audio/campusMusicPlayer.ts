/**
 * Player singleton — trilha ambiente do campus (single `<audio>`, fade, preload, localStorage).
 * Playlist via `/api/campus/audio-tracks` (scan de `public/audio/mp3`).
 */

export type CampusMusicTrack = {
  filename: string;
  url: string;
};

const API_TRACKS = "/api/campus/audio-tracks";
const LS_KEY = "thcproce.campusAmbientMusic.v1";

const VOL_MIN = 0.1;
const VOL_MAX = 0.18;
const VOL_DEFAULT = 0.14;

export const campusAmbientVolumeRange = {
  min: VOL_MIN,
  max: VOL_MAX,
  default: VOL_DEFAULT
} as const;

const FADE_OUT_MS = 520;
const FADE_IN_MS = 780;
const POSITION_SAVE_INTERVAL_MS = 5000;

type PersistedV1 = {
  v: 1;
  volume: number;
  muted: boolean;
  filename: string | null;
  positionSec: number;
};

export type CampusMusicSnapshot = {
  ready: boolean;
  campusActive: boolean;
  unlocked: boolean;
  playing: boolean;
  muted: boolean;
  volume: number;
  trackCount: number;
  currentFilename: string | null;
  /** Derivado do filename — sem lista editorial hardcoded */
  currentLabel: string | null;
  error: string | null;
};

type Listener = () => void;

function clampVol(v: number): number {
  return Math.min(VOL_MAX, Math.max(VOL_MIN, v));
}

/**
 * Remove extensão, hífens/underscores como espaços, compacta whitespace,
 * capitaliza palavras (pt-BR) — ex.: `vim-pra-california.mp3` → `Vim Pra Califórnia`.
 */
export function humanizeCampusMusicFilename(filename: string): string {
  const base = filename.replace(/\.(mp3|wav|ogg|m4a|opus|flac)$/i, "").trim();
  const spaced = base
    .replace(/[-_]+/g, " ")
    .replace(/[^\p{L}\p{N}\s.'’]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!spaced) return base || filename;

  const words = spaced.split(" ");
  const out: string[] = [];
  const MAX_WORDS = 12;
  const MAX_CHARS = 48;
  for (let i = 0; i < Math.min(words.length, MAX_WORDS); i++) {
    const w = words[i]!;
    if (!w) continue;
    const lower = w.toLocaleLowerCase("pt-BR");
    const show =
      lower.charAt(0).toLocaleUpperCase("pt-BR") +
      (lower.length > 1 ? lower.slice(1) : "");
    out.push(show);
  }
  let label = out.join(" ");
  if (label.length > MAX_CHARS) label = `${label.slice(0, MAX_CHARS - 1)}…`;
  return label;
}

function readPersisted(): PersistedV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Partial<PersistedV1>;
    if (o.v !== 1) return null;
    return {
      v: 1,
      volume: typeof o.volume === "number" ? clampVol(o.volume) : VOL_DEFAULT,
      muted: Boolean(o.muted),
      filename: typeof o.filename === "string" ? o.filename : null,
      positionSec:
        typeof o.positionSec === "number" && Number.isFinite(o.positionSec)
          ? Math.max(0, o.positionSec)
          : 0
    };
  } catch {
    return null;
  }
}

function writePersisted(p: PersistedV1) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    /* quota / private mode */
  }
}

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export class CampusMusicPlayer {
  private static instance: CampusMusicPlayer | null = null;

  static get(): CampusMusicPlayer {
    if (!CampusMusicPlayer.instance) {
      CampusMusicPlayer.instance = new CampusMusicPlayer();
    }
    return CampusMusicPlayer.instance;
  }

  private listeners = new Set<Listener>();
  private playlist: CampusMusicTrack[] = [];
  /** Índice na playlist (ordem alfabética dos ficheiros). */
  private cursor = 0;
  private audio: HTMLAudioElement | null = null;
  private preloadAudio: HTMLAudioElement | null = null;
  private preloadTargetFilename: string | null = null;

  private volumeUser = VOL_DEFAULT;
  private muted = false;

  private campusActive = false;
  private unlocked = false;
  private playingIntent = false;
  private ready = false;
  private error: string | null = null;

  /** Filename cuja `src` está carregada em `audio` */
  private loadedFilename: string | null = null;

  private fadeRaf: number | null = null;
  private positionTimer: ReturnType<typeof setInterval> | null = null;
  private bootPromise: Promise<void> | null = null;

  /** Evita ciclo infinito quando todas as faixas falham (MediaError). */
  private audioErrorSkips = 0;

  private constructor() {}

  subscribe(cb: Listener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    for (const cb of this.listeners) cb();
  }

  getSnapshot(): CampusMusicSnapshot {
    const fn = this.playlist[this.cursor]?.filename ?? null;
    return {
      ready: this.ready,
      campusActive: this.campusActive,
      unlocked: this.unlocked,
      playing: Boolean(this.audio && !this.audio.paused),
      muted: this.muted,
      volume: this.volumeUser,
      trackCount: this.playlist.length,
      currentFilename: fn,
      currentLabel: fn ? humanizeCampusMusicFilename(fn) : null,
      error: this.error
    };
  }

  setCampusActive(active: boolean) {
    if (this.campusActive === active) return;
    this.campusActive = active;
    if (!active) {
      this.playingIntent = Boolean(this.audio && !this.audio.paused);
      void this.fadePause();
    } else if (this.playingIntent && this.unlocked && this.ready) {
      void this.resumePlayback();
    }
    this.notify();
  }

  markUserInteracted() {
    if (this.unlocked) return;
    this.unlocked = true;
    this.notify();
  }

  async bootstrap(): Promise<void> {
    if (typeof window === "undefined") return;
    if (this.bootPromise) return this.bootPromise;

    this.bootPromise = (async () => {
      const persisted = readPersisted();
      this.volumeUser = persisted?.volume ?? VOL_DEFAULT;
      this.muted = persisted?.muted ?? false;

      try {
        const res = await fetch(`${API_TRACKS}?_=${Date.now()}`, {
          cache: "no-store",
          headers: { Pragma: "no-cache" }
        });
        if (!res.ok) throw new Error(`tracks ${res.status}`);
        const data = (await res.json()) as { tracks?: CampusMusicTrack[] };
        this.playlist = Array.isArray(data.tracks) ? data.tracks : [];
        this.error = null;
      } catch (e) {
        this.playlist = [];
        this.error = e instanceof Error ? e.message : "playlist";
      }

      this.cursor = this.resolveCursor(persisted?.filename ?? null);
      this.preloadTargetFilename = null;
      this.ensureAudio();
      if (this.audio) {
        this.audio.volume = this.effectiveVolume();
      }
      this.schedulePreloadNext();
      this.ready = true;
      this.notify();
    })();

    return this.bootPromise;
  }

  private resolveCursor(preferredFilename: string | null): number {
    if (!this.playlist.length) return 0;
    if (preferredFilename) {
      const idx = this.playlist.findIndex((t) => t.filename === preferredFilename);
      if (idx >= 0) return idx;
    }
    return 0;
  }

  private ensureAudio() {
    if (this.audio) return;
    const el = new Audio();
    el.preload = "auto";
    el.crossOrigin = "anonymous";
    el.addEventListener("ended", () => void this.onEnded());
    el.addEventListener("error", () => void this.onAudioDecodeError());
    el.addEventListener("playing", () => {
      this.audioErrorSkips = 0;
    });
    el.addEventListener("play", () => {
      this.startPositionSaver();
      this.notify();
    });
    el.addEventListener("pause", () => {
      this.stopPositionSaver();
      this.persistNow();
      this.notify();
    });
    this.audio = el;
  }

  private cancelFade() {
    if (this.fadeRaf != null) {
      cancelAnimationFrame(this.fadeRaf);
      this.fadeRaf = null;
    }
  }

  private effectiveVolume(): number {
    return this.muted ? 0 : this.volumeUser;
  }

  private fadeVolume(from: number, to: number, ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.cancelFade();
      const t0 = performance.now();
      const step = (now: number) => {
        const raw = Math.min(1, (now - t0) / ms);
        const t = easeOutQuad(raw);
        const v = from + (to - from) * t;
        if (this.audio) this.audio.volume = Math.max(0, Math.min(1, v));
        if (raw < 1) this.fadeRaf = requestAnimationFrame(step);
        else {
          this.fadeRaf = null;
          resolve();
        }
      };
      this.fadeRaf = requestAnimationFrame(step);
    });
  }

  private async fadePause() {
    if (!this.audio || this.audio.paused) return;
    const start = this.audio.volume;
    await this.fadeVolume(start, 0, FADE_OUT_MS);
    this.audio.pause();
  }

  async togglePlay() {
    await this.bootstrap();
    if (!this.playlist.length || !this.audio) return;

    if (!this.audio.paused) {
      this.playingIntent = false;
      await this.fadePause();
      this.persistNow();
    } else {
      if (!this.unlocked) this.markUserInteracted();
      this.playingIntent = true;
      await this.resumePlayback();
    }
    this.notify();
  }

  async toggleMute() {
    this.muted = !this.muted;
    if (this.audio) {
      this.audio.volume = this.effectiveVolume();
    }
    this.persistNow();
    this.notify();
  }

  setVolume(v: number) {
    this.volumeUser = clampVol(v);
    if (this.audio) {
      this.audio.volume = this.effectiveVolume();
    }
    this.persistNow();
    this.notify();
  }

  async nextTrack() {
    await this.bootstrap();
    if (!this.playlist.length || !this.audio) return;
    this.cursor = (this.cursor + 1) % this.playlist.length;
    await this.loadAndPlay(true);
    this.schedulePreloadNext();
    this.notify();
  }

  private async onEnded() {
    this.cursor = (this.cursor + 1) % this.playlist.length;
    await this.loadAndPlay(true);
    this.schedulePreloadNext();
    this.notify();
  }

  private devWarn(message: string, detail?: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[campus-ambient-music] ${message}`, detail ?? "");
    }
  }

  private async onAudioDecodeError() {
    this.devWarn("Falha ao carregar/reproduzir faixa", {
      file: this.loadedFilename,
      code: this.audio?.error?.code,
      message: this.audio?.error?.message
    });

    if (!this.audio || this.playlist.length === 0) {
      this.notify();
      return;
    }

    const n = this.playlist.length;
    if (n <= 1) {
      this.notify();
      return;
    }

    if (this.audioErrorSkips >= n) {
      this.audioErrorSkips = 0;
      this.notify();
      return;
    }

    this.audioErrorSkips++;
    this.cursor = (this.cursor + 1) % n;
    await this.loadAndPlay(true, true);
    this.schedulePreloadNext();
    this.persistNow();
    this.notify();
  }

  private currentTrack(): CampusMusicTrack | null {
    return this.playlist[this.cursor] ?? null;
  }

  private async loadAndPlay(fromTransition: boolean, skipFadeOut = false) {
    const track = this.currentTrack();
    if (!track || !this.audio) return;

    const targetVol = this.effectiveVolume();

    if (fromTransition && targetVol > 0 && this.loadedFilename && !skipFadeOut) {
      await this.fadeVolume(this.audio.volume, 0, FADE_OUT_MS);
    }

    this.audio.src = track.url;
    this.loadedFilename = track.filename;

    if (fromTransition) {
      try {
        this.audio.currentTime = 0;
      } catch {
        /* */
      }
    }

    try {
      await this.audio.play();
      if (targetVol > 0) {
        this.audio.volume = 0;
        await this.fadeVolume(0, targetVol, FADE_IN_MS);
      } else {
        this.audio.volume = 0;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "NotAllowedError") {
        return;
      }
      this.devWarn("play() falhou (aguardando error event ou nova tentativa)", e);
      return;
    }

    this.persistNow();
  }

  private async resumePlayback() {
    if (!this.campusActive || !this.audio || !this.playlist.length) return;
    const track = this.currentTrack();
    if (!track) return;

    const targetVol = this.effectiveVolume();

    if (this.loadedFilename !== track.filename) {
      this.audio.src = track.url;
      this.loadedFilename = track.filename;
      const persisted = readPersisted();
      if (persisted?.filename === track.filename && persisted.positionSec > 0.5) {
        try {
          this.audio.currentTime = persisted.positionSec;
        } catch {
          /* */
        }
      }
      try {
        this.audio.volume = 0;
        await this.audio.play();
        if (targetVol > 0) await this.fadeVolume(0, targetVol, FADE_IN_MS);
        else this.audio.volume = 0;
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "NotAllowedError")) {
          this.devWarn("resumePlayback: reprodução falhou após mudar faixa", e);
        }
      }
    } else {
      try {
        this.audio.volume = targetVol;
        await this.audio.play();
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "NotAllowedError")) {
          this.devWarn("resumePlayback: reprodução falhou ao retomar", e);
        }
      }
    }
    this.persistNow();
  }

  private schedulePreloadNext() {
    if (typeof window === "undefined") return;
    const next = this.peekNextTrack();
    if (!next) return;

    if (!this.preloadAudio) {
      this.preloadAudio = new Audio();
      this.preloadAudio.preload = "auto";
    }

    if (this.preloadTargetFilename === next.filename) return;
    this.preloadTargetFilename = next.filename;
    this.preloadAudio.src = next.url;
    try {
      void this.preloadAudio.load();
    } catch {
      /* */
    }
  }

  private peekNextTrack(): CampusMusicTrack | null {
    if (!this.playlist.length) return null;
    const i = (this.cursor + 1) % this.playlist.length;
    return this.playlist[i] ?? null;
  }

  private startPositionSaver() {
    this.stopPositionSaver();
    this.positionTimer = setInterval(() => this.persistNow(), POSITION_SAVE_INTERVAL_MS);
  }

  private stopPositionSaver() {
    if (this.positionTimer) {
      clearInterval(this.positionTimer);
      this.positionTimer = null;
    }
  }

  persistNow() {
    const track = this.currentTrack();
    writePersisted({
      v: 1,
      volume: this.volumeUser,
      muted: this.muted,
      filename: track?.filename ?? null,
      positionSec: this.audio?.currentTime ?? 0
    });
  }

  disposeUiHooks() {
    this.stopPositionSaver();
    this.cancelFade();
  }
}

export function getCampusMusicPlayer(): CampusMusicPlayer {
  return CampusMusicPlayer.get();
}
