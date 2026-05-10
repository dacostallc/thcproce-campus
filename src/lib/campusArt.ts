import type { CSSProperties } from "react";

/**
 * Dimensões export da arte base do campus (`public/campus/campus*.png`).
 * Ao trocar a imagem, atualiza estes valores para manter hotspots alinhados quando o ratio coincidir.
 */
export const CAMPUS_ART_WIDTH = 1536;
export const CAMPUS_ART_HEIGHT = 1024;
export const CAMPUS_ART_ASPECT = CAMPUS_ART_WIDTH / CAMPUS_ART_HEIGHT;

/**
 * Alinhamento horizontal/vertical da imagem no seu content-box.
 * Deve ser idêntico nas duas camadas (dia/noite) para evitar “salto” na transição por opacidade.
 */
export const CAMPUS_IMAGE_OBJECT_POSITION = "center center";

/** Mapa avançado (polígonos walk): preenche o palco — crop possível; overlays seguem o mesmo enquadramento. */
export const CAMPUS_IMAGE_OBJECT_FIT = "cover";

/** Mapa simples interactivo: `contain` obrigatório — arte completa visível; mesmo encaixe que o SVG de hotspots. */
export const CAMPUS_IMAGE_OBJECT_FIT_SIMPLE = "contain" as const;

/** `viewBox` SVG alinhado à arte-base (user space = pixéis de referência da image-map). */
export const CAMPUS_MAP_SVG_VIEW_BOX = `0 0 ${CAMPUS_ART_WIDTH} ${CAMPUS_ART_HEIGHT}` as const;

const CAMPUS_MAP_BACKGROUND_IMG_BASE = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectPosition: CAMPUS_IMAGE_OBJECT_POSITION,
  zIndex: 0
} as const;

/**
 * Mesmo layout/crop para `<img>` dia e noite — sem transform, escala ou object-position diferente.
 */
export const CAMPUS_MAP_BACKGROUND_IMG_STYLE = {
  ...CAMPUS_MAP_BACKGROUND_IMG_BASE,
  objectFit: CAMPUS_IMAGE_OBJECT_FIT
} satisfies CSSProperties;

/**
 * `object-fit: contain` + `object-position: center` — arte completa vis (sem crop do content-box).
 *
 * No mapa simples (`/campus`), usado dentro do frame 3:2 centrado. Em debug/preview (`internalPreview`,
 * `NEXT_PUBLIC_CAMPUS_MAP_*`) pode aplicar-se também com palco completo quando o layout o exige.
 */
export const CAMPUS_MAP_BACKGROUND_IMG_STYLE_CONTAIN = {
  ...CAMPUS_MAP_BACKGROUND_IMG_BASE,
  objectFit: "contain" as const
} satisfies CSSProperties;

/**
 * Imagem duplicada do campus em fundo integral (palco/simples): `cover` para preencher o letterbox sem “buracos”;
 * arte principal continua `contain` no frame central. Escala + blur apenas para ambience.
 */
export const CAMPUS_MAP_SIMPLE_STAGE_BACKDROP_IMG_STYLE = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: CAMPUS_IMAGE_OBJECT_POSITION,
  transform: "scale(1.06)",
  transformOrigin: "center center",
  filter: "blur(14px) saturate(0.92)",
  opacity: 0.085
} satisfies CSSProperties;

/**
 * Mesmo comportamento geométrico que `object-fit: cover → slice` | `contain → meet`.
 * Mantém hotspots alinhados à PNG dentro do mesmo `absolute inset-0`.
 */
export function campusMapInteractiveSvgPreserveAspectRatio(
  objectFit: "cover" | "contain"
): "xMidYMid slice" | "xMidYMid meet" {
  return objectFit === "contain" ? "xMidYMid meet" : "xMidYMid slice";
}
