"use client";

import { useEffect, useRef, useState } from "react";
import { Award, CheckCircle2, ChevronRight, Clock, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";

type Props = {
  courseId: string;
  /** null = prova final do curso; string = prova de uma aula específica */
  lessonId?: string | null;
  /** Duração em segundos. Padrão: 1800 (30 min). 0 = sem limite. */
  timeLimitSecs?: number;
  className?: string;
};

type Phase = "idle" | "taking" | "submitting" | "result";

/**
 * Painel de prova inline — abre "Fazer Prova", exibe questões uma a uma,
 * calcula nota no servidor e exibe certificado se aprovado.
 */
function formatTimer(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function LessonExamPanel({ courseId, lessonId, timeLimitSecs = 1800, className }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimitSecs);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [result, setResult] = useState<{
    score: number;
    isApproved: boolean;
    passingScore: number;
    correctCount: number;
    totalQuestions: number;
    certificateHash: string | null;
  } | null>(null);

  const { data: exam, isLoading: examLoading } = trpc.exams.examByCourse.useQuery(
    { courseId, lessonId: lessonId ?? undefined },
    { enabled: phase !== "idle", staleTime: 60_000, retry: false },
  );

  const submitMutation = trpc.exams.submitExam.useMutation({
    onSuccess: (data) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setResult(data);
      setPhase("result");
    },
  });

  // Timer regressivo — dispara submissão automática ao zerar
  useEffect(() => {
    if (phase !== "taking" || timeLimitSecs === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          // Tempo esgotado — submete com as respostas actuais
          if (exam) {
            setPhase("submitting");
            submitMutation.mutate({ examId: exam.id, answers });
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, exam?.id]);

  function startExam() {
    setAnswers([]);
    setCurrentQ(0);
    setResult(null);
    setTimeLeft(timeLimitSecs);
    setPhase("taking");
  }

  function selectAnswer(idx: number) {
    const next = [...answers];
    next[currentQ] = idx;
    setAnswers(next);
  }

  function nextQuestion() {
    if (!exam) return;
    if (currentQ < exam.questions.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      // Última questão — submete
      setPhase("submitting");
      submitMutation.mutate({ examId: exam.id, answers });
    }
  }

  // ── Estado: botão "Fazer Prova"
  if (phase === "idle") {
    return (
      <button
        type="button"
        onClick={startExam}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-[#4a7060]/35 bg-[#0a110d]/80 px-3 py-1.5 text-[11px] font-semibold text-[#6ab896]/85 transition-all hover:border-[#4a7060]/65 hover:bg-[#0c160f] hover:text-[#8dd4b4]",
          className,
        )}
        aria-label="Iniciar prova deste curso"
      >
        <Award className="size-3.5 shrink-0" aria-hidden />
        Fazer Prova
      </button>
    );
  }

  // ── Estado: carregando prova
  if (phase === "taking" && (examLoading || !exam)) {
    return (
      <div className={cn("flex items-center gap-2 text-[11px] text-white/40", className)}>
        <Loader2 className="size-3.5 animate-spin" />
        Carregando prova…
      </div>
    );
  }

  // ── Estado: sem prova cadastrada
  if (phase === "taking" && exam === null) {
    return (
      <p className={cn("text-[11px] text-white/35", className)}>
        Nenhuma prova cadastrada para este curso ainda.
      </p>
    );
  }

  // ── Estado: fazendo a prova
  if (phase === "taking" && exam) {
    const q = exam.questions[currentQ]!;
    const selected = answers[currentQ];

    return (
      <div
        className={cn(
          "flex flex-col gap-4 rounded-xl border border-[#4a7060]/25 bg-[#090f0c]/95 p-4",
          className,
        )}
        role="region"
        aria-label="Prova"
      >
        {/* Cabeçalho: título + timer + progresso */}
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 flex-1 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6ab896]/75">
            {exam.title}
          </span>
          {timeLimitSecs > 0 && (
            <span
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[10px] tabular-nums font-semibold",
                timeLeft <= 300
                  ? "bg-rose-500/15 text-rose-300"
                  : "bg-white/[0.06] text-white/40",
              )}
            >
              <Clock className="size-3" aria-hidden />
              {formatTimer(timeLeft)}
            </span>
          )}
          <span className="shrink-0 text-[10px] tabular-nums text-white/35">
            {currentQ + 1}/{exam.questions.length}
          </span>
        </div>

        <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[#4a7060]/60 transition-all"
            style={{ width: `${((currentQ + 1) / exam.questions.length) * 100}%` }}
          />
        </div>

        {/* Pergunta */}
        <p className="text-sm font-medium leading-snug text-white/90">{q.question}</p>

        {/* Opções */}
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectAnswer(i)}
              className={cn(
                "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left text-[12px] leading-snug transition-all",
                selected === i
                  ? "border-[#4a7060]/60 bg-[#4a7060]/20 text-white"
                  : "border-white/[0.08] bg-white/[0.03] text-white/65 hover:border-white/20 hover:bg-white/[0.06] hover:text-white/90",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold",
                  selected === i
                    ? "border-[#6ab896] bg-[#6ab896]/25 text-[#6ab896]"
                    : "border-white/20 text-white/35",
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>

        {/* Avançar */}
        <Button
          type="button"
          size="sm"
          disabled={selected === undefined}
          onClick={nextQuestion}
          className="ml-auto border border-[#4a7060]/40 bg-[#0c160f] text-[#8dd4b4] hover:bg-[#0f1f17]"
        >
          {currentQ < exam.questions.length - 1 ? (
            <>
              Próxima
              <ChevronRight className="ml-1 size-4" />
            </>
          ) : (
            "Enviar respostas"
          )}
        </Button>
      </div>
    );
  }

  // ── Estado: enviando
  if (phase === "submitting") {
    return (
      <div className={cn("flex items-center gap-2 text-[11px] text-white/40", className)}>
        <Loader2 className="size-3.5 animate-spin" />
        Calculando resultado…
      </div>
    );
  }

  // ── Estado: resultado
  if (phase === "result" && result) {
    const pct = Math.round((result.score / 10) * 100);
    return (
      <div
        className={cn(
          "flex flex-col gap-4 rounded-xl border p-4",
          result.isApproved
            ? "border-emerald-500/30 bg-emerald-950/20"
            : "border-rose-500/25 bg-rose-950/15",
          className,
        )}
        role="region"
        aria-label="Resultado da prova"
      >
        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          {result.isApproved ? (
            <CheckCircle2 className="size-6 shrink-0 text-emerald-400" />
          ) : (
            <XCircle className="size-6 shrink-0 text-rose-400" />
          )}
          <div>
            <p className="text-sm font-semibold text-white">
              {result.isApproved ? "Aprovado!" : "Não aprovado"}
            </p>
            <p className="text-[11px] text-white/50">
              {result.correctCount} de {result.totalQuestions} corretas · mínimo{" "}
              {result.passingScore.toFixed(1)}
            </p>
          </div>
          <span
            className={cn(
              "ml-auto text-2xl font-bold tabular-nums",
              result.isApproved ? "text-emerald-300" : "text-rose-300",
            )}
          >
            {result.score.toFixed(1)}
          </span>
        </div>

        {/* Barra de nota */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              result.isApproved ? "bg-emerald-500/70" : "bg-rose-500/60",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Certificado */}
        {result.isApproved && result.certificateHash && (
          <div className="rounded-lg border border-amber-500/25 bg-amber-950/20 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Award className="size-4 shrink-0 text-amber-400/80" aria-hidden />
              <p className="text-[11px] font-semibold text-amber-200/90">
                Certificado emitido!
              </p>
            </div>
            <a
              href={`/certificado/${result.certificateHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-[10px] text-amber-300/70 underline underline-offset-2 hover:text-amber-200"
            >
              Ver certificado →
            </a>
          </div>
        )}

        {/* Tentar novamente */}
        {!result.isApproved && (
          <button
            type="button"
            onClick={startExam}
            className="text-[11px] text-white/40 underline underline-offset-2 hover:text-white/70"
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  return null;
}
