"use client";

import dynamic from "next/dynamic";

import { videoEmbedBlockDataSchema } from "@/lib/blocks/schemas";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export function VideoEmbedBlock({ data }: { data: unknown }) {
  const parsed = videoEmbedBlockDataSchema.safeParse(data);
  if (!parsed.success) return null;

  let url: string;
  if ("url" in parsed.data) {
    url = parsed.data.url;
  } else {
    const { provider, id } = parsed.data;
    const p = provider.toLowerCase();
    if (p.includes("youtube") || p === "yt") {
      url = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
    } else if (p.includes("vimeo")) {
      url = `https://vimeo.com/${encodeURIComponent(id)}`;
    } else {
      return (
        <p className="text-sm text-white/55">
          Reprodutor não disponível para o fornecedor &quot;{provider}&quot;. Use uma URL completa em{" "}
          <code className="rounded bg-black/40 px-1">url</code>.
        </p>
      );
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
      <div className="relative aspect-video w-full">
        <ReactPlayer url={url} width="100%" height="100%" controls className="absolute inset-0" />
      </div>
    </div>
  );
}
