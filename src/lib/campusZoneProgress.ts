import { mapZones, type MapZone } from "@/data/mapZones";
import { areas, type Area } from "@/data/courses";

export type { MapZone } from "@/data/mapZones";
export { findMapZoneAtPercent, mapZones } from "@/data/mapZones";

export type CampusUnlockContext = {
  studentXP: number;
  areaDone: Record<string, boolean> | undefined;
  isAdmin: boolean;
  publicAll: boolean;
};

export function isCampusZoneUnlocked(
  z: MapZone,
  ctx: CampusUnlockContext
): boolean {
  if (ctx.publicAll || ctx.isAdmin) return true;
  const hasGate = z.requiredCourse != null || z.requiredXP != null;
  if (!hasGate) return true;
  if (z.requiredCourse && !ctx.areaDone?.[z.requiredCourse]) return false;
  if (z.requiredXP != null && ctx.studentXP < z.requiredXP) return false;
  return true;
}

function areaLabel(areaId: string): string {
  const a = areas.find((x) => x.id === areaId);
  return a?.name ?? areaId;
}

/** Mensagem para tooltip em zona bloqueada. */
export function campusZoneLockedTooltip(
  z: MapZone,
  ctx: CampusUnlockContext
): string | null {
  if (isCampusZoneUnlocked(z, ctx)) return null;

  const parts: string[] = [];
  if (z.requiredCourse && !ctx.areaDone?.[z.requiredCourse]) {
    parts.push(`Necessário concluir ${areaLabel(z.requiredCourse)}`);
  }
  if (z.requiredXP != null && ctx.studentXP < z.requiredXP) {
    parts.push(`Necessário atingir ${z.requiredXP} XP`);
  }
  if (parts.length === 0) return "Zona bloqueada";
  return parts.join(" · ");
}

export function campusUnlockStats(ctx: CampusUnlockContext): {
  unlocked: number;
  total: number;
  pct: number;
} {
  const total = mapZones.length;
  let unlocked = 0;
  for (const z of mapZones) {
    if (isCampusZoneUnlocked(z, ctx)) unlocked++;
  }
  const pct = total > 0 ? Math.round((unlocked / total) * 100) : 0;
  return { unlocked, total, pct };
}

export function getAreaForMapZone(z: MapZone): Area | null {
  if (!z.courseSlug) return null;
  return areas.find((a) => a.id === z.courseSlug) ?? null;
}
