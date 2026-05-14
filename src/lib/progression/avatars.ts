/**
 * Official XP avatar tiers (single source of truth for campus level keys + HUD/perfil art).
 */

export const FALLBACK_IMAGE = "/avatar/iniciante.png" as const;

/** @deprecated Prefer FALLBACK_IMAGE */
export const XP_AVATAR_FALLBACK_SRC = FALLBACK_IMAGE;

export const AVATAR_TIERS = [
  { key: "iniciante",  label: "Iniciante",  minXp: 0,    imageSrc: "/avatar/iniciante.png" },
  { key: "aprendiz",  label: "Aprendiz",   minXp: 150,  imageSrc: "/avatar/aprendiz.png" },
  { key: "cultivador", label: "Cultivador", minXp: 300,  imageSrc: "/avatar/cultivador.png" },
  { key: "hashmaker",  label: "Hashmaker",  minXp: 450,  imageSrc: "/avatar/hashmaker.png" },
  { key: "medicinal",  label: "Medicinal",  minXp: 900,  imageSrc: "/avatar/medicinal.png" },
  { key: "master",     label: "Master",     minXp: 1800, imageSrc: "/avatar/master.png" },
] as const;

/** @deprecated Prefer AVATAR_TIERS */
export const XP_AVATAR_TIERS = AVATAR_TIERS;

export type AvatarTier = (typeof AVATAR_TIERS)[number];
export type AvatarTierKey = AvatarTier["key"];

export type AvatarTierInfo = {
  key: string;
  label: string;
  imageSrc: string;
  minXp: number;
};

export type XpAvatarNext = AvatarTierInfo;

/** Result of `getAvatarByXp` — includes legacy Portuguese field names for existing UI. */
export type AvatarByXpResult = {
  id: string;
  name: string;
  tier: AvatarTierInfo;
  next: AvatarTierInfo | null;
  progressToNext: number;
  xpIntoTier: number;
  xpRemainingToNext: number | null;
  xp: number;
  key: string;
  label: string;
  imageSrc: string;
  minXp: number;
  nomeNivel: string;
  imagem: string;
  xpMinimoNivel: number;
  proximoNivel: XpAvatarNext | null;
  progressoProximoAvatar: number;
  xpDentroDoNivel: number;
  xpFaltandoProximo: number | null;
};

export type XpAvatarTier = AvatarTier;
export type XpAvatarTierKey = AvatarTierKey;
export type XpAvatarByXp = AvatarByXpResult;

function clamp01(n: number): number {
  if (n <= 0) return 0;
  if (n >= 1) return 1;
  return n;
}

/** Maps legacy `Profile.levelKey` values to current tier keys. */
export function normalizeLegacyXpLevelKey(key: string | null | undefined): AvatarTierKey | string {
  if (!key) return "iniciante";
  const map: Record<string, AvatarTierKey> = {
    semente: "iniciante",
    muda: "aprendiz",
    vegetativa: "cultivador",
    floracao: "hashmaker",
    colheita: "medicinal",
    master: "master",
  };
  return map[key] ?? key;
}

/**
 * Resolves official avatar tier from total XP (server or client).
 */
export function getAvatarByXp(rawXp: number): AvatarByXpResult {
  const xp = Math.max(0, Math.floor(Number(rawXp) || 0));

  let currentIdx = 0;
  for (let i = 0; i < AVATAR_TIERS.length; i++) {
    if (xp >= AVATAR_TIERS[i]!.minXp) currentIdx = i;
  }

  const current = AVATAR_TIERS[currentIdx]!;
  const nextTier = currentIdx + 1 < AVATAR_TIERS.length ? AVATAR_TIERS[currentIdx + 1]! : null;

  const tier: AvatarTierInfo = {
    key: current.key,
    label: current.label,
    imageSrc: current.imageSrc,
    minXp: current.minXp,
  };

  const next: AvatarTierInfo | null = nextTier
    ? {
        key: nextTier.key,
        label: nextTier.label,
        imageSrc: nextTier.imageSrc,
        minXp: nextTier.minXp,
      }
    : null;

  const span = nextTier ? nextTier.minXp - current.minXp : 0;
  const xpIntoTier = xp - current.minXp;
  const progressToNext = nextTier ? (span > 0 ? clamp01(xpIntoTier / span) : 1) : 1;
  const xpRemainingToNext = nextTier ? Math.max(0, nextTier.minXp - xp) : null;

  return {
    id: tier.key,
    name: tier.label,
    tier,
    next,
    progressToNext,
    xpIntoTier,
    xpRemainingToNext,
    xp,
    key: tier.key,
    label: tier.label,
    imageSrc: tier.imageSrc,
    minXp: tier.minXp,
    nomeNivel: tier.label,
    imagem: tier.imageSrc,
    xpMinimoNivel: tier.minXp,
    proximoNivel: next,
    progressoProximoAvatar: progressToNext,
    xpDentroDoNivel: xpIntoTier,
    xpFaltandoProximo: xpRemainingToNext,
  };
}
