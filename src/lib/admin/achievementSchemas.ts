import { z } from "zod";

const codeSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[A-Z0-9_]+$/, "Use maiúsculas, números e sublinhado (ex.: FIRST_QUIZ_PASSED).");

export const achievementFormSchema = z.object({
  code: codeSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  xpReward: z.coerce.number().int().min(0).max(1_000_000),
  souvenirCredits: z.coerce.number().int().min(0).max(1_000_000),
});

export function parseAchievementForm(formData: FormData) {
  const descriptionRaw = String(formData.get("description") ?? "").trim();
  return achievementFormSchema.safeParse({
    code: String(formData.get("code") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: descriptionRaw === "" ? undefined : descriptionRaw,
    xpReward: formData.get("xpReward"),
    souvenirCredits: formData.get("souvenirCredits"),
  });
}
