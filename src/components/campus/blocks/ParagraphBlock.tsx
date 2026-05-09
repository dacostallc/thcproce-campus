"use client";

import { paragraphBlockDataSchema } from "@/lib/blocks/schemas";

export function ParagraphBlock({ data }: { data: unknown }) {
  const parsed = paragraphBlockDataSchema.safeParse(data);
  if (!parsed.success) return null;
  return (
    <p className="text-[15px] leading-relaxed text-white/[0.88] whitespace-pre-wrap">
      {parsed.data.text}
    </p>
  );
}
