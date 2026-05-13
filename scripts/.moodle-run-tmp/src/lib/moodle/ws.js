"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMoodleWsException = isMoodleWsException;
exports.callMoodleWs = callMoodleWs;
exports.fetchEnrolledCoursesForUser = fetchEnrolledCoursesForUser;
exports.fetchCompletionStatus = fetchCompletionStatus;
exports.stripHtml = stripHtml;
exports.fetchCourseContentsFlat = fetchCourseContentsFlat;
exports.validateMoodleToken = validateMoodleToken;
const courses_1 = require("@/content/courses");
/**
 * Chamadas ao Moodle Web Services (REST).
 * Sem MOODLE_WS_TOKEN, as funções devolvem mocks para desenvolvimento.
 *
 * Use `MOODLE_WS_BASE_URL` (servidor) quando o caminho público /escola estiver bloqueado no edge
 * mas o Moodle continuar acessível por hostname interno ou URL técnica.
 */
const base = () => {
    const internal = typeof process.env.MOODLE_WS_BASE_URL === "string"
        ? process.env.MOODLE_WS_BASE_URL.trim().replace(/\/$/, "")
        : "";
    if (internal)
        return internal;
    return process.env.NEXT_PUBLIC_MOODLE_BASE_URL?.replace(/\/$/, "") ?? "";
};
/** Resposta de erro padrão do Moodle REST (`exception`, `message`, …). */
function isMoodleWsException(data) {
    return Boolean(data && typeof data === "object" && "exception" in data);
}
/**
 * Chamada REST genérica ao Moodle (GET). Arrays usam notação `key[0]`, `key[1]`, … como no PHP Moodle.
 * Nunca exponha o token ao cliente — só server-side.
 */
async function callMoodleWs(wsfunction, params = {}, init) {
    const tok = process.env.MOODLE_WS_TOKEN;
    const b = base();
    if (!tok || !b)
        return null;
    const qs = new URLSearchParams({
        moodlewsrestformat: "json",
        wstoken: tok,
        wsfunction
    });
    for (const [key, val] of Object.entries(params)) {
        if (Array.isArray(val)) {
            val.forEach((item, i) => {
                qs.append(`${key}[${i}]`, String(item));
            });
        }
        else {
            qs.append(key, String(val));
        }
    }
    const url = `${b}/webservice/rest/server.php?${qs.toString()}`;
    const res = await fetch(url, {
        method: "GET",
        next: { revalidate: 60 },
        ...init
    });
    if (!res.ok)
        return null;
    return (await res.json());
}
async function ws(wsfunction, params = {}) {
    return callMoodleWs(wsfunction, params, {});
}
async function fetchEnrolledCoursesForUser(moodleUserId) {
    const data = await ws("core_enrol_get_users_courses", {
        userid: String(moodleUserId)
    });
    if (data)
        return data;
    return [
        { id: 1, fullname: (0, courses_1.cannabis101DisplayName)(), shortname: "C101" },
        { id: 2, fullname: "Cultivo Indoor", shortname: "IND" }
    ];
}
async function fetchCompletionStatus(courseId, moodleUserId) {
    const data = await ws("core_completion_get_course_completion_status", {
        courseid: String(courseId),
        userid: String(moodleUserId)
    });
    if (!data)
        return null;
    const d = data;
    return { completed: Boolean(d.completionstatus?.completed) };
}
/** Texto plano seguro a partir de HTML (intro Moodle, pré-visualização). */
function stripHtml(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function isWsException(data) {
    return isMoodleWsException(data);
}
/**
 * Secções e módulos do curso (páginas, quiz, etc.).
 * Requer `core_course_get_contents` activo no serviço externo Moodle + `MOODLE_WS_TOKEN`.
 */
async function fetchCourseContentsFlat(courseId) {
    const data = await ws("core_course_get_contents", {
        courseid: String(courseId)
    });
    if (!data || isWsException(data))
        return null;
    if (!Array.isArray(data))
        return null;
    const out = [];
    for (const sec of data) {
        /** Rótulo bruto usado também no matcher campus ↔ LMS; a UI só vê texto suavizado no router. */
        const sectionTitle = (typeof sec.name === "string" && sec.name.trim()) ||
            (typeof sec.section === "number" ? `Secção ${sec.section}` : "Secção");
        for (const mod of sec.modules ?? []) {
            if (mod.visible === 0)
                continue;
            const summaryHtml = typeof mod.description === "string" ? mod.description : "";
            const moodleUrl = typeof mod.url === "string" && mod.url.trim() ? mod.url.trim() : null;
            out.push({
                sectionTitle,
                moduleName: typeof mod.name === "string" ? mod.name : "",
                modname: typeof mod.modname === "string" ? mod.modname : "",
                moodleUrl,
                summaryText: stripHtml(summaryHtml).slice(0, 12000)
            });
        }
    }
    return out;
}
/** Valida token de sessão do app móvel / webservice (quando configurado). */
async function validateMoodleToken(_token) {
    return null;
}
