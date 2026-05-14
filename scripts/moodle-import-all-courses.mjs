/**
 * Importa conteúdo completo de todos os cursos do Moodle como arquivos .md
 * e gera course.json para cada curso.
 *
 * Uso: node scripts/moodle-import-all-courses.mjs
 *
 * O que faz:
 * 1. Para cada curso no MOODLE_COURSE_MAP, busca todas as páginas via mod_page_get_pages_by_courses
 * 2. Converte HTML → texto limpo
 * 3. Salva como arquivos .md em src/content/courses/<slug>/
 * 4. Gera course.json com a lista de aulas
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// Mapeamento Moodle ID → slug canônico do campus
const MOODLE_TO_SLUG = {
  12:  "cannabis-101",   // Germinação de Sementes
  15:  "cultivo-indoor", // A Fase da Vegetação
  17:  "cultivo-floracao", // Transição e Floração (novo slug)
  18:  "extraction",     // Extração do Óleo de Cannabis
  19:  "hash-maker",     // Hash Maker
  20:  "nutricao-cannabis", // Nutrientes (novo slug)
  21:  "cultivo-solo",   // Preparação de Solo (novo slug)
  22:  "medicine",       // Aplicações Terapêuticas
  23:  "culinary",       // Culinária com Cannabis
  24:  "genetica",       // Sementes Feminizadas
};

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
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${wsfunction}`);
  const data = await res.json();
  if (data?.exception) throw new Error(`WS ${wsfunction}: ${data.message}`);
  return data;
}

// Converte HTML para Markdown básico
function htmlToMarkdown(html = "") {
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1")
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<li[^>]*>(.*?)<\/li>/gis, "- $1\n")
    .replace(/<ul[^>]*>|<\/ul>/gi, "\n")
    .replace(/<ol[^>]*>|<\/ol>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function importCourse(moodleId, courseSlug) {
  console.log(`\n📥 Importando curso ${moodleId} → ${courseSlug}...`);

  const outDir = path.join(ROOT, "src", "content", "courses", courseSlug);
  fs.mkdirSync(outDir, { recursive: true });

  // Busca estrutura do curso
  const contents = await ws("core_course_get_contents", { courseid: String(moodleId) });

  // Busca páginas completas
  let pages = [];
  try {
    const pagesResult = await ws("mod_page_get_pages_by_courses", { "courseids[0]": String(moodleId) });
    pages = pagesResult?.pages ?? [];
  } catch (e) {
    console.warn(`  ⚠️  mod_page_get_pages_by_courses falhou: ${e.message}`);
  }

  // Busca resources (arquivos texto)
  let resources = [];
  try {
    const resourcesResult = await ws("mod_resource_get_resources_by_courses", { "courseids[0]": String(moodleId) });
    resources = resourcesResult?.resources ?? [];
  } catch { /* ignora */ }

  // Mapa cmid → página completa
  const pageMap = new Map(pages.map(p => [p.coursemodule, p]));
  const resourceMap = new Map(resources.map(r => [r.coursemodule, r]));

  // Extrai nome do curso para título
  let courseTitle = `Curso ${moodleId}`;
  try {
    const info = await ws("core_course_get_courses", { "options[ids][0]": String(moodleId) });
    if (info?.[0]?.fullname) courseTitle = info[0].fullname;
  } catch { /* ignora */ }

  // Coleta módulos visíveis com conteúdo
  const lessonIds = [];
  let lessonOrder = 1;

  for (const section of contents) {
    for (const mod of (section.modules || [])) {
      if (mod.visible === 0) continue;
      if (!["page", "resource", "label"].includes(mod.modname)) continue;

      const lessonSlug = `${courseSlug.replace(/-/g, "").slice(0, 4)}-l${String(lessonOrder).padStart(2, "0")}-${slugify(mod.name)}`;
      const mdPath = path.join(outDir, `${lessonSlug}.md`);

      // Se já existe, não sobrescreve (preserva conteúdo manual)
      if (fs.existsSync(mdPath)) {
        lessonIds.push(lessonSlug);
        lessonOrder++;
        continue;
      }

      let bodyMd = "";
      let summaryMd = htmlToMarkdown(mod.description || "");

      if (mod.modname === "page") {
        const page = pageMap.get(mod.id);
        if (page?.content) {
          bodyMd = htmlToMarkdown(page.content);
        } else {
          bodyMd = summaryMd;
        }
      } else if (mod.modname === "resource") {
        const res = resourceMap.get(mod.id);
        bodyMd = summaryMd || htmlToMarkdown(res?.intro || "");
      } else {
        bodyMd = summaryMd;
      }

      if (!bodyMd || bodyMd.length < 30) continue;

      const frontmatter = [
        "---",
        `title: "${mod.name.replace(/"/g, "'")}"`,
        `lessonId: "${lessonSlug}"`,
        `courseId: "${courseSlug}"`,
        `module: "${(section.name || "Módulo").replace(/"/g, "'")}"`,
        `order: ${lessonOrder}`,
        `level: "Intermediário"`,
        `moodleCmid: ${mod.id}`,
        `moodleCourseId: ${moodleId}`,
        "---",
        "",
      ].join("\n");

      fs.writeFileSync(mdPath, frontmatter + `# ${mod.name}\n\n` + bodyMd + "\n");
      lessonIds.push(lessonSlug);
      lessonOrder++;
      process.stdout.write(".");
    }
  }

  console.log(`\n  ✅ ${lessonIds.length} aulas importadas`);

  // Gera/atualiza course.json apenas se não existir ou se está desatualizado
  const courseJsonPath = path.join(outDir, "course.json");
  const courseJson = {
    courseId: courseSlug,
    version: 1,
    title: courseTitle,
    lessonCount: lessonIds.length,
    lessons: lessonIds,
    moodleId,
    importedAt: new Date().toISOString(),
  };
  fs.writeFileSync(courseJsonPath, JSON.stringify(courseJson, null, 2) + "\n");

  return { courseSlug, lessonCount: lessonIds.length, courseTitle };
}

async function main() {
  loadDotEnv();

  const results = [];
  const failed = [];

  for (const [moodleId, courseSlug] of Object.entries(MOODLE_TO_SLUG)) {
    try {
      const result = await importCourse(Number(moodleId), courseSlug);
      results.push(result);
    } catch (e) {
      console.error(`\n❌ Falha no curso ${moodleId}: ${e.message}`);
      failed.push({ moodleId, error: e.message });
    }
  }

  console.log("\n\n=== RESUMO DA IMPORTAÇÃO ===");
  results.forEach(r => console.log(`✅ ${r.courseSlug}: ${r.lessonCount} aulas — ${r.courseTitle}`));
  if (failed.length) {
    console.log("\nFalhas:");
    failed.forEach(f => console.log(`❌ Moodle ${f.moodleId}: ${f.error}`));
  }
  console.log(`\nTotal: ${results.reduce((acc, r) => acc + r.lessonCount, 0)} aulas importadas`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
