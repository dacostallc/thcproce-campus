"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeMoodleLessonHtml = sanitizeMoodleLessonHtml;
exports.fetchMoodleFullContent = fetchMoodleFullContent;
/**
 * Conteúdo completo de actividades Moodle (server-side).
 *
 * Funções WS usadas (além de `core_course_get_contents` já existente no projeto):
 * - `mod_page_get_pages_by_courses` — corpo HTML da página (intro + content)
 * - `mod_book_get_books_by_courses` — só introdução; capítulos não são expostos pelo núcleo Moodle via WS
 * - `mod_lesson_get_pages` + `mod_lesson_get_page_data` (returncontents) — páginas de conteúdo da lesson
 * - `mod_resource_get_resources_by_courses` — intro HTML do recurso (ficheiros não são embed aqui)
 * - `mod_label_get_labels_by_courses` — rótulo/intro
 * - `mod_url_get_urls_by_courses` — intro + URL externa como texto
 *
 * Requer `MOODLE_WS_TOKEN`, base URL (ver `src/lib/moodle/ws.ts`) e funções activadas no serviço externo.
 */
const ws_1 = require("@/lib/moodle/ws");
const FETCH_INIT = { cache: "no-store" };
const MAX_RAW_HTML = 800000;
/** Remove superfícies de ataque comuns; preserva marcação simples (títulos, listas, links). */
function sanitizeMoodleLessonHtml(unsafe) {
    let s = unsafe.slice(0, MAX_RAW_HTML);
    s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
    s = s.replace(/<style[\s\S]*?<\/style>/gi, "");
    s = s.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
    s = s.replace(/<object[\s\S]*?<\/object>/gi, "");
    s = s.replace(/<embed[^>]*>/gi, "");
    s = s.replace(/\s(on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))/gi, "");
    s = s.replace(/javascript:/gi, "");
    s = s.replace(/vbscript:/gi, "");
    return s.trim();
}
function buildResult(base) {
    const html = sanitizeMoodleLessonHtml(base.htmlRaw);
    const text = (0, ws_1.stripHtml)(html);
    const { htmlRaw: _, ...rest } = base;
    return {
        ...rest,
        html,
        text,
        charCount: text.length,
    };
}
function emptyResult(courseId, cmid, reason) {
    return {
        source: "none",
        title: "",
        html: "",
        text: "",
        charCount: 0,
        courseId,
        cmid,
        modname: "",
        instanceId: null,
        warnings: [reason],
    };
}
async function loadCourseModules(courseId) {
    const data = await (0, ws_1.callMoodleWs)("core_course_get_contents", { courseid: courseId }, FETCH_INIT);
    if (!data || (0, ws_1.isMoodleWsException)(data) || !Array.isArray(data))
        return null;
    const out = [];
    for (const sec of data) {
        for (const mod of sec.modules ?? []) {
            if (mod.visible === 0)
                continue;
            out.push(mod);
        }
    }
    return out;
}
function pickModule(modules, cmid) {
    return modules.find((m) => readPositiveId(m.id) === cmid) ?? null;
}
function asRecord(v) {
    return v && typeof v === "object" ? v : null;
}
function readString(r, key) {
    const v = r[key];
    return typeof v === "string" ? v : "";
}
function safeHttpUrl(raw) {
    const u = raw.trim();
    if (!/^https?:\/\//i.test(u))
        return "";
    return u.replace(/[\s"'<>`]/g, "");
}
function escapeXml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function readPositiveId(v) {
    if (typeof v === "number" && Number.isFinite(v) && v > 0)
        return v;
    if (typeof v === "string") {
        const n = Number(v);
        if (Number.isFinite(n) && n > 0)
            return n;
    }
    return null;
}
function drillLessonPageHtml(pd) {
    const o = asRecord(pd);
    if (!o)
        return "";
    const page = asRecord(o.page);
    if (page) {
        const c = page.contents;
        if (typeof c === "string" && c.trim())
            return c;
    }
    const c0 = o.contents;
    if (typeof c0 === "string" && c0.trim())
        return c0;
    return "";
}
async function fetchLessonBodyHtml(lessonInstanceId, warnings) {
    const pagesRes = await (0, ws_1.callMoodleWs)("mod_lesson_get_pages", { lessonid: lessonInstanceId }, FETCH_INIT);
    if (!pagesRes || (0, ws_1.isMoodleWsException)(pagesRes)) {
        warnings.push("mod_lesson_get_pages falhou ou não está disponível no serviço externo.");
        return "";
    }
    const pages = asRecord(pagesRes)?.pages;
    if (!Array.isArray(pages) || pages.length === 0) {
        warnings.push("Lesson sem páginas listadas em mod_lesson_get_pages.");
        return "";
    }
    const chunks = [];
    for (const p of pages) {
        const pr = asRecord(p);
        const pageId = readPositiveId(pr?.id);
        if (pageId == null)
            continue;
        const pd = await (0, ws_1.callMoodleWs)("mod_lesson_get_page_data", {
            lessonid: lessonInstanceId,
            pageid: pageId,
            returncontents: 1,
        }, FETCH_INIT);
        if (!pd || (0, ws_1.isMoodleWsException)(pd))
            continue;
        const html = drillLessonPageHtml(pd);
        if (html.trim())
            chunks.push(html);
    }
    if (chunks.length === 0) {
        warnings.push("Nenhum HTML de página obtido via mod_lesson_get_page_data (ver permissões returncontents).");
    }
    return chunks.join('<hr class="thc-moodle-lesson-sep" />');
}
async function fetchMoodleFullContent(args) {
    const { courseId, cmid } = args;
    const modules = await loadCourseModules(courseId);
    if (!modules) {
        return emptyResult(courseId, cmid, "core_course_get_contents falhou ou curso inacessível.");
    }
    const mod = pickModule(modules, cmid);
    if (!mod) {
        return emptyResult(courseId, cmid, `Nenhum módulo visível com cmid=${cmid} neste curso.`);
    }
    const title = typeof mod.name === "string" ? mod.name : "";
    const modname = typeof mod.modname === "string" ? mod.modname.toLowerCase().trim() : "";
    const instance = readPositiveId(mod.instance);
    const desc = typeof mod.description === "string" ? mod.description : "";
    const warnings = [];
    const meta = {
        courseId,
        cmid,
        modname,
        instanceId: instance,
        title,
        warnings,
    };
    if (!instance) {
        warnings.push("instance (id da actividade) ausente em core_course_get_contents.");
        return buildResult({
            ...meta,
            source: "moodle_description",
            htmlRaw: desc,
        });
    }
    if (modname === "page") {
        const res = await (0, ws_1.callMoodleWs)("mod_page_get_pages_by_courses", { courseids: [courseId] }, FETCH_INIT);
        if (!res || (0, ws_1.isMoodleWsException)(res)) {
            warnings.push("mod_page_get_pages_by_courses falhou.");
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        const list = asRecord(res)?.pages;
        if (!Array.isArray(list)) {
            warnings.push("Resposta mod_page sem array pages.");
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        const page = list.find((p) => readPositiveId(asRecord(p)?.id) === instance);
        const pr = asRecord(page);
        if (!pr) {
            warnings.push(`Página com instance=${instance} não encontrada na lista do curso.`);
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        const intro = readString(pr, "intro");
        const content = readString(pr, "content");
        const htmlRaw = [intro, content].filter(Boolean).join("<hr />");
        return buildResult({ ...meta, source: "moodle_page", htmlRaw });
    }
    if (modname === "book") {
        const res = await (0, ws_1.callMoodleWs)("mod_book_get_books_by_courses", { courseids: [courseId] }, FETCH_INIT);
        if (!res || (0, ws_1.isMoodleWsException)(res)) {
            warnings.push("mod_book_get_books_by_courses falhou.");
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        const books = asRecord(res)?.books;
        if (!Array.isArray(books)) {
            warnings.push("Resposta mod_book sem array books.");
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        const book = books.find((b) => readPositiveId(asRecord(b)?.id) === instance);
        const br = asRecord(book);
        if (!br) {
            warnings.push(`Livro instance=${instance} não encontrado.`);
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        warnings.push("Livro Moodle: o núcleo só expõe introdução via WS; capítulos completos exigem extensão ou ingestão alternativa.");
        const intro = readString(br, "intro");
        return buildResult({ ...meta, source: "moodle_book", htmlRaw: intro || desc });
    }
    if (modname === "lesson") {
        const body = await fetchLessonBodyHtml(instance, warnings);
        if (body.trim()) {
            return buildResult({ ...meta, source: "moodle_lesson", htmlRaw: body });
        }
        const res = await (0, ws_1.callMoodleWs)("mod_lesson_get_lessons_by_courses", { courseids: [courseId] }, FETCH_INIT);
        if (res && !(0, ws_1.isMoodleWsException)(res)) {
            const lessons = asRecord(res)?.lessons;
            if (Array.isArray(lessons)) {
                const lesson = lessons.find((l) => readPositiveId(asRecord(l)?.id) === instance);
                const intro = readString(asRecord(lesson) ?? {}, "intro");
                if (intro.trim()) {
                    return buildResult({ ...meta, source: "moodle_lesson", htmlRaw: intro });
                }
            }
        }
        return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
    }
    if (modname === "resource") {
        const res = await (0, ws_1.callMoodleWs)("mod_resource_get_resources_by_courses", { courseids: [courseId] }, FETCH_INIT);
        if (!res || (0, ws_1.isMoodleWsException)(res)) {
            warnings.push("mod_resource_get_resources_by_courses falhou.");
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        const resources = asRecord(res)?.resources;
        if (!Array.isArray(resources)) {
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        const r = resources.find((x) => readPositiveId(asRecord(x)?.id) === instance);
        const intro = readString(asRecord(r) ?? {}, "intro");
        return buildResult({
            ...meta,
            source: intro.trim() ? "moodle_resource" : "moodle_description",
            htmlRaw: intro.trim() ? intro : desc,
        });
    }
    if (modname === "label") {
        const res = await (0, ws_1.callMoodleWs)("mod_label_get_labels_by_courses", { courseids: [courseId] }, FETCH_INIT);
        if (!res || (0, ws_1.isMoodleWsException)(res)) {
            warnings.push("mod_label_get_labels_by_courses falhou.");
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        const labels = asRecord(res)?.labels;
        if (!Array.isArray(labels)) {
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        const lab = labels.find((x) => readPositiveId(asRecord(x)?.id) === instance);
        const intro = readString(asRecord(lab) ?? {}, "intro");
        return buildResult({
            ...meta,
            source: intro.trim() ? "moodle_label" : "moodle_description",
            htmlRaw: intro.trim() ? intro : desc,
        });
    }
    if (modname === "url") {
        const res = await (0, ws_1.callMoodleWs)("mod_url_get_urls_by_courses", { courseids: [courseId] }, FETCH_INIT);
        if (!res || (0, ws_1.isMoodleWsException)(res)) {
            warnings.push("mod_url_get_urls_by_courses falhou.");
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        const urls = asRecord(res)?.urls;
        if (!Array.isArray(urls)) {
            return buildResult({ ...meta, source: "moodle_description", htmlRaw: desc });
        }
        const u = urls.find((x) => readPositiveId(asRecord(x)?.id) === instance);
        const ur = asRecord(u) ?? {};
        const intro = readString(ur, "intro");
        const externalurl = readString(ur, "externalurl");
        const safe = safeHttpUrl(externalurl);
        const linkPara = safe ? `<p><a href="${safe}">${escapeXml(safe)}</a></p>` : "";
        const htmlRaw = [intro, linkPara].filter(Boolean).join("<hr />");
        return buildResult({
            ...meta,
            source: htmlRaw.trim() ? "moodle_url" : "moodle_description",
            htmlRaw: htmlRaw.trim() ? htmlRaw : desc,
        });
    }
    return buildResult({
        ...meta,
        source: "moodle_description",
        htmlRaw: desc,
    });
}
