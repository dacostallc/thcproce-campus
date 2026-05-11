import type { CampusMapInteractiveArea } from "@/lib/campusMapAreasInteractive.types";

const IMG_W = 1536;
const IMG_H = 1024;

/** Spawn praça / entrada visível no mapa simples. */
export const CAMPUS_LIVE_PRESENCE_DEFAULT_PCT = { xPct: 42, yPct: 82 } as const;

/**
 * Centro aproximado do hotspot em % do mapa (coords literais sobre arte 1536×1024).
 */
export function interactiveHitAnchorPct(hit: CampusMapInteractiveArea): { xPct: number; yPct: number } {
  const raw = hit.coords.split(",").map((t) => Number(t.trim()));
  const nums = raw.filter((n) => Number.isFinite(n));
  if (hit.shape === "circle" && nums.length >= 2) {
    return {
      xPct: (nums[0]! / IMG_W) * 100,
      yPct: (nums[1]! / IMG_H) * 100
    };
  }
  if (nums.length >= 4 && nums.length % 2 === 0) {
    let sx = 0;
    let sy = 0;
    let n = 0;
    for (let i = 0; i + 1 < nums.length; i += 2) {
      sx += nums[i]!;
      sy += nums[i + 1]!;
      n++;
    }
    if (n > 0) {
      return {
        xPct: (sx / n / IMG_W) * 100,
        yPct: (sy / n / IMG_H) * 100
      };
    }
  }
  return { ...CAMPUS_LIVE_PRESENCE_DEFAULT_PCT };
}

export function clampPresencePct(xPct: number, yPct: number): { xPct: number; yPct: number } {
  const cx = Number.isFinite(xPct) ? xPct : CAMPUS_LIVE_PRESENCE_DEFAULT_PCT.xPct;
  const cy = Number.isFinite(yPct) ? yPct : CAMPUS_LIVE_PRESENCE_DEFAULT_PCT.yPct;
  return {
    xPct: Math.min(99, Math.max(1, cx)),
    yPct: Math.min(99, Math.max(1, cy))
  };
}

/** Puxa ligeiramente para o hotspot quando o painel está aberto — sensação de «estar na área». */
export function blendPlayerTowardHotspot(
  player: { x: number; y: number },
  hotspot: CampusMapInteractiveArea | null
): { xPct: number; yPct: number } {
  const base = clampPresencePct(player.x, player.y);
  if (!hotspot) return base;
  const a = interactiveHitAnchorPct(hotspot);
  return clampPresencePct(base.xPct * 0.42 + a.xPct * 0.58, base.yPct * 0.42 + a.yPct * 0.58);
}

/** Espalha bolhas quando várias pessoas partilham a mesma zona (determinístico). */
export function jitterPresencePctByVisitorId(
  visitorId: string,
  xPct: number,
  yPct: number
): { xPct: number; yPct: number } {
  let h = 2166136261;
  for (let i = 0; i < visitorId.length; i++) {
    h ^= visitorId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const dx = ((h >>> 0) % 9) - 4;
  const dy = ((Math.imul(h, 31) >>> 0) % 9) - 4;
  return clampPresencePct(xPct + dx * 0.45, yPct + dy * 0.45);
}
