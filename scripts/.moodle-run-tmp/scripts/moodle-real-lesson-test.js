"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Smoke test: descobrir cmid de uma página no curso Cannabis 101 e chamar fetchMoodleFullContent.
 * Executar: node --env-file=.env ./node_modules/tsx/dist/cli.mjs scripts/moodle-real-lesson-test.ts
 */
const courseMap_1 = require("../src/lib/moodle/courseMap");
const ws_1 = require("../src/lib/moodle/ws");
const moodleFullContent_1 = require("../src/server/moodle/moodleFullContent");
const syncCampusLessonMoodleContent_1 = require("../src/server/moodle/syncCampusLessonMoodleContent");
async function main() {
    const map = (0, courseMap_1.parseMoodleCourseMap)();
    const courseId = map["cannabis-101"];
    if (!courseId) {
        console.error("MOODLE_COURSE_MAP sem cannabis-101");
        process.exit(1);
    }
    if (!process.env.MOODLE_WS_TOKEN?.trim()) {
        console.error("MOODLE_WS_TOKEN em falta");
        process.exit(1);
    }
    const data = await (0, ws_1.callMoodleWs)("core_course_get_contents", { courseid: courseId }, { cache: "no-store" });
    if (!data || (0, ws_1.isMoodleWsException)(data)) {
        console.error("core_course_get_contents falhou");
        console.error(JSON.stringify(data).slice(0, 500));
        process.exit(1);
    }
    if (!Array.isArray(data)) {
        console.error("Resposta inesperada");
        process.exit(1);
    }
    let picked = null;
    outer: for (const sec of data) {
        for (const mod of sec.modules ?? []) {
            if (mod.visible === 0)
                continue;
            if (mod.modname === "page" && typeof mod.id === "number") {
                picked = { cmid: mod.id, name: String(mod.name ?? ""), modname: mod.modname };
                break outer;
            }
        }
    }
    if (!picked) {
        console.error("Nenhum módulo tipo page encontrado no curso");
        process.exit(1);
    }
    console.log("--- Moodle curso ---");
    console.log("courseId (cannabis-101):", courseId);
    console.log("cmid escolhido (primeira page visível):", picked.cmid);
    console.log("nome:", picked.name);
    const full = await (0, moodleFullContent_1.fetchMoodleFullContent)({ courseId, cmid: picked.cmid });
    console.log("\n--- fetchMoodleFullContent ---");
    console.log("source:", full.source);
    console.log("title:", full.title);
    console.log("charCount:", full.charCount);
    console.log("warnings:", full.warnings);
    console.log("\nprimeiros 300 caracteres (text):");
    console.log(JSON.stringify(full.text.slice(0, 300)));
    const trySync = process.env.MOODLE_E2E_RUN_SYNC === "1";
    if (trySync && full.charCount >= 40) {
        console.log("\n--- syncCampusLessonMoodleContent (MOODLE_E2E_RUN_SYNC=1) ---");
        const r = await (0, syncCampusLessonMoodleContent_1.syncCampusLessonMoodleContent)({
            courseId,
            cmid: picked.cmid,
            areaId: "cannabis-101",
            lessonIndex: 0,
        });
        console.log(JSON.stringify(r, null, 2));
    }
    else if (full.charCount >= 40) {
        console.log("\n(sync omitido: definir MOODLE_E2E_RUN_SYNC=1 para tentar Prisma)");
    }
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
