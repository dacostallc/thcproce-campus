import { z } from "zod";

export const AVATAR_TYPES = ["menino", "menina", "cultivador", "pesquisador"] as const;
export type AvatarType = (typeof AVATAR_TYPES)[number];

export const AVATAR_COLORS = ["verde", "dourado", "azul", "roxo"] as const;
export type AvatarColor = (typeof AVATAR_COLORS)[number];

export const AVATAR_TYPE_LABELS: Record<AvatarType, string> = {
  menino: "Menino",
  menina: "Menina",
  cultivador: "Cultivador",
  pesquisador: "Pesquisador",
};

export const AVATAR_TYPE_EMOJI: Record<AvatarType, string> = {
  menino: "👦",
  menina: "👧",
  cultivador: "🌱",
  pesquisador: "🔬",
};

export const AVATAR_COLOR_LABELS: Record<AvatarColor, string> = {
  verde: "Verde",
  dourado: "Dourado",
  azul: "Azul",
  roxo: "Roxo",
};

/** Classes Tailwind para anel/fundo do cartão do avatar. */
export function avatarColorStyles(color: AvatarColor): { ring: string; bg: string } {
  switch (color) {
    case "verde":
      return { ring: "ring-emerald-400/70", bg: "bg-emerald-500/15" };
    case "dourado":
      return { ring: "ring-amber-400/70", bg: "bg-amber-500/15" };
    case "azul":
      return { ring: "ring-sky-400/70", bg: "bg-sky-500/15" };
    case "roxo":
      return { ring: "ring-violet-400/70", bg: "bg-violet-500/15" };
    default:
      return { ring: "ring-white/30", bg: "bg-white/5" };
  }
}

export function parseAvatarType(raw: unknown): AvatarType | null {
  const s = typeof raw === "string" ? raw.trim() : "";
  return (AVATAR_TYPES as readonly string[]).includes(s) ? (s as AvatarType) : null;
}

export function parseAvatarColor(raw: unknown): AvatarColor | null {
  const s = typeof raw === "string" ? raw.trim() : "";
  return (AVATAR_COLORS as readonly string[]).includes(s) ? (s as AvatarColor) : null;
}

export const updateAvatarFormSchema = z.object({
  avatarType: z.enum(AVATAR_TYPES),
  avatarColor: z.enum(AVATAR_COLORS),
});
