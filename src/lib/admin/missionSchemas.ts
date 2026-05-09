import { MissionType } from "@prisma/client";
import { z } from "zod";

const codeSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9_]+$/, "Use letras, números e sublinhado (ex.: mission_pass_first_quiz).");

export const missionFormSchema = z.object({
  code: codeSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.nativeEnum(MissionType),
  targetValue: z.coerce.number().int().min(1).max(1_000_000),
  xpReward: z.coerce.number().int().min(0).max(1_000_000),
  souvenirCreditsReward: z.coerce.number().int().min(0).max(1_000_000),
  active: z.boolean(),
});

export function parseMissionForm(formData: FormData) {
  const descriptionRaw = String(formData.get("description") ?? "").trim();
  return missionFormSchema.safeParse({
    code: String(formData.get("code") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: descriptionRaw === "" ? undefined : descriptionRaw,
    type: formData.get("type"),
    targetValue: formData.get("targetValue"),
    xpReward: formData.get("xpReward"),
    souvenirCreditsReward: formData.get("souvenirCreditsReward"),
    active: formData.get("isActive") === "on",
  });
}
