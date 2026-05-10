/**
 * Sons de interface discretos (Web Audio API, sem ficheiros externos).
 * Desativar globalmente: `NEXT_PUBLIC_CAMPUS_UI_SOUND=0`.
 */

let audioCtx: AudioContext | null = null;

export function isCampusUiSoundDisabled(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_UI_SOUND === "0";
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined" || isCampusUiSoundDisabled()) return null;
  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx ||= new Ctor();
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function scheduleTone(
  ctx: AudioContext,
  startOffset: number,
  freq: number,
  duration: number,
  peakGain: number,
  type: OscillatorType = "sine"
) {
  const t0 = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(peakGain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0009, t0 + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Duplo tom ascendente — missão / conquista local. */
export function playCampusMissionCompleteChime(): void {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    scheduleTone(ctx, 0, 523.25, 0.11, 0.035);
    scheduleTone(ctx, 0.08, 659.25, 0.14, 0.028);
  } catch {
    /* autoplay / Safari */
  }
}

/** Tom único suave — recompensa XP/créditos. */
export function playCampusRewardToastChime(): void {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    scheduleTone(ctx, 0, 440, 0.12, 0.022);
    scheduleTone(ctx, 0.05, 554.37, 0.1, 0.016);
  } catch {
    /* noop */
  }
}
