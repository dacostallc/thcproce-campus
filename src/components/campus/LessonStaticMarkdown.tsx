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

type Props = {
  markdown: string;
  className?: string;
};

/**
 * Markdown para leitura em camada estática (sem HUD/XP no corpo).
 * GFM, links seguros, imagens responsivas.
 */
export function LessonStaticMarkdown({ markdown, className }: Props) {
  const md = normalizeLessonMarkdown(markdown);

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
