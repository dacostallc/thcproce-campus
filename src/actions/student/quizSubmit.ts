"use server";

import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { getPublishedQuizWithAnswers } from "@/lib/quiz/playable";
import { applyQuizPassGamification, type QuizPassGamificationResult } from "@/lib/services/gamification";
import { syncMissionsForProfile } from "@/lib/services/missionsSync";
import { runSerializableTransaction } from "@/lib/gamification/safeTransactions";
import { prisma } from "@/lib/prisma";

export type QuizSubmitResult =
  | {
      ok: true;
      score: number;
      maxScore: number;
      passed: boolean;
      rows: { prompt: string; correct: boolean; explanation: string | null }[];
      gamification?: QuizPassGamificationResult;
    }
  | { ok: false; message?: string };

export async function submitQuizAction(
  _prev: QuizSubmitResult,
  formData: FormData,
): Promise<QuizSubmitResult> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase() ?? null;
  if (!email) {
    return { ok: false, message: "Inicie sessão para submeter o quiz." };
  }
  const profile = await prisma.profile.findUnique({ where: { email } });
  if (!profile) {
    return { ok: false, message: "Perfil não encontrado. Complete a inscrição no campus." };
  }

  const quizId = String(formData.get("quizId") ?? "").trim();
  if (!quizId) return { ok: false, message: "Quiz inválido." };

  const full = await getPublishedQuizWithAnswers(quizId);
  if (!full) {
    return { ok: false, message: "Quiz indisponível ou não publicado." };
  }

  if (!full.questions.length) {
    return { ok: false, message: "Este quiz ainda não tem perguntas." };
  }

  const answers = new Map<string, string>();
  for (const [k, v] of formData.entries()) {
    if (k.startsWith("q_") && typeof v === "string" && v.length > 0) {
      answers.set(k.slice(2), v);
    }
  }

  for (const q of full.questions) {
    if (q.type !== "SINGLE_CHOICE" && q.type !== "TRUE_FALSE") {
      return { ok: false, message: "Tipo de pergunta não suportado neste quiz." };
    }
    if (!answers.has(q.id)) {
      return { ok: false, message: "Responda a todas as perguntas antes de submeter." };
    }
    if (!q.options.length) {
      return { ok: false, message: "Há perguntas sem opções — contacte o formador." };
    }
  }

  type RowPayload = { questionId: string; value: unknown; isCorrect: boolean; awardedPoints: number };
  const responseRows: RowPayload[] = [];
  let score = 0;
  const maxScore = full.questions.length;

  const recapRows: { prompt: string; correct: boolean; explanation: string | null }[] = [];

  for (const q of full.questions) {
    const selectedId = answers.get(q.id)!;
    const opt = q.options.find((o) => o.id === selectedId);
    if (!opt) {
      return { ok: false, message: "Selecção inválida numa das perguntas." };
    }
    const correct = opt.isCorrect === true;
    if (correct) score += 1;
    responseRows.push({
      questionId: q.id,
      value: { optionId: selectedId },
      isCorrect: correct,
      awardedPoints: correct ? 1 : 0,
    });
    recapRows.push({
      prompt: q.prompt,
      correct,
      explanation: q.explanation,
    });
  }

  const pct = maxScore > 0 ? (100 * score) / maxScore : 0;
  const passed =
    full.passingPercent == null ? score === maxScore : maxScore > 0 && pct >= full.passingPercent;

  let gamification: QuizPassGamificationResult | undefined;

  await runSerializableTransaction(prisma, async (tx) => {
    const attempt = await tx.quizAttempt.create({
      data: {
        quizId,
        profileId: profile.id,
        finishedAt: new Date(),
        score,
        maxScore,
        passed,
      },
    });
    for (const r of responseRows) {
      await tx.quizResponse.create({
        data: {
          attemptId: attempt.id,
          questionId: r.questionId,
          value: r.value as Prisma.InputJsonValue,
          isCorrect: r.isCorrect,
          awardedPoints: r.awardedPoints,
        },
      });
    }

    if (passed) {
      const passedAttemptsForQuiz = await tx.quizAttempt.count({
        where: { profileId: profile.id, quizId, passed: true },
      });
      // Só a primeira aprovação neste quiz paga XP/créditos/achievements automáticos.
      // Novas tentativas aprovadas ficam registadas, evitando duplicar recompensa em retry paralelo ou reaprovções.
      if (passedAttemptsForQuiz === 1) {
        gamification = await applyQuizPassGamification(tx, profile.id, {
          quizId,
          quizTitle: full.title,
        });
      }
    }
  }, "quizSubmit");

  await syncMissionsForProfile(profile.id);

  return {
    ok: true,
    score,
    maxScore,
    passed,
    rows: recapRows,
    ...(gamification ? { gamification } : {}),
  };
}
