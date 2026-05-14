/**
 * Course registry THCProce — núcleo de registo central por `manifest.areaId` (= slug no mapa).
 *
 * ─── Checklist mínimo para um curso novo (sem tocar React) ───
 * 1. Criar pasta `src/content/courses/<course-id>/` (<course-id> alinhado a `Area.id` em `data/courses`).
 * 2. Criar `manifest.ts` com `CourseManifest` (HUD, previews, stats, marketing opcional).
 * 3. Opcional `lessons.ts` — exponha array e associe em `data/lessonContent` (entrada MANUAL_* / import).
 * 4. Opcional `theme.ts` — entrada em `data/courseLessonThemes.ts` (hero/tokens por `areaId`).
 * 5. Opcional `media.ts` — Mux primário / poster / trailers (handlers passados em `media` / `primaryMux`).
 * 6. Opcional `gating.ts` — publicação + lock sequencial próprios (`gate`).
 * 7. Registrar aqui com `registerCourse({ manifest, … })` (imports do pacote criado).
 *
 * Overrides que quebrarem o ciclo barril ↔ dados: usar imports directos tipo `@/content/courses/<course-id>/manifest`.
 */
import type { CourseRegistrationConfig } from "./types";
import {
  CANNABIS101_AREA_ID,
  CANNABIS101_MANIFEST,
  getCannabis101DisplayName
} from "./cannabis-101/manifest";
import {
  getCannabis101PrimaryMuxPlaybackId,
  getCannabis101TrailerMuxPlaybackId,
  getCannabis101TrailerYoutubeId,
  hasCannabis101TrailerConfigured,
  CANNABIS101_LESSON_MEDIA_HINTS,
  CANNABIS101_HERO_POSTER_SRC
} from "./cannabis-101/media";
import {
  getCannabis101LessonGate,
  getPublishedLessonCount as getCannabisPublishedLessonCount
} from "./cannabis-101/gating";
import type {
  CourseManifest,
  CourseLessonPanelUi,
  RegisteredCourseCapabilities
} from "./types";
// Todos os cursos com IDs canônicos do mapa
import { Culinary_MANIFEST }            from "./culinaria/manifest";
import { Medicine_MANIFEST }            from "./medicina/manifest";
import { Extraction_MANIFEST }          from "./extracao-oleo/manifest";
import { CultivoGreenhouse_MANIFEST }   from "./cultivo-greenhouse/manifest";
import { CultivoOutdoor_MANIFEST }      from "./cultivo-outdoor/manifest";
import { CultivoIndoor_MANIFEST }       from "./cultivo-indoor/manifest";
import { Genetica_MANIFEST }            from "./genetica/manifest";
import { SecagemCura_MANIFEST }         from "./secagem-cura/manifest";
import { ExtracoesSolventless_MANIFEST } from "./extracoes-solventless/manifest";
import { LABORATORIO_MANIFEST }         from "./laboratorio/manifest";
import { Legislacao_MANIFEST }          from "./legislacao/manifest";
import { Cooperativismo_MANIFEST }      from "./cooperativismo/manifest";
import { Industria_MANIFEST }           from "./industria/manifest";
import { EXTRACOES_101_MANIFEST }       from "./extracoes-101/manifest";
import { HashMaker_MANIFEST }           from "./hash-maker/manifest";
import { CultivoFloracao_MANIFEST }     from "./cultivo-floracao/manifest";
import { NutricaoCannabis_MANIFEST }    from "./nutricao-cannabis/manifest";
import { CultivoSolo_MANIFEST }         from "./cultivo-solo/manifest";
import { getCourseLessonTheme } from "@/data/courseLessonThemes";
import { tryGetManualLessonsForCourse } from "@/data/lessonContent";

const DEFAULT_LESSON_PANEL_UI: CourseLessonPanelUi = {
  moodleLessonSnippet: false,
  lessonRichTabsVariant: "campus"
};

const REGISTERED_CAPABILITIES: Record<string, RegisteredCourseCapabilities> = {};

/** Registo idempotente: re-chamar para o mesmo `manifest.areaId` substitui a entrada anterior. */
export function registerCourse(config: CourseRegistrationConfig): void {
  const trimmed = config.manifest.areaId.trim();
  if (!trimmed) {
    throw new Error("registerCourse: manifest.areaId é obrigatório e não pode ser vazio.");
  }
  const manifest: CourseManifest = {
    ...config.manifest,
    areaId: trimmed
  };
  REGISTERED_CAPABILITIES[trimmed] = {
    manifest,
    lessonPanelUi: config.lessonPanelUi,
    primaryMux: config.primaryMux,
    gate: config.gate,
    media: config.media
  };
}

const CANN_MEDIA = {
  heroPosterSrc: CANNABIS101_HERO_POSTER_SRC,
  lessonMediaHints: CANNABIS101_LESSON_MEDIA_HINTS,
  primaryMuxPlaybackId: getCannabis101PrimaryMuxPlaybackId,
  trailerMuxPlaybackId: getCannabis101TrailerMuxPlaybackId,
  trailerYoutubeId: getCannabis101TrailerYoutubeId,
  hasTrailerConfigured: hasCannabis101TrailerConfigured
} satisfies NonNullable<CourseRegistrationConfig["media"]>;

const CANN_GATE = {
  getPublishedLessonCount: getCannabisPublishedLessonCount,
  getLessonGate: getCannabis101LessonGate
} satisfies NonNullable<CourseRegistrationConfig["gate"]>;

function adaptCannabis101Manifest(): CourseManifest {
  const m = CANNABIS101_MANIFEST;
  return {
    areaId: m.areaId,
    displayName: m.displayName,
    marketing: {
      short: m.marketing.short,
      category: m.marketing.category,
      level: m.marketing.level,
      color: m.marketing.color,
      mapPosition: { x: m.marketing.mapPosition.x, y: m.marketing.mapPosition.y },
      description: m.marketing.description,
      highlights: [...m.marketing.highlights],
      professor: m.marketing.professor
    },
    hud: { nextLessonFallbackLabel: m.hud.nextLessonFallbackLabel },
    previewLessonTitles: [...m.previewLessonTitles],
    stats: { lessonCount: m.stats.lessonCount, hoursLabel: m.stats.hoursLabel }
  };
}

registerCourse({
  manifest: adaptCannabis101Manifest(),
  lessonPanelUi: {
    moodleLessonSnippet: true,
    lessonRichTabsVariant: "cannabis101"
  },
  primaryMux: getCannabis101PrimaryMuxPlaybackId,
  gate: CANN_GATE,
  media: CANN_MEDIA,
  usesCinematicLayout: true,   // ← blueprint: sidebar + HUD + Concluir Aula
});

// ── Todos os cursos — layout Blueprint completo (sidebar + HUD + narração) ──
registerCourse({ manifest: Culinary_MANIFEST,              usesCinematicLayout: true });
registerCourse({ manifest: Medicine_MANIFEST,              usesCinematicLayout: true });
registerCourse({ manifest: Extraction_MANIFEST,            usesCinematicLayout: true });
registerCourse({ manifest: CultivoGreenhouse_MANIFEST,     usesCinematicLayout: true });
registerCourse({ manifest: CultivoOutdoor_MANIFEST,        usesCinematicLayout: true });
registerCourse({ manifest: CultivoIndoor_MANIFEST,         usesCinematicLayout: true });
registerCourse({ manifest: Genetica_MANIFEST,              usesCinematicLayout: true });
registerCourse({ manifest: SecagemCura_MANIFEST,           usesCinematicLayout: true });
registerCourse({ manifest: ExtracoesSolventless_MANIFEST,  usesCinematicLayout: true });
registerCourse({ manifest: LABORATORIO_MANIFEST,           usesCinematicLayout: true });
registerCourse({ manifest: Legislacao_MANIFEST,            usesCinematicLayout: true });
registerCourse({ manifest: Cooperativismo_MANIFEST,        usesCinematicLayout: true });
registerCourse({ manifest: Industria_MANIFEST,             usesCinematicLayout: true });
// Novos cursos importados do Moodle
registerCourse({ manifest: CultivoFloracao_MANIFEST,       usesCinematicLayout: true });
registerCourse({ manifest: NutricaoCannabis_MANIFEST,      usesCinematicLayout: true });
registerCourse({ manifest: CultivoSolo_MANIFEST,           usesCinematicLayout: true });

// ── Extrações 101 — layout Blueprint completo ──
registerCourse({
  manifest: EXTRACOES_101_MANIFEST,
  usesCinematicLayout: true,
});

// ── Hash Maker — layout Blueprint ──
registerCourse({
  manifest: HashMaker_MANIFEST,
  usesCinematicLayout: true,
});

function capabilityFor(areaId: string | undefined): RegisteredCourseCapabilities | undefined {
  if (!areaId) return undefined;
  return REGISTERED_CAPABILITIES[areaId];
}

function resolveLessonPanelUi(areaId: string | undefined): CourseLessonPanelUi {
  if (!areaId) return DEFAULT_LESSON_PANEL_UI;
  return {
    ...DEFAULT_LESSON_PANEL_UI,
    ...capabilityFor(areaId)?.lessonPanelUi
  };
}

/** Lista de áreas registadas neste núcleo (manifest + comportamentos opcionais). */
export function getRegisteredCourseAreaIds(): readonly string[] {
  return Object.keys(REGISTERED_CAPABILITIES);
}

export function hasRegisteredCourseCapabilities(areaId: string | undefined): boolean {
  return Boolean(areaId && areaId in REGISTERED_CAPABILITIES);
}

export function getCourseManifest(areaId: string | undefined): CourseManifest | undefined {
  return capabilityFor(areaId)?.manifest;
}

export function coursePreviewLessonTitlesForArea(areaId: string): readonly string[] | undefined {
  return getCourseManifest(areaId)?.previewLessonTitles;
}

export function hudNextLessonCueForArea(areaId: string): string | undefined {
  return getCourseManifest(areaId)?.hud.nextLessonFallbackLabel;
}

export function getCourseTheme(areaId: string) {
  return getCourseLessonTheme(areaId);
}

export function getCourseLessons(areaId: string) {
  return tryGetManualLessonsForCourse(areaId);
}

export function getCourseMedia(areaId: string | undefined) {
  return capabilityFor(areaId)?.media;
}

export function getCourseGate(areaId: string | undefined) {
  return capabilityFor(areaId)?.gate;
}

// ——— Layout cinematográfico ———

/**
 * Retorna `true` se o curso deve usar o layout completo do blueprint Cannabis 101:
 * sidebar agrupada, HUD de XP, botão "Concluir Aula" e player de narração.
 *
 * Para activar num novo curso: `registerCourse({ ..., usesCinematicLayout: true })`.
 */
export function isCinematicCourse(areaId: string | undefined): boolean {
  if (!areaId) return false;
  return Boolean(REGISTERED_CAPABILITIES[areaId]?.usesCinematicLayout);
}

// ——— Compat Cannabis 101 (UI continua igual) ———

/** `Area.id` do curso Cannabis 101. */
export function isCannabis101CourseArea(areaId: string | undefined): boolean {
  return Boolean(areaId && areaId === CANNABIS101_AREA_ID);
}

export function areaUsesMoodleLessonSnippet(areaId: string | undefined): boolean {
  return resolveLessonPanelUi(areaId).moodleLessonSnippet;
}

export function lessonRichTabsVariantForArea(
  areaId: string | undefined
): "cannabis101" | "campus" {
  return resolveLessonPanelUi(areaId).lessonRichTabsVariant;
}

export function areaUsesRegisteredPrimaryMux(areaId: string | undefined): boolean {
  const cap = capabilityFor(areaId);
  return Boolean(cap?.primaryMux);
}

export function registeredPrimaryMuxPlaybackId(areaId: string | undefined): string {
  const fn = capabilityFor(areaId)?.primaryMux;
  return fn ? fn().trim() : "";
}

export function cannabis101HudNextLessonCue(): string {
  return hudNextLessonCueForArea(CANNABIS101_AREA_ID) ?? "";
}

export function cannabis101CoursePreviewLessonTitles(): readonly string[] {
  return getCourseManifest(CANNABIS101_AREA_ID)?.previewLessonTitles ?? [];
}

export function cannabis101DisplayName(): string {
  return getCannabis101DisplayName();
}
