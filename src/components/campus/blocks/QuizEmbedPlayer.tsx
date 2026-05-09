"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSession } from "next-auth/react";

import { submitQuizAction, type QuizSubmitResult } from "@/actions/student/quizSubmit";
import { trpc } from "@/lib/trpc/react";

const initial: QuizSubmitResult = { ok: false, message: undefined };

function SubmitQuizButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-canna-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      {pending ? "A submeter…" : "Submeter respostas"}
    </button>
  );
}

export function QuizEmbedPlayer({ quizId }: { quizId: string }) {
  const { status } = useSession();
  const q = trpc.campus.quizForPlay.useQuery({ quizId }, { staleTime: 60_000 });
  const [state, formAction] = useFormState(submitQuizAction, initial);

  if (status === "loading") {
    return <p className="text-xs text-white/50">A verificar sessão…</p>;
  }
  if (status === "unauthenticated") {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-100/90">
        Inicie sessão no campus para responder a este quiz.
      </div>
    );
  }

  if (q.isLoading) {
    return <p className="text-xs text-white/50">A carregar quiz…</p>;
  }
  if (q.isError || !q.data) {
    return (
      <div className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-xs text-white/60">
        Quiz indisponível (não publicado ou incompleto).
      </div>
    );
  }

  const quiz = q.data;

  if (state.ok) {
    const g = state.passed ? state.gamification : undefined;

    return (
      <div className="space-y-4 rounded-xl border border-white/10 bg-black/35 px-4 py-4">
        <p className="text-lg font-semibold text-white">Resultado</p>
        <p className="text-sm text-white/85">
          Pontuação: <strong>{state.score}</strong> / {state.maxScore}{" "}
          {state.passed ? (
            <span className="text-emerald-300">— Aprovado</span>
          ) : (
            <span className="text-rose-300">— Não atingiu o mínimo</span>
          )}
        </p>

        {g ? (
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-950/15 px-3 py-3 text-sm text-white/90">
            <p className="font-semibold text-emerald-200/95">Progresso</p>
            <p className="mt-1">
              +{g.xpGained} XP neste quiz · Total: <strong>{g.xpTotal} XP</strong>
            </p>
            <p className="mt-1 text-xs text-white/75">
              +{g.souvenirCreditsGained} créditos souvenir · Saldo:{" "}
              <strong>{g.souvenirCreditsTotal}</strong>
            </p>
            <p className="mt-1 text-xs text-white/60">
              Nível: {g.levelLabel} <span className="font-mono text-white/45">({g.levelKey})</span>
            </p>
            {g.unlocked.length > 0 ? (
              <div className="mt-3 border-t border-white/10 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Conquistas desbloqueadas
                </p>
                <ul className="mt-2 space-y-1 text-xs">
                  {g.unlocked.map((u) => (
                    <li key={u.code}>
                      <span className="text-canna-200/90">{u.title}</span>{" "}
                      <span className="font-mono text-white/45">({u.code})</span>
                      {u.xpReward > 0 ? (
                        <span className="text-white/55"> — +{u.xpReward} XP</span>
                      ) : null}
                      {u.souvenirCredits > 0 ? (
                        <span className="text-sky-300/90"> — +{u.souvenirCredits} souvenir</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
        <ul className="space-y-3 text-sm">
          {state.rows.map((row, i) => (
            <li
              key={i}
              className={`rounded-lg border px-3 py-2 ${row.correct ? "border-emerald-500/30 bg-emerald-950/15" : "border-rose-500/25 bg-rose-950/10"}`}
            >
              <p className="font-medium text-white/90">{row.prompt}</p>
              <p className="mt-1 text-xs text-white/55">
                {row.correct ? "Correto." : "Incorreto."}
                {row.explanation ? (
                  <span className="mt-1 block whitespace-pre-wrap text-white/65">{row.explanation}</span>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/35 px-4 py-4">
      <h3 className="text-base font-semibold text-white">{quiz.title}</h3>
      {quiz.passingPercent != null ? (
        <p className="mt-1 text-xs text-white/50">Aprovação: {quiz.passingPercent}%</p>
      ) : (
        <p className="mt-1 text-xs text-white/50">Responda todas as perguntas (todas correctas = aprovação).</p>
      )}

      {state.ok === false && state.message ? (
        <p className="mt-3 rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-sm text-rose-100">
          {state.message}
        </p>
      ) : null}

      <form action={formAction} className="mt-4 space-y-5">
        <input type="hidden" name="quizId" value={quizId} />
        {quiz.questions.map((question) => (
          <fieldset key={question.id} className="space-y-2 rounded-lg border border-white/10 bg-black/25 p-3">
            <legend className="px-1 text-sm font-medium text-white/90">{question.prompt}</legend>
            <p className="text-[10px] uppercase tracking-wider text-white/35">{question.type}</p>
            <ul className="space-y-2">
              {question.options.map((opt) => (
                <li key={opt.id}>
                  <label className="flex cursor-pointer items-start gap-2 text-sm text-white/85">
                    <input
                      type="radio"
                      name={`q_${question.id}`}
                      value={opt.id}
                      required
                      className="mt-1"
                    />
                    <span>{opt.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
        <SubmitQuizButton />
      </form>
    </div>
  );
}
