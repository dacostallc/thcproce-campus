/**
 * Catálogo manual de áreas do mapa do campus.
 *
 * ## Interactivo (HTML image-map)
 * Dados literais em `campusMapAreasCatalog.seed.ts` — `coords` iguais ao export &lt;area&gt; (pixéis na arte-base).
 * No mapa simples o SVG partilha o mesmo content-box que a PNG (frame `#campus-map-art-frame`), viewBox 1536×1024 e `preserveAspectRatio` alinhado ao `object-fit` da imagem.
 *
 * ## Legado (overlay JSON debug)
 * Polígonos percentagem ou pixéis na referência da arte — `CampusMapAreasDebugOverlay` + localStorage.
 */

import { CAMPUS_ART_HEIGHT, CAMPUS_ART_WIDTH } from "@/lib/campusArt";
import { CAMPUS_MAP_INTERACTIVE_AREAS as _CAMPUS_MAP_INTERACTIVE_AREAS_FROM_SEED } from "@/lib/campusMapAreasCatalog.seed";
import type { CampusMapInteractiveShape } from "@/lib/campusMapAreasInteractive.types";

export type {
  CampusMapInteractiveArea,
  CampusMapHotspotAccessStatus,
  CampusMapHotspotType,
  CampusMapInteractiveKind,
  CampusMapInteractiveShape,
  CampusMapInteractiveStatus,
  CampusMapInteractiveTarget
} from "@/lib/campusMapAreasInteractive.types";

export const CAMPUS_MAP_INTERACTIVE_AREAS = _CAMPUS_MAP_INTERACTIVE_AREAS_FROM_SEED;

/** Dimensão em pixéis da imagem ao gerar o map na image-map.net (alinhar à arte-base). */
export const IMAGE_MAP_COORDS_REFERENCE_PX = {
  width: CAMPUS_ART_WIDTH,
  height: CAMPUS_ART_HEIGHT
} as const;

export type SvgImageMapPrimitive =
  | { kind: "polygon"; pointsPct: string }
  | { kind: "circle"; cxPct: number; cyPct: number; rPct: number };

/** Primitiva no espaço de pixéis da arte (coords image-map crus). Usado pelo overlay alinhado à PNG */
export type SvgImageMapPrimitiveArt =
  | { kind: "polygon"; pointsPx: string }
  | { kind: "circle"; cx: number; cy: number; r: number };

/**
 * Pixéis → primitivas no viewBox da arte ({@link IMAGE_MAP_COORDS_REFERENCE_PX}) sem distorção.
 */
export function imageMapCoordsToSvgPrimitiveArt(
  coords: string,
  shape: CampusMapInteractiveShape,
  ref: { width: number; height: number } = IMAGE_MAP_COORDS_REFERENCE_PX
): SvgImageMapPrimitiveArt {
  const nums = coords.split(",").map((s) => Number(s.trim()));
  if (shape === "circle") {
    const [cx, cy, r] = nums;
    if (nums.length !== 3 || nums.some((n) => !Number.isFinite(n))) {
      throw new Error(`image-map circle coords inválidos: "${coords}"`);
    }
    return { kind: "circle", cx: cx!, cy: cy!, r: r! };
  }
  if (nums.length < 6 || nums.length % 2 !== 0 || nums.some((n) => !Number.isFinite(n))) {
    throw new Error(`image-map poly coords inválidos: "${coords}"`);
  }
  const pairs: string[] = [];
  for (let i = 0; i < nums.length; i += 2) {
    pairs.push(`${nums[i]},${nums[i + 1]}`);
  }
  return { kind: "polygon", pointsPx: pairs.join(" ") };
}

/** Centro óptimo (pixéis arte) para hit / proximidade. */
export function imageMapApproxArtCentroid(
  coords: string,
  shape: CampusMapInteractiveShape,
  ref: { width: number; height: number } = IMAGE_MAP_COORDS_REFERENCE_PX
): { cx: number; cy: number } {
  const p = imageMapCoordsToSvgPrimitiveArt(coords, shape, ref);
  if (p.kind === "circle") {
    return { cx: p.cx, cy: p.cy };
  }
  const verts = p.pointsPx.split(/\s+/).filter(Boolean);
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (const pair of verts) {
    const [xs, ys] = pair.split(",").map((s) => Number(s.trim()));
    if (Number.isFinite(xs) && Number.isFinite(ys)) {
      sx += xs!;
      sy += ys!;
      n++;
    }
  }
  if (!n) return { cx: ref.width / 2, cy: ref.height / 2 };
  return { cx: sx / n, cy: sy / n };
}

/**
 * Transformação permitida sobre coords exportados: escala ortogonal px → % do mesmo reference frame.
 * Não deduplica nem reordena vértices.
 */
export function imageMapCoordsToSvgPrimitive(
  coords: string,
  shape: CampusMapInteractiveShape,
  ref: { width: number; height: number } = IMAGE_MAP_COORDS_REFERENCE_PX
): SvgImageMapPrimitive {
  const nums = coords.split(",").map((s) => Number(s.trim()));
  if (shape === "circle") {
    const [cx, cy, r] = nums;
    if (nums.length !== 3 || nums.some((n) => !Number.isFinite(n))) {
      throw new Error(`image-map circle coords inválidos: "${coords}"`);
    }
    return {
      kind: "circle",
      cxPct: (cx! / ref.width) * 100,
      cyPct: (cy! / ref.height) * 100,
      rPct: (r! / ref.width) * 100
    };
  }
  if (nums.length < 6 || nums.length % 2 !== 0 || nums.some((n) => !Number.isFinite(n))) {
    throw new Error(`image-map poly coords inválidos: "${coords}"`);
  }
  const pairs: string[] = [];
  for (let i = 0; i < nums.length; i += 2) {
    pairs.push(`${(nums[i]! / ref.width) * 100},${(nums[i + 1]! / ref.height) * 100}`);
  }
  return { kind: "polygon", pointsPct: pairs.join(" ") };
}

/** Centro aproximado (%) sobre o sistema legacy viewBox 0–100 — preferir {@link imageMapApproxArtCentroid} para alinhamento com PNG na arte. */
export function imageMapApproxCenterPct(coords: string, shape: CampusMapInteractiveShape): { x: number; y: number } {
  const p = imageMapCoordsToSvgPrimitive(coords, shape);
  if (p.kind === "circle") {
    return { x: p.cxPct, y: p.cyPct };
  }
  const verts = p.pointsPct.split(/\s+/).filter(Boolean);
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (const pair of verts) {
    const [xs, ys] = pair.split(",");
    const x = Number(xs);
    const y = Number(ys);
    if (Number.isFinite(x) && Number.isFinite(y)) {
      sx += x;
      sy += y;
      n++;
    }
  }
  if (!n) return { x: 50, y: 50 };
  return { x: sx / n, y: sy / n };
}

/** ——— Legado: polígonos percentagem / JSON colado ——— */

/** Ponto no plano da área; para `percent_of_stage`, x/y ∈ [0, 100]. */
export type CampusMapPoint = { x: number; y: number };

/** Unidade em que os vértices foram introduzidos manualmente (sem inferência por imagem). */
export type CampusMapAreaCoordUnit = "percent_of_stage" | "pixel_ref_1920_1080";

/**
 * Área clicável legada: polígono simples em ordem de vértices.
 * O SVG fecha o polígono ligando o último vértice ao primeiro.
 */
export type CampusMapArea = {
  id: string;
  label?: string;
  polygon: CampusMapPoint[];
  coordUnit: CampusMapAreaCoordUnit;
  exampleOnly?: boolean;
  authorNotes?: string;
};

/** Áreas produtivas legadas — vazio em produção. */
export const CAMPUS_MAP_AREAS_CATALOG: CampusMapArea[] = [];

/** Placeholders para `/preview/campus-map-areas` e QA do overlay JSON. */
export const CAMPUS_MAP_AREAS_EXAMPLE_ONLY: CampusMapArea[] = [
  {
    id: "_example_corner_square_sw",
    label: "EXAMPLE_ONLY — quadrado exemplo",
    exampleOnly: true,
    coordUnit: "percent_of_stage",
    authorNotes:
      "Substituir por polígonos reais; mantido como referência de schema. NÃO usar como hit area em produção.",
    polygon: [
      { x: 2, y: 82 },
      { x: 12, y: 82 },
      { x: 12, y: 95 },
      { x: 2, y: 95 }
    ]
  },
  {
    id: "_example_triangle_marker_ne",
    label: "EXAMPLE_ONLY — triângulo exemplo",
    exampleOnly: true,
    coordUnit: "percent_of_stage",
    authorNotes:
      "Triângulo mínimo para validar renderização SVG; remover quando houver dados reais no catálogo.",
    polygon: [
      { x: 90, y: 4 },
      { x: 98, y: 4 },
      { x: 94, y: 12 }
    ]
  }
];

export type CampusMapAreasFileV1 = {
  version: 1;
  areas: CampusMapArea[];
};

/** `points` do SVG (`x,y` em user space = percent se viewBox 0 0 100 100). */
export function campusMapPolygonToSvgPoints(polygon: CampusMapPoint[]): string {
  return polygon.map((p) => `${p.x},${p.y}`).join(" ");
}

/** Converte pixéis na mesma referência que {@link IMAGE_MAP_COORDS_REFERENCE_PX} (nome `pixel_ref_1920_1080` é legado). */
export function campusMapConvertRef1920PointToPercent(p: CampusMapPoint): CampusMapPoint {
  return {
    x: Math.round((p.x / CAMPUS_ART_WIDTH) * 10000) / 100,
    y: Math.round((p.y / CAMPUS_ART_HEIGHT) * 10000) / 100
  };
}

export function campusMapNormalizePolygonToPercent(area: CampusMapArea): CampusMapPoint[] {
  if (area.coordUnit === "percent_of_stage") {
    return area.polygon;
  }
  return area.polygon.map((v) => campusMapConvertRef1920PointToPercent(v));
}

function isPoint(v: unknown): v is CampusMapPoint {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return typeof o.x === "number" && Number.isFinite(o.x) && typeof o.y === "number" && Number.isFinite(o.y);
}

function isArea(v: unknown): v is CampusMapArea {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id.trim()) return false;
  if (!Array.isArray(o.polygon) || o.polygon.length < 3) return false;
  if (!o.polygon.every(isPoint)) return false;
  if (o.coordUnit !== "percent_of_stage" && o.coordUnit !== "pixel_ref_1920_1080") return false;
  return true;
}

export function parseCampusMapAreasOverlayJson(raw: string): CampusMapArea[] | null {
  try {
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return null;
    const v = (j as Record<string, unknown>).version;
    const areas = (j as Record<string, unknown>).areas;
    if (v !== 1 || !Array.isArray(areas)) return null;
    if (!areas.every(isArea)) return null;
    return areas as CampusMapArea[];
  } catch {
    return null;
  }
}

export const CAMPUS_MAP_AREAS_OVERLAY_LS_KEY = "thc_campus_map_areas_overlay_json_v1" as const;

export type ResolveCampusMapAreasOptions = {
  includeExamples: boolean;
  jsonOverride?: string | null;
};

export function resolveCampusMapAreasForOverlay(opts: ResolveCampusMapAreasOptions): CampusMapArea[] {
  const out: CampusMapArea[] = [...CAMPUS_MAP_AREAS_CATALOG];
  if (opts.includeExamples) {
    out.push(...CAMPUS_MAP_AREAS_EXAMPLE_ONLY);
  }
  if (opts.jsonOverride && opts.jsonOverride.trim()) {
    const parsed = parseCampusMapAreasOverlayJson(opts.jsonOverride.trim());
    if (parsed && parsed.length) {
      return parsed;
    }
  }
  return out;
}
