"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { getCampusHowlerEngine } from "@/lib/audio/howlerPlayer";
import {
  HUD_AMBIENT_DEFAULT_VOLUME,
  hudAmbientPlaylistFromApiRows,
  readHudAmbientAutoplayIntent,
  readHudAmbientMuted,
  readHudAmbientRepeat,
  readHudAmbientShuffle,
  readHudAmbientTrackIndex,
  readHudAmbientVolume01,
  writeHudAmbientAutoplayIntent,
  writeHudAmbientMuted,
  writeHudAmbientRepeat,
  writeHudAmbientShuffle,
  writeHudAmbientTrackIndex,
  writeHudAmbientVolume01,
  type HudAmbientRepeatMode,
  type HudAmbientResolvedTrack,
  type HudAmbientTrackRow
} from "@/lib/campusHudAmbientMusic";

function coerceRows(raw: unknown): HudAmbientTrackRow[] {
  if (!Array.isArray(raw)) return [];
  const out: HudAmbientTrackRow[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const category = o.category;
    const filename = o.filename;
    const url = o.url;
    if (
      (category === "ambience" ||
        category === "radio" ||
        category === "cinema" ||
        category === "legacy") &&
      typeof filename === "string" &&
      typeof url === "string"
    ) {
      out.push({ category, filename, url });
    }
  }
  return out;
}

function maxAmbientErrorSkips(trackCount: number): number {
  return Math.max(6, trackCount * 3 + 2);
}

function computeNaturalNext(
  i: number,
  len: number,
  repeat: HudAmbientRepeatMode,
  shuffle: boolean
): number | null {
  if (len <= 0) return null;
  if (len === 1) return i;
  if (shuffle) {
    let j = Math.floor(Math.random() * (len - 1));
    if (j >= i) j += 1;
    return j;
  }
  if (repeat === "off" && i >= len - 1) return null;
  return (i + 1) % len;
}

export type CampusAudioContextValue = {
  tracks: HudAmbientResolvedTrack[];
  catalogResolved: boolean;
  trackIndex: number;
  playing: boolean;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeatMode: HudAmbientRepeatMode;
  current: HudAmbientResolvedTrack | null;
  togglePlay: () => void;
  goNext: () => void;
  goPrev: () => void;
  toggleMute: () => void;
  setVolume01: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
};

const CampusAudioContext = createContext<CampusAudioContextValue | null>(null);

export function useCampusAudio(): CampusAudioContextValue {
  const ctx = useContext(CampusAudioContext);
  if (!ctx) {
    throw new Error("useCampusAudio must be used within CampusAudioProvider");
  }
  return ctx;
}

export function CampusAudioProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<HudAmbientResolvedTrack[]>([]);
  const [catalogResolved, setCatalogResolved] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(HUD_AMBIENT_DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<HudAmbientRepeatMode>("all");

  const resumeAttemptedRef = useRef(false);
  const ambientPrefsHydratedRef = useRef(false);
  const prevSrcRef = useRef<string | null>(null);
  const errorSkipRef = useRef(0);
  /** Evita avançar várias faixas em sequência por erros HTML5/autoplay espúrios */
  const lastSkipAdvanceMsRef = useRef(0);

  const tracksRef = useRef(tracks);
  const trackIndexRef = useRef(trackIndex);
  const repeatRef = useRef(repeatMode);
  const shuffleRef = useRef(shuffle);
  const mutedRef = useRef(muted);
  const volumeRef = useRef(volume);

  tracksRef.current = tracks;
  trackIndexRef.current = trackIndex;
  repeatRef.current = repeatMode;
  shuffleRef.current = shuffle;
  mutedRef.current = muted;
  volumeRef.current = volume;

  useEffect(() => {
    const ac = new AbortController();
    void (async () => {
      try {
        const res = await fetch(`/api/campus/audio-tracks?_=${Date.now()}`, {
          signal: ac.signal,
          cache: "no-store",
          headers: { Pragma: "no-cache" }
        });
        const json = (await res.json()) as { tracks?: unknown };
        const candidates = hudAmbientPlaylistFromApiRows(coerceRows(json?.tracks));
        if (ac.signal.aborted) return;
        setTracks(candidates);
        if (candidates.length > 0) {
          ambientPrefsHydratedRef.current = true;
          setVolume(readHudAmbientVolume01());
          setMuted(readHudAmbientMuted());
          setShuffle(readHudAmbientShuffle());
          setRepeatMode(readHudAmbientRepeat());
          setTrackIndex(readHudAmbientTrackIndex(candidates.length));
        }
      } catch {
        if (!ac.signal.aborted) setTracks([]);
      } finally {
        if (!ac.signal.aborted) setCatalogResolved(true);
      }
    })();
    return () => ac.abort();
  }, []);

  useEffect(() => {
    if (!catalogResolved) return;
    if (tracks.length > 0) return;
    ambientPrefsHydratedRef.current = false;
  }, [catalogResolved, tracks.length]);

  useEffect(() => {
    if (!catalogResolved || tracks.length > 0) return;
    resumeAttemptedRef.current = false;
    prevSrcRef.current = null;
    errorSkipRef.current = 0;
    writeHudAmbientAutoplayIntent(false);
    setPlaying(false);
    getCampusHowlerEngine().clearPlayback();
  }, [catalogResolved, tracks.length]);

  const advanceAfterNaturalEnd = useCallback(() => {
    const list = tracksRef.current;
    const len = list.length;
    const i = trackIndexRef.current;
    if (len <= 0) return;

    if (len === 1) {
      getCampusHowlerEngine().restartCurrent(mutedRef.current ? 0 : volumeRef.current);
      return;
    }

    const next = computeNaturalNext(i, len, repeatRef.current, shuffleRef.current);
    if (next === null) {
      setPlaying(false);
      writeHudAmbientAutoplayIntent(false);
      return;
    }
    errorSkipRef.current = 0;
    setTrackIndex(next);
    writeHudAmbientTrackIndex(next);
  }, []);

  const skipOnLoadError = useCallback(() => {
    const list = tracksRef.current;
    const cap = maxAmbientErrorSkips(list.length);
    errorSkipRef.current += 1;
    if (errorSkipRef.current > cap || list.length === 0) {
      setPlaying(false);
      writeHudAmbientAutoplayIntent(false);
      errorSkipRef.current = 0;
      return;
    }
    if (!readHudAmbientAutoplayIntent()) {
      setPlaying(false);
      return;
    }
    const now = Date.now();
    if (now - lastSkipAdvanceMsRef.current < 3200) {
      errorSkipRef.current = Math.max(0, errorSkipRef.current - 1);
      return;
    }
    lastSkipAdvanceMsRef.current = now;
    setTrackIndex((idx) => {
      const len = list.length;
      if (len <= 0) return idx;
      const next = (idx + 1) % len;
      writeHudAmbientTrackIndex(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const engine = getCampusHowlerEngine();
    engine.setHandlers({
      onNaturalEnd: () => {
        if (repeatRef.current === "one") {
          engine.restartCurrent(mutedRef.current ? 0 : volumeRef.current);
          return;
        }
        advanceAfterNaturalEnd();
      },
      onLoadOrPlayError: () => {
        skipOnLoadError();
      }
    });
  }, [advanceAfterNaturalEnd, skipOnLoadError]);

  const current = tracks[trackIndex] ?? null;
  const currentSrc = current?.src ?? "";

  useEffect(() => {
    if (!catalogResolved || tracks.length === 0 || !currentSrc) return;
    const urlChanged = prevSrcRef.current !== currentSrc;
    prevSrcRef.current = currentSrc;
    getCampusHowlerEngine().sync({
      src: currentSrc,
      playing,
      volume01: muted ? 0 : volume,
      urlChanged
    });
  }, [catalogResolved, tracks.length, currentSrc, playing, muted, volume]);

  useEffect(() => {
    if (!catalogResolved || tracks.length === 0) return;
    writeHudAmbientTrackIndex(trackIndex);
  }, [catalogResolved, tracks.length, trackIndex]);

  useEffect(() => {
    if (!catalogResolved || tracks.length === 0) return;
    if (!readHudAmbientAutoplayIntent()) return;
    if (resumeAttemptedRef.current) return;
    resumeAttemptedRef.current = true;
    const id = window.requestAnimationFrame(() => {
      setPlaying(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, [catalogResolved, tracks.length]);

  const togglePlay = useCallback(() => {
    if (tracksRef.current.length === 0) return;
    setPlaying((p) => {
      if (p) {
        writeHudAmbientAutoplayIntent(false);
        return false;
      }
      writeHudAmbientAutoplayIntent(true);
      return true;
    });
  }, []);

  const goPrev = useCallback(() => {
    const len = tracksRef.current.length;
    if (len <= 0) return;
    errorSkipRef.current = 0;
    setTrackIndex((i) => {
      const next = (i - 1 + len) % len;
      writeHudAmbientTrackIndex(next);
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    const len = tracksRef.current.length;
    if (len <= 0) return;
    errorSkipRef.current = 0;
    setTrackIndex((i) => {
      const next = (i + 1) % len;
      writeHudAmbientTrackIndex(next);
      return next;
    });
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      writeHudAmbientMuted(next);
      return next;
    });
  }, []);

  const setVolume01 = useCallback((v: number) => {
    const next = Math.min(1, Math.max(0, v));
    setVolume(next);
    writeHudAmbientVolume01(next);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((s) => {
      const next = !s;
      writeHudAmbientShuffle(next);
      return next;
    });
  }, []);

  const cycleRepeat = useCallback(() => {
    const order: HudAmbientRepeatMode[] = ["off", "all", "one"];
    setRepeatMode((r) => {
      const idx = order.indexOf(r);
      const next = order[(idx + 1) % order.length] ?? "all";
      writeHudAmbientRepeat(next);
      return next;
    });
  }, []);

  const value = useMemo<CampusAudioContextValue>(
    () => ({
      tracks,
      catalogResolved,
      trackIndex,
      playing,
      volume,
      muted,
      shuffle,
      repeatMode,
      current,
      togglePlay,
      goNext,
      goPrev,
      toggleMute,
      setVolume01,
      toggleShuffle,
      cycleRepeat
    }),
    [
      tracks,
      catalogResolved,
      trackIndex,
      playing,
      volume,
      muted,
      shuffle,
      repeatMode,
      current,
      togglePlay,
      goNext,
      goPrev,
      toggleMute,
      setVolume01,
      toggleShuffle,
      cycleRepeat
    ]
  );

  return <CampusAudioContext.Provider value={value}>{children}</CampusAudioContext.Provider>;
}
