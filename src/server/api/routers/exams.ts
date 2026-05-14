/**
 * Router de Provas e Certificados.
 *
 * Procedimentos:
 *  examByCourse          — busca a prova de um curso (pública, sem autenticação)
 *  submitExam            — envia respostas, calcula nota, emite certificado se aprovado
 *  myAttempts            — histórico de tentativas do aluno (autenticado)
 *  myCertificates        — certificados emitidos para o aluno logado
 *  verifyCertificate     — verifica hash público de um certificado (sem autenticação)
 */

import { router, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/server/db";
import { awardXp, PROGRESSION_XP_REASON } from "@/lib/progression/rewards";
import { XP_REWARD_EXAM_PASS } from "@/lib/progression/xp";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type QuestionRaw = {
  question: string;
  options: string[];
  correct: number; // índice 0-based da resposta correta
};

function parseQuestions(raw: unknown): QuestionRaw[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (q): q is QuestionRaw =>
      q !== null &&
      typeof q === "object" &&
      typeof (q as QuestionRaw).question === "string" &&
      Array.isArray((q as QuestionRaw).options) &&
      typeof (q as QuestionRaw).correct === "number",
  );
}

/** Calcula nota de 0 a 10. */
function calculateScore(questions: QuestionRaw[], answers: number[]): number {
  if (questions.length === 0) return 0;
  const correct = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
    0,
  );
  return parseFloat(((correct / questions.length) * 10).toFixed(2));
}

/** Resolve o profileId a partir da sessão. */
async function requireProfile(session: {
  user?: { email?: string | null } | null;
} | null) {
  const email = session?.user?.email;
  if (!email) throw new TRPCError({ code: "UNAUTHORIZED" });
  const profile = await prisma.profile.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Perfil não encontrado." });
  return profile.id;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const examsRouter = router({
  /** Busca a prova de um curso (lessonId null = prova final do curso). */
  examByCourse: publicProcedure
    .input(
      z.object({
        courseId: z.string().min(1).max(64),
        lessonId: z.string().max(160).optional(),
      }),
    )
    .query(async ({ input }) => {
      const lessonId = input.lessonId ?? null;
      const exam = await prisma.exam.findFirst({
        where: {
          courseId: input.courseId,
          lessonId,
        },
        select: {
          id: true,
          title: true,
          passingScore: true,
          questions: true,
        },
      });
      if (!exam) return null;

      // Retorna as perguntas SEM a resposta correta — segurança no cliente
      const questions = parseQuestions(exam.questions).map(({ question, options }) => ({
        question,
        options,
      }));

      return {
        id: exam.id,
        title: exam.title,
        passingScore: exam.passingScore,
        questionCount: questions.length,
        questions,
      };
    }),

  /** Envia respostas, calcula nota e emite certificado se aprovado. */
  submitExam: protectedProcedure
    .input(
      z.object({
        examId: z.string().cuid(),
        answers: z.array(z.number().int().min(0)).min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profileId = await requireProfile(ctx.session);

      const exam = await prisma.exam.findUnique({
        where: { id: input.examId },
        select: { courseId: true, questions: true, passingScore: true },
      });
      if (!exam) throw new TRPCError({ code: "NOT_FOUND", message: "Prova não encontrada." });

      const questions = parseQuestions(exam.questions);
      const score = calculateScore(questions, input.answers);
      const isApproved = score >= exam.passingScore;

      // Registra a tentativa
      const attempt = await prisma.userExamAttempt.create({
        data: {
          profileId,
          examId: input.examId,
          score,
          answers: input.answers,
          isApproved,
        },
        select: { id: true },
      });

      // Concede XP ao passar no exame (apenas na primeira aprovação)
      if (isApproved) {
        const alreadyPassed = await prisma.userExamAttempt.count({
          where: { profileId, examId: input.examId, isApproved: true },
        });
        if (alreadyPassed <= 1) {
          // <= 1 porque a tentativa atual já foi criada acima
          await awardXp(prisma, profileId, XP_REWARD_EXAM_PASS, PROGRESSION_XP_REASON.COMPLETE_COURSE, {
            examId: input.examId,
            courseId: exam.courseId,
          });
        }
      }

      // Emite certificado automaticamente (idempotente — unique constraint)
      let certificate: { verifyHash: string } | null = null;
      if (isApproved) {
        try {
          certificate = await prisma.certificate.upsert({
            where: { profileId_courseId: { profileId, courseId: exam.courseId } },
            create: { profileId, courseId: exam.courseId },
            update: {},
            select: { verifyHash: true },
          });
        } catch {
          // já existe — busca o existente
          certificate = await prisma.certificate.findUnique({
            where: { profileId_courseId: { profileId, courseId: exam.courseId } },
            select: { verifyHash: true },
          });
        }
      }

      return {
        attemptId: attempt.id,
        score,
        isApproved,
        passingScore: exam.passingScore,
        correctCount: Math.round((score / 10) * questions.length),
        totalQuestions: questions.length,
        certificateHash: certificate?.verifyHash ?? null,
      };
    }),

  /** Histórico de tentativas do aluno para um curso. */
  myAttempts: protectedProcedure
    .input(z.object({ courseId: z.string().min(1).max(64) }))
    .query(async ({ ctx, input }) => {
      const profileId = await requireProfile(ctx.session);
      const attempts = await prisma.userExamAttempt.findMany({
        where: {
          profileId,
          exam: { courseId: input.courseId },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          score: true,
          isApproved: true,
          createdAt: true,
          exam: { select: { title: true, passingScore: true } },
        },
      });
      return attempts.map((a) => ({
        id: a.id,
        score: a.score,
        isApproved: a.isApproved,
        examTitle: a.exam.title,
        passingScore: a.exam.passingScore,
        createdAt: a.createdAt.toISOString(),
      }));
    }),

  /** Certificados do aluno logado. */
  myCertificates: protectedProcedure.query(async ({ ctx }) => {
    const profileId = await requireProfile(ctx.session);
    const certs = await prisma.certificate.findMany({
      where: { profileId },
      orderBy: { issuedAt: "desc" },
      select: { id: true, courseId: true, verifyHash: true, issuedAt: true },
    });
    return certs.map((c) => ({
      id: c.id,
      courseId: c.courseId,
      verifyHash: c.verifyHash,
      issuedAt: c.issuedAt.toISOString(),
      verifyUrl: `/certificado/${c.verifyHash}`,
    }));
  }),

  /** Verifica um certificado publicamente pelo hash (sem autenticação). */
  verifyCertificate: publicProcedure
    .input(z.object({ hash: z.string().cuid() }))
    .query(async ({ input }) => {
      const cert = await prisma.certificate.findUnique({
        where: { verifyHash: input.hash },
        select: {
          courseId: true,
          issuedAt: true,
          profile: { select: { displayName: true } },
        },
      });
      if (!cert) return { valid: false as const };
      return {
        valid: true as const,
        courseId: cert.courseId,
        studentName: cert.profile.displayName ?? "Aluno",
        issuedAt: cert.issuedAt.toISOString(),
      };
    }),
});

export type ExamsRouter = typeof examsRouter;
