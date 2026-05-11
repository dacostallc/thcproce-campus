import fs from "fs";
import path from "path";
import type {
  CampusMapPointAmbience,
  CampusMapPointBundleMeta,
  CampusMapPointMission,
  CampusMapPointQuiz,
  CampusMapPointRewards,
  CampusMapPointSeasonal,
  CampusMapPointSeasonalScenario
} from "@/lib/campus/campusMapPointBundle.types";

function readJson<T>(filePath: string): T | undefined {
  if (!fs.existsSync(filePath)) return undefined;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function isQuizShape(v: unknown): v is CampusMapPointQuiz {
  if (!v || typeof v !== "object") return false;
  const q = (v as CampusMapPointQuiz).questions;
  if (!Array.isArray(q) || q.length !== 2) return false;
  for (const item of q) {
    if (!item || typeof item !== "object") return false;
    const opt = (item as CampusMapPointQuiz["questions"][number]).options;
    if (!Array.isArray(opt) || opt.length !== 4) return false;
    const ci = (item as CampusMapPointQuiz["questions"][number]).correctIndex;
    if (typeof ci !== "number" || ci < 0 || ci > 3) return false;
    if (typeof (item as CampusMapPointQuiz["questions"][number]).question !== "string") return false;
    if (typeof (item as CampusMapPointQuiz["questions"][number]).id !== "string") return false;
  }
  return true;
}

function isMissionShape(v: unknown): v is CampusMapPointMission {
  if (!v || typeof v !== "object") return false;
  const m = v as CampusMapPointMission;
  if (typeof m.title !== "string" || typeof m.description !== "string") return false;
  if (!Array.isArray(m.checklist)) return false;
  return m.checklist.every((x) => typeof x === "string");
}

const REWARD_RARITIES = new Set(["comum", "raro", "épico", "lendário"]);

function isRewardsShape(v: unknown): v is CampusMapPointRewards {
  if (!v || typeof v !== "object") return false;
  const r = v as CampusMapPointRewards;
  if (typeof r.xp !== "number" || typeof r.greenCoins !== "number") return false;
  if (typeof r.growerMasterProgress !== "number") return false;
  if (r.rarity !== undefined && typeof r.rarity === "string" && !REWARD_RARITIES.has(r.rarity)) return false;
  if (!r.badge || typeof r.badge !== "object") return false;
  const b = r.badge;
  return typeof b.id === "string" && typeof b.name === "string" && typeof b.description === "string";
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isBundleMetaShape(v: unknown): v is CampusMapPointBundleMeta {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (o.theme !== undefined && typeof o.theme !== "string") return false;
  if (o.difficulty !== undefined && typeof o.difficulty !== "string") return false;
  if (o.category !== undefined && typeof o.category !== "string") return false;
  if (o.areaType !== undefined && typeof o.areaType !== "string") return false;
  if (o.tags !== undefined && !isStringArray(o.tags)) return false;
  if (o.prerequisites !== undefined && !isStringArray(o.prerequisites)) return false;
  if (o.relatedAreas !== undefined && !isStringArray(o.relatedAreas)) return false;
  if (o.recommendedNext !== undefined && !isStringArray(o.recommendedNext)) return false;
  return true;
}

function isSeasonalShape(v: unknown): v is CampusMapPointSeasonal {
  if (!v || typeof v !== "object") return false;
  const s = v as CampusMapPointSeasonal;
  if (s.scenarios === undefined) return true;
  if (!Array.isArray(s.scenarios)) return false;
  for (const sc of s.scenarios) {
    if (!sc || typeof sc !== "object") return false;
    const x = sc as CampusMapPointSeasonalScenario;
    if (typeof x.id !== "string" || typeof x.label !== "string" || typeof x.summary !== "string") return false;
    if (x.relatedSlugs !== undefined && !isStringArray(x.relatedSlugs)) return false;
  }
  return true;
}

function isAmbienceShape(v: unknown): v is CampusMapPointAmbience {
  if (!v || typeof v !== "object") return false;
  const a = v as CampusMapPointAmbience;
  if (!Array.isArray(a.lines)) return true;
  return a.lines.every((x) => typeof x === "string");
}

/** Anexa ficheiros JSON opcionais na pasta do map-point (mesmo nível que overview.md). */
export function readCampusMapPointBundleSlice(mapPointId: string): {
  mission?: CampusMapPointMission;
  quiz?: CampusMapPointQuiz;
  rewards?: CampusMapPointRewards;
  ambience?: CampusMapPointAmbience;
  bundleMeta?: CampusMapPointBundleMeta;
  seasonal?: CampusMapPointSeasonal;
} {
  const id = mapPointId.trim();
  if (!/^[a-z0-9-]{1,120}$/.test(id)) return {};

  const dir = path.join(process.cwd(), "src", "content", "campus", "map-points", id);

  const missionRaw = readJson<unknown>(path.join(dir, "mission.json"));
  const quizRaw = readJson<unknown>(path.join(dir, "quiz.json"));
  const rewardsRaw = readJson<unknown>(path.join(dir, "rewards.json"));
  const ambienceRaw = readJson<unknown>(path.join(dir, "ambience.json"));
  const bundleMetaRaw = readJson<unknown>(path.join(dir, "metadata.json"));
  const seasonalRaw = readJson<unknown>(path.join(dir, "seasonal.json"));

  return {
    mission: isMissionShape(missionRaw) ? missionRaw : undefined,
    quiz: isQuizShape(quizRaw) ? quizRaw : undefined,
    rewards: isRewardsShape(rewardsRaw) ? rewardsRaw : undefined,
    ambience: isAmbienceShape(ambienceRaw) ? ambienceRaw : undefined,
    bundleMeta: isBundleMetaShape(bundleMetaRaw) ? bundleMetaRaw : undefined,
    seasonal: isSeasonalShape(seasonalRaw) ? seasonalRaw : undefined
  };
}
