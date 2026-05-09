"use server";

import type { BlockType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { adminBlockTypeSchema } from "@/lib/admin/adminBlockTypes";
import {
  adminCoursePath,
  adminLessonEditPath,
  adminModuleEditPath,
} from "@/lib/admin/adminRevalidate";
import { requireCampusAdmin } from "@/lib/admin/requireCampusAdmin";
import { safeParseContentBlockData } from "@/lib/blocks/schemas";
import { prisma } from "@/lib/prisma";

import type { CourseActionState } from "@/actions/admin/course";

export type BlockActionState = CourseActionState;

function coerceInt(v: FormDataEntryValue | null): number | null {
  if (v === null || v === "") return null;
  const n = Number.parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

async function assertLesson(courseId: string, moduleId: string, lessonId: string) {
  return prisma.lesson.findFirst({
    where: { id: lessonId, moduleId, module: { courseId } },
  });
}

function parseJsonField(raw: string): { ok: true; value: unknown } | { ok: false; message: string } {
  const t = raw.trim();
  if (t === "") {
    return { ok: false, message: "JSON dos dados do bloco não pode ficar vazio." };
  }
  try {
    return { ok: true, value: JSON.parse(t) as unknown };
  } catch {
    return { ok: false, message: "JSON inválido — verifique chaves e vírgulas." };
  }
}

export async function createContentBlockAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  _prev: BlockActionState,
  formData: FormData,
): Promise<BlockActionState> {
  await requireCampusAdmin();
  const lesson = await assertLesson(courseId, moduleId, lessonId);
  if (!lesson) {
    return { ok: false, message: "Aula não encontrada." };
  }

  const typeRaw = String(formData.get("type") ?? "");
  const typeParsed = adminBlockTypeSchema.safeParse(typeRaw);
  if (!typeParsed.success) {
    return { ok: false, message: "Tipo de bloco inválido." };
  }
  const type = typeParsed.data as BlockType;

  const sortParsed = coerceInt(formData.get("sortOrder"));
  if (sortParsed === null || !Number.isInteger(sortParsed)) {
    return { ok: false, fieldErrors: { sortOrder: ["Ordem deve ser um número inteiro."] } };
  }

  const dataRaw = String(formData.get("data") ?? "");
  const json = parseJsonField(dataRaw);
  if (!json.ok) {
    return { ok: false, message: json.message };
  }

  const content = safeParseContentBlockData(type, json.value);
  if (!content.success) {
    const msg = content.error.issues.map((i) => i.message).join(" · ");
    return {
      ok: false,
      message: msg || "Dados do bloco não correspondem ao tipo escolhido.",
    };
  }

  await prisma.contentBlock.create({
    data: {
      lessonId,
      type,
      sortOrder: sortParsed,
      data: content.data as Prisma.InputJsonValue,
    },
  });

  revalidatePath(adminCoursePath(courseId));
  revalidatePath(adminModuleEditPath(courseId, moduleId));
  revalidatePath(adminLessonEditPath(courseId, moduleId, lessonId));
  redirect(adminLessonEditPath(courseId, moduleId, lessonId));
}

export async function updateContentBlockAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
  _prev: BlockActionState,
  formData: FormData,
): Promise<BlockActionState> {
  await requireCampusAdmin();
  const lesson = await assertLesson(courseId, moduleId, lessonId);
  if (!lesson) {
    return { ok: false, message: "Aula não encontrada." };
  }

  const block = await prisma.contentBlock.findFirst({
    where: { id: blockId, lessonId },
  });
  if (!block) {
    return { ok: false, message: "Bloco não encontrado." };
  }

  const typeRaw = String(formData.get("type") ?? "");
  const typeParsed = adminBlockTypeSchema.safeParse(typeRaw);
  if (!typeParsed.success) {
    return { ok: false, message: "Tipo de bloco inválido." };
  }
  const type = typeParsed.data as BlockType;

  const sortParsed = coerceInt(formData.get("sortOrder"));
  if (sortParsed === null || !Number.isInteger(sortParsed)) {
    return { ok: false, fieldErrors: { sortOrder: ["Ordem deve ser um número inteiro."] } };
  }

  const dataRaw = String(formData.get("data") ?? "");
  const json = parseJsonField(dataRaw);
  if (!json.ok) {
    return { ok: false, message: json.message };
  }

  const content = safeParseContentBlockData(type, json.value);
  if (!content.success) {
    const msg = content.error.issues.map((i) => i.message).join(" · ");
    return {
      ok: false,
      message: msg || "Dados do bloco não correspondem ao tipo escolhido.",
    };
  }

  await prisma.contentBlock.update({
    where: { id: blockId },
    data: {
      type,
      sortOrder: sortParsed,
      data: content.data as Prisma.InputJsonValue,
    },
  });

  revalidatePath(adminCoursePath(courseId));
  revalidatePath(adminModuleEditPath(courseId, moduleId));
  revalidatePath(adminLessonEditPath(courseId, moduleId, lessonId));
  redirect(adminLessonEditPath(courseId, moduleId, lessonId));
}

export async function deleteContentBlockAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  blockId: string,
): Promise<void> {
  await requireCampusAdmin();
  const lesson = await assertLesson(courseId, moduleId, lessonId);
  if (!lesson) {
    redirect(adminModuleEditPath(courseId, moduleId));
  }
  await prisma.contentBlock.deleteMany({
    where: { id: blockId, lessonId },
  });
  revalidatePath(adminCoursePath(courseId));
  revalidatePath(adminModuleEditPath(courseId, moduleId));
  revalidatePath(adminLessonEditPath(courseId, moduleId, lessonId));
  redirect(adminLessonEditPath(courseId, moduleId, lessonId));
}
