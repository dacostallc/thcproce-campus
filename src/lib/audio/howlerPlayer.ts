import { Howl } from "howler";

/** Fade ao trocar faixa ou iniciar reprodução */
export const CAMPUS_HOWL_FADE_MS = 420;
/** Fade rápido ao sair de uma faixa */
export const CAMPUS_HOWL_FADE_OUT_MS = 260;

export type CampusHowlerHandlers = {
  onNaturalEnd: () => void;
  onLoadOrPlayError: () => void;
};

function toAbsUrl(src: string): string {
  if (typeof window === "undefined") return src;
  try {
    return new URL(src, window.location.origin).href;
  } catch {
    return src;
  }
}

/** Chave estável para saber se a faixa mudou — só pathname+search evita remount por diferença cosmética no href. */
function audioUrlKey(src: string): string {
  try {
    const u = new URL(src, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return `${u.pathname}${u.search}`;
  } catch {
    return src;
  }
}

/**
 * Motor Howler singleton para o campus — HTML5 para ficheiros grandes e mobile.
 */
export class CampusHowlerEngine {
  private howl: Howl | null = null;
  private loadedAbsUrl: string | null = null;
  /** Igual a `audioUrlKey(loadedAbsUrl)` — comparação principal para evitar Howl novo sem mudança real de faixa */
  private loadedUrlKey: string | null = null;
  /** Relógio de parede: ignorar `end` espúrio no início/meio (bugs HTML5 / buffer). */
  private playStartedAtMs = 0;
  private lastKnownDuration = 0;
  private handlers: CampusHowlerHandlers = {
    onNaturalEnd: () => {},
    onLoadOrPlayError: () => {}
  };
  private destroyed = false;
  /** Evita montar Howl obsoleto após sync rápidos */
  private syncGen = 0;
  /** Limita recuperações após `end` espúrio repetido (HTML5) */
  private endRecoveryAttempts = 0;

  setHandlers(next: Partial<CampusHowlerHandlers>): void {
    this.handlers = { ...this.handlers, ...next };
  }

  destroy(): void {
    this.destroyed = true;
    this.syncGen++;
    this.unloadHowl();
  }

  private unloadHowl(): void {
    if (!this.howl) {
      this.loadedAbsUrl = null;
      this.loadedUrlKey = null;
      return;
    }
    try {
      this.howl.stop();
      this.howl.unload();
    } catch {
      /* noop */
    }
    this.howl = null;
    this.loadedAbsUrl = null;
    this.loadedUrlKey = null;
  }

  /** Para e liberta o decoder sem destruir o singleton (playlist vazia / logout de áudio). */
  clearPlayback(): void {
    if (this.destroyed) return;
    this.syncGen++;
    this.fadeOutAndUnload(() => {});
  }

  /** Repete a faixa actual (modo repeat-one). */
  restartCurrent(volume01: number): void {
    if (this.destroyed || !this.howl) return;
    const h = this.howl;
    try {
      h.seek(0);
    } catch {
      /* noop */
    }
    this.playStartedAtMs = Date.now();
    this.endRecoveryAttempts = 0;
    const id = h.play();
    if (id !== undefined && volume01 > 0.001) {
      h.volume(0, id);
      h.fade(0, volume01, CAMPUS_HOWL_FADE_MS, id);
    } else if (id !== undefined) {
      h.volume(volume01, id);
    }
  }

  private fadeOutAndUnload(done: () => void): void {
    if (!this.howl || !this.howl.playing()) {
      this.unloadHowl();
      done();
      return;
    }
    const h = this.howl;
    const from = h.volume();
    const ms = CAMPUS_HOWL_FADE_OUT_MS;
    if (from <= 0.01) {
      this.unloadHowl();
      done();
      return;
    }
    try {
      h.fade(from, 0, ms);
    } catch {
      this.unloadHowl();
      done();
      return;
    }
    window.setTimeout(() => {
      if (this.destroyed) return;
      this.unloadHowl();
      done();
    }, ms + 60);
  }

  private mountHowl(absUrl: string, playing: boolean, volume01: number, gen: number): void {
    if (this.destroyed || gen !== this.syncGen) return;
    this.endRecoveryAttempts = 0;
    this.loadedAbsUrl = absUrl;
    this.loadedUrlKey = audioUrlKey(absUrl);
    const h = new Howl({
      src: [absUrl],
      html5: true,
      /** Carregar o ficheiro completo reduz cortes e `ended` prematuro em fluxos HTML5. */
      preload: true,
      volume: playing ? 0 : volume01,
      onend: () => {
        if (this.destroyed) return;
        const hh = this.howl;
        if (!hh) return;

        let dur = this.lastKnownDuration;
        try {
          const d = hh.duration();
          if (Number.isFinite(d) && d > 0) dur = d;
        } catch {
          /* noop */
        }

        let seekPos = 0;
        try {
          const s = hh.seek();
          if (typeof s === "number" && Number.isFinite(s)) seekPos = s;
        } catch {
          /* noop */
        }

        const elapsedMs = Date.now() - this.playStartedAtMs;
        const durMs = dur > 0 ? dur * 1000 : 0;

        /** `ended` no meio da faixa ou muito cedo vs duração → ignorar uma vez e tentar continuar */
        const suspiciousMid =
          dur > 8 &&
          seekPos > 2 &&
          seekPos < dur - 2.5;
        const suspiciousEarly =
          dur > 12 && durMs > 0 && elapsedMs > 0 && elapsedMs < durMs * 0.55;

        if (suspiciousMid || suspiciousEarly) {
          if (this.endRecoveryAttempts >= 6) {
            this.endRecoveryAttempts = 0;
            this.handlers.onNaturalEnd();
            return;
          }
          this.endRecoveryAttempts += 1;
          try {
            hh.play();
          } catch {
            /* noop */
          }
          return;
        }

        this.endRecoveryAttempts = 0;
        this.handlers.onNaturalEnd();
      },
      onloaderror: () => {
        if (this.destroyed) return;
        this.handlers.onLoadOrPlayError();
      },
      onplayerror: () => {
        if (this.destroyed) return;
        this.handlers.onLoadOrPlayError();
      }
    });
    this.howl = h;

    h.once("load", () => {
      if (this.destroyed || gen !== this.syncGen) return;
      try {
        const d = h.duration();
        if (Number.isFinite(d) && d > 0) this.lastKnownDuration = d;
      } catch {
        /* noop */
      }
      if (!playing) {
        h.volume(volume01);
        return;
      }
      this.playStartedAtMs = Date.now();
      const id = h.play();
      if (id !== undefined && volume01 > 0.001) {
        h.volume(0, id);
        h.fade(0, volume01, CAMPUS_HOWL_FADE_MS, id);
      } else if (id !== undefined) {
        h.volume(volume01, id);
      }
    });
  }

  /**
   * Mantém o Howler alinhado com o estado React (src / play / volume).
   * `urlChanged` deve vir do pai (comparação com o src anterior).
   */
  sync(opts: { src: string; playing: boolean; volume01: number; urlChanged: boolean }): void {
    if (this.destroyed) return;
    const absUrl = toAbsUrl(opts.src);
    const nextKey = audioUrlKey(absUrl);
    const { playing, volume01, urlChanged } = opts;

    const needsNewHowl =
      urlChanged || !this.howl || !this.loadedUrlKey || this.loadedUrlKey !== nextKey;

    if (needsNewHowl) {
      const gen = ++this.syncGen;
      this.fadeOutAndUnload(() => {
        if (this.destroyed || gen !== this.syncGen) return;
        this.mountHowl(absUrl, playing, volume01, gen);
      });
      return;
    }

    const h = this.howl;
    if (!h) return;

    h.volume(volume01);

    if (playing && !h.playing()) {
      this.playStartedAtMs = Date.now();
      const id = h.play();
      if (id !== undefined && volume01 > 0.001) {
        h.volume(0, id);
        h.fade(0, volume01, CAMPUS_HOWL_FADE_MS, id);
      } else if (id !== undefined) {
        h.volume(volume01, id);
      }
    } else if (!playing && h.playing()) {
      h.pause();
    }
  }
}

let campusHowlerSingleton: CampusHowlerEngine | null = null;

export function getCampusHowlerEngine(): CampusHowlerEngine {
  if (!campusHowlerSingleton) {
    campusHowlerSingleton = new CampusHowlerEngine();
  }
  return campusHowlerSingleton;
}
