"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "day" | "night";

function webglLikelySupported(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    const gl =
      c.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ??
      c.getContext("webgl", { failIfMajorPerformanceCaveat: false }) ??
      (c.getContext("experimental-webgl") as WebGLRenderingContext | null);
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Partículas leves na camada Pixi (WebGL). Sem `@pixi/react` — apenas React + pixi.js.
 * Complementa o CSS AmbientLife (drones externos).
 */
export function AmbientPixi({ phase }: { phase: Phase }) {
  const host = useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = useState(() => !webglLikelySupported());

  useEffect(() => {
    if (disabled) return;

    let alive = true;
    const wrap = host.current;
    if (!wrap) return;

    let teardown: (() => void) | undefined;

    void (async () => {
      try {
        const { Application, Container, Graphics } = await import("pixi.js");
        if (!alive || !wrap) return;

        const app = new Application();
        await app.init({
          width: wrap.clientWidth || 640,
          height: wrap.clientHeight || 640,
          backgroundAlpha: 0,
          antialias: false,
          resolution: typeof window !== "undefined" ? window.devicePixelRatio : 1,
          autoDensity: true,
          preference: "webgl"
        });

        if (!alive) {
          app.destroy(true, { children: true });
          return;
        }

        wrap.appendChild(app.canvas as HTMLCanvasElement);
        app.canvas.style.width = "100%";
        app.canvas.style.height = "100%";
        app.canvas.style.display = "block";

        const root = new Container();
        app.stage.addChild(root);

        const tint = phase === "day" ? 0xfbbf24 : 0x86efac;
        const dots: InstanceType<typeof Graphics>[] = [];
        const pad = 10;
        const n = 4;
        const randIn = (mw: number, mh: number): { x: number; y: number } => ({
          x: pad + Math.random() * Math.max(1, mw - pad * 2),
          y: pad + Math.random() * Math.max(1, mh - pad * 2)
        });
        const spreadDots = (mw: number, mh: number): void => {
          for (const g of dots) {
            const p = randIn(mw, mh);
            g.x = p.x;
            g.y = p.y;
          }
        };

        let w0 = app.screen.width;
        let h0 = app.screen.height;
        for (let i = 0; i < n; i++) {
          const g = new Graphics();
          const r = 0.65 + Math.random() * 1.15;
          g.circle(0, 0, r).fill({ color: tint, alpha: 0.18 + Math.random() * 0.14 });
          const p = randIn(w0, h0);
          g.x = p.x;
          g.y = p.y;
          root.addChild(g);
          dots.push(g);
        }

        let t = 0;
        const tick = (): void => {
          const w = app.screen.width;
          const h = app.screen.height;
          t += 1;
          for (const g of dots) {
            g.y -= 0.09 + Math.sin(t * 0.008 + g.x) * 0.035;
            g.x += 0.026 * Math.cos(t * 0.012 + g.y * 0.018);
            if (g.y < pad) {
              const p = randIn(w, h);
              g.y = p.y;
              g.x = p.x;
            }
            if (g.x < pad || g.x > w - pad) {
              const p = randIn(w, h);
              g.x = p.x;
              g.y = p.y;
            }
            g.x = Math.min(w - pad, Math.max(pad, g.x));
            g.y = Math.min(h - pad, Math.max(pad, g.y));
          }
        };

        app.ticker.add(tick);

        const ro = new ResizeObserver(() => {
          try {
            const cw = wrap.clientWidth;
            const ch = wrap.clientHeight;
            if (cw && ch && app.renderer) {
              app.renderer.resize(cw, ch);
              spreadDots(app.screen.width, app.screen.height);
            }
          } catch {
            /* noop */
          }
        });
        ro.observe(wrap);

        teardown = () => {
          ro.disconnect();
          app.ticker.remove(tick);
          app.destroy(true, { children: true });
        };
      } catch (e) {
        console.warn("[AmbientPixi] WebGL/pixi indisponível — modo só CSS.", e);
        if (alive) setDisabled(true);
      }
    })();

    return () => {
      alive = false;
      teardown?.();
      if (host.current) host.current.replaceChildren();
    };
  }, [phase, disabled]);

  if (disabled) return null;

  return (
    <div
      ref={host}
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.22] md:opacity-[0.28]"
      aria-hidden
    />
  );
}
