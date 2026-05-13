-- Align `"Profile"` with `schema.prisma` progression / gamification fields.
-- Idempotent for databases that applied an older baseline without these columns.
-- No DROP or destructive operations.

ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "xpTotal" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "souvenirCredits" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "levelKey" TEXT NOT NULL DEFAULT 'iniciante';
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "progressionClaims" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "lessonProgress" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "streakDays" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "referralSouvenirEarned" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "avatarType" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "avatarColor" TEXT;
