-- Tabela de áudio narrado por aula — gerado via ElevenLabs, URL armazenada aqui.
-- Idempotente: IF NOT EXISTS em todas as operações.

CREATE TABLE IF NOT EXISTS "LessonAudio" (
    "id"          TEXT         NOT NULL,
    "courseId"    TEXT         NOT NULL,
    "lessonId"    TEXT         NOT NULL,
    "audioUrl"    TEXT         NOT NULL,
    "durationSec" INTEGER,
    "sizeBytes"   INTEGER,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonAudio_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "LessonAudio_courseId_lessonId_key"
    ON "LessonAudio"("courseId", "lessonId");

CREATE INDEX IF NOT EXISTS "LessonAudio_courseId_idx"
    ON "LessonAudio"("courseId");
