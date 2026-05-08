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
    { id: 1, fullname: "Cannabis 101", shortname: "C101" },
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

/** Valida token de sessão do app móvel / webservice (quando configurado). */
export async function validateMoodleToken(_token: string): Promise<{
  userid: number;
  username: string;
} | null> {
  return null;
}
