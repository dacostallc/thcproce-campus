import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

  const overviewPath = path.join(process.cwd(), "src", "content", "campus", "map-points", id, "overview.md");
  if (!fs.existsSync(overviewPath)) return null;

  const rawFile = fs.readFileSync(overviewPath, "utf8");
  const { data, content } = matter(rawFile);
  const dataObj = data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : {};

  return {
    mapPointId: id,
    meta: normalizeMeta(id, dataObj),
    overviewMarkdown: stripLeadingAtxH1(content.trimStart())
  };
}
