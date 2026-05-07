"use client";

import Link from "next/link";
import { GraduationCap, Leaf, MessageCircle, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  userName?: string | null;
  levelLabel?: string | null;
  className?: string;
};

/** Barra inferior estilo mockup — só Cannabis 101 */
export function Cannabis101LessonFooter({ userName, levelLabel, className }: Props) {
  const display = userName?.trim() || "Visitante";
  const level = levelLabel?.trim() || "—";

  return (
    <footer
      className={cn(
        "mt-auto flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-amber-500/20 bg-black/40 px-4 py-3 sm:px-5",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-[#0c1812]">
          <Leaf className="size-4 text-amber-400" aria-hidden />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-xs font-bold text-white">Campus THCProce</p>
          <p className="truncate text-[10px] text-amber-200/75">
            Pré-lançamento fundador · Acesso internacional
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-1 sm:flex">
        <Link
          href="https://thcproce.com.br/escola"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-amber-200"
          aria-label="Comunidade"
        >
          <MessageCircle className="size-4" />
        </Link>
        <Link
          href="https://thcproce.com.br/escola"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-amber-200"
          aria-label="Suporte"
        >
          <Headphones className="size-4" />
        </Link>
        <Link
          href="https://thcproce.com.br/escola"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-amber-200"
          aria-label="Certificados"
        >
          <GraduationCap className="size-4" />
        </Link>
      </div>

      <div className="text-right leading-tight">
        <p className="truncate text-xs font-semibold text-white">{display}</p>
        <p className="text-[10px] text-amber-200/80">Nível · {level}</p>
      </div>
    </footer>
  );
}
