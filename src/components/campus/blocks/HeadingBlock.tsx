"use client";

import { headingBlockDataSchema } from "@/lib/blocks/schemas";

export function HeadingBlock({ data }: { data: unknown }) {
  const parsed = headingBlockDataSchema.safeParse(data);
  if (!parsed.success) return null;
  const level = parsed.data.level ?? 2;
  const n = Math.min(6, Math.max(1, level));
  const className =
    n === 1
      ? "text-2xl font-bold tracking-tight text-white sm:text-3xl"
      : n === 2
        ? "text-xl font-semibold tracking-tight text-white sm:text-2xl"
        : "text-lg font-semibold text-white/95";
  if (n === 1) return <h1 className={className}>{parsed.data.text}</h1>;
  if (n === 2) return <h2 className={className}>{parsed.data.text}</h2>;
  if (n === 3) return <h3 className={className}>{parsed.data.text}</h3>;
  if (n === 4) return <h4 className={className}>{parsed.data.text}</h4>;
  if (n === 5) return <h5 className={className}>{parsed.data.text}</h5>;
  return <h6 className={className}>{parsed.data.text}</h6>;
}
