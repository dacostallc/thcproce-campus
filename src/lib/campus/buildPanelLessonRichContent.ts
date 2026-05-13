import type { LessonRichContent } from "@/data/lessonRichTypes";

/** Texto único quando não há blocos publicados no CMS nem texto Moodle (WS) para o slot. */
export const CAMPUS_LESSON_UNSYNCED_PLACEHOLDER = "Conteúdo ainda não sincronizado." as const;

/** Mínimo de caracteres na descrição do módulo Moodle (`core_course_get_contents`). */
const MOODLE_MODULE_DESCRIPTION_MIN_CHARS = 40;

export type PanelLessonContentSource =
  | "moodle_module_description"
  | "unsynced"
  /** Texto canónico em `src/data/lessonContent` (ex.: CANNABIS101_LESSONS / `lessonBodies`). */
  | "repository";

export type PanelLessonContentResult = {
  content: LessonRichContent;
  source: PanelLessonContentSource;
  charCount: number;
};

type MoodleSnippetResult =
  | { ok: true; summaryText: string }
  | { ok: false }
  | null
  | undefined;

function baseRichShell(): LessonRichContent {
  return {
    intro: "",
    summary: "",
    objectives: [],
    materials: [],
    references: [],
    professorNotes: "",
    body: CAMPUS_LESSON_UNSYNCED_PLACEHOLDER,
    quiz: [],
    media: undefined,
    displayTitle: undefined,
  };
}

/**
 * Monta o corpo textual quando **não** há blocos Prisma no painel.
 * Blocos sincronizados (Postgres) são renderizados só via `BlockRenderer` em `LessonPanel`.
 *
 * Ordem: descrição do módulo Moodle (WS) → placeholder fixo (sem texto do repositório).
 */
export function buildPanelLessonRichContent(args: {
  moodleSnippet: MoodleSnippetResult;
  moodleSnippetEnabledForArea: boolean;
}): PanelLessonContentResult {
  const { moodleSnippet, moodleSnippetEnabledForArea } = args;

  if (
    moodleSnippetEnabledForArea &&
    moodleSnippet &&
    moodleSnippet.ok === true &&
    moodleSnippet.summaryText.trim().length >= MOODLE_MODULE_DESCRIPTION_MIN_CHARS
  ) {
    const raw = moodleSnippet.summaryText.trim();
    return {
      content: { ...baseRichShell(), body: raw },
      source: "moodle_module_description",
      charCount: raw.length,
    };
  }

  return {
    content: baseRichShell(),
    source: "unsynced",
    charCount: CAMPUS_LESSON_UNSYNCED_PLACEHOLDER.length,
  };
}
