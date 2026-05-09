import { AvatarItemType } from "@prisma/client";
import { z } from "zod";

const codeSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9_]+$/, "Use letras, números e sublinhado (ex.: hat_mestre_cultivo).");

export const avatarItemFormSchema = z.object({
  code: codeSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.nativeEnum(AvatarItemType),
  displayGlyph: z.string().min(1).max(16),
  unlockAchievementCode: z.union([
    z.null(),
    z
      .string()
      .min(1)
      .max(64)
      .regex(/^[A-Z0-9_]+$/, "Use maiúsculas, números e sublinhado (ex.: XP_1000)."),
  ]),
  active: z.boolean(),
});

export function parseAvatarItemForm(formData: FormData) {
  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const achRaw = String(formData.get("requiredAchievementCode") ?? "").trim();
  return avatarItemFormSchema.safeParse({
    code: String(formData.get("code") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: descriptionRaw === "" ? undefined : descriptionRaw,
    type: formData.get("type"),
    displayGlyph: String(formData.get("displayGlyph") ?? "").trim() || "✨",
    unlockAchievementCode: achRaw === "" ? null : achRaw,
    active: formData.get("isActive") === "on",
  });
}
