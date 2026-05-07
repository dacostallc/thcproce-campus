"use client";

import dynamic from "next/dynamic";

const MuxLessonPlayer = dynamic(
  () => import("./MuxLessonPlayer").then((m) => m.MuxLessonPlayer),
  { ssr: false }
);

const BunnyLessonPlayer = dynamic(
  () => import("./BunnyLessonPlayer").then((m) => m.BunnyLessonPlayer),
  { ssr: false }
);

export function LessonPageClient({
  provider,
  id,
  courseSlug
}: {
  provider: "mux" | "bunny";
  id: string;
  courseSlug: string | null;
}) {
  return provider === "bunny" ? (
    <BunnyLessonPlayer videoId={id} courseSlug={courseSlug} />
  ) : (
    <MuxLessonPlayer playbackId={id} courseSlug={courseSlug} />
  );
}
