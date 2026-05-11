import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { decksBySlug } from "./campus-map-point-decks.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, "campus-map-point-bundles-data.mjs");
let s = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");

for (const slug of Object.keys(decksBySlug)) {
  const esc = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(  "${esc}": \\{\\n    overviewBody: lesson\\(\\{)(?!\\n      deck:)`, "m");
  if (!re.test(s)) {
    if (new RegExp(`  "${esc}": \\{\\n    overviewBody: lesson\\(\\{\\n      deck:`,"m").test(s)) {
      continue;
    }
    throw new Error(`[apply-decks] bloco não encontrado: ${slug}`);
  }
  s = s.replace(re, `$1\n      deck: decksBySlug[${JSON.stringify(slug)}],`);
}

fs.writeFileSync(p, s.endsWith("\n") ? s : `${s}\n`, "utf8");
console.log("[apply-decks] overviewBody atualizados com deck onde faltava");
