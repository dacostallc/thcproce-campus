"use client";

import type { PointerEventHandler } from "react";
import type { PctPos } from "@/stores/campusStore";
import { useCampusStore } from "@/stores/campusStore";
import {
  getNearestWalkablePoint,
  isPointInWalkableZone
} from "@/data/walkableZones";
import { resolveCampusClickTarget } from "@/lib/resolveCampusClickTarget";

type Props = {
  onWalkTo: (pct: PctPos) => void;
};

/**
 * Camada transparente: cliques na calçada movem o avatar usando `resolveCampusClickTarget`.
 * Cliques em prédio são tratados pela camada de zonas (acima).
 */
export function MapWalkLayer({ onWalkTo }: Props) {
  const cineOpen = useCampusStore((s) => s.isCineOpen);

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (cineOpen) return;
    if (e.button !== 0) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = Math.min(99, Math.max(1, ((e.clientX - r.left) / r.width) * 100));
    const py = Math.min(99, Math.max(1, ((e.clientY - r.top) / r.height) * 100));

    const hit = resolveCampusClickTarget(px, py);
    if (hit.type === "none") return;
    if (hit.type === "zone") return;

    const dest = isPointInWalkableZone(hit.destination.x, hit.destination.y)
      ? hit.destination
      : getNearestWalkablePoint(hit.destination.x, hit.destination.y);
    onWalkTo(dest);
  };

  return (
    <div
      role="presentation"
      className={`absolute inset-0 z-[8] touch-none ${
        cineOpen ? "cursor-default" : "cursor-crosshair"
      }`}
      onPointerDown={handlePointerDown}
      aria-hidden
    />
  );
}
