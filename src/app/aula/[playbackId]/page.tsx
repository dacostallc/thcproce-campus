import { LessonPageClient } from "@/components/video/LessonPageClient";

type Props = {
  params: { playbackId: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default function LessonPage({ params, searchParams }: Props) {
  const id = decodeURIComponent(params.playbackId);
  const course =
    typeof searchParams.course === "string" ? searchParams.course : null;
  const p =
    typeof searchParams.provider === "string"
      ? searchParams.provider.toLowerCase().trim()
      : "mux";
  const provider: "mux" | "bunny" = p === "bunny" ? "bunny" : "mux";

  return (
    <LessonPageClient provider={provider} id={id} courseSlug={course} />
  );
}
