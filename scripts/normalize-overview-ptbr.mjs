/**
 * Normaliza trechos PT-BR recorrentes no frontmatter/corpo dos overview.md
 * (preserva YAML; não altera estrutura das chaves).
 *
 * Uso: node scripts/normalize-overview-ptbr.mjs
 */
import fs from "fs";
import path from "path";

const MAP_ROOT = path.join(process.cwd(), "src", "content", "campus", "map-points");

function patch(content) {
  return content
    .replace(/\bregistos\b/g, "registros")
    .replace(/\bregisto\b/g, "registro")
    .replace(/\bComcompartilha\b/g, "Compartilha")
    .replace(/\bcomcompartilham\b/g, "compartilham")
    .replace(/\bModeración\b/g, "Moderação");
}

let n = 0;
for (const slug of fs.readdirSync(MAP_ROOT)) {
  const p = path.join(MAP_ROOT, slug, "overview.md");
  if (!fs.existsSync(p)) continue;
  const raw = fs.readFileSync(p, "utf8");
  const next = patch(raw);
  if (next !== raw) {
    fs.writeFileSync(p, next.endsWith("\n") ? next : `${next}\n`, "utf8");
    n++;
  }
}
console.log(`[normalize-overview-ptbr] atualizados ${n} ficheiros`);
