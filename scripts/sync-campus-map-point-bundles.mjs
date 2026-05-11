/**
 * Sincroniza `mission.json`, `quiz.json`, `rewards.json`, `ambience.json`, `metadata.json`,
 * `seasonal.json` e reescreve o corpo de `overview.md` preservando o frontmatter YAML.
 *
 * Faixas de XP/moedas/raridade vêm de `campus-map-point-progression.mjs` (alinhado ao TS em `campusMapPointRewardTiers`).
 *
 * Uso (raiz do repo): node scripts/sync-campus-map-point-bundles.mjs
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { bundlesBySlug } from "./campus-map-point-bundles-data.mjs";
import { TIERS, progressionTierBySlug, journeyBySlug, seasonalBySlug } from "./campus-map-point-progression.mjs";

const MAP_ROOT = path.join(process.cwd(), "src", "content", "campus", "map-points");

function slugsOnDisk() {
  return fs
    .readdirSync(MAP_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((slug) => fs.existsSync(path.join(MAP_ROOT, slug, "overview.md")))
    .sort();
}

function writeJson(dir, name, obj) {
  fs.writeFileSync(path.join(dir, name), JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function mergeRewards(slug, pack) {
  const tierKey = progressionTierBySlug[slug];
  if (!tierKey || !TIERS[tierKey]) {
    throw new Error(`[bundles] tier editorial ausente para slug "${slug}"`);
  }
  const t = TIERS[tierKey];
  const badge = pack.rewards?.badge;
  if (!badge?.id || !badge?.name || !badge?.description) {
    throw new Error(`[bundles] badge incompleto em "${slug}"`);
  }
  return {
    xp: t.xp,
    greenCoins: t.greenCoins,
    growerMasterProgress: t.growerMasterProgress,
    rarity: t.rarity,
    badge
  };
}

function mergeMetadata(slug, pack) {
  const meta = { ...(pack.metadata ?? {}) };
  const j = journeyBySlug[slug];
  if (!j) {
    delete meta.prerequisites;
    delete meta.relatedAreas;
    delete meta.recommendedNext;
    return meta;
  }
  if (j.prerequisites?.length) meta.prerequisites = j.prerequisites;
  else delete meta.prerequisites;
  if (j.relatedAreas?.length) meta.relatedAreas = j.relatedAreas;
  else delete meta.relatedAreas;
  if (j.recommendedNext?.length) meta.recommendedNext = j.recommendedNext;
  else delete meta.recommendedNext;
  return meta;
}

function main() {
  const slugs = slugsOnDisk();
  let n = 0;
  for (const slug of slugs) {
    const pack = bundlesBySlug[slug];
    if (!pack) {
      console.warn(`[bundles] sem definição para pasta "${slug}" — ignorado`);
      continue;
    }
    const dir = path.join(MAP_ROOT, slug);
    const overviewPath = path.join(dir, "overview.md");
    const raw = fs.readFileSync(overviewPath, "utf8");
    const parsed = matter(raw);
    const nextFile = matter.stringify("\n" + pack.overviewBody.trim() + "\n", parsed.data, { lineWidth: 9999 });
    fs.writeFileSync(overviewPath, nextFile, "utf8");

    writeJson(dir, "mission.json", pack.mission);
    writeJson(dir, "quiz.json", pack.quiz);
    writeJson(dir, "rewards.json", mergeRewards(slug, pack));
    writeJson(dir, "ambience.json", pack.ambience);
    writeJson(dir, "metadata.json", mergeMetadata(slug, pack));

    const seasonal = seasonalBySlug[slug];
    if (seasonal?.scenarios?.length) {
      writeJson(dir, "seasonal.json", seasonal);
    } else if (fs.existsSync(path.join(dir, "seasonal.json"))) {
      fs.unlinkSync(path.join(dir, "seasonal.json"));
    }

    n += 1;
  }
  console.log(`[bundles] atualizados ${n}/${slugs.length} map-points`);
}

main();