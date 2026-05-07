let audioCtx: AudioContext | null = null;
let lastAt = 0;

/** Sino suave para aviso do professor (sem ficheiro externo). */
export function playCampusAdminBroadcastChime() {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_CAMPUS_BROADCAST_SOUND === "0") return;

  const now = performance.now();
  if (now - lastAt < 400) return;
  lastAt = now;

  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    audioCtx ||= new Ctor();
    const ctx = audioCtx;
    if (ctx.state === "suspended") void ctx.resume();

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.012);
    master.gain.exponentialRampToValueAtTime(0.0006, ctx.currentTime + 0.38);
    master.connect(ctx.destination);

    const playTone = (freq: number, t0: number, dur: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.55, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.02, t0 + dur);
      osc.connect(g);
      g.connect(master);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    };

    const t0 = ctx.currentTime + 0.01;
    playTone(880, t0, 0.11);
    playTone(1174, t0 + 0.09, 0.14);
  } catch {
    /* autoplay / Safari */
  }
}
