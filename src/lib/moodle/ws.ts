import { cannabis101DisplayName } from "@/content/courses";

/**
 * Chamadas ao Moodle Web Services (REST).
 * Sem MOODLE_WS_TOKEN, as funções devolvem mocks para desenvolvimento.
 *
 * Use `MOODLE_WS_BASE_URL` (servidor) quando o caminho público /escola estiver bloqueado no edge
 * mas o Moodle continuar acessível por hostname interno ou URL técnica.
 */
const base = () => {
  const internal =
    typeof process.env.MOODLE_WS_BASE_URL === "string"
      ? process.env.MOODLE_WS_BASE_URL.trim().replace(/\/$/, "")
      : "";
  if (internal) return internal;
  return process.env.NEXT_PUBLIC_MOODLE_BASE_URL?.replace(/\/$/, "") ?? "";
};

function q(u: string, p: Record<string, string>) {
  const qs = new URLSearchParams({
    moodlewsrestformat: "json",
    ...p
  });
  return `${u}?${qs.toString()}`;
}

async function ws<T>(
  wsfunction: string,
  params: Record<string, string> = {}
): Promise<T | null> {
  const tok = process.env.MOODLE_WS_TOKEN;
  const b = base();
  if (!tok || !b) return null;

  const url = q(`${b}/webservice/rest/server.php`, {
    wstoken: tok,
    wsfunction,
    ...params
  });

  const res = await fetch(url, { method: "GET", next: { revalidate: 60 } });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

export type MoodleCourse = {
  id: number;
  fullname: string;
  shortname: string;
  summary?: string;
};

export async function fetchEnrolledCoursesForUser(
  moodleUserId: number
): Promise<MoodleCourse[]> {
  const data = await ws<MoodleCourse[]>("core_enrol_get_users_courses", {
    userid: String(moodleUserId)
  });
  if (data) return data;

  return [
    { id: 1, fullname: cannabis101DisplayName(), shortname: "C101" },
    { id: 2, fullname: "Cultivo Indoor", shortname: "IND" }
  ];
}

export async function fetchCompletionStatus(
  courseId: number,
  moodleUserId: number
): Promise<{ completed: boolean } | null> {
  const data = await ws<unknown>("core_completion_get_course_completion_status", {
    courseid: String(courseId),
    userid: String(moodleUserId)
  });
  if (!data) return null;
  const d = data as { completionstatus?: { completed?: boolean } };
  return { completed: Boolean(d.completionstatus?.completed) };
}

export type MoodleFlatModule = {
  sectionTitle: string;
  moduleName: string;
  modname: string;
  moodleUrl: string | null;
  /** Texto plano a partir do campo description HTML do módulo (intro na página do curso). */
  summaryText: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isWsException(data: unknown): boolean {
  return Boolean(data && typeof data === "object" && "exception" in data);
}

type RawSection = {
  id?: number;
  name?: string;
  section?: number;
  modules?: RawModule[];
};

type RawModule = {
  id?: number;
  name?: string;
  url?: string;
  modname?: string;
  description?: string;
  visible?: number;
};

/**
 * Secções e módulos do curso (páginas, quiz, etc.).
 * Requer `core_course_get_contents` activo no serviço externo Moodle + `MOODLE_WS_TOKEN`.
 */
export async function fetchCourseContentsFlat(courseId: number): Promise<MoodleFlatModule[] | null> {
  const data = await ws<unknown>("core_course_get_contents", {
    courseid: String(courseId)
  });
  if (!data || isWsException(data)) return null;
  if (!Array.isArray(data)) return null;

  const out: MoodleFlatModule[] = [];
  for (const sec of data as RawSection[]) {
    /** Rótulo bruto usado também no matcher campus ↔ LMS; a UI só vê texto suavizado no router. */
    const sectionTitle =
      (typeof sec.name === "string" && sec.name.trim()) ||
      (typeof sec.section === "number" ? `Secção ${sec.section}` : "Secção");
    for (const mod of sec.modules ?? []) {
      if (mod.visible === 0) continue;
      const summaryHtml = typeof mod.description === "string" ? mod.description : "";
      const moodleUrl = typeof mod.url === "string" && mod.url.trim() ? mod.url.trim() : null;
      out.push({
        sectionTitle,
        moduleName: typeof mod.name === "string" ? mod.name : "",
        modname: typeof mod.modname === "string" ? mod.modname : "",
        moodleUrl,
        summaryText: stripHtml(summaryHtml).slice(0, 12_000)
      });
    }
  }
  return out;
}

/** Valida token de sessão do app móvel / webservice (quando configurado). */
export async function validateMoodleToken(_token: string): Promise<{
  userid: number;
  username: string;
} | null> {
  return null;
}
