import type { AccessStatus } from "@prisma/client";

/**
 * Quem pode abrir salas de aula a partir do mapa.
 * NEXT_PUBLIC_CAMPUS_PUBLIC_ALL=true → todos (visitante inclusive), útil para demo.
 */
export function canOpenCampusCourses(
  accessStatus: AccessStatus | undefined | null,
  isLoggedIn: boolean
): boolean {
  if (process.env.NEXT_PUBLIC_CAMPUS_PUBLIC_ALL === "true") return true;
  if (!isLoggedIn) return false;
  const s = accessStatus ?? "pendente";
  if (s === "ativo" || s === "vitalicio") return true;
  if (s === "pendente" && process.env.NEXT_PUBLIC_CAMPUS_ALLOW_PENDING_ACCESS === "true") {
    return true;
  }
  return false;
}
