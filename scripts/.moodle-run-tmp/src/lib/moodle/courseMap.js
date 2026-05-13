"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMoodleCourseMap = parseMoodleCourseMap;
exports.moodleCourseIdForArea = moodleCourseIdForArea;
const courses_1 = require("@/data/courses");
/**
 * Opcional: `MOODLE_COURSE_MAP={"cannabis-101":42,"medicina":55}`
 * Sobrescreve o fallback `100 + índice` em `courses.ts`.
 */
function parseMoodleCourseMap() {
    const raw = process.env.MOODLE_COURSE_MAP?.trim();
    if (!raw)
        return {};
    try {
        const parsed = JSON.parse(raw);
        const allowed = new Set(courses_1.areas.map((a) => a.id));
        const out = {};
        for (const [slug, v] of Object.entries(parsed)) {
            if (!allowed.has(slug))
                continue;
            const n = typeof v === "number" ? v : Number(v);
            if (Number.isFinite(n) && n > 0)
                out[slug] = Math.floor(n);
        }
        return out;
    }
    catch {
        return {};
    }
}
function moodleCourseIdForArea(slug, indexFallback) {
    const m = parseMoodleCourseMap();
    const mapped = m[slug];
    if (mapped != null)
        return mapped;
    return 100 + indexFallback;
}
