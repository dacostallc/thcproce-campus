import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  CampusMapPointAmbience,
  CampusMapPointBundleMeta,
  CampusMapPointMission,
  CampusMapPointQuiz,
  CampusMapPointRewards,
  CampusMapPointSeasonal
} from "@/lib/campus/campusMapPointBundle.types";
import { resolveCampusMapPointContentFolderSlug } from "@/lib/campus/campusMapPointContentSlug";
import { readCampusMapPointBundleSlice } from "@/lib/campus/readCampusMapPointBundle";

const MAP_POINT_ID_RE = /^[a-z0-9-]{1,120}$/;

export type CampusMapPointReaderMeta = {
  mapPointId?: string;
  title?: string;
  panelTitle?: string;
  linkedCourseId?: string;
  shortDescription?: string;
  longDescription?: string;
  introduction?: string;
  objectives?: string[];
  summary?: string;
  difficulty?: string;
  category?: string;
  tags?: string[];
  moduleTitles?: string[];
  lessonTitles?: string[];
  contentVersion?: number;
  locale?: string;
};

export type CampusMapPointReaderPayload = {
  mapPointId: string;
  meta: CampusMapPointReaderMeta;
  /** Corpo Markdown do overview (sem o primeiro `# Título`, já extraído para o cabeçalho UI). */
  overviewMarkdown: string;
  mission?: CampusMapPointMission;
  quiz?: CampusMapPointQuiz;
  rewards?: CampusMapPointRewards;
  ambience?: CampusMapPointAmbience;
  bundleMeta?: CampusMapPointBundleMeta;
  seasonal?: CampusMapPointSeasonal;
};

function coerceStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
  return out.length ? out : undefined;
}

function normalizeLinkedCourseId(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  return t.length ? t : undefined;
}

/** Remove o primeiro título ATX para não duplicar o H1 da UI. */
function stripLeadingAtxH1(md: string): string {
  return md.replace(/^\s*#[^\n]+\n+/, "");
}

function normalizeMeta(mapPointId: string, raw: Record<string, unknown>): CampusMapPointReaderMeta {
  return {
    mapPointId: typeof raw.mapPointId === "string" ? raw.mapPointId : mapPointId,
    title: typeof raw.title === "string" ? raw.title : undefined,
    panelTitle: typeof raw.panelTitle === "string" ? raw.panelTitle : undefined,
    linkedCourseId: normalizeLinkedCourseId(raw.linkedCourseId),
    shortDescription: typeof raw.shortDescription === "string" ? raw.shortDescription : undefined,
    longDescription: typeof raw.longDescription === "string" ? raw.longDescription : undefined,
    introduction: typeof raw.introduction === "string" ? raw.introduction : undefined,
    objectives: coerceStringArray(raw.objectives),
    summary: typeof raw.summary === "string" ? raw.summary : undefined,
    difficulty: typeof raw.difficulty === "string" ? raw.difficulty : undefined,
    category: typeof raw.category === "string" ? raw.category : undefined,
    tags: coerceStringArray(raw.tags),
    moduleTitles: coerceStringArray(raw.moduleTitles),
    lessonTitles: coerceStringArray(raw.lessonTitles),
    contentVersion: typeof raw.contentVersion === "number" ? raw.contentVersion : undefined,
    locale: typeof raw.locale === "string" ? raw.locale : undefined
  };
}

/**
 * Lê `src/content/campus/map-points/<mapPointId>/overview.md` (gray-matter).
 * Só aceita ids alfanuméricos + hífen — evita path traversal.
 */
export function loadCampusMapPointReaderPayload(mapPointId: string): CampusMapPointReaderPayload | null {
  const id = mapPointId.trim();
  if (!MAP_POINT_ID_RE.test(id)) return null;

  const contentSlug = resolveCampusMapPointContentFolderSlug(id);
  const overviewPath = path.join(
    process.cwd(),
    "src",
    "content",
    "campus",
    "map-points",
    contentSlug,
    "overview.md"
  );
  if (!fs.existsSync(overviewPath)) return null;

  const rawFile = fs.readFileSync(overviewPath, "utf8");
  const { data, content } = matter(rawFile);
  const dataObj = data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : {};

  const slice = readCampusMapPointBundleSlice(contentSlug);
  const overviewMarkdown = stripLeadingAtxH1(content.trimStart());
  let overviewMtimeMs: number | null = null;
  try {
    overviewMtimeMs = fs.statSync(overviewPath).mtimeMs;
  } catch {
    overviewMtimeMs = null;
  }

  // #region agent log
  void fetch("http://127.0.0.1:7921/ingest/fedeaed6-2db0-4def-b356-f5bb89b86d65", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "91f9aa" },
    body: JSON.stringify({
      sessionId: "91f9aa",
      runId: "lesson-content-pre",
      hypothesisId: "H2-H4-H5",
      location: "loadCampusMapPointContent.ts:loadCampusMapPointReaderPayload",
      message: "map point payload read from disk",
      data: {
        mapPointId: id,
        contentSlug,
        slugMismatch: id !== contentSlug,
        overviewMtimeMs,
        overviewChars: overviewMarkdown.length,
        rawFileChars: rawFile.length,
        contentVersion: typeof dataObj.contentVersion === "number" ? dataObj.contentVersion : null,
        hasMission: Boolean(slice.mission),
        hasQuiz: Boolean(slice.quiz),
        hasRewards: Boolean(slice.rewards),
        hasSeasonal: Boolean(slice.seasonal)
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  return {
    mapPointId: id,
    meta: normalizeMeta(id, dataObj),
    overviewMarkdown,
    ...slice
  };
}
