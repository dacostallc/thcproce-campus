import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const publishStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const lessonFormSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug é obrigatório")
    .regex(slugRegex, "Slug: só letras minúsculas, números e hífens"),
  status: publishStatusSchema,
  sortOrder: z.coerce.number().int(),
});

export function parseLessonFormData(formData: FormData) {
  const raw = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? "").toLowerCase(),
    status: String(formData.get("status") ?? "DRAFT"),
    sortOrder: formData.get("sortOrder"),
  };
  return lessonFormSchema.safeParse(raw);
}
