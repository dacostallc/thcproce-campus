import type { CampusMapZoneLabel } from "@/data/campusMicroLessonContext";

/**
 * Âncoras discretas (% do palco do mapa) para agrupar pontos por zona pedagógica.
 * Valores aproximados — só orientação visual, não geolocalização real.
 */
export const CAMPUS_SOCIAL_ZONE_ANCHOR_PCT: Record<
  CampusMapZoneLabel,
  { xPct: number; yPct: number }
> = {
  fundamentos: { xPct: 52, yPct: 74 },
  greenhouse: { xPct: 30, yPct: 26 },
  outdoor_cultivo: { xPct: 82, yPct: 28 },
  indoor_cultivo: { xPct: 76, yPct: 52 },
  viveiro_genetica: { xPct: 22, yPct: 48 },
  laboratorio_extracao: { xPct: 42, yPct: 44 },
  laboratorio_solventless: { xPct: 38, yPct: 58 },
  escola_culinaria: { xPct: 58, yPct: 34 },
  instituto_medicinal: { xPct: 64, yPct: 48 },
  biblioteca_ciencia_legal: { xPct: 48, yPct: 58 },
  comunidade_social: { xPct: 68, yPct: 66 },
  arena_eventos: { xPct: 88, yPct: 62 },
  cinema: { xPct: 56, yPct: 22 },
  loja_campus: { xPct: 62, yPct: 70 }
};

/** Espalha vários colegas na mesma zona (pixels virtuais pequenos em %). */
export function campusSocialPeerDotOffset(seed: string): { dx: number; dy: number } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const dx = ((h % 7) - 3) * 0.45;
  const dy = (((h >> 4) % 7) - 3) * 0.45;
  return { dx, dy };
}
