"use client";

import type { Components } from "react-markdown";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Props = {
  markdown: string;
  sky: "day" | "night";
};

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

export function CampusMapPointMarkdown({ markdown, sky }: Props) {
  const isDay = sky === "day";

  const linkClass = cn(
    "font-medium underline underline-offset-[3px] decoration-white/35 transition-colors hover:decoration-white/65",
    isDay ? "text-emerald-900/95 hover:text-emerald-950" : "text-canna-200/95 hover:text-white"
  );

  const components: Components = {
    a: ({ href, children }) => {
      const safe = safeMarkdownHref(href);
      if (!safe) {
        return (
          <span className={cn(linkClass, "cursor-not-allowed opacity-70")} title="Link inválido">
            {children}
          </span>
        );
      }
      const external =
        safe.startsWith("http://") ||
        safe.startsWith("https://") ||
        safe.startsWith("//");
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
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
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
    blockquote: ({ children }) => (
      <blockquote
        className={cn(
          "my-3 border-l-2 pl-3 italic text-[13px] leading-relaxed",
          isDay ? "border-emerald-700/35 text-slate-800/85" : "border-white/20 text-white/78"
        )}
      >
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul className={cn("my-2 list-disc space-y-1.5 pl-5", isDay ? "text-slate-800/90" : "text-white/84")}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className={cn("my-2 list-decimal space-y-1.5 pl-5", isDay ? "text-slate-800/90" : "text-white/84")}>
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-snug">{children}</li>,
    h2: ({ children }) => (
      <h2
        className={cn(
          "mt-5 mb-2 text-[13px] font-bold uppercase tracking-[0.16em]",
          isDay ? "text-slate-900/92" : "text-teal-200/88"
        )}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className={cn("mt-4 mb-1.5 text-sm font-semibold", isDay ? "text-slate-900/90" : "text-white/92")}>
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className={cn("leading-relaxed", isDay ? "text-[14px] text-slate-800/88" : "text-[14px] text-white/82")}>
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong className={cn("font-semibold", isDay ? "text-slate-950" : "text-white/95")}>{children}</strong>
    ),
    hr: () => <hr className={cn("my-4 border-0 border-t", isDay ? "border-slate-400/25" : "border-white/12")} />
  };

  return (
    <div
      className={cn(
        "campus-map-point-md space-y-2",
        isDay ? "[&_.campus-map-point-md-inner]:text-slate-900" : "[&_.campus-map-point-md-inner]:text-white"
      )}
    >
      <div className="campus-map-point-md-inner">
        <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
