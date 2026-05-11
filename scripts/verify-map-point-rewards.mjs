/**
 * Garante que cada rewards.json está alinhado a TIERS + progressionTierBySlug.
 * Uso: node scripts/verify-map-point-rewards.mjs
 */
import fs from "fs";
import path from "path";
import { TIERS, progressionTierBySlug } from "./campus-map-point-progression.mjs";

const MAP_ROOT = path.join(process.cwd(), "src", "content", "campus", "map-points");
const errors = [];

for (const slug of fs.readdirSync(MAP_ROOT).sort()) {
  const rp = path.join(MAP_ROOT, slug, "rewards.json");
  if (!fs.existsSync(rp)) continue;
  const tier = progressionTierBySlug[slug];
  if (!tier || !TIERS[tier]) {
    errors.push(`[${slug}] tier não definido em progressionTierBySlug`);
    continue;
  }
  const t = TIERS[tier];
  let r;
  try {
    r = JSON.parse(fs.readFileSync(rp, "utf8"));
  } catch {
    errors.push(`[${slug}] rewards.json inválido`);
    continue;
  }
  if (r.xp !== t.xp || r.greenCoins !== t.greenCoins || r.growerMasterProgress !== t.growerMasterProgress || r.rarity !== t.rarity) {
    errors.push(
      `[${slug}] drift: esperado xp=${t.xp}, gc=${t.greenCoins}, gm=${t.growerMasterProgress}, rarity=${t.rarity}; disco=${JSON.stringify(
        { xp: r.xp, greenCoins: r.greenCoins, growerMasterProgress: r.growerMasterProgress, rarity: r.rarity }
      )}`
    );
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("[verify-map-point-rewards] todos os rewards.json conferem com os tiers.");
