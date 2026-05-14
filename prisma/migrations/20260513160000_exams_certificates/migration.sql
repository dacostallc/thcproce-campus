-- Sistema de Provas e Certificados
-- Idempotente: IF NOT EXISTS em todas as operações.

CREATE TABLE IF NOT EXISTS "Exam" (
    "id"           TEXT         NOT NULL,
    "courseId"     TEXT         NOT NULL,
    "lessonId"     TEXT,
    "title"        TEXT         NOT NULL,
    "questions"    JSONB        NOT NULL DEFAULT '[]',
    "passingScore" DOUBLE PRECISION NOT NULL DEFAULT 7.0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Exam_courseId_lessonId_key"
    ON "Exam"("courseId", "lessonId");

CREATE INDEX IF NOT EXISTS "Exam_courseId_idx"
    ON "Exam"("courseId");

-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "UserExamAttempt" (
    "id"         TEXT             NOT NULL,
    "profileId"  TEXT             NOT NULL,
    "examId"     TEXT             NOT NULL,
    "score"      DOUBLE PRECISION NOT NULL,
    "answers"    JSONB            NOT NULL DEFAULT '[]',
    "isApproved" BOOLEAN          NOT NULL DEFAULT FALSE,
    "createdAt"  TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserExamAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "UserExamAttempt_profileId_examId_idx"
    ON "UserExamAttempt"("profileId", "examId");

ALTER TABLE "UserExamAttempt"
    DROP CONSTRAINT IF EXISTS "UserExamAttempt_profileId_fkey";
ALTER TABLE "UserExamAttempt"
    ADD CONSTRAINT "UserExamAttempt_profileId_fkey"
    FOREIGN KEY ("profileId") REFERENCES "Profile"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserExamAttempt"
    DROP CONSTRAINT IF EXISTS "UserExamAttempt_examId_fkey";
ALTER TABLE "UserExamAttempt"
    ADD CONSTRAINT "UserExamAttempt_examId_fkey"
    FOREIGN KEY ("examId") REFERENCES "Exam"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Certificate" (
    "id"          TEXT         NOT NULL,
    "profileId"   TEXT         NOT NULL,
    "courseId"    TEXT         NOT NULL,
    "verifyHash"  TEXT         NOT NULL,
    "issuedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Certificate_verifyHash_key"
    ON "Certificate"("verifyHash");

CREATE UNIQUE INDEX IF NOT EXISTS "Certificate_profileId_courseId_key"
    ON "Certificate"("profileId", "courseId");

CREATE INDEX IF NOT EXISTS "Certificate_profileId_idx"
    ON "Certificate"("profileId");

ALTER TABLE "Certificate"
    DROP CONSTRAINT IF EXISTS "Certificate_profileId_fkey";
ALTER TABLE "Certificate"
    ADD CONSTRAINT "Certificate_profileId_fkey"
    FOREIGN KEY ("profileId") REFERENCES "Profile"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
