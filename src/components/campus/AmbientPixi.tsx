"use client";

import { useEffect, useRef } from "react";

type Phase = "day" | "night";

/**
 * Partículas leves na camada Pixi (WebGL). Sem `@pixi/react` — apenas React + pixi.js.
 * Complementa o CSS AmbientLife (drones externos).
 */
export function AmbientPixi({ phase }: { phase: Phase }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    const wrap = host.current;
    if (!wrap) return;

    void import("pixi.js").then(async ({ Application, Container, Graphics }) => {
      if (!alive || !wrap) return;

      const app = new Application();
      await app.init({
        width: wrap.clientWidth || 640,
        height: wrap.clientHeight || 640,
        backgroundAlpha: 0,
        antialias: false,
        resolution: typeof window !== "undefined" ? window.devicePixelRatio : 1,
        autoDensity: true
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
      const w = app.screen.width;
      const h = app.screen.height;
      const n = 18;
      for (let i = 0; i < n; i++) {
        const g = new Graphics();
        const r = 1 + Math.random() * 2.5;
        g.circle(0, 0, r).fill({ color: tint, alpha: 0.45 + Math.random() * 0.4 });
        g.x = Math.random() * w;
        g.y = Math.random() * h;
        root.addChild(g);
        dots.push(g);
      }

      let t = 0;
      const tick = (): void => {
        t += 1;
        for (const g of dots) {
          g.y -= 0.25 + Math.sin(t * 0.01 + g.x) * 0.08;
          g.x += 0.06 * Math.cos(t * 0.015 + g.y * 0.02);
          if (g.y < -4) {
            g.y = h + 4;
            g.x = Math.random() * w;
          }
          if (g.x < -4 || g.x > w + 4) g.x = ((g.x + w * 2) % w + w) % w;
        }
      };

      app.ticker.add(tick);

      const ro = new ResizeObserver(() => {
        try {
          const cw = wrap.clientWidth;
          const ch = wrap.clientHeight;
          if (cw && ch && app.renderer) {
            app.renderer.resize(cw, ch);
          }
        } catch {
          /* noop */
        }
      });
      ro.observe(wrap);

      return () => {
        alive = false;
        ro.disconnect();
        app.destroy(true, { children: true });
      };
    }).catch(() => {
      /* Pixi opcional — sem crash */
    });

    return () => {
      alive = false;
      if (host.current)
        host.current.replaceChildren();
    };
  }, [phase]);

  return (
    <div
      ref={host}
      className="pointer-events-none absolute inset-0 z-[6] opacity-50 md:opacity-65"
      aria-hidden
    />
  );
}
