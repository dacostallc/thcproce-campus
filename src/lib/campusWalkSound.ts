import type { PctPos } from "@/stores/campusStore";

let audioCtx: AudioContext | null = null;
let lastCueAt = 0;

/** Sem asset externo — clique/passada muito subtil (imersão). Desativar com NEXT_PUBLIC_CAMPUS_WALK_SOUND=0 */
export function maybePlayCampusWalkSound(prev: PctPos, next: PctPos) {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_CAMPUS_WALK_SOUND === "0") return;

  const d = Math.hypot(next.x - prev.x, next.y - prev.y);
  if (d < 0.32) return;

  const now = performance.now();
  if (now - lastCueAt < 95) return;
  lastCueAt = now;

  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    audioCtx ||= new Ctor();
    const ctx = audioCtx;
    if (ctx.state === "suspended") void ctx.resume();

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const fil = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(190, ctx.currentTime + 0.06);

    fil.type = "lowpass";
    fil.frequency.setValueAtTime(2600, ctx.currentTime);
    fil.Q.setValueAtTime(0.6, ctx.currentTime);

    const vol = Math.min(0.05, 0.022 + d * 0.00095);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + 0.075);

    osc.connect(fil);
    fil.connect(g);
    g.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.09);
  } catch {
    /* Safari / políticas de autoplay ou contexto indisponível */
  }
}
