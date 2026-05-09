"use client";

import { imageBlockDataSchema } from "@/lib/blocks/schemas";

export function ImageBlock({ data }: { data: unknown }) {
  const parsed = imageBlockDataSchema.safeParse(data);
  if (!parsed.success) return null;
  return (
    <figure className="space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={parsed.data.url}
        alt={parsed.data.alt ?? ""}
        className="max-h-[min(70vh,520px)] w-auto max-w-full rounded-xl border border-white/10 object-contain"
        loading="lazy"
      />
      {parsed.data.alt ? (
        <figcaption className="text-center text-xs text-white/45">{parsed.data.alt}</figcaption>
      ) : null}
    </figure>
  );
}
