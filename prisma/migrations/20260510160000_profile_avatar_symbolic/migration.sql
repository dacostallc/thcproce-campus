-- Campos de avatar simbólico em Profile (schema.prisma — alinhamento produção).
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "avatarType" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "avatarColor" TEXT;
