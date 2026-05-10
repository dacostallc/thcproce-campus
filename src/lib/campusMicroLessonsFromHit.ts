import type { CampusMicroLessonBlueprint } from "@/data/campusMicroLessonContext";
import {
  enrichMicroLessonBlueprint,
  inheritMicroLessonThemeFromZone,
  resolveCampusMapZoneLabel,
  resolveCampusZoneEducationalContext,
  type CampusMapZoneLabel
} from "@/data/campusMicroLessonContext";

export type CampusMicroLessonDifficulty = "Iniciante" | "Intermediário" | "Avançado";

export type CampusMicroLessonOffer = {
  blueprint: CampusMicroLessonBlueprint;
  enriched: ReturnType<typeof enrichMicroLessonBlueprint>;
  zoneLabel: CampusMapZoneLabel;
  visualVariant: string;
  thematicKeywords: readonly string[];
  educationalThemeId: string;
  educationalThemeTitle: string;
  /** Categoria pedagógica (= tema da zona) */
  categoryLabel: string;
  description: string;
  estimatedMinutes: number;
  xpBonus: number;
  difficulty: CampusMicroLessonDifficulty;
};

function stableHash(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type GetMicroLessonsForCampusHitInput = {
  legacyHitId?: string | null;
  courseId?: string | null;
};

/**
 * Resolve a zona pedagógica via {@link resolveCampusZoneEducationalContext} e devolve microaulas só dessa zona.
 * Sem IDs não há contexto territorial → lista vazia (sem sorteio global).
 */
export function getMicroLessonsForCampusHit(
  input: GetMicroLessonsForCampusHitInput
): CampusMicroLessonOffer[] {
  const hid = input.legacyHitId?.trim() ?? "";
  const cid = input.courseId?.trim() ?? "";
  if (!hid && !cid) return [];

  const ctx = resolveCampusZoneEducationalContext({
    legacyHitId: hid || undefined,
    courseId: cid || undefined
  });

  const zoneLabel = resolveCampusMapZoneLabel({
    legacyHitId: hid || undefined,
    courseId: cid || undefined
  });

  const metaFor = (bp: CampusMicroLessonBlueprint) => {
    const enriched = enrichMicroLessonBlueprint(bp);
    const h = stableHash(bp.id);
    const difficulties: CampusMicroLessonDifficulty[] = [
      "Iniciante",
      "Intermediário",
      "Avançado"
    ];
    return {
      estimatedMinutes: enriched.durationMin,
      xpBonus: enriched.xpReward,
      difficulty: difficulties[h % difficulties.length]!
    };
  };

  return ctx.microLessonBlueprints.map((bp) => {
    const themed = inheritMicroLessonThemeFromZone(zoneLabel, {
      blueprint: bp
    });
    const enriched = enrichMicroLessonBlueprint(bp);
    const m = metaFor(bp);
    return {
      blueprint: bp,
      enriched,
      zoneLabel: themed.zoneLabel,
      visualVariant: themed.visualVariant,
      thematicKeywords: themed.thematicKeywords,
      educationalThemeId: themed.educationalThemeId,
      educationalThemeTitle: themed.educationalThemeTitle,
      categoryLabel: ctx.theme.title,
      description: enriched.objective,
      estimatedMinutes: m.estimatedMinutes,
      xpBonus: m.xpBonus,
      difficulty: m.difficulty
    };
  });
}
