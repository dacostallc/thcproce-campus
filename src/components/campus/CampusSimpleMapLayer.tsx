"use client";

import type { PointerEventHandler } from "react";
import { areas, type Area } from "@/data/courses";
import { findSimpleHitAreaId } from "@/data/campusSimpleHitBoxes";
import type { PctPos } from "@/stores/campusStore";
import { useCampusStore } from "@/stores/campusStore";
import { useCampusHudStore } from "@/stores/campusHudStore";

type Props = {
  onSelectArea: (area: Area) => void;
  setPlayerLoose: (p: PctPos) => void;
};

/**
 * Modo simples: mapa sem polígonos — clique abre curso se cair numa hit-box grande
 * (invisível); caso contrário move o avatar livremente no mapa.
 */
export function CampusSimpleMapLayer({ onSelectArea, setPlayerLoose }: Props) {
  const cineOpen = useCampusStore((s) => s.isCineOpen);
  const mapInteractionsSuppressed = cineOpen;

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (mapInteractionsSuppressed) return;
    if (e.button !== 0) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = Math.min(99, Math.max(1, ((e.clientX - r.left) / r.width) * 100));
    const py = Math.min(99, Math.max(1, ((e.clientY - r.top) / r.height) * 100));

    const hitId = findSimpleHitAreaId(px, py);
    if (hitId) {
      const area = areas.find((a) => a.id === hitId);
      if (area) {
        setPlayerLoose(area.position);
        onSelectArea(area);
      }
      return;
    }
    setPlayerLoose({ x: px, y: py });
  };

  return (
    <div
      role="presentation"
      className={`absolute inset-0 touch-none ${
        mapInteractionsSuppressed ? "cursor-default" : "cursor-crosshair"
      }`}
      onPointerDown={handlePointerDown}
      aria-hidden
    />
  );
}
