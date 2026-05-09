"use client";

import type { BlockType } from "@prisma/client";

import { quizEmbedBlockDataSchema } from "@/lib/blocks/schemas";

import { CalloutBlock } from "@/components/campus/blocks/CalloutBlock";
import { HeadingBlock } from "@/components/campus/blocks/HeadingBlock";
import { ImageBlock } from "@/components/campus/blocks/ImageBlock";
import { ParagraphBlock } from "@/components/campus/blocks/ParagraphBlock";
import { QuizEmbedPlayer } from "@/components/campus/blocks/QuizEmbedPlayer";
import { VideoEmbedBlock } from "@/components/campus/blocks/VideoEmbedBlock";

export type CmsRenderBlock = {
  id: string;
  type: BlockType;
  data: unknown;
};

function renderSwitch(block: CmsRenderBlock) {
  switch (block.type) {
    case "HEADING":
      return <HeadingBlock data={block.data} />;
    case "PARAGRAPH":
      return <ParagraphBlock data={block.data} />;
    case "CALLOUT":
      return <CalloutBlock data={block.data} />;
    case "VIDEO_EMBED":
      return <VideoEmbedBlock data={block.data} />;
    case "IMAGE":
      return <ImageBlock data={block.data} />;
    case "QUIZ_EMBED": {
      const parsed = quizEmbedBlockDataSchema.safeParse(block.data);
      if (!parsed.success) return null;
      return <QuizEmbedPlayer quizId={parsed.data.quizId} />;
    }
    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: CmsRenderBlock[] }) {
  return (
    <article className="cms-block-renderer space-y-6 text-white/[0.9]">
      {blocks.map((b) => (
        <section key={b.id} className="cms-block-renderer__block" data-block-type={b.type}>
          {renderSwitch(b)}
        </section>
      ))}
    </article>
  );
}
