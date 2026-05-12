/**
 * Exporta estrutura + texto disponível via Web Services do curso Cannabis 101 no Moodle legado.
 *
 * Pré-requisitos no Moodle (serviço externo ligado ao token):
 * - core_course_get_contents
 * - mod_page_get_pages_by_courses (recomendado — corpo das atividades "Página")
 *
 * Uso (na raiz do repo):
 *   node scripts/moodle-export-cannabis101.mjs
 *   node scripts/moodle-export-cannabis101.mjs --stdout
 *
 * Variáveis (.env ou shell):
 * - MOODLE_WS_TOKEN (obrigatório)
 * - MOODLE_WS_BASE_URL ou NEXT_PUBLIC_MOODLE_BASE_URL (base até /escola, sem barra final)
 * - ID do curso: MOODLE_COURSE_MAP com {"cannabis-101":NNN} OU NEXT_PUBLIC_MOODLE_CANNABIS101_COURSE_ID=NNN
 *
 * Saída padrão: docs/moodle-export/cannabis-101.json (gitignored recomendado se contiver dados internos)
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "docs", "moodle-export");
const OUT_FILE = path.join(OUT_DIR, "cannabis-101.json");

function loadDotEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(ROOT, name);
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, "utf8");
    for (let line of raw.split(/\r?\n/)) {
      line = line.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
    break;
  }
}

function moodleBase() {
  const internal = (process.env.MOODLE_WS_BASE_URL || "").trim().replace(/\/$/, "");
  if (internal) return internal;
  return (process.env.NEXT_PUBLIC_MOODLE_BASE_URL || "").trim().replace(/\/$/, "");
}

function cannabis101CourseId() {
  const rawMap = (process.env.MOODLE_COURSE_MAP || "").trim();
  if (rawMap) {
    try {
      const m = JSON.parse(rawMap);
      const id = m["cannabis-101"];
      const n = typeof id === "number" ? id : Number(id);
      if (Number.isFinite(n) && n > 0) return Math.floor(n);
    } catch {
      /* ignore */
    }
  }
  const id = (process.env.NEXT_PUBLIC_MOODLE_CANNABIS101_COURSE_ID || "").trim();
  const n = Number(id);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}

function qs(url, params) {
  const usp = new URLSearchParams({
    moodlewsrestformat: "json",
    ...params
  });
  return `${url}?${usp.toString()}`;
}

async function ws(wsfunction, params) {
  const tok = (process.env.MOODLE_WS_TOKEN || "").trim();
  const b = moodleBase();
  if (!tok || !b) {
    throw new Error(
      "Defina MOODLE_WS_TOKEN e MOODLE_WS_BASE_URL ou NEXT_PUBLIC_MOODLE_BASE_URL (ver docs/MOODLE_CANNABIS101_EXPORT.md)."
    );
  }
  const url = qs(`${b}/webservice/rest/server.php`, {
    wstoken: tok,
    wsfunction,
    ...params
  });
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`Moodle HTTP ${res.status}: ${wsfunction}`);
  const data = await res.json();
  if (data && typeof data === "object" && "exception" in data) {
    throw new Error(`Moodle WS ${wsfunction}: ${data.message || JSON.stringify(data)}`);
  }
  return data;
}

function stripHtml(html) {
  if (typeof html !== "string") return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenContents(sections) {
  const out = [];
  if (!Array.isArray(sections)) return out;
  for (const sec of sections) {
    const sectionTitle =
      (typeof sec.name === "string" && sec.name.trim()) ||
      (typeof sec.section === "number" ? `Secção ${sec.section}` : "Secção");
    for (const mod of sec.modules || []) {
      if (mod.visible === 0) continue;
      const desc = typeof mod.description === "string" ? mod.description : "";
      out.push({
        sectionTitle,
        moduleName: typeof mod.name === "string" ? mod.name : "",
        modname: typeof mod.modname === "string" ? mod.modname : "",
        cmid: typeof mod.id === "number" ? mod.id : Number(mod.id) || null,
        moodleUrl: typeof mod.url === "string" && mod.url.trim() ? mod.url.trim() : null,
        summaryPlain: stripHtml(desc).slice(0, 12000)
      });
    }
  }
  return out;
}

async function main() {
  loadDotEnv();
  const courseId = cannabis101CourseId();
  if (!courseId) {
    throw new Error(
      "ID do curso Cannabis 101 não encontrado. Use MOODLE_COURSE_MAP={\"cannabis-101\":<id>} ou NEXT_PUBLIC_MOODLE_CANNABIS101_COURSE_ID=<id>."
    );
  }

  const contents = await ws("core_course_get_contents", {
    courseid: String(courseId)
  });

  let pagesFromApi = null;
  try {
    pagesFromApi = await ws("mod_page_get_pages_by_courses", {
      "courseids[0]": String(courseId)
    });
  } catch (e) {
    pagesFromApi = { _error: String(e.message || e), hint: "Adicione mod_page_get_pages_by_courses ao serviço WS no Moodle." };
  }

  const payload = {
    areaId: "cannabis-101",
    courseId,
    moodleBase: moodleBase(),
    fetchedAt: new Date().toISOString(),
    outlineFlat: flattenContents(contents),
    pagesByCourse: pagesFromApi
  };

  const json = JSON.stringify(payload, null, 2);
  const stdout = process.argv.includes("--stdout");
  if (stdout) {
    console.log(json);
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, json, "utf8");
  console.log(`Cannabis 101: exportados ${payload.outlineFlat.length} módulos visíveis → ${OUT_FILE}`);
  if (pagesFromApi && pagesFromApi._error) {
    console.warn("Aviso:", pagesFromApi._error);
    console.warn("Sem mod_page: só há descrições do sumário do curso (souvente vazias para Página).");
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
