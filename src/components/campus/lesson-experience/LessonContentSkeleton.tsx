"use client";

import { cn } from "@/lib/utils";

/**
 * Esboço animado da área de conteúdo da aula.
 * Substitui as linhas de texto "A sincronizar…" / "Preparando leitura…"
 * enquanto o fetch do DB ou do Markdown ainda não completou.
 *
 * Uso:
 *   - `variant="content"` (padrão) — área de leitura com parágrafos.
 *   - `variant="cinema"` — layout Cannabis 101: barra de título + leitura + footer nav.
 */

type Props = {
  variant?: "content" | "cinema";
  className?: string;
};

/** Linha de texto simulada com largura percentual variável. */
function SkLine({ w, className }: { w: string; className?: string }) {
  return (
    <div
      className={cn("h-3 rounded-md bg-white/[0.07]", className)}
      style={{ width: w }}
    />
  );
}

/** Bloco de parágrafo com N linhas de largura aleatória mas determinística. */
function SkParagraph({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-2.5">
      {lines.map((w, i) => (
        <SkLine key={i} w={w} />
      ))}
    </div>
  );
}

export function LessonContentSkeleton({ variant = "content", className }: Props) {
  if (variant === "cinema") {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 animate-pulse flex-col overflow-hidden rounded-xl",
          className,
        )}
        aria-busy="true"
        aria-label="Carregando conteúdo da aula…"
        role="status"
      >
        {/* Barra de título (simula o frame de janela do curso) */}
        <div className="shrink-0 border-b border-white/[0.06] bg-[#050505]/95 px-4 py-3">
          <div className="flex items-center gap-3">
            <SkLine w="12%" className="h-4" />
            <SkLine w="38%" className="h-4" />
          </div>
        </div>

        {/* Área de leitura */}
        <div className="min-h-0 flex-1 overflow-hidden px-6 py-6 sm:px-10 sm:py-8">
          {/* Título da aula */}
          <SkLine w="55%" className="mb-6 h-5" />

          {/* Parágrafo introdutório */}
          <SkParagraph lines={["92%", "88%", "75%", "83%", "60%"]} />

          <div className="my-5 h-px bg-white/[0.05]" />

          {/* Segundo parágrafo */}
          <SkParagraph lines={["87%", "94%", "70%", "82%"]} />

          <div className="my-5 h-px bg-white/[0.05]" />

          {/* Terceiro parágrafo (mais curto — fim de seção) */}
          <SkParagraph lines={["78%", "91%", "45%"]} />
        </div>

        {/* Footer de navegação */}
        <div className="shrink-0 border-t border-white/[0.06] bg-[#060908] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="h-8 w-28 rounded-lg bg-white/[0.06]" />
            <div className="h-8 w-20 rounded-lg bg-white/[0.06]" />
            <div className="h-8 w-28 rounded-lg bg-white/[0.06]" />
          </div>
        </div>
      </div>
    );
  }

  /* variant === "content" — layout genérico de leitura */
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 animate-pulse flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08120e]/90 p-4 sm:p-6",
        className,
      )}
      aria-busy="true"
      aria-label="Carregando conteúdo da aula…"
      role="status"
    >
      {/* Título */}
      <SkLine w="50%" className="mb-5 h-5" />

      {/* Parágrafo 1 */}
      <SkParagraph lines={["95%", "88%", "72%", "84%", "58%"]} />

      <div className="my-4 h-px bg-white/[0.05]" />

      {/* Parágrafo 2 */}
      <SkParagraph lines={["89%", "93%", "68%", "81%"]} />

      <div className="my-4 h-px bg-white/[0.05]" />

      {/* Parágrafo 3 */}
      <SkParagraph lines={["76%", "90%", "43%"]} />

      {/* Footer fake */}
      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="h-8 w-24 rounded-lg bg-white/[0.05]" />
          <div className="h-8 w-16 rounded-lg bg-white/[0.05]" />
          <div className="h-8 w-24 rounded-lg bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}
