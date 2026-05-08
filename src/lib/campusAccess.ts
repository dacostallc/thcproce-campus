import type { AccessStatus } from "@prisma/client";

function campusLivePulseFromEnv(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_LIVE_ACTIVE === "true";
}

function campusLiveStrictGateBlocksPulse(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_LIVE_STRICT_GATE === "true";
}

function campusLiveVisitorGateEnvOk(): boolean {
  if (process.env.NEXT_PUBLIC_CAMPUS_LIVE_BLOCK_VISITOR_AREAS === "true") return false;
  if (process.env.NEXT_PUBLIC_CAMPUS_LIVE_VISITOR_AREA_ACCESS === "false") return false;
  return true;
}

/**
 * Pulse `true` = live ligada na BD ou `NEXT_PUBLIC_CAMPUS_LIVE_ACTIVE=true`.
 * `NEXT_PUBLIC_CAMPUS_LIVE_STRICT_GATE=true` ignora o efeito da live nas salas.
 */
export function isCampusLiveCourseHourActiveWithPulse(livePulse: boolean): boolean {
  if (!livePulse) return false;
  if (campusLiveStrictGateBlocksPulse()) return false;
  return true;
}

export function isCampusLiveVisitorAreaAccessWithPulse(livePulse: boolean): boolean {
  if (!livePulse) return false;
  return campusLiveVisitorGateEnvOk();
}

/**
 * Evento ao vivo (só env público). Preferir `isCampusLiveCourseHourActiveWithPulse` com dados da API em cliente/servidor unificado.
 */
export function isCampusLiveCourseHourActive(): boolean {
  return isCampusLiveCourseHourActiveWithPulse(campusLivePulseFromEnv());
}

/**
 * Mesma janela para visitantes (pulse só via env). Com BD use `isCampusLiveVisitorAreaAccessWithPulse`.
 */
export function isCampusLiveVisitorAreaAccess(): boolean {
  return isCampusLiveVisitorAreaAccessWithPulse(campusLivePulseFromEnv());
}

/**
 * Quem pode abrir salas — `livePulse` deve refletir merge BD + env (ex.: `campus.liveBroadcast`).
 */
export function canOpenCampusCoursesWithPulse(
  accessStatus: AccessStatus | undefined | null,
  isLoggedIn: boolean,
  livePulse: boolean
): boolean {
  if (process.env.NEXT_PUBLIC_CAMPUS_PUBLIC_ALL === "true") return true;
  if (isCampusLiveCourseHourActiveWithPulse(livePulse) && isLoggedIn) return true;
  if (!isLoggedIn) return false;
  const s = accessStatus ?? "pendente";
  if (s === "ativo" || s === "vitalicio") return true;
  if (s === "pendente" && process.env.NEXT_PUBLIC_CAMPUS_ALLOW_PENDING_ACCESS === "true") {
    return true;
  }
  return false;
}

/**
 * Quem pode abrir salas de aula a partir do mapa (pulse só env).
 * NEXT_PUBLIC_CAMPUS_PUBLIC_ALL=true → todos (visitante inclusive), útil para demo.
 */
export function canOpenCampusCourses(
  accessStatus: AccessStatus | undefined | null,
  isLoggedIn: boolean
): boolean {
  return canOpenCampusCoursesWithPulse(accessStatus, isLoggedIn, campusLivePulseFromEnv());
}
