-- Adiciona UserCourseProgress: progresso relacional por (perfil, curso).
-- Estratégia aditiva — não remove Profile.lessonProgress (JSON legado).
-- Idempotente: usa IF NOT EXISTS em todas as operações.

CREATE TABLE IF NOT EXISTS "UserCourseProgress" (
    "id"                     TEXT         NOT NULL,
    "profileId"              TEXT         NOT NULL,
    "courseSlug"             TEXT         NOT NULL,
    "completedLessonIndices" JSONB        NOT NULL DEFAULT '[]',
    "lastLessonIndex"        INTEGER,
    "startedAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt"            TIMESTAMP(3),

    CONSTRAINT "UserCourseProgress_pkey" PRIMARY KEY ("id")
);

-- Índice único garante uma linha por (aluno, curso)
CREATE UNIQUE INDEX IF NOT EXISTS "UserCourseProgress_profileId_courseSlug_key"
    ON "UserCourseProgress"("profileId", "courseSlug");

-- Índices para queries frequentes
CREATE INDEX IF NOT EXISTS "UserCourseProgress_profileId_idx"
    ON "UserCourseProgress"("profileId");

CREATE INDEX IF NOT EXISTS "UserCourseProgress_courseSlug_idx"
    ON "UserCourseProgress"("courseSlug");

-- FK com CASCADE: apaga progresso quando o perfil é removido
ALTER TABLE "UserCourseProgress"
    DROP CONSTRAINT IF EXISTS "UserCourseProgress_profileId_fkey";

ALTER TABLE "UserCourseProgress"
    ADD CONSTRAINT "UserCourseProgress_profileId_fkey"
    FOREIGN KEY ("profileId") REFERENCES "Profile"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
