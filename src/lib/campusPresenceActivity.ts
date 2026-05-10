/**
 * Actividade do aluno no campus — transmitida em realtime (`campusActivity` no payload).
 * Backend futuro: espelhar estes valores num campo enumerado na BD ou canal WS.
 */

export const CAMPUS_ACTIVITY_KINDS = [
  "studying",
  "cinema",
  "mural",
  "shop",
  "lesson"
] as const;

export type CampusActivityKind = (typeof CAMPUS_ACTIVITY_KINDS)[number];

export function coerceCampusActivityKind(raw: unknown): CampusActivityKind | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim().toLowerCase();
  return (CAMPUS_ACTIVITY_KINDS as readonly string[]).includes(s)
    ? (s as CampusActivityKind)
    : null;
}

/** Inferência retrocompatível quando peers antigos não enviam `campusActivity`. */
export function inferCampusActivityFromLegacyPayload(inCinema: boolean): CampusActivityKind {
  return inCinema ? "cinema" : "studying";
}

export type CampusActivitySnapshot = {
  pathname: string;
  isCineOpen: boolean;
  lessonPanelOpen: boolean;
  muralOpen: boolean;
  muralFeedOpen: boolean;
  campusStoreOpen: boolean;
};

/**
 * Prioridade: cinema → aula → mural → loja → estudando no mapa.
 * Chamado só no cliente (pathname + stores).
 */
export function deriveLocalCampusActivity(s: CampusActivitySnapshot): CampusActivityKind {
  if (s.isCineOpen) return "cinema";
  if (s.lessonPanelOpen) return "lesson";
  if (s.muralOpen || s.muralFeedOpen) return "mural";
  const p = s.pathname || "";
  if (p.startsWith("/campus/loja")) return "shop";
  if (s.campusStoreOpen && p.startsWith("/campus")) return "shop";
  return "studying";
}

export function campusActivityLabelPt(kind: CampusActivityKind): string {
  switch (kind) {
    case "cinema":
      return "No cinema";
    case "lesson":
      return "Em aula";
    case "mural":
      return "No mural";
    case "shop":
      return "Na loja";
    default:
      return "A estudar";
  }
}
