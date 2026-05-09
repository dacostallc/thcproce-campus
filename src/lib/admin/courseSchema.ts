import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const publishStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const courseFormSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug é obrigatório")
    .regex(slugRegex, "Slug: só letras minúsculas, números e hífens"),
  description: z.preprocess((val) => {
    if (val === undefined || val === null) return null;
    const s = String(val).trim();
    return s === "" ? null : s;
  }, z.union([z.null(), z.string()])),
  status: publishStatusSchema,
  sortOrder: z.coerce.number().int(),
  thumbnailUrl: z.preprocess((val) => {
    if (val === undefined || val === null) return null;
    const s = String(val).trim();
    return s === "" ? null : s;
  }, z.union([z.null(), z.string().url("URL da miniatura inválida")])),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

export function parseCourseFormData(formData: FormData) {
  const raw = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? "").toLowerCase(),
    description: formData.get("description"),
    status: String(formData.get("status") ?? "DRAFT"),
    sortOrder: formData.get("sortOrder"),
    thumbnailUrl: formData.get("thumbnailUrl"),
  };
  return courseFormSchema.safeParse(raw);
}
