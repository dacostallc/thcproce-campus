"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor estilo drone minimalista; suavização via rAF (actualiza só transform, sem re-render).
 * Ative com `NEXT_PUBLIC_CUSTOM_CURSOR=true`.
 */
export function CampusMapCustomCursor({ active }: { active: boolean }) {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;

    const el = dotRef.current;

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    let rafId = 0;
    const loop = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      c.x += (t.x - c.x) * 0.22;
      c.y += (t.y - c.y) * 0.22;
      if (el) {
        el.style.transform = `translate3d(${c.x - 16}px, ${c.y - 16}px, 0)`;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[50] h-8 w-8 will-change-transform"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
      aria-hidden
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        className="opacity-95 drop-shadow-[0_0_6px_rgba(74,222,128,0.45)]"
      >
        <circle
          cx="16"
          cy="16"
          r="9"
          fill="none"
          stroke="#4ade80"
          strokeWidth="1.2"
          opacity="0.9"
        />
        <circle cx="16" cy="16" r="2.2" fill="#facc15" opacity="0.92" />
        <path
          d="M16 5v3M16 24v3M5 16h3M24 16h3"
          stroke="#4ade80"
          strokeWidth="1"
          opacity="0.45"
        />
      </svg>
    </div>
  );
}
