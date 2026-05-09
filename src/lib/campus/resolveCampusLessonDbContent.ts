import { BlockType } from "@prisma/client";

import { safeParseContentBlockData } from "@/lib/blocks/schemas";
import { campusDbLessonFallback } from "@/lib/campus/campusDbLessonLog";
import { getDbLessonTargetForCampusSlot } from "@/lib/features/campusDbLessons";
import { getPublishedLessonWithBlocks } from "@/lib/services/content-read";

import type { PublishedLessonWithBlocks } from "@/lib/services/content-read";

/** Tipos de bloco que o painel do campus sabe renderizar (fase piloto). */
const RENDER_BLOCK_TYPES: ReadonlySet<BlockType> = new Set([
  BlockType.HEADING,
  BlockType.PARAGRAPH,
  BlockType.CALLOUT,
  BlockType.VIDEO_EMBED,
  BlockType.IMAGE,
  BlockType.QUIZ_EMBED,
]);

export type CampusLessonSourceResult =
  | { mode: "legacy"; reason: string }
  | { mode: "db"; lesson: PublishedLessonWithBlocks };

/**
 * Decide se a combinação área + índice de aula deve usar conteúdo do Postgres.
 * Regras: entrada em CAMPUS_DB_LESSONS + cadeia publicada + blocos válidos e suportados.
 */
export async function resolveCampusLessonDbContent(
  areaId: string,
  lessonIndex: number,
): Promise<CampusLessonSourceResult> {
  const target = getDbLessonTargetForCampusSlot(areaId, lessonIndex);
  if (!target) {
    return { mode: "legacy", reason: "not_flagged" };
  }

  try {
    const lesson = await getPublishedLessonWithBlocks(
      target.courseSlug,
      target.moduleSlug,
      target.lessonSlug,
    );
    if (!lesson) {
      campusDbLessonFallback("no_published_lesson", { areaId, lessonIndex, ...target });
      return { mode: "legacy", reason: "no_published_lesson" };
    }
    if (lesson.blocks.length === 0) {
      campusDbLessonFallback("empty_blocks", { areaId, lessonIndex, ...target });
      return { mode: "legacy", reason: "empty_blocks" };
    }

    for (const b of lesson.blocks) {
      if (!RENDER_BLOCK_TYPES.has(b.type)) {
        campusDbLessonFallback("unsupported_block_type", {
          areaId,
          lessonIndex,
          blockId: b.id,
          type: b.type,
        });
        return { mode: "legacy", reason: "unsupported_block_type" };
      }
      const parsed = safeParseContentBlockData(b.type, b.data);
      if (!parsed.success) {
        campusDbLessonFallback("invalid_block_data", {
          areaId,
          lessonIndex,
          blockId: b.id,
          type: b.type,
        });
        return { mode: "legacy", reason: "invalid_block_data" };
      }
    }

    return { mode: "db", lesson };
  } catch (e) {
    campusDbLessonFallback("db_error", {
      areaId,
      lessonIndex,
      error: e instanceof Error ? e.message : String(e),
    });
    return { mode: "legacy", reason: "db_error" };
  }
}
