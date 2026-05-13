import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";
import { getCannabis101LessonStableId } from "@/content/courses/cannabis-101/lessons";

const SAFE_SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isSafeStaticLessonSegment(s: string): boolean {
  return s.length > 0 && s.length < 160 && SAFE_SEGMENT.test(s);
}

export type StaticLessonLoaded = {
  found: true;
  title: string;
  markdownContent: string;
  metadata: Record<string, unknown>;
  lessonId: string;
  courseId: string;
};

export type StaticLessonNotFound = { found: false };

export type StaticLessonLoadResult = StaticLessonLoaded | StaticLessonNotFound;

function contentLessonFile(courseId: string, lessonId: string): string {
  return path.join(process.cwd(), "content", "courses", courseId, "lessons", `${lessonId}.md`);
}

/**
 * Lê uma aula em Markdown do disco (`content/courses/<courseId>/lessons/<lessonId>.md`).
 * Sem Prisma, Moodle ou HTTP. Só uso em runtime Node (ex.: tRPC).
 */
export function loadStaticLesson(courseId: string, lessonId: string): StaticLessonLoadResult {
  if (!isSafeStaticLessonSegment(courseId) || !isSafeStaticLessonSegment(lessonId)) {
    return { found: false };
  }
  const filePath = contentLessonFile(courseId, lessonId);
  if (!fs.existsSync(filePath)) return { found: false };
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const meta = data && typeof data === "object" && !Array.isArray(data) ? { ...data } : {};
  const titleFromFm = typeof meta.title === "string" ? meta.title.trim() : "";
  const title = titleFromFm || lessonId;
  return {
    found: true,
    courseId,
    lessonId,
    title,
    markdownContent: content.trim(),
    metadata: meta,
  };
}

/**
 * Mapeia área do campus + índice da aula para ficheiro estático, quando existir suporte.
 * Hoje: apenas `cannabis-101` via ids estáveis do manifest.
 */
export function loadStaticLessonForAreaLesson(
  areaId: string,
  lessonIndex: number,
): StaticLessonLoadResult {
  if (!isSafeStaticLessonSegment(areaId) || lessonIndex < 0 || !Number.isFinite(lessonIndex)) {
    return { found: false };
  }
  if (areaId !== CANNABIS101_AREA_ID) return { found: false };
  const lessonId = getCannabis101LessonStableId(lessonIndex);
  if (!lessonId) return { found: false };
  return loadStaticLesson(areaId, lessonId);
}
