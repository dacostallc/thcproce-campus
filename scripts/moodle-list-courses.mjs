/**
 * Lista todos os cursos disponíveis no Moodle e mostra estrutura de módulos.
 * Uso: node scripts/moodle-list-courses.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

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
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = val;
    }
    break;
  }
}

async function ws(wsfunction, params = {}) {
  const tok = (process.env.MOODLE_WS_TOKEN || "").trim();
  const base = (process.env.MOODLE_WS_BASE_URL || process.env.NEXT_PUBLIC_MOODLE_BASE_URL || "").trim().replace(/\/$/, "");
  const usp = new URLSearchParams({ moodlewsrestformat: "json", wstoken: tok, wsfunction, ...params });
  const res = await fetch(`${base}/webservice/rest/server.php?${usp}`);
  const data = await res.json();
  if (data?.exception) throw new Error(`WS ${wsfunction}: ${data.message}`);
  return data;
}

function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function main() {
  loadDotEnv();

  const courseMap = JSON.parse(process.env.MOODLE_COURSE_MAP || "{}");
  const courseIds = Object.values(courseMap).filter(Boolean);

  console.log(`\n🔍 Moodle: ${process.env.MOODLE_WS_BASE_URL}`);
  console.log(`📚 IDs no MOODLE_COURSE_MAP: ${courseIds.join(", ")}\n`);

  const results = [];

  for (const courseId of courseIds) {
    try {
      const contents = await ws("core_course_get_contents", { courseid: String(courseId) });
      const slug = Object.entries(courseMap).find(([, v]) => v == courseId)?.[0] ?? `curso-${courseId}`;

      const modules = [];
      for (const sec of contents) {
        for (const mod of (sec.modules || [])) {
          if (mod.visible === 0) continue;
          modules.push({
            cmid: mod.id,
            name: mod.name,
            modname: mod.modname,
            section: sec.name,
            summary: stripHtml(mod.description || "").slice(0, 200),
          });
        }
      }

      // Tenta pegar o nome do curso
      let courseName = `Curso ${courseId}`;
      try {
        const courseInfo = await ws("core_course_get_courses", { "options[ids][0]": String(courseId) });
        if (courseInfo?.[0]?.fullname) courseName = courseInfo[0].fullname;
      } catch { /* ignora */ }

      results.push({ courseId, slug, courseName, moduleCount: modules.length, modules: modules.slice(0, 5) });

      console.log(`✅ [${courseId}] ${courseName} (slug: ${slug}) — ${modules.length} módulos visíveis`);
      modules.slice(0, 3).forEach(m => console.log(`     cmid:${m.cmid} [${m.modname}] ${m.name.slice(0, 60)}`));
    } catch (e) {
      console.log(`❌ [${courseId}] Erro: ${e.message}`);
    }
  }

  const outDir = path.join(ROOT, "docs", "moodle-export");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "courses-map.json"), JSON.stringify(results, null, 2));
  console.log(`\n📄 Mapa salvo em docs/moodle-export/courses-map.json`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
