/** Mínimo de caracteres para tratar texto extraído dos blocos CMS como corpo canónico (evita ruído). */
export const CMS_CANONICAL_BODY_MIN_CHARS = 40;

export type CmsBlockForCanonical = {
  type: string;
  sortOrder: number;
  data: unknown;
};

export function hasMoodleFullSyncInBlockData(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const sync = (data as Record<string, unknown>).moodleFullSync;
  return Boolean(sync && typeof sync === "object");
}

/** Origem Moodle guardada no bloco (campo moodleFullSync.source), se existir. */
export function getMoodleImportSourceFromBlocks(blocks: CmsBlockForCanonical[] | null | undefined): string | null {
  if (!blocks?.length) return null;
  const sorted = [...blocks].sort((a, b) => a.sortOrder - b.sortOrder);
  for (const b of sorted) {
    if (!hasMoodleFullSyncInBlockData(b.data)) continue;
    const sync = (b.data as Record<string, unknown>).moodleFullSync as Record<string, unknown>;
    const s = sync?.source;
    if (typeof s === "string" && s.length > 0) return s;
  }
  return null;
}

function pullText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const t = (data as Record<string, unknown>).text;
  return typeof t === "string" ? t.trim() : "";
}

/**
 * Concatena texto dos blocos CMS na ordem pedagógica (sortOrder).
 * Se existir import Moodle (`moodleFullSync`), usa **apenas** esses blocos como corpo canónico
 * (evita misturar com parágrafos editoriais no mesmo painel).
 * Caso contrário, inclui HEADING, PARAGRAPH e CALLOUT como antes.
 */
export function extractCanonicalPlainTextFromCmsBlocks(blocks: CmsBlockForCanonical[]): string {
  if (!blocks?.length) return "";
  const sorted = [...blocks].sort((a, b) => a.sortOrder - b.sortOrder);
  const moodleBlocks = sorted.filter((b) => hasMoodleFullSyncInBlockData(b.data));
  const sourceBlocks = moodleBlocks.length > 0 ? moodleBlocks : sorted;

  const parts: string[] = [];
  for (const b of sourceBlocks) {
    switch (b.type) {
      case "HEADING":
      case "PARAGRAPH":
      case "CALLOUT": {
        const text = pullText(b.data);
        if (text) parts.push(text);
        break;
      }
      default:
        break;
    }
  }
  return parts.join("\n\n");
}
