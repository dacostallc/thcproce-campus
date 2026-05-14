import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type StaticLessonLoaded = {
  found: true;
  title: string;
  markdownContent: string;
  metadata: Record<string, unknown>;
  lessonId: string;
  courseId: string;
  /** Caminho real lido do disco — útil para debug. */
  resolvedPath: string;
};

export type StaticLessonNotFound = { found: false };
export type StaticLessonLoadResult = StaticLessonLoaded | StaticLessonNotFound;

/**
 * Formato do `course.json` em `src/content/courses/<courseId>/course.json`.
 *
 * Campo obrigatório para roteamento por índice: `lessons` — array de ids de aula
 * em ordem canónica (posição = índice 0-based da aula no campus).
 *
 * Exemplo mínimo para um novo curso:
 * ```json
 * {
 *   "courseId": "extracoes-101",
 *   "title": "Extrações 101",
 *   "lessons": ["ext-l01-introducao", "ext-l02-equipamentos"]
 * }
 * ```
 */
type CourseManifest = {
  courseId: string;
  title?: string;
  /** Ids de aula em ordem canónica. Posição = índice 0-based usado no campus. */
  lessons?: string[];
  [key: string]: unknown;
};

// ─── Candidatos de caminho (por ordem de prioridade) ─────────────────────────

/**
 * Localização canónica (nova): `src/content/courses/<courseId>/course.json`
 * Localização legada (fallback): `content/courses/<courseId>/course.json`
 *
 * Novos cursos devem usar `src/content/courses/`. O Cannabis 101 existente
 * continuará a funcionar via fallback até a migração ser concluída.
 *
 * Para migrar de uma vez: `npx tsx scripts/migrate-content-to-src.mts`
 */
function manifestCandidates(courseId: string): string[] {
  const cwd = process.cwd();
  return [
    path.join(cwd, "src", "content", "courses", courseId, "course.json"),
    path.join(cwd, "content", "courses", courseId, "course.json"),
  ];
}

/**
 * Candidatos de caminho para o arquivo `.md` de uma aula.
 * Ordem: `src/content/courses/<courseId>/<lessonId>.md` → legado com `lessons/`.
 */
function lessonCandidates(courseId: string, lessonId: string): string[] {
  const cwd = process.cwd();
  return [
    path.join(cwd, "src", "content", "courses", courseId, `${lessonId}.md`),
    path.join(cwd, "content", "courses", courseId, "lessons", `${lessonId}.md`),
  ];
}

// ─── Cache em memória ─────────────────────────────────────────────────────────

const manifestCache = new Map<string, CourseManifest | null>();

// ─── Segurança ────────────────────────────────────────────────────────────────

const SAFE_SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isSafeStaticLessonSegment(s: string): boolean {
  return s.length > 0 && s.length < 160 && SAFE_SEGMENT.test(s);
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

function loadCourseManifest(courseId: string): CourseManifest | null {
  if (manifestCache.has(courseId)) {
    return manifestCache.get(courseId) ?? null;
  }
  for (const candidate of manifestCandidates(courseId)) {
    if (!fs.existsSync(candidate)) continue;
    try {
      const parsed = JSON.parse(fs.readFileSync(candidate, "utf8")) as CourseManifest;
      manifestCache.set(courseId, parsed);
      return parsed;
    } catch {
      continue;
    }
  }
  manifestCache.set(courseId, null);
  return null;
}

function findLessonFile(courseId: string, lessonId: string): string | null {
  for (const candidate of lessonCandidates(courseId, lessonId)) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Lê uma aula em Markdown do disco.
 *
 * Procura em ordem:
 *  1. `src/content/courses/<courseId>/<lessonId>.md`   ← novo (Blueprint)
 *  2. `content/courses/<courseId>/lessons/<lessonId>.md` ← legado (fallback)
 *
 * Puro filesystem — sem Prisma, Moodle ou HTTP.
 * Use apenas em runtime Node (rotas tRPC, Route Handlers).
 */
export function loadStaticLesson(
  courseId: string,
  lessonId: string,
): StaticLessonLoadResult {
  if (!isSafeStaticLessonSegment(courseId) || !isSafeStaticLessonSegment(lessonId)) {
    return { found: false };
  }
  const filePath = findLessonFile(courseId, lessonId);
  if (!filePath) return { found: false };

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const meta =
    data && typeof data === "object" && !Array.isArray(data) ? { ...data } : {};
  const title = (typeof meta.title === "string" ? meta.title.trim() : "") || lessonId;

  return {
    found: true,
    courseId,
    lessonId,
    title,
    markdownContent: content.trim(),
    metadata: meta,
    resolvedPath: filePath,
  };
}

/**
 * Resolve área do campus + índice de aula → Markdown estático.
 *
 * Funciona para **qualquer curso** com `course.json` contendo `"lessons": [...]`.
 *
 * ## Como adicionar um novo curso
 *
 * 1. Crie `src/content/courses/<slug>/course.json` com `"lessons": ["slug-l01-...", ...]`
 * 2. Coloque os arquivos `.md` em `src/content/courses/<slug>/`
 * 3. Registre a área em `src/data/courses.ts`
 * 4. Nenhuma outra alteração de código é necessária.
 *
 * @see `content/courses/README.md` para documentação completa.
 * @see `scripts/migrate-content-to-src.mts` para migrar arquivos legados.
 */
export function loadStaticLessonForAreaLesson(
  areaId: string,
  lessonIndex: number,
): StaticLessonLoadResult {
  if (
    !isSafeStaticLessonSegment(areaId) ||
    lessonIndex < 0 ||
    !Number.isFinite(lessonIndex)
  ) {
    return { found: false };
  }

  const manifest = loadCourseManifest(areaId);
  if (!manifest) return { found: false };

  const lessons = manifest.lessons;
  if (!Array.isArray(lessons) || lessonIndex >= lessons.length) {
    return { found: false };
  }

  const lessonId = lessons[lessonIndex];
  if (typeof lessonId !== "string" || !isSafeStaticLessonSegment(lessonId)) {
    return { found: false };
  }

  return loadStaticLesson(areaId, lessonId);
}
