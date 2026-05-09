import { z } from "zod";

export const ADMIN_QUESTION_TYPES = ["SINGLE_CHOICE", "TRUE_FALSE"] as const;

export type AdminQuestionType = (typeof ADMIN_QUESTION_TYPES)[number];

export const adminQuestionTypeSchema = z.enum(ADMIN_QUESTION_TYPES);

export const quizMetaSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório"),
  passingPercent: z.preprocess((val) => {
    if (val === undefined || val === null || String(val).trim() === "") return null;
    const n = Number.parseInt(String(val), 10);
    return Number.isFinite(n) ? n : null;
  }, z.union([z.null(), z.number().int().min(0).max(100)])),
});

export function parseQuizMetaForm(formData: FormData) {
  return quizMetaSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    passingPercent: formData.get("passingPercent"),
  });
}

export const questionFormSchema = z.object({
  prompt: z.string().trim().min(1, "Enunciado obrigatório"),
  type: adminQuestionTypeSchema,
  sortOrder: z.coerce.number().int(),
  explanation: z.preprocess((val) => {
    if (val === undefined || val === null) return null;
    const s = String(val).trim();
    return s === "" ? null : s;
  }, z.union([z.null(), z.string()])),
});

export function parseQuestionForm(formData: FormData) {
  return questionFormSchema.safeParse({
    prompt: String(formData.get("prompt") ?? ""),
    type: String(formData.get("type") ?? "SINGLE_CHOICE"),
    sortOrder: formData.get("sortOrder"),
    explanation: formData.get("explanation"),
  });
}

export const optionFormSchema = z.object({
  label: z.string().trim().min(1, "Texto da opção obrigatório"),
  sortOrder: z.coerce.number().int(),
  isCorrect: z.boolean(),
});

export function parseOptionForm(formData: FormData) {
  return optionFormSchema.safeParse({
    label: String(formData.get("label") ?? ""),
    sortOrder: formData.get("sortOrder"),
    isCorrect: formData.get("isCorrect") === "on",
  });
}
