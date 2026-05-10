import type { PctPos } from "@/stores/campusStore";

/** Memória do mapa no cliente — espelho futuro de `userCampusProgress` / perfil. */
export interface CampusMapMemory {
  version: 1;
  /** Último painel em foco (coerente com servidor `campusMapMemory`). */
  lastPanelKind?: "course" | "hotspot" | "lesson" | null;
  lastLegacyHitId?: string | null;
  lastBuildingCourseId?: string | null;
  /** Etiqueta humana da zona (quando existir). */
  lastZoneLabel?: string | null;
  /** Snapshot da posição do avatar (%). */
  lastAvatarPct?: PctPos | null;
  /** Epoch ms da última interação relevante no mapa. */
  lastActivityAt?: number | null;

  /** Zonas visitadas (union incremental em `mergeCampusMapMemory`). */
  visitedZoneIds?: string[];
  /** Hotspots descobertos / abertos no mapa interactivo. */
  discoveredHotspotIds?: string[];
  /** IDs estáveis de microaulas ou lições concluídas (cliente). */
  completedLessonIds?: string[];
  /** Último spawn preferido (%). */
  lastSpawnPosition?: { xPercent: number; yPercent: number } | null;
  /** Drive-in cinematográfico aberto na última sessão. */
  cinemaDriveInOpen?: boolean | null;
}
