/** Tipos das áreas interactivas exportadas por image-map (HTML) — catálogo campus. */

export type CampusMapInteractiveShape = "poly" | "circle";

/** Semântica do hotspot no mapa (UI, filtros, analytics). */
export type CampusMapHotspotType =
  | "course"
  | "lesson"
  | "module"
  | "event"
  | "library"
  | "lab"
  | "community";

/** Estado de acesso exibido no mapa e nos modais. */
export type CampusMapHotspotAccessStatus = "open" | "locked" | "coming_soon";

export type CampusMapInteractiveTarget =
  | { kind: "course"; courseId: string }
  | { kind: "route"; href: string }
  | { kind: "hud_store" }
  | { kind: "hud_mural" }
  /** Mural demo no mapa (feed local / mock) — evita acoplar ao painel HUD com TRPC. */
  | { kind: "campus_mural_feed" }
  /** Painel lateral «Programação do dia» (mapa simples). */
  | { kind: "schedule_day" }
  /** Cinema / live no mapa — abre o frame flutuante (HUD), independente do alinhamento no ecrã. */
  | { kind: "cinema_live_rail" }
  /** Painel especial de boas‑vindas / frase (sem destino HUD). */
  | { kind: "welcome_intro" }
  | { kind: "none"; reason?: string };

/**
 * Área do mapa: `coords` é o literal do export &lt;area coords="..."&gt; (não reordenar nem deduplicar).
 */

/** Preset de iluminação do mapa (salas grandes vs. temas pequenos). */
export type CampusMapInteractiveLightingPresetId = "primary" | "topic";

/**
 * Metadados opcionais de glow / pulso por área (sem alterar `coords`).
 * Valores em `campusMapInteractiveLighting.ts` fazem merge com o preset.
 */
export type CampusMapInteractiveLightingOverride = {
  glowColor?: string;
  /** Multiplicador aproximado da intensidade do filtro (0.35–1.6 típico). */
  glowIntensity?: number;
  /** Duração de um ciclo de “respiração” em segundos. */
  pulseSpeed?: number;
  /** Opacidade base da camada ambiente (primárias). */
  ambientLightOpacity?: number;
  preset?: CampusMapInteractiveLightingPresetId;
};

export type CampusMapInteractiveLightingResolved = {
  preset: CampusMapInteractiveLightingPresetId;
  glowColor: string;
  glowIntensity: number;
  pulseSpeed: number;
  ambientLightOpacity: number;
};

export type CampusMapInteractiveArea = {
  id: string;
  /**
   * Título curto (mapa/modais). Preferir texto natural em PT‑BR para o utilizador quando possível:
   * o `panelTitle` substitui visualmente só no painel, se definido.
   */
  title: string;
  /** Rótulo curto alternativo; se definido, substitui `title` em tooltips e HUD do hotspot. */
  label?: string;
  /** Se definido, o aluno vê este título nos modais — evita inglês técnico do id (ex.: green-houses). */
  panelTitle?: string;
  /**
   * 1–2 frases no painel (sem jargon de código).
   * Se vazio omisso no catálogo, o UI faz fallback discreto sobre o campo `short` do curso.
   */
  studentSummary?: string;
  /** Descrição curta para o painel lateral; fallback: `studentSummary` ou `area.short`. */
  shortDescription?: string;
  /** CTA principal no painel (ex.: «Entrar»). */
  ctaLabel?: string;
  /** CTA secundária (ex.: «Ver aulas»). */
  secondaryCtaLabel?: string;
  /** Slugs editoriais — `courseSlug` alinha com `Area.id` / manifestos (ex.: cannabis-101). */
  courseSlug?: string;
  moduleSlug?: string;
  lessonSlug?: string;
  /** Pulse vermelho discreto no centro do hotspot (ao vivo). */
  live?: boolean;
  coords: string;
  shape: CampusMapInteractiveShape;
  type: CampusMapHotspotType;
  status: CampusMapHotspotAccessStatus;
  target: CampusMapInteractiveTarget;
  metadata?: Record<string, string>;
  /** Glow / pulso — não altera coordenadas; omitir usa preset por `id`. */
  lighting?: CampusMapInteractiveLightingOverride;
};

/** @deprecated usar {@link CampusMapHotspotType} */
export type CampusMapInteractiveKind = CampusMapHotspotType;
/** @deprecated usar {@link CampusMapHotspotAccessStatus} */
export type CampusMapInteractiveStatus = CampusMapHotspotAccessStatus;
