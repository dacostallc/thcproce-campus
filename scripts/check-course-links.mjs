/**
 * Verifica se todos os IDs do mapa (courses.ts) têm course.json correspondente
 * e se todos os course.json têm hotspot no mapa.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// Extrai IDs do mapa de courses.ts
const coursesTs = fs.readFileSync(path.join(ROOT, "src/data/courses.ts"), "utf8");
const mapIds = [...coursesTs.matchAll(/\bid:\s*["']([^"']+)["']/g)]
  .map(m => m[1])
  .filter(id => id.length > 3 && !id.includes("Area") && !id.includes("http"));

// Lê todos os course.json
const coursesDir = path.join(ROOT, "src/content/courses");
const courseJsonMap = {};
for (const dir of fs.readdirSync(coursesDir)) {
  if (dir.startsWith("_")) continue;
  const jsonPath = path.join(coursesDir, dir, "course.json");
  if (!fs.existsSync(jsonPath)) continue;
  try {
    const j = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    courseJsonMap[j.courseId] = { lessonCount: j.lessonCount || 0, lessons: (j.lessons || []).length, dir };
  } catch {}
}

// Verifica manifests
const manifestMap = {};
for (const dir of fs.readdirSync(coursesDir)) {
  if (dir.startsWith("_")) continue;
  const mPath = path.join(coursesDir, dir, "manifest.ts");
  if (fs.existsSync(mPath)) {
    const m = fs.readFileSync(mPath, "utf8");
    const match = m.match(/areaId:\s*["']([^"']+)["']/);
    if (match) manifestMap[match[1]] = dir;
  }
}

console.log("=== CURSOS NO MAPA vs CONTEÚDO ===\n");

const seen = new Set();
for (const id of [...new Set(mapIds)]) {
  if (seen.has(id)) continue;
  seen.add(id);
  
  const hasJson = courseJsonMap[id];
  const hasManifest = manifestMap[id];
  const status = hasJson && hasManifest ? "✅" : hasJson ? "⚠️ " : "❌";
  const detail = hasJson 
    ? `${hasJson.lessons} aulas${!hasManifest ? " (sem manifest)" : ""}`
    : "SEM course.json";
  
  console.log(`${status} ${id.padEnd(30)} ${detail}`);
}

console.log("\n=== COURSE.JSON SEM HOTSPOT NO MAPA ===\n");
for (const [id, info] of Object.entries(courseJsonMap)) {
  if (!mapIds.includes(id)) {
    const hasManifest = manifestMap[id];
    console.log(`⚠️  ${id.padEnd(30)} ${info.lessons} aulas${!hasManifest ? " (sem manifest)" : ""} -- NÃO está no mapa`);
  }
}

console.log("\n=== MANIFESTS SEM HOTSPOT NO MAPA ===\n");
for (const [areaId] of Object.entries(manifestMap)) {
  if (!mapIds.includes(areaId) && !courseJsonMap[areaId]) {
    console.log(`⚠️  ${areaId}`);
  }
}
