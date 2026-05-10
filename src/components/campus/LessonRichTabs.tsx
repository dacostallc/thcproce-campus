"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Bookmark,
  ClipboardList,
  GraduationCap,
  Library,
  StickyNote,
  Target,
  Video,
  Image as ImageIcon,
  LayoutGrid,
  FileStack,
  Sparkles
} from "lucide-react";
import type { LessonRichContent } from "@/data/lessonRichTypes";
import type { LessonQuizItem } from "@/data/lessonRichTypes";
import type { LessonMediaHints } from "@/data/lessonRichTypes";
import type { AreaColor } from "@/data/courses";
import { cn } from "@/lib/utils";
import {
  buildInlineLessonQuizQuestionId,
  lessonQuizAttemptStorageKey,
  persistLessonQuizAttempt,
  readLessonQuizAttempt
} from "@/lib/lessonAcademicPersistence";
import { adjustCreditsByWithApplied } from "@/lib/studentGamificationStorage";
import { completeCampusMissionPhase2IfNeeded } from "@/lib/campusMissionsPhase2Storage";
import { bumpAcademicQuizAnswered } from "@/lib/campusAcademicHistoryStorage";

type StreamPal = {
  articleBorder: string;
  sectionBorder: string;
  sectionTitle: string;
  summaryKicker: string;
  badgeNum: string;
  refBorder: string;
  profBox: string;
  textareaFocus: string;
};

/** Stream layout: Cannabis 101 = âmbar (`amber`); demais cursos = `streamAccent`. */
const STREAM_PALETTE: Record<AreaColor, StreamPal> = {
  amber: {
    articleBorder: "border-amber-500/25",
    sectionBorder: "border-amber-500/10",
    sectionTitle:
      "mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-amber-100/88 sm:text-xs",
    summaryKicker: "text-[10px] font-bold uppercase tracking-widest text-amber-200/80",
    badgeNum:
      "bg-gradient-to-br from-amber-500/35 to-amber-900/30 text-[12px] font-bold text-amber-50 shadow-inner ring-1 ring-amber-400/25",
    refBorder: "border-l-2 border-amber-400/35",
    profBox: "border border-amber-500/20 bg-amber-950/20 shadow-inner",
    textareaFocus: "focus:ring-amber-500/40"
  },
  canna: {
    articleBorder: "border-canna-500/15",
    sectionBorder: "border-canna-500/10",
    sectionTitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-canna-200/55 mb-3",
    summaryKicker: "text-[10px] font-bold uppercase tracking-widest text-canna-200/70",
    badgeNum: "bg-canna-500/15 text-[11px] font-bold text-canna-200",
    refBorder: "border-l-2 border-canna-500/25",
    profBox: "border border-canna-500/15 bg-canna-950/10",
    textareaFocus: "focus:ring-canna-500/35"
  },
  purple: {
    articleBorder: "border-purple-500/15",
    sectionBorder: "border-purple-500/10",
    sectionTitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-purple-200/55 mb-3",
    summaryKicker: "text-[10px] font-bold uppercase tracking-widest text-purple-200/70",
    badgeNum: "bg-purple-500/15 text-[11px] font-bold text-purple-200",
    refBorder: "border-l-2 border-purple-500/25",
    profBox: "border border-purple-500/15 bg-purple-950/10",
    textareaFocus: "focus:ring-purple-500/35"
  },
  cyan: {
    articleBorder: "border-cyan-500/15",
    sectionBorder: "border-cyan-500/10",
    sectionTitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200/55 mb-3",
    summaryKicker: "text-[10px] font-bold uppercase tracking-widest text-cyan-200/70",
    badgeNum: "bg-cyan-500/15 text-[11px] font-bold text-cyan-200",
    refBorder: "border-l-2 border-cyan-500/25",
    profBox: "border border-cyan-500/15 bg-cyan-950/10",
    textareaFocus: "focus:ring-cyan-500/35"
  },
  rose: {
    articleBorder: "border-rose-500/15",
    sectionBorder: "border-rose-500/10",
    sectionTitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-rose-200/55 mb-3",
    summaryKicker: "text-[10px] font-bold uppercase tracking-widest text-rose-200/70",
    badgeNum: "bg-rose-500/15 text-[11px] font-bold text-rose-200",
    refBorder: "border-l-2 border-rose-500/25",
    profBox: "border border-rose-500/15 bg-rose-950/10",
    textareaFocus: "focus:ring-rose-500/35"
  }
};

const TABS = [
  { id: "conteudo" as const, label: "Aula", icon: BookOpen },
  { id: "objetivos" as const, label: "Objetivos", icon: Target },
  { id: "materiais" as const, label: "Materiais", icon: ClipboardList },
  { id: "refs" as const, label: "Referências", icon: Library },
  { id: "prof" as const, label: "Professor", icon: GraduationCap },
  { id: "notas" as const, label: "Suas notas", icon: StickyNote }
];

type TabId = (typeof TABS)[number]["id"];

type StreamChapterMeta = {
  moduleTitle: string;
  moduleOrdinal: number;
  moduleCount: number;
  lessonOrdinalInModule: number;
  lessonsInModule: number;
  globalLesson: number;
  globalTotal: number;
  tagline: string;
};

export type LessonQuizAcademicContext = {
  areaId: string;
  lessonIndex: number;
};

type Props = {
  storageKey: string;
  content: LessonRichContent;
  variant?: "default" | "cannabis101" | "campus";
  layout?: "tabs" | "stream";
  streamAccent?: AreaColor;
  /** Cannabis 101: metadados de capítulo para herói + progressão na sala. */
  streamChapter?: StreamChapterMeta | null;
  /** Quando já mostrou intro fora das tabs/stream (evita duplicar a secção "Começa assim"). */
  skipIntroSection?: boolean;
  /** Quiz inline: pontuação local (+/- créditos) e persistência de tentativas. */
  lessonQuizContext?: LessonQuizAcademicContext | null;
};

function SectionTitle({
  palette,
  icon,
  children
}: {
  palette: StreamPal;
  icon?: ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h2 className={palette.sectionTitle}>
      {icon ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 border-l border-amber-500/20 pl-3 leading-tight">{children}</span>
    </h2>
  );
}

function splitBodyParagraphs(body: string | undefined): string[] {
  if (!body?.trim()) return [];
  return body
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const CAN101_STREAM_SECTION = {
  intro: "Começa assim",
  body: "Na prática",
  objectives: "O que você leva desta sessão",
  summary: "Recap rápido",
  quiz: "Quiz leve (sem drama)",
  media: "Mídia & referência visual",
  materials: "Materiais & links",
  refs: "Leituras & fontes",
  prof: "Bastidor pro facilitador(a)",
  notes: "Suas anotações"
} as const;

function formatLessonQuizScoreLine(creditsDeltaApplied: number, correct: boolean): string {
  if (correct) return creditsDeltaApplied > 0 ? `Resposta correta: +${creditsDeltaApplied}` : "Resposta correta";
  if (creditsDeltaApplied === 0) return "Resposta incorreta — penalização não aplicada (saldo já era 0)";
  return `Resposta incorreta: ${creditsDeltaApplied}`;
}

type StreamQuizQuestionProps = {
  q: LessonQuizItem;
  index: number;
  /** Cannabis 101: feedback textual mais “premium” e menos jargon de sala de aula. */
  cinematicHints?: boolean;
  quizContext?: LessonQuizAcademicContext | null;
};

function StreamQuizBlock({
  items,
  cinematicHints,
  quizContext
}: {
  items: LessonQuizItem[];
  cinematicHints?: boolean;
  quizContext?: LessonQuizAcademicContext | null;
}) {
  return (
    <div className="space-y-5">
      {items.map((q, qi) => (
        <StreamQuizQuestion
          key={qi}
          q={q}
          index={qi}
          cinematicHints={cinematicHints}
          quizContext={quizContext}
        />
      ))}
    </div>
  );
}

function StreamQuizQuestion({
  q,
  index,
  cinematicHints,
  quizContext
}: StreamQuizQuestionProps) {
  const questionId = useMemo(() => buildInlineLessonQuizQuestionId(index, q.question), [index, q.question]);
  const compositeKey =
    quizContext != null
      ? lessonQuizAttemptStorageKey(quizContext.areaId, quizContext.lessonIndex, questionId)
      : null;

  const [picked, setPicked] = useState<number | null>(null);
  const [scoreLine, setScoreLine] = useState<string | null>(null);

  useEffect(() => {
    if (!compositeKey) return;
    const prev = readLessonQuizAttempt(compositeKey);
    if (!prev) return;
    setPicked(prev.pickedIndex);
    const correct = prev.pickedIndex === q.correctIndex;
    setScoreLine(formatLessonQuizScoreLine(prev.creditsDeltaApplied, correct));
  }, [compositeKey, q.correctIndex]);

  const done = picked !== null;

  function handlePick(oi: number) {
    if (picked !== null) return;
    setPicked(oi);
    if (!quizContext || !compositeKey) return;
    const existing = readLessonQuizAttempt(compositeKey);
    if (existing) return;
    const correct = oi === q.correctIndex;
    const attemptedDelta = correct ? 2 : -2;
    const { appliedDelta } = adjustCreditsByWithApplied(attemptedDelta, "lesson_quiz_inline");
    persistLessonQuizAttempt(compositeKey, {
      pickedIndex: oi,
      creditsDeltaApplied: appliedDelta,
      recordedAtMs: Date.now()
    });
    bumpAcademicQuizAnswered(quizContext.areaId);
    setScoreLine(formatLessonQuizScoreLine(appliedDelta, correct));
    if (correct) completeCampusMissionPhase2IfNeeded("campus-p2-first-quiz-correct");
  }

  return (
    <div className="rounded-xl border border-white/14 bg-black/40 px-4 py-3.5 transition duration-200 hover:-translate-y-px hover:border-amber-500/20 hover:shadow-md hover:shadow-black/30">
      <p className="mb-2 text-sm font-semibold leading-snug text-white/90">
        <span className="mr-2 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-[11px] font-bold text-emerald-200">
          {index + 1}
        </span>
        {q.question}
      </p>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {q.options.map((opt, oi) => {
          const isCorrect = oi === q.correctIndex;
          const isWrongPick = done && picked === oi && !isCorrect;
          return (
            <button
              key={oi}
              type="button"
              disabled={done}
              onClick={() => handlePick(oi)}
              className={cn(
                "rounded-md border px-3 py-2.5 text-left text-[13px] leading-snug transition-colors",
                !done && "border-white/15 bg-black/30 text-white/85 hover:bg-white/8",
                done && isCorrect && "border-emerald-500/45 bg-emerald-500/10 text-emerald-50",
                done && isWrongPick && "border-rose-500/35 bg-rose-500/10 text-white/85"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {done ? (
        <div className="mt-2 space-y-1">
          {scoreLine ? (
            <p
              className={cn(
                "text-xs font-semibold",
                scoreLine.startsWith("Resposta correta") ? "text-emerald-200/95" : "text-rose-200/90"
              )}
            >
              {scoreLine}
            </p>
          ) : null}
          <p className="text-xs text-white/50">
            {picked === q.correctIndex
              ? cinematicHints
                ? "Isso aí — combina com o que a gente destacou mais acima nesta sessão."
                : "Correto — fecha com o texto principal da aula."
              : cinematicHints
                ? "Quase! Dá uma olhada de novo na abertura e nos objetivos; a resposta que a THCProce considera certa está no roteiro desta aula."
                : "Revise o miolo da aula e os objetivos; a alternativa certa segue o texto-base desta edição."}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function MediaHintRow({ media, pal }: { media: LessonMediaHints; pal: StreamPal }) {
  const row: { label: string; Icon: typeof Video; on: boolean }[] = [
    { label: "Vídeo / demonstração", Icon: Video, on: media.needsVideo },
    { label: "Imagens (campo, bancada, equipamento)", Icon: ImageIcon, on: media.needsImage },
    { label: "Infográfico ou esquema", Icon: LayoutGrid, on: media.needsInfographic },
    { label: "Material de apoio (PDF, checklists)", Icon: FileStack, on: media.needsSupportMaterial }
  ];
  const any = row.some((x) => x.on);
  if (!any) {
    return (
      <p className="text-[13px] text-white/45">
        Nada de obrigatório em vídeo aqui — o texto já se vira sozinho pra um primeiro contato.
      </p>
    );
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {row
        .filter((x) => x.on)
        .map(({ label, Icon }) => (
          <li
            key={label}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/80 transition duration-200 hover:-translate-y-px hover:border-white/35 hover:text-white",
              pal.articleBorder
            )}
          >
            <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
            {label}
          </li>
        ))}
    </ul>
  );
}

export function LessonRichTabs({
  storageKey,
  content,
  variant = "default",
  layout = "tabs",
  streamAccent = "canna",
  streamChapter = null,
  skipIntroSection = false,
  lessonQuizContext = null
}: Props) {
  const [tab, setTab] = useState<TabId>("conteudo");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setTab("conteudo");
  }, [storageKey]);

  useEffect(() => {
    try {
      setNotes(localStorage.getItem(storageKey) ?? "");
    } catch {
      setNotes("");
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, notes);
    } catch {
      /* noop */
    }
  }, [storageKey, notes]);

  const c = variant === "cannabis101";
  const campusStream = variant === "campus" && layout === "stream";
  const stream = layout === "stream" && (c || campusStream);
  const pal = c ? STREAM_PALETTE.amber : STREAM_PALETTE[streamAccent];
  const wrap = c
    ? "border-amber-500/25 bg-[#050d0a]/80 shadow-[0_0_40px_rgba(0,0,0,0.35)]"
    : "border-white/10 bg-black/20";
  const tabBar = c ? "border-amber-500/20" : "border-white/10";
  const activeTab = c
    ? "bg-amber-500/20 text-amber-100 border border-amber-400/40"
    : "bg-canna-500/25 text-canna-100 border border-canna-400/35";
  const idleTab = c
    ? "text-white/50 hover:bg-amber-500/10 hover:text-white/90 border border-transparent"
    : "text-white/55 hover:bg-white/5 hover:text-white/90 border border-transparent";

  const bodyProse = "text-[15px] sm:text-[16px] leading-[1.78] text-white/[0.9] lg:text-[16px] lg:leading-[1.8]";
  const bodyLead = c
    ? "text-[16px] sm:text-[17px] font-medium leading-[1.72] text-white/[0.94]"
    : bodyProse;

  const bodyParagraphs = useMemo(() => splitBodyParagraphs(content.body), [content.body]);

  if (stream) {
    return (
      <motion.article
        key={storageKey}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "mx-auto w-full max-w-[min(72ch,100%)] rounded-[1.25rem] border px-4 py-6 sm:px-9 sm:py-9 lg:max-w-[76ch] lg:px-11 lg:py-11 shadow-[0_28px_90px_rgba(0,0,0,0.55)]",
          pal.articleBorder,
          c
            ? "bg-[#040907]/96 ring-1 ring-amber-500/15"
            : "bg-[#050b08]/92 ring-1 ring-white/[0.06]"
        )}
      >
        {c && streamChapter ? (
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.35 }}
            className="relative mb-8 overflow-hidden rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-950/55 via-[#06120c]/95 to-black/85 px-4 py-5 sm:px-6 sm:py-6"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-amber-400/20 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/45 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100 shadow-sm shadow-amber-950/40">
                <Sparkles className="size-3.5 shrink-0 text-amber-300" aria-hidden />
                Capítulo {streamChapter.moduleOrdinal}/{streamChapter.moduleCount}
              </span>
              <span
                className="rounded-full border border-white/12 bg-black/30 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/60"
                title="Posição dentro do módulo atual"
              >
                {streamChapter.lessonOrdinalInModule}/{streamChapter.lessonsInModule} no capítulo
              </span>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-white/35">
                {streamChapter.globalLesson}/{streamChapter.globalTotal}
              </span>
            </div>
            <p className="relative mt-3 text-[12px] font-bold uppercase tracking-[0.2em] text-amber-200/90 sm:text-[13px]">
              {streamChapter.moduleTitle}
            </p>
            <p className="relative mt-2 max-w-[52ch] text-[15px] font-semibold leading-snug text-white sm:text-[17px]">
              {streamChapter.tagline}
            </p>
          </motion.header>
        ) : null}

        {!skipIntroSection ? (
          <section className={cn("border-b pb-8 sm:pb-11", pal.sectionBorder)}>
            {c ? (
              <SectionTitle palette={pal} icon={<BookOpen className="size-3.5 opacity-90" aria-hidden />}>
                {CAN101_STREAM_SECTION.intro}
              </SectionTitle>
            ) : (
              <h2 className={pal.sectionTitle}>Introdução</h2>
            )}
            <div className={cn("space-y-5 sm:space-y-6", bodyProse)}>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.08 }}
                className={bodyLead}
              >
                {content.intro}
              </motion.p>
            </div>
          </section>
        ) : null}

        <section className={cn("border-b py-8 sm:py-11", pal.sectionBorder)}>
          {c ? (
            <SectionTitle palette={pal} icon={<LayoutGrid className="size-3.5 opacity-90" aria-hidden />}>
              {CAN101_STREAM_SECTION.body}
            </SectionTitle>
          ) : (
            <h2 className={pal.sectionTitle}>Desenvolvimento</h2>
          )}
          <div className={cn("space-y-6 sm:space-y-8", bodyProse)}>
            {bodyParagraphs.length ? (
              bodyParagraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(0.05 * i, 0.35) }}
                  className={cn(
                    c && "border-l-2 border-amber-500/20 pl-4 sm:pl-5 leading-[1.82]",
                    i === 0 && c && "text-[16px] sm:text-[17px] font-medium text-white/[0.94]"
                  )}
                >
                  {p}
                </motion.p>
              ))
            ) : (
              <p className="text-white/50">
                {c
                  ? "O texto completo deste episódio ainda tá entrando no campus — enquanto isso, aproveita a abertura, os objetivos e os links em Materiais pra não ficar no vácuo."
                  : "Conteúdo principal será exibido aqui quando o campo textual da aula estiver preenchido."}
              </p>
            )}
          </div>
        </section>

        {c ? (
          <>
            <section className={cn("border-b py-8 sm:py-11", pal.sectionBorder)}>
              <SectionTitle palette={pal} icon={<Bookmark className="size-3.5 opacity-90" aria-hidden />}>
                {CAN101_STREAM_SECTION.summary}
              </SectionTitle>
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl border px-5 py-5 sm:px-7 sm:py-6",
                  "border-amber-400/35 bg-gradient-to-br from-amber-950/45 via-[#050c08] to-black/80 shadow-[0_0_48px_rgba(180,120,50,0.12)]"
                )}
              >
                <div
                  className="pointer-events-none absolute right-0 top-0 size-32 bg-gradient-to-bl from-amber-400/10 to-transparent blur-2xl"
                  aria-hidden
                />
                <p className="relative text-[14px] sm:text-[16px] leading-relaxed text-amber-50/[0.93]">
                  {content.summary}
                </p>
              </div>
            </section>

            <section className={cn("border-b py-8 sm:py-11", pal.sectionBorder)}>
              <SectionTitle palette={pal} icon={<Target className="size-3.5 opacity-90" aria-hidden />}>
                {CAN101_STREAM_SECTION.objectives}
              </SectionTitle>
              <ul className="grid gap-3 sm:gap-4">
                {content.objectives.map((o, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    className={cn(
                      "flex gap-3 rounded-2xl border px-4 py-3.5 sm:px-5 sm:py-4 text-[14px] sm:text-[15px] leading-relaxed text-white/[0.9] transition duration-200",
                      "border-amber-500/25 bg-gradient-to-br from-[#0c1610]/95 to-black/50 shadow-lg shadow-black/25 ring-1 ring-amber-500/10 hover:border-amber-400/40 hover:ring-amber-400/15"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl font-bold",
                        pal.badgeNum
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 pt-0.5">{o}</span>
                  </motion.li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <>
            <section className={cn("border-b py-8 sm:py-11", pal.sectionBorder)}>
              <h2 className={pal.sectionTitle}>Objetivos da aula</h2>
              <ul className="grid gap-3 sm:gap-4">
                {content.objectives.map((o, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 sm:px-5 sm:py-4 text-[14px] sm:text-[15px] leading-relaxed text-white/[0.9] transition duration-200"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl font-bold",
                        pal.badgeNum
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 pt-0.5">{o}</span>
                  </motion.li>
                ))}
              </ul>
            </section>

            <section className={cn("border-b py-8 sm:py-11", pal.sectionBorder)}>
              <h2 className={pal.sectionTitle}>Resumo final</h2>
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl border px-5 py-5 sm:px-7 sm:py-6",
                  "border-white/14 bg-black/35"
                )}
              >
                <p className="relative text-[14px] sm:text-[16px] leading-relaxed text-white/[0.9]">
                  {content.summary}
                </p>
              </div>
            </section>
          </>
        )}

        {content.quiz?.length ? (
          <section className={cn("border-b py-8 sm:py-11", pal.sectionBorder)}>
            {c ? (
              <SectionTitle palette={pal} icon={<Sparkles className="size-3.5 opacity-90" aria-hidden />}>
                {CAN101_STREAM_SECTION.quiz}
              </SectionTitle>
            ) : (
              <h2 className={pal.sectionTitle}>Quiz rápido</h2>
            )}
            <StreamQuizBlock
              items={content.quiz}
              cinematicHints={c}
              quizContext={lessonQuizContext}
            />
          </section>
        ) : null}

        {content.media ? (
          <section className={cn("border-b py-8 sm:py-11", pal.sectionBorder)}>
            {c ? (
              <SectionTitle palette={pal} icon={<Video className="size-3.5 opacity-90" aria-hidden />}>
                {CAN101_STREAM_SECTION.media}
              </SectionTitle>
            ) : (
              <h2 className={pal.sectionTitle}>Recursos sugeridos (produção)</h2>
            )}
            <p className={cn("mb-3 text-[12px] leading-relaxed text-white/50")}>
              {c
                ? "Sugestões criativas pra equipe THCProce: o que poderia virar vídeo, foto de bancada ou infográfico digno de doc no futuro."
                : "Indicações editoriais para enriquecer versões futuras desta aula com visuais e demonstrações."}
            </p>
            <MediaHintRow media={content.media} pal={pal} />
          </section>
        ) : null}

        <section className={cn("border-b py-8 sm:py-11", pal.sectionBorder)}>
          {c ? (
            <SectionTitle palette={pal} icon={<ClipboardList className="size-3.5 opacity-90" aria-hidden />}>
              {CAN101_STREAM_SECTION.materials}
            </SectionTitle>
          ) : (
            <h2 className={pal.sectionTitle}>Materiais de apoio</h2>
          )}
          <ul className="space-y-2.5 text-[14px] sm:text-[15px] text-white/[0.88] list-none">
            {content.materials.map((m, i) => (
              <li
                key={i}
                className={cn(
                  "rounded-xl border px-3 py-2.5 transition duration-200 sm:px-4 sm:py-3",
                  c
                    ? "border-white/12 bg-black/30 hover:border-amber-500/30 hover:bg-amber-950/20"
                    : "border-white/10 bg-black/25"
                )}
              >
                {m}
              </li>
            ))}
          </ul>
        </section>

        <section className={cn("border-b py-8 sm:py-11", pal.sectionBorder)}>
          {c ? (
            <SectionTitle palette={pal} icon={<Library className="size-3.5 opacity-90" aria-hidden />}>
              {CAN101_STREAM_SECTION.refs}
            </SectionTitle>
          ) : (
            <h2 className={pal.sectionTitle}>Referências</h2>
          )}
          <ul className="space-y-2.5 text-[14px] sm:text-[15px] text-white/[0.9] list-none">
            {content.references.map((r, i) => (
              <li
                key={i}
                className={cn(
                  "rounded-lg py-1 pl-3 transition duration-150 hover:bg-white/5",
                  pal.refBorder
                )}
              >
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className={cn("border-b py-8 sm:py-11", pal.sectionBorder)}>
          {c ? (
            <SectionTitle palette={pal} icon={<GraduationCap className="size-3.5 opacity-90" aria-hidden />}>
              {CAN101_STREAM_SECTION.prof}
            </SectionTitle>
          ) : (
            <h2 className={pal.sectionTitle}>Notas do professor</h2>
          )}
          <div
            className={cn(
              "rounded-xl px-4 py-3.5 text-[14px] leading-relaxed text-white/[0.88] sm:px-5 sm:py-4",
              pal.profBox
            )}
          >
            {content.professorNotes}
          </div>
        </section>

        <section className="pt-8 sm:pt-11">
          {c ? (
            <SectionTitle palette={pal} icon={<StickyNote className="size-3.5 opacity-90" aria-hidden />}>
              {CAN101_STREAM_SECTION.notes}
            </SectionTitle>
          ) : (
            <h2 className={pal.sectionTitle}>Suas notas</h2>
          )}
          <p className="mb-2 text-xs text-white/45">
            {c
              ? "Fica guardado no seu aparelho — tipo caderninho de gameplay, só que do cultivo."
              : "Guardadas neste dispositivo — para revisão rápida."}
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            className={cn(
              "w-full rounded-xl border border-white/12 bg-black/40 px-3 py-3 text-[14px] text-white placeholder:text-white/30 transition focus:outline-none focus:ring-2 sm:px-4 sm:py-3.5",
              pal.textareaFocus
            )}
            placeholder="Anotações, dúvidas, próximos passos…"
          />
        </section>
      </motion.article>
    );
  }

  return (
    <div className={cn("rounded-2xl border shadow-inner overflow-hidden", wrap)}>
      <div
        className={cn(
          "flex flex-wrap gap-1 p-2 sm:p-2.5 border-b bg-black/25",
          tabBar,
          c && "glass-hud rounded-none border-amber-500/15"
        )}
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-all duration-200 motion-reduce:transition-none hover:scale-[1.02] active:scale-[0.98]",
                active ? activeTab : idleTab
              )}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[240px] p-4 sm:min-h-[280px] sm:p-5">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3 text-white/85"
        >
          {tab === "conteudo" && (
            <div className="space-y-4 text-sm leading-relaxed">
              {!skipIntroSection ? (
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    {c ? CAN101_STREAM_SECTION.intro : "Introdução"}
                  </p>
                  <p className="text-white/90">{content.intro}</p>
                </div>
              ) : null}
              {bodyParagraphs.length ? (
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    {c ? CAN101_STREAM_SECTION.body : "Desenvolvimento"}
                  </p>
                  <div className="space-y-3">
                    {bodyParagraphs.map((p, i) => (
                      <p key={i} className="text-white/88">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-canna-300/90">
                  {c ? CAN101_STREAM_SECTION.summary : "Resumo final"}
                </p>
                <p className="text-white/80">{content.summary}</p>
              </div>
              {content.quiz?.length ? (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    {c ? CAN101_STREAM_SECTION.quiz : "Quiz rápido"}
                  </p>
                  <StreamQuizBlock
                    items={content.quiz}
                    cinematicHints={c}
                    quizContext={lessonQuizContext}
                  />
                </div>
              ) : null}
              {content.media ? (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Recursos sugeridos
                  </p>
                  <MediaHintRow media={content.media} pal={STREAM_PALETTE.canna} />
                </div>
              ) : null}
            </div>
          )}
          {tab === "objetivos" && (
            <ul className="space-y-2 text-sm">
              {content.objectives.map((o, i) => (
                <li key={i} className="flex gap-2 rounded-lg border border-canna-400/15 bg-canna-500/5 px-3 py-2">
                  <span className="font-bold text-canna-300">{i + 1}.</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === "materiais" && (
            <ul className="space-y-2 text-sm list-none">
              {content.materials.map((m, i) => (
                <li key={i} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                  {m}
                </li>
              ))}
            </ul>
          )}
          {tab === "refs" && (
            <ul className="space-y-2 text-sm list-none">
              {content.references.map((r, i) => (
                <li key={i} className="rounded-lg border border-white/10 px-3 py-2 text-canna-100/90">
                  {r}
                </li>
              ))}
            </ul>
          )}
          {tab === "prof" && (
            <div className="rounded-xl border border-amber-400/20 bg-amber-950/20 p-4 text-sm leading-relaxed text-white/85">
              {content.professorNotes}
            </div>
          )}
          {tab === "notas" && (
            <div className="space-y-2">
              <p className="text-xs text-white/50">
                Guardadas neste dispositivo. Use para anotar insights da aula.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-canna-500/40"
                placeholder="Suas anotações, dúvidas para o fórum…"
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
