import type { AccessStatus } from "@prisma/client";

import { isCampusAdminEmail } from "@/lib/campusAdmin";
import { isCampusModeratorEmail } from "@/lib/campusModerators";

/**
 * Hierarquia visual das tags sobre os avatars no Campus / Cine THCProce.
 * Ajustar cores só aqui — reflete no mapa e no auditório.
 */
export type CampusUserRole = "admin" | "moderator" | "pro" | "free";

/** Estilo por cargo (cores hex + sombras). Admin tem brilho (glow “Boss”). */
export const USER_ROLE_STYLE: Record<
  CampusUserRole,
  {
    label: string;
    borderHex: string;
    borderWidthPx: number;
    nameColorHex: string;
    xpColorHex: string;
    separatorColorHex: string;
    glowBoxShadow?: string;
    outerGlowFilter?: string;
    fontBold: boolean;
    leadingEmoji: string;
  }
> = {
  admin: {
    label: "Admin THCProce",
    borderHex: "#fbbf24",
    borderWidthPx: 2,
    nameColorHex: "#fffbeb",
    xpColorHex: "#fef9c3",
    separatorColorHex: "rgba(255,251,235,0.55)",
    /** Brilho dourado apenas no administrador */
    glowBoxShadow:
      "0 0 22px rgba(251,191,36,0.65), 0 0 10px rgba(245,158,11,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
    outerGlowFilter: "drop-shadow(0 0 10px rgba(251,191,36,0.75))",
    fontBold: true,
    leadingEmoji: "👑"
  },
  moderator: {
    label: "Moderador",
    borderHex: "#22d3ee",
    borderWidthPx: 2,
    nameColorHex: "#ecfeff",
    xpColorHex: "#bae6fd",
    separatorColorHex: "rgba(186,230,253,0.55)",
    fontBold: false,
    leadingEmoji: "🛡️"
  },
  pro: {
    label: "Aluno PRO",
    borderHex: "rgba(255,255,255,0.18)",
    borderWidthPx: 1,
    nameColorHex: "#4ade80",
    xpColorHex: "#bbf7d0",
    separatorColorHex: "rgba(167,243,208,0.65)",
    fontBold: false,
    leadingEmoji: ""
  },
  free: {
    label: "Aluno THC",
    borderHex: "rgba(255,255,255,0.12)",
    borderWidthPx: 1,
    nameColorHex: "#f8fafc",
    xpColorHex: "rgba(248,250,252,0.92)",
    separatorColorHex: "rgba(248,250,252,0.45)",
    fontBold: false,
    leadingEmoji: ""
  }
};

export function coerceCampusUserRole(raw: unknown): CampusUserRole | null {
  if (raw === "admin" || raw === "moderator" || raw === "pro" || raw === "free") return raw;
  return null;
}

/**
 * Hierarquia: admin › moderador › PRO (ativo/vitalício) › free / visitante.
 */
export function deriveCampusPresenceRole(opts: {
  email: string | null | undefined;
  accessStatus: AccessStatus | null | undefined;
}): CampusUserRole {
  const email = opts.email ?? null;

  if (isCampusAdminEmail(email)) return "admin";
  if (isCampusModeratorEmail(email)) return "moderator";

  const status = opts.accessStatus ?? "pendente";
  if (status === "ativo" || status === "vitalicio") return "pro";
  return "free";
}
