"use client";

import { calloutBlockDataSchema } from "@/lib/blocks/schemas";
import { cn } from "@/lib/utils";

export function CalloutBlock({ data }: { data: unknown }) {
  const parsed = calloutBlockDataSchema.safeParse(data);
  if (!parsed.success) return null;
  const variant = parsed.data.variant ?? "info";
  return (
    <aside
      className={cn(
        "rounded-xl border px-4 py-3 text-[14px] leading-relaxed",
        variant === "warning" && "border-amber-500/35 bg-amber-950/25 text-amber-50/95",
        variant === "neutral" && "border-white/15 bg-white/5 text-white/85",
        variant === "info" && "border-canna-400/30 bg-canna-950/20 text-canna-50/95",
      )}
    >
      {parsed.data.text}
    </aside>
  );
}
