"use client";

import type { PointerEventHandler } from "react";
import type { PctPos } from "@/stores/campusStore";

type Props = {
  onWalkTo: (pct: PctPos) => void;
};

/** Camada transparente: cliques no mapa movem o avatar. Fica atrás dos hotspots (z-index menor). */
export function MapWalkLayer({ onWalkTo }: Props) {
  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== 0) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    onWalkTo({
      x: Math.min(99, Math.max(1, px)),
      y: Math.min(99, Math.max(1, py))
    });
  };

  return (
    <div
      role="presentation"
      className="absolute inset-0 z-[8] cursor-crosshair touch-none"
      onPointerDown={handlePointerDown}
      aria-hidden
    />
  );
}
