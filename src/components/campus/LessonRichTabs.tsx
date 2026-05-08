"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Library,
  StickyNote,
  Target,
  Video,
  Image as ImageIcon,
  LayoutGrid,
  FileStack
} from "lucide-react";
import type { LessonRichContent } from "@/data/lessonRichTypes";
import type { LessonQuizItem } from "@/data/lessonRichTypes";
import type { LessonMediaHints } from "@/data/lessonRichTypes";
import type { AreaColor } from "@/data/courses";
import { cn } from "@/lib/utils";

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
    articleBorder: "border-amber-500/15",
    sectionBorder: "border-amber-500/10",
    sectionTitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200/55 mb-3",
    summaryKicker: "text-[10px] font-bold uppercase tracking-widest text-amber-200/70",
    badgeNum: "bg-amber-500/15 text-[11px] font-bold text-amber-200",
    refBorder: "border-l-2 border-amber-500/25",
    profBox: "border border-amber-500/15 bg-amber-950/10",
    textareaFocus: "focus:ring-amber-500/35"
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

type Props = {
  storageKey: string;
  content: LessonRichContent;
  variant?: "default" | "cannabis101" | "campus";
  layout?: "tabs" | "stream";
  streamAccent?: AreaColor;
};

function splitBody(body?: string): string[] {
  if (!body?.trim()) return [];
  return body
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const CAN101_STREAM_SECTION = {
  intro: "Abertura",
  body: "Trilho principal",
  objectives: "O que você leva daqui",
  summary: "Síntese",
  quiz: "Check rápido",
  media: "Produção e visuais",
  materials: "Materiais",
  refs: "Referências",
  prof: "Notas para facilitador(a)",
  notes: "Suas notas"
} as const;

type StreamQuizQuestionProps = {
  q: LessonQuizItem;
  index: number;
  /** Cannabis 101: feedback textual mais “premium” e menos jargon de sala de aula. */
  cinematicHints?: boolean;
};

function StreamQuizBlock({
  items,
  cinematicHints
}: {
  items: LessonQuizItem[];
  cinematicHints?: boolean;
}) {
  return (
    <div className="space-y-5">
      {items.map((q, qi) => (
        <StreamQuizQuestion key={qi} q={q} index={qi} cinematicHints={cinematicHints} />
      ))}
    </div>
  );
}

function StreamQuizQuestion({
  q,
  index,
  cinematicHints
}: StreamQuizQuestionProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null;
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 px-4 py-3">
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
              onClick={() => setPicked(oi)}
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
        <p className="mt-2 text-xs text-white/50">
          {picked === q.correctIndex
            ? cinematicHints
              ? "Certo — conecte aos argumentos mestre destacados mais acima nesta sala."
              : "Correto — conecte à evidência citada no texto principal da aula."
            : cinematicHints
              ? "Volte aos objetivos e à abertura: a opção assinalada segue o roteiro desta edição THCProce."
              : "Revise o corpo da aula e os objetivos; a resposta indicada reflete o texto-base desta edição."}
        </p>
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
        Nenhum recurso audiovisual obrigatório indicado — texto-base autossuficiente para estudo inicial.
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
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/80",
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
  streamAccent = "canna"
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

  const bodyProse = "text-[15px] leading-[1.65] text-white/[0.88]";
  const bodyParagraphs = splitBody(content.body);

  if (stream) {
    return (
      <article
        className={cn(
          "mx-auto w-full max-w-[70ch] rounded-xl border px-4 py-5 sm:px-6 sm:py-6",
          pal.articleBorder,
          "bg-[#030806]/60"
        )}
      >
        <section className={cn("border-b pb-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>{c ? CAN101_STREAM_SECTION.intro : "Introdução"}</h2>
          <div className={cn("space-y-4", bodyProse)}>
            <p>{content.intro}</p>
          </div>
        </section>

        <section className={cn("border-b py-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>{c ? CAN101_STREAM_SECTION.body : "Desenvolvimento"}</h2>
          <div className={cn("space-y-4", bodyProse)}>
            {bodyParagraphs.length ? (
              bodyParagraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="text-white/50">
                {c
                  ? "O roteiro detalhado deste episódio aparece aqui assim que estiver sincronizado pela equipa THCProce — até lá, avance pela abertura, pelos objetivos e pelas ligações em «Materiais»."
                  : "Conteúdo principal será exibido aqui quando o campo textual da aula estiver preenchido."}
              </p>
            )}
          </div>
        </section>

        <section className={cn("border-b py-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>{c ? CAN101_STREAM_SECTION.objectives : "Objetivos da aula"}</h2>
          <ul className="space-y-2.5 text-[14px] leading-snug text-white/85">
            {content.objectives.map((o, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md",
                    pal.badgeNum
                  )}
                >
                  {i + 1}
                </span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={cn("border-b py-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>{c ? CAN101_STREAM_SECTION.summary : "Resumo final"}</h2>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-[14px] leading-relaxed text-white/85">{content.summary}</p>
          </div>
        </section>

        {content.quiz?.length ? (
          <section className={cn("border-b py-8", pal.sectionBorder)}>
            <h2 className={pal.sectionTitle}>{c ? CAN101_STREAM_SECTION.quiz : "Quiz rápido"}</h2>
            <StreamQuizBlock items={content.quiz} cinematicHints={c} />
          </section>
        ) : null}

        {content.media ? (
          <section className={cn("border-b py-8", pal.sectionBorder)}>
            <h2 className={pal.sectionTitle}>{c ? CAN101_STREAM_SECTION.media : "Recursos sugeridos (produção)"}</h2>
            <p className={cn("mb-3 text-[12px] leading-relaxed text-white/50")}>
              {c
                ? "Indicação editorial para equipe de mídia THCProce: o que complementar em versões futuras desta aula."
                : "Indicações editoriais para enriquecer versões futuras desta aula com visuais e demonstrações."}
            </p>
            <MediaHintRow media={content.media} pal={pal} />
          </section>
        ) : null}

        <section className={cn("border-b py-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>{c ? CAN101_STREAM_SECTION.materials : "Materiais de apoio"}</h2>
          <ul className="space-y-2 text-[14px] text-white/85 list-none">
            {content.materials.map((m, i) => (
              <li key={i} className="rounded-md border border-white/10 bg-black/25 px-3 py-2">
                {m}
              </li>
            ))}
          </ul>
        </section>

        <section className={cn("border-b py-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>{c ? CAN101_STREAM_SECTION.refs : "Referências"}</h2>
          <ul className="space-y-2 text-[14px] text-white/90 list-none">
            {content.references.map((r, i) => (
              <li key={i} className={cn("pl-3", pal.refBorder)}>
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className={cn("border-b py-8", pal.sectionBorder)}>
          <h2 className={pal.sectionTitle}>{c ? CAN101_STREAM_SECTION.prof : "Notas do professor"}</h2>
          <div
            className={cn(
              "rounded-lg px-4 py-3 text-[14px] leading-relaxed text-white/85",
              pal.profBox
            )}
          >
            {content.professorNotes}
          </div>
        </section>

        <section className="pt-8">
          <h2 className={pal.sectionTitle}>{c ? CAN101_STREAM_SECTION.notes : "Suas notas"}</h2>
          <p className="mb-2 text-xs text-white/45">Guardadas neste dispositivo — para revisão rápida.</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            className={cn(
              "w-full rounded-lg border border-white/12 bg-black/35 px-3 py-2.5 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2",
              pal.textareaFocus
            )}
            placeholder="Anotações, dúvidas, próximos passos…"
          />
        </section>
      </article>
    );
  }

  return (
    <div className={cn("rounded-2xl border shadow-inner", wrap)}>
      <div className={cn("flex flex-wrap gap-1 border-b p-2", tabBar)}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors",
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
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {c ? CAN101_STREAM_SECTION.intro : "Introdução"}
                </p>
                <p className="text-white/90">{content.intro}</p>
              </div>
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
                  <StreamQuizBlock items={content.quiz} cinematicHints={c} />
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
