import type {
  MissionTelemetry,
  StudentAvatarVariant,
  StudentProfile
} from "@/lib/studentGamificationStorage";
import { cannabis101HasLocalLessonMarksSync, hasCannabis101FirstLessonBegunSync } from "@/lib/campusCannabis101Hint";
import { sumDistinctLocalLessonMarksAcrossAreas } from "@/lib/campusProgressStorage";
import {
  CANNABIS101_AREA_ID
} from "@/content/courses/cannabis-101/manifest";
const VISUAL_DEFAULT_IDS = new Set(["frame-none", "aura-none", "badge-vis-none", "holofx-off"]);

export type CampusStartHereKind =
  | "cannabis101_entry"
  | "first_lesson"
  | "missions"
  | "avatar_custom";

export type CampusStartHereRecommendation = {
  kind: CampusStartHereKind;
  /** Texto curto para o chip / cartão */
  headline: string;
  /** Sugestão de ação ou contexto */
  supportingLine: string;
  /** Id da área de curso (quando aplicável) */
  areaIdHint?: typeof CANNABIS101_AREA_ID;
};

export function isCannabis101StartedLocal(): boolean {
  return hasCannabis101FirstLessonBegunSync() || cannabis101HasLocalLessonMarksSync();
}

function cosmeticsStillDefault(profile: StudentProfile): boolean {
  const vc = profile.visualCosmeticsV1;
  const ids = [vc.frameId, vc.auraId, vc.badgeVisualId, vc.hologramFx].filter(Boolean);
  if (ids.length === 0) return true;
  return ids.every((id) => VISUAL_DEFAULT_IDS.has(id));
}

function stillVisitorBaseline(
  avatarVariant: StudentAvatarVariant,
  avatarStateCosmeticLayers: string[]
): boolean {
  return avatarVariant === "visitor" && avatarStateCosmeticLayers.length === 0;
}

function missionsNeedNudge(telem: MissionTelemetry, claimedMissionCount: number): boolean {
  if (!telem.missionsPanelOpenedOnceEver && claimedMissionCount === 0) return true;
  return false;
}

/**
 * Escolhe um único passo recomendado (prioridade fixa — primeiro que aplicar ganha).
 * Usar no HUD/campus após hydration do perfil local.
 */
export function getCampusStartHereRecommendation(profile: StudentProfile): CampusStartHereRecommendation | null {
  const c101 = isCannabis101StartedLocal();

  if (!c101) {
    return {
      kind: "cannabis101_entry",
      headline: "Entre no Cannabis 101",
      supportingLine: "Abra o curso introdutório no mapa para começar.",
      areaIdHint: CANNABIS101_AREA_ID
    };
  }

  const lessonMarksSum = sumDistinctLocalLessonMarksAcrossAreas();
  if (lessonMarksSum === 0) {
    return {
      kind: "first_lesson",
      headline: "Conclua sua primeira aula",
      supportingLine: "Marque uma aula como vista para ganhar XP e créditos no campus.",
      areaIdHint: CANNABIS101_AREA_ID
    };
  }

  if (missionsNeedNudge(profile.missionTelemetry, profile.claimedMissionIds.length)) {
    return {
      kind: "missions",
      headline: "Abra suas missões",
      supportingLine: "Veja objetivos rápidos e resgate recompensas locais quando concluídos.",
    };
  }

  if (
    stillVisitorBaseline(profile.avatarVariant, profile.avatarState.cosmeticLayerIds) &&
    cosmeticsStillDefault(profile)
  ) {
    return {
      kind: "avatar_custom",
      headline: "Personalize seu avatar",
      supportingLine: "Escolha aparência e cosméticos no perfil.",
    };
  }

  return null;
}
