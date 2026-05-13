"use client";

import type { Components } from "react-markdown";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { cn } from "@/lib/utils";

/** Entidades que às vezes vêm copiadas de HTML e aparecem como texto cru. */
const NBSP_ENTITY = /&nbsp;|&#160;|&#xa0;/gi;

/**
 * Garante que cabeçalhos e listas GFM sejam reconhecidos: precisam de linha em branco
 * antes do bloco quando o texto anterior não é vazio (caso típico do `introduction` em
 * `lessonBodies` com uma quebra `\n` só).
 */
export function normalizeLessonMarkdown(raw: string): string {
  let s = raw.replace(NBSP_ENTITY, " ").replace(/\u00a0/g, " ");
  const lines = s.split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const prev = out[out.length - 1];
    const isHeading = /^\s{0,3}#{1,6}\s/.test(line);
    const isBullet = /^\s{0,3}[*+-]\s/.test(line);
    const isHr = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(line);
    const prevTrim = prev !== undefined ? prev.trim() : "";
    const prevIsBullet = prev !== undefined && /^\s{0,3}[*+-]\s/.test(prev);
    if ((isHeading || isHr || (isBullet && !prevIsBullet)) && prevTrim !== "") {
      out.push("");
    }
    out.push(line);
  }
  return out.join("\n").trim();
}

/** Bloqueia esquemas perigosos; devolve URL utilizável ou null. */
function safeMarkdownHref(href: unknown): string | null {
  if (typeof href !== "string") return null;
  const h = href.trim();
  if (!h) return null;
  const lower = h.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return null;
  }
  return h;
}

const linkClass =
  "font-medium text-canna-200/95 underline underline-offset-[3px] decoration-white/40 transition-colors hover:text-white hover:decoration-white/70";

type Props = {
  markdown: string;
  className?: string;
};

/**
 * Markdown para slides da sala (fundo escuro) — alinhado ao tom de `ClassroomLessonView`.
 * Inclui GFM (tabelas, etc.) e `remark-breaks` para quebras com uma só `\n`.
 */
export function LessonSlideMarkdown({ markdown, className }: Props) {
  const md = normalizeLessonMarkdown(markdown);

  const components: Components = {
    a: ({ href, children }) => {
      const safe = safeMarkdownHref(href);
      if (!safe) {
        return (
          <span className={cn(linkClass, "cursor-not-allowed opacity-60")} title="Link inválido">
            {children}
          </span>
        );
      }
      const external =
        safe.startsWith("http://") || safe.startsWith("https://") || safe.startsWith("//");
      const specialScheme =
        safe.toLowerCase().startsWith("mailto:") || safe.toLowerCase().startsWith("tel:");
      if (specialScheme) {
        return (
          <a href={safe} className={linkClass}>
            {children}
          </a>
        );
      }
      if (external) {
        const url = safe.startsWith("//") ? `https:${safe}` : safe;
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {children}
          </a>
        );
      }
      return (
        <Link href={safe} className={linkClass}>
          {children}
        </Link>
      );
    },
    h1: ({ children }) => (
      <h1 className="mt-4 mb-2 text-lg font-bold tracking-tight text-white/95 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-5 mb-2 border-b border-white/10 pb-1.5 text-base font-semibold text-teal-100/95 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 mb-1.5 text-[15px] font-semibold text-white/92">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-3 mb-1 text-sm font-semibold uppercase tracking-wide text-white/80">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="my-2.5 text-[15px] leading-[1.78] text-white/[0.9] first:mt-0 last:mb-0 sm:text-[16px] sm:leading-[1.76]">
        {children}
      </p>
    ),
    ul: ({ children }) => <ul className="my-2.5 list-disc space-y-1.5 pl-5 text-white/84">{children}</ul>,
    ol: ({ children }) => (
      <ol className="my-2.5 list-decimal space-y-1.5 pl-5 text-white/84">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-3 border-l-2 border-white/25 pl-3 text-[14px] italic leading-relaxed text-white/78">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-5 border-0 border-t border-white/15" />,
    br: () => <br />,
    strong: ({ children }) => <strong className="font-semibold text-white/95">{children}</strong>,
    code: ({ className: codeClass, children }) => {
      const isBlock = /language-/.test(String(codeClass ?? ""));
      if (isBlock) {
        return (
          <code
            className={cn("font-mono text-[13px] leading-relaxed text-emerald-100/92", codeClass)}
          >
            {children}
          </code>
        );
      }
      return (
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-amber-100/90">
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-black/35 p-3">{children}</pre>
    ),
    table: ({ children }) => (
      <div className="my-4 overflow-x-auto rounded-lg border border-white/12 bg-white/[0.03]">
        <table className="w-full min-w-[280px] border-collapse text-left text-[13px] text-white/82">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-white/[0.06] text-white/88">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-white/10">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-3 py-2 font-semibold text-white/90 first:pl-4 last:pr-4">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 align-top first:pl-4 last:pr-4 [&_p]:my-1">{children}</td>
    )
  };

  return (
    <div
      className={cn(
        "lesson-slide-md selection:bg-emerald-500/25 selection:text-white [word-break:break-word]",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {md}
      </ReactMarkdown>
    </div>
  );
}
