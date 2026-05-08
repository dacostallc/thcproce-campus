"use client";

import Link from "next/link";
import { GraduationCap, Leaf, MessageCircle, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

import type { AreaColor } from "@/data/courses";

const FOOT: Record<
  AreaColor,
  {
    bar: string;
    leaf: string;
    leafBox: string;
    sub: string;
    linkHover: string;
  }
> = {
  amber: {
    bar: "border-amber-500/20",
    leaf: "text-amber-400",
    leafBox: "border-amber-500/30",
    sub: "text-amber-200/75",
    linkHover: "hover:text-amber-200"
  },
  canna: {
    bar: "border-canna-500/20",
    leaf: "text-canna-400",
    leafBox: "border-canna-500/30",
    sub: "text-canna-200/75",
    linkHover: "hover:text-canna-200"
  },
  purple: {
    bar: "border-purple-500/20",
    leaf: "text-purple-400",
    leafBox: "border-purple-500/30",
    sub: "text-purple-200/75",
    linkHover: "hover:text-purple-200"
  },
  cyan: {
    bar: "border-cyan-500/20",
    leaf: "text-cyan-400",
    leafBox: "border-cyan-500/30",
    sub: "text-cyan-200/75",
    linkHover: "hover:text-cyan-200"
  },
  rose: {
    bar: "border-rose-500/20",
    leaf: "text-rose-400",
    leafBox: "border-rose-500/30",
    sub: "text-rose-200/75",
    linkHover: "hover:text-rose-200"
  }
};

type Props = {
  accent?: AreaColor;
  userName?: string | null;
  levelLabel?: string | null;
  className?: string;
};

/** Barra inferior da sala — padrão campus (todas as áreas). */
export function Cannabis101LessonFooter({
  accent = "amber",
  userName,
  levelLabel,
  className
}: Props) {
  const F = FOOT[accent];
  const display = userName?.trim() || "Visitante";
  const level = levelLabel?.trim() || "—";

  return (
    <footer
      className={cn(
        "mt-auto flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5",
        "border-t bg-black/40",
        F.bar,
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-[#0c1812]",
            F.leafBox
          )}
        >
          <Leaf className={cn("size-4", F.leaf)} aria-hidden />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-xs font-bold text-white">Campus THCProce</p>
          <p className={cn("truncate text-[10px]", F.sub)}>
            Pré-lançamento fundador · Acesso internacional
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-1 sm:flex">
        <Link
          href="/"
          className={cn(
            "rounded-lg p-2 text-white/50 transition hover:bg-white/5",
            F.linkHover
          )}
          aria-label="Campus"
        >
          <MessageCircle className="size-4" />
        </Link>
        <a
          href="mailto:procbd@icloud.com"
          className={cn(
            "rounded-lg p-2 text-white/50 transition hover:bg-white/5",
            F.linkHover
          )}
          aria-label="Suporte por e-mail"
        >
          <Headphones className="size-4" />
        </a>
        <Link
          href="/planos"
          className={cn(
            "rounded-lg p-2 text-white/50 transition hover:bg-white/5",
            F.linkHover
          )}
          aria-label="Planos e certificação"
        >
          <GraduationCap className="size-4" />
        </Link>
      </div>

      <div className="text-right leading-tight">
        <p className="truncate text-xs font-semibold text-white">{display}</p>
        <p className={cn("text-[10px]", F.sub)}>Nível · {level}</p>
      </div>
    </footer>
  );
}
