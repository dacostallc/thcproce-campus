/**
 * Re-export canonical progression avatars — prefer `@/lib/progression/avatars` in new code.
 */

export {
  AVATAR_TIERS,
  XP_AVATAR_TIERS,
  FALLBACK_IMAGE,
  XP_AVATAR_FALLBACK_SRC,
  getAvatarByXp,
  normalizeLegacyXpLevelKey,
  type AvatarByXpResult,
  type AvatarTier,
  type AvatarTierInfo,
  type AvatarTierKey,
  type XpAvatarByXp,
  type XpAvatarNext,
  type XpAvatarTier,
  type XpAvatarTierKey,
} from "@/lib/progression/avatars";
