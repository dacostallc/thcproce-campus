/**
 * Migra arquivos Markdown de `content/courses/<courseId>/lessons/`
 * para `src/content/courses/<courseId>/` (estrutura Blueprint canónica).
 *
 * Execute uma única vez após atualizar o código:
 *   npx --yes tsx scripts/migrate-content-to-src.mts
 *
 * O script é idempotente — pode ser executado várias vezes com segurança.
 * Não apaga os arquivos originais (precisa de confirmação manual).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const OLD_BASE = path.join(root, "content", "courses");
const NEW_BASE = path.join(root, "src", "content", "courses");

function migrateLesson(src: string, dst: string): "copied" | "skipped" | "exists" {
  if (!fs.existsSync(src)) return "skipped";
  if (fs.existsSync(dst)) return "exists";
  fs.cpSync(src, dst);
  return "copied";
}

function migrateCourse(courseId: string) {
  const oldLessonsDir = path.join(OLD_BASE, courseId, "lessons");
  const newCourseDir = path.join(NEW_BASE, courseId);
  const oldCourseJson = path.join(OLD_BASE, courseId, "course.json");
  const newCourseJson = path.join(newCourseDir, "course.json");

  if (!fs.existsSync(oldLessonsDir)) {
    console.log(`  [${courseId}] lessons/ não encontrado — pulando`);
    return;
  }

  fs.mkdirSync(newCourseDir, { recursive: true });

  // Migrar course.json
  const jsonResult = migrateLesson(oldCourseJson, newCourseJson);
  console.log(`  [${courseId}] course.json: ${jsonResult}`);

  // Migrar .md files
  const files = fs.readdirSync(oldLessonsDir).filter((f) => f.endsWith(".md"));
  let copied = 0;
  let skipped = 0;
  for (const file of files) {
    const src = path.join(oldLessonsDir, file);
    const dst = path.join(newCourseDir, file);
    const result = migrateLesson(src, dst);
    if (result === "copied") copied++;
    else skipped++;
  }
  console.log(`  [${courseId}] .md: ${copied} copiados, ${skipped} ignorados (já existiam)`);
}

// Descobre cursos com pasta lessons/
const courseDirs = fs
  .readdirSync(OLD_BASE, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
  .map((e) => e.name);

if (courseDirs.length === 0) {
  console.log("Nenhum curso encontrado em content/courses/ — nada a migrar.");
  process.exit(0);
}

console.log(`Migrando ${courseDirs.length} curso(s) de content/ → src/content/...\n`);
for (const courseId of courseDirs) {
  migrateCourse(courseId);
}

console.log(`
Migração concluída.

PRÓXIMOS PASSOS (manual):
  1. Verifique src/content/courses/ — os arquivos devem estar lá.
  2. Se tudo OK, remova content/courses/ manualmente:
       Remove-Item content\\courses -Recurse  (PowerShell)
       rm -rf content/courses               (bash)
  3. Atualize next.config.mjs: remova './content/courses/**' de outputFileTracingIncludes.
`);
