import { z } from "zod";

/** Tipos editáveis no admin CMS (subconjunto de `BlockType` do Prisma). */
export const ADMIN_BLOCK_TYPES = [
  "HEADING",
  "PARAGRAPH",
  "CALLOUT",
  "VIDEO_EMBED",
  "IMAGE",
  "QUIZ_EMBED",
] as const;

export type AdminBlockType = (typeof ADMIN_BLOCK_TYPES)[number];

export const adminBlockTypeSchema = z.enum(ADMIN_BLOCK_TYPES);
