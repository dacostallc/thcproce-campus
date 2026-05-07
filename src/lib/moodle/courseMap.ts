import { areas } from "@/data/courses";

/**
 * Opcional: `MOODLE_COURSE_MAP={"cannabis-101":42,"medicina":55}`
 * Sobrescreve o fallback `100 + índice` em `courses.ts`.
 */
export function parseMoodleCourseMap(): Partial<Record<string, number>> {
  const raw = process.env.MOODLE_COURSE_MAP?.trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const allowed = new Set(areas.map((a) => a.id));
    const out: Partial<Record<string, number>> = {};
    for (const [slug, v] of Object.entries(parsed)) {
      if (!allowed.has(slug)) continue;
      const n = typeof v === "number" ? v : Number(v);
      if (Number.isFinite(n) && n > 0) out[slug] = Math.floor(n);
    }
    return out;
  } catch {
    return {};
  }
}

export function moodleCourseIdForArea(slug: string, indexFallback: number): number {
  const m = parseMoodleCourseMap();
  const mapped = m[slug];
  if (mapped != null) return mapped;
  return 100 + indexFallback;
}
