/**
 * Copia conteúdo dos cursos com IDs errados para as pastas com IDs corretos do mapa.
 * extraction → extracao-oleo
 * medicine   → medicina
 * culinary   → culinaria
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "src", "content", "courses");

const mappings = [
  { from: "extraction", to: "extracao-oleo" },
  { from: "medicine",   to: "medicina" },
  { from: "culinary",   to: "culinaria" },
];

for (const { from, to } of mappings) {
  const fromDir = path.join(DIR, from);
  const toDir   = path.join(DIR, to);

  const j = JSON.parse(fs.readFileSync(path.join(fromDir, "course.json"), "utf8"));
  fs.mkdirSync(toDir, { recursive: true });

  // Copia .md
  const mds = fs.readdirSync(fromDir).filter(f => f.endsWith(".md"));
  for (const f of mds) {
    fs.copyFileSync(path.join(fromDir, f), path.join(toDir, f));
  }

  // course.json com courseId correto
  j.courseId = to;
  fs.writeFileSync(path.join(toDir, "course.json"), JSON.stringify(j, null, 2) + "\n");

  // manifest.ts com areaId correto
  const manifestSrc = path.join(fromDir, "manifest.ts");
  if (fs.existsSync(manifestSrc)) {
    let manifest = fs.readFileSync(manifestSrc, "utf8");
    manifest = manifest
      .replace(/areaId:\s*["'][^"']+["']/, `areaId: "${to}"`)
      .replace(/courseId:\s*["'][^"']+["']/, `courseId: "${to}"`);
    fs.writeFileSync(path.join(toDir, "manifest.ts"), manifest);
  }

  console.log(`✅ ${from} → ${to} (${mds.length} aulas)`);
}
