"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCampusLessonMoodleContent = syncCampusLessonMoodleContent;
const client_1 = require("@prisma/client");
const cmsBlocksCanonicalText_1 = require("@/lib/campus/cmsBlocksCanonicalText");
const campusDbLessons_1 = require("@/lib/features/campusDbLessons");
const prisma_1 = require("@/lib/prisma");
const moodleFullContent_1 = require("@/server/moodle/moodleFullContent");
/**
 * Grava o corpo Moodle completo num ContentBlock PARAGRAPH com `moodleFullSync`.
 * Remove apenas blocos PARAGRAPH anteriores com o mesmo marcador (re-sync).
 */
async function syncCampusLessonMoodleContent(input) {
    const target = (0, campusDbLessons_1.getDbLessonTargetForCampusSlot)(input.areaId, input.lessonIndex);
    if (!target) {
        return {
            ok: false,
            status: 400,
            error: "Sem mapeamento CAMPUS_DB_LESSONS para este slot. Formato: areaId|lessonIndex|courseSlug|moduleSlug|lessonSlug.",
        };
    }
    const full = await (0, moodleFullContent_1.fetchMoodleFullContent)({
        courseId: input.courseId,
        cmid: input.cmid,
    });
    if (full.charCount < cmsBlocksCanonicalText_1.CMS_CANONICAL_BODY_MIN_CHARS) {
        return {
            ok: false,
            status: 400,
            error: full.warnings[0] ??
                `Conteúdo insuficiente (charCount=${full.charCount}, mínimo ${cmsBlocksCanonicalText_1.CMS_CANONICAL_BODY_MIN_CHARS}). Fonte Moodle: ${full.source}.`,
        };
    }
    const lesson = await prisma_1.prisma.lesson.findFirst({
        where: {
            slug: target.lessonSlug,
            status: client_1.PublishStatus.PUBLISHED,
            module: {
                slug: target.moduleSlug,
                status: client_1.PublishStatus.PUBLISHED,
                course: { slug: target.courseSlug, status: client_1.PublishStatus.PUBLISHED },
            },
        },
        include: { blocks: true },
    });
    if (!lesson) {
        return {
            ok: false,
            status: 404,
            error: "Aula não encontrada ou cadeia não publicada (Course/Module/Lesson devem estar PUBLISHED).",
        };
    }
    const moodleBlockIds = lesson.blocks
        .filter((b) => {
        if (b.type !== client_1.BlockType.PARAGRAPH)
            return false;
        const d = b.data;
        return d.moodleFullSync != null && typeof d.moodleFullSync === "object";
    })
        .map((b) => b.id);
    const data = {
        text: full.text,
        html: full.html,
        moodleFullSync: {
            courseId: input.courseId,
            cmid: input.cmid,
            source: full.source,
            charCount: full.charCount,
            title: full.title,
            syncedAt: new Date().toISOString(),
        },
    };
    const block = await prisma_1.prisma.$transaction(async (tx) => {
        if (moodleBlockIds.length) {
            await tx.contentBlock.deleteMany({ where: { id: { in: moodleBlockIds } } });
        }
        return tx.contentBlock.create({
            data: {
                lessonId: lesson.id,
                type: client_1.BlockType.PARAGRAPH,
                sortOrder: -1000,
                data,
            },
        });
    });
    return {
        ok: true,
        lessonId: lesson.id,
        blockId: block.id,
        courseSlug: target.courseSlug,
        moduleSlug: target.moduleSlug,
        lessonSlug: target.lessonSlug,
        charCount: full.charCount,
        source: full.source,
    };
}
