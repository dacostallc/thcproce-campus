"use client";

import type { Components } from "react-markdown";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { cn } from "@/lib/utils";
import { normalizeLessonMarkdown } from "@/components/campus/LessonSlideMarkdown";
import "@/styles/lesson-static-content.css";

function safeMarkdownHref(href: unknown): string | null {
  if (typeof href !== "string") return null;
  const h = href.trim();
  if (!h) return null;
  const lower = h.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    return null;
  }
  return h;
}

const linkClass =
  "font-medium text-[#0b7a56] underline underline-offset-[3px] decoration-[#0b7a56]/35 transition-colors hover:text-[#065d42] hover:decoration-[#065d42]/55";

export interface ParagraphTimestamp {
  text: string;
  startTime: number;
}

type Props = {
  markdown: string;
  className?: string;
  /** Timestamps de parágrafo para click-to-seek e highlighting. */
  paragraphTimestamps?: ParagraphTimestamp[] | null;
  /** Chamado quando o utilizador clica num parágrafo com timestamp. */
  onParagraphClick?: (startTime: number) => void;
  /** Posição atual do áudio em segundos — usado para highlighting sincronizado. */
  audioCurrentTime?: number;
};

/**
 * Markdown para leitura em camada estática (sem HUD/XP no corpo).
 * GFM, links seguros, imagens responsivas.
 * Suporta parágrafos clicáveis com seek de áudio via `paragraphTimestamps`.
 */
export function LessonStaticMarkdown({
  markdown,
  className,
  paragraphTimestamps,
  onParagraphClick,
  audioCurrentTime,
}: Props) {
  const md = normalizeLessonMarkdown(markdown);

  const hasTimestamps = Boolean(paragraphTimestamps?.length);

  /** Encontra o timestamp mais próximo para um texto de parágrafo. */
  function findTimestamp(text: string): number | null {
    if (!paragraphTimestamps?.length) return null;
    const plain = text.trim().slice(0, 80).toLowerCase();
    for (const pt of paragraphTimestamps) {
      if (pt.text.toLowerCase().startsWith(plain.slice(0, 40)) ||
          plain.startsWith(pt.text.toLowerCase().slice(0, 40))) {
        return pt.startTime;
      }
    }
    return null;
  }

  /**
   * Determina se um parágrafo está activo dado o currentTime do áudio.
   * Usa o próximo timestamp como endTime implícito — o parágrafo acende
   * quando currentTime >= startTime e apaga quando currentTime >= próximo startTime.
   */
  function isActiveParagraph(startTime: number): boolean {
    if (audioCurrentTime === undefined || !paragraphTimestamps?.length) return false;
    if (startTime > audioCurrentTime) return false;

    const sorted = [...paragraphTimestamps].sort((a, b) => a.startTime - b.startTime);
    const idx = sorted.findIndex((pt) => pt.startTime === startTime);
    const endTime = sorted[idx + 1]?.startTime ?? Infinity;

    return audioCurrentTime >= startTime && audioCurrentTime < endTime;
  }

  const components: Components = {
    a: ({ href, children }) => {
      const safe = safeMarkdownHref(href);
      if (!safe) {
        return (
          <span className={cn(linkClass, "cursor-not-allowed opacity-55")} title="Link inválido">
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
    p: ({ children }) => {
      if (!hasTimestamps) return <p>{children}</p>;

      const raw = typeof children === "string"
        ? children
        : Array.isArray(children)
          ? children.map((c) => (typeof c === "string" ? c : "")).join("")
          : "";

      const ts = findTimestamp(raw);
      if (ts === null) return <p>{children}</p>;

      const active = isActiveParagraph(ts);
      const clickable = Boolean(onParagraphClick);

      return (
        <p
          onClick={clickable ? () => onParagraphClick?.(ts) : undefined}
          title={clickable ? `Ouvir este trecho (${ts.toFixed(1)}s)` : undefined}
          className={cn(
            "rounded p-1 transition-all duration-300",
            active
              ? "scale-[1.01] bg-emerald-950/40 font-medium text-emerald-400"
              : "text-neutral-300",
            clickable && "cursor-pointer",
            clickable && !active && "hover:bg-emerald-950/20 hover:text-emerald-300/70",
          )}
        >
          {children}
        </p>
      );
    },
    img: ({ src, alt }) => {
      if (typeof src !== "string" || !src.trim()) {
        return <span className="text-sm text-[#163529]/60">[imagem indisponível]</span>;
      }
      const s = src.trim();
      const url = s.startsWith("//") ? `https:${s}` : s;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={typeof alt === "string" ? alt : ""}
          loading="lazy"
          decoding="async"
        />
      );
    },
  };

  return (
    <div className={cn("lesson-static-content selection:bg-emerald-300/35", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {md}
      </ReactMarkdown>
    </div>
  );
}
