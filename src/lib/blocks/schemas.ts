import { BlockType } from "@prisma/client";
import { z } from "zod";

/** Heading: texto + nível opcional (1–6). */
export const headingBlockDataSchema = z.object({
  text: z.string(),
  level: z.number().int().min(1).max(6).optional(),
});

/** Parágrafo: corpo textual. */
export const paragraphBlockDataSchema = z.object({
  text: z.string(),
});

/** Callout / destaque. */
export const calloutBlockDataSchema = z.object({
  text: z.string(),
  variant: z.enum(["info", "warning", "neutral"]).optional(),
});

export const imageBlockDataSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
});

/** Vídeo: URL directa ou par provider+id (Mux, YouTube, etc.). */
export const videoEmbedBlockDataSchema = z.union([
  z.object({ url: z.string().url() }),
  z.object({
    provider: z.string().min(1),
    id: z.string().min(1),
  }),
]);

export const fileDownloadBlockDataSchema = z.object({
  url: z.string().url(),
  label: z.string().optional(),
});

/** Referência a um quiz persistido (renderização numa fase posterior). */
export const quizEmbedBlockDataSchema = z.object({
  quizId: z.string().min(1),
});

/** Bloco extensível — validação mínima; preferir tipos específicos quando possível. */
export const customBlockDataSchema = z.record(z.string(), z.unknown());

const blockDataSchemas: Record<BlockType, z.ZodType> = {
  [BlockType.HEADING]: headingBlockDataSchema,
  [BlockType.PARAGRAPH]: paragraphBlockDataSchema,
  [BlockType.CALLOUT]: calloutBlockDataSchema,
  [BlockType.IMAGE]: imageBlockDataSchema,
  [BlockType.VIDEO_EMBED]: videoEmbedBlockDataSchema,
  [BlockType.FILE_DOWNLOAD]: fileDownloadBlockDataSchema,
  [BlockType.QUIZ_EMBED]: quizEmbedBlockDataSchema,
  [BlockType.CUSTOM]: customBlockDataSchema,
};

export function parseContentBlockData(type: BlockType, data: unknown): unknown {
  const schema = blockDataSchemas[type];
  return schema.parse(data);
}

export function safeParseContentBlockData(type: BlockType, data: unknown) {
  const schema = blockDataSchemas[type];
  return schema.safeParse(data);
}
