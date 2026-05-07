"use client";

import type { PointerEventHandler } from "react";
import { clampToWalkZone, CAMPUS_WALK_RECTS } from "@/lib/campusWalkable";
import type { PctPos } from "@/stores/campusStore";

type Props = {
  onWalkTo: (pct: PctPos) => void;
};

/** Camada transparente: cliques no mapa movem o avatar apenas por calçadas / corredores (ver `campusWalkable`). Fica atrás dos hotspots. */
export function MapWalkLayer({ onWalkTo }: Props) {
  const showDebug =
    typeof process.env.NEXT_PUBLIC_CAMPUS_DEBUG_WALK !== "undefined" &&
    process.env.NEXT_PUBLIC_CAMPUS_DEBUG_WALK === "1";

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== 0) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = Math.min(99, Math.max(1, ((e.clientX - r.left) / r.width) * 100));
    const py = Math.min(99, Math.max(1, ((e.clientY - r.top) / r.height) * 100));
    const raw: PctPos = { x: px, y: py };
    onWalkTo(clampToWalkZone(raw));
  };

  return (
    <>
      <div
        role="presentation"
        className="absolute inset-0 z-[8] cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        aria-hidden
      />
      {showDebug
        ? CAMPUS_WALK_RECTS.map((rect, i) => (
            <div
              key={i}
              aria-hidden
              className="pointer-events-none absolute z-[9] rounded-sm border border-canna-400/35 bg-lime-400/10"
              style={{
                left: `${rect.minX}%`,
                top: `${rect.minY}%`,
                width: `${rect.maxX - rect.minX}%`,
                height: `${rect.maxY - rect.minY}%`
              }}
            />
          ))
        : null}
    </>
  );
}
