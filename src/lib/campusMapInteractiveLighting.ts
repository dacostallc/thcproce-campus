import type {
  CampusMapInteractiveLightingOverride,
  CampusMapInteractiveLightingResolved
} from "@/lib/campusMapAreasInteractive.types";
import { isCampusMapPrimaryCourseArea } from "@/lib/campusMapTopicCatalog";

/** Merge manual por `areaId` (sem tocar no seed); útil para overrides pontuais. */
const LIGHTING_OVERRIDES_BY_AREA_ID: Record<string, CampusMapInteractiveLightingOverride> = {};

/** Soft green–gold; SVG filtro em `CampusMapInteractiveLayer` reforça o lado dourado. */
const PRIMARY_BASE = {
  glowColor: "#9ee8c8",
  glowIntensity: 1,
  pulseSpeed: 5.2,
  ambientLightOpacity: 0.12
} satisfies Omit<CampusMapInteractiveLightingResolved, "preset">;

/** Repouso quase invisível; glow real por proximidade/hover (desktop fino). */
const TOPIC_BASE = {
  glowColor: "#7bd8ee",
  glowIntensity: 0.62,
  pulseSpeed: 6.4,
  ambientLightOpacity: 0.028
} satisfies Omit<CampusMapInteractiveLightingResolved, "preset">;

function mergeResolved(
  preset: CampusMapInteractiveLightingResolved["preset"],
  base: Omit<CampusMapInteractiveLightingResolved, "preset">,
  o: CampusMapInteractiveLightingOverride
): CampusMapInteractiveLightingResolved {
  return {
    preset,
    glowColor: o.glowColor ?? base.glowColor,
    glowIntensity: o.glowIntensity ?? base.glowIntensity,
    pulseSpeed: o.pulseSpeed ?? base.pulseSpeed,
    ambientLightOpacity: o.ambientLightOpacity ?? base.ambientLightOpacity
  };
}

export function resolveCampusMapInteractiveLighting(
  areaId: string,
  catalogLighting?: CampusMapInteractiveLightingOverride
): CampusMapInteractiveLightingResolved {
  const defaultPreset: CampusMapInteractiveLightingResolved["preset"] = isCampusMapPrimaryCourseArea(areaId)
    ? "primary"
    : "topic";
  const layered: CampusMapInteractiveLightingOverride = {
    ...LIGHTING_OVERRIDES_BY_AREA_ID[areaId],
    ...catalogLighting
  };
  const preset = layered.preset ?? defaultPreset;
  const base = preset === "primary" ? PRIMARY_BASE : TOPIC_BASE;
  return mergeResolved(preset, base, layered);
}

/** Distância no espaço “pseudo-%” (eixo X: 0–100 da largura art, Y: 0–100 da altura art) para revelar glow em temas pequenos — ver conversão do ponteiro em `CampusMapInteractiveLayer`. */
export const CAMPUS_MAP_TOPIC_PROXIMITY_UNITS = 5.85;
