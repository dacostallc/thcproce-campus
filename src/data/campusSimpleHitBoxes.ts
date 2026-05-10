import { areas } from "@/data/courses";

/** Caixa delimitadora em % (0–100), espaço do mapa campus. */
export type CampusSimpleHitBox = {
  areaId: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

/** Meia-largura / meia-altura em % — áreas “grandes” em torno do hotspot. */
const HALF_W = 11;
const HALF_H = 10;

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n));
}

/** Lista estável: uma caixa por área do catálogo de cursos. */
export const CAMPUS_SIMPLE_HIT_BOXES: CampusSimpleHitBox[] = areas.map((a) => {
  const { x, y } = a.position;
  return {
    areaId: a.id,
    minX: clampPct(x - HALF_W),
    maxX: clampPct(x + HALF_W),
    minY: clampPct(y - HALF_H),
    maxY: clampPct(y + HALF_H)
  };
});

/**
 * Última área na lista que contém o ponto (prioridade em sobreposições).
 */
export function findSimpleHitAreaId(px: number, py: number): string | null {
  for (let i = CAMPUS_SIMPLE_HIT_BOXES.length - 1; i >= 0; i--) {
    const b = CAMPUS_SIMPLE_HIT_BOXES[i]!;
    if (px >= b.minX && px <= b.maxX && py >= b.minY && py <= b.maxY) {
      return b.areaId;
    }
  }
  return null;
}
