"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  adminCoursePath,
  adminLessonEditPath,
  adminModuleEditPath,
} from "@/lib/admin/adminRevalidate";
import { parseLessonFormData } from "@/lib/admin/lessonSchema";
import { requireCampusAdmin } from "@/lib/admin/requireCampusAdmin";
import { prisma } from "@/lib/prisma";

import type { CourseActionState } from "@/actions/admin/course";

export type LessonActionState = CourseActionState;

async function assertLessonContext(courseId: string, moduleId: string, lessonId: string) {
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, moduleId, module: { courseId } },
  });
  return lesson;
}

export async function createLessonAction(
  courseId: string,
  moduleId: string,
  _prev: LessonActionState,
  formData: FormData,
): Promise<LessonActionState> {
  await requireCampusAdmin();
  const mod = await prisma.module.findFirst({
    where: { id: moduleId, courseId },
  });
  if (!mod) {
    return { ok: false, message: "Módulo não encontrado." };
  }
  const parsed = parseLessonFormData(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  let lessonId: string;
  try {
    const created = await prisma.lesson.create({
      data: {
        moduleId,
        title: data.title,
        slug: data.slug,
        status: data.status,
        sortOrder: data.sortOrder,
      },
    });
    lessonId = created.id;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, message: "Este slug já está em uso neste módulo." };
    }
    throw e;
  }
  revalidatePath(adminCoursePath(courseId));
  revalidatePath(adminModuleEditPath(courseId, moduleId));
  redirect(adminLessonEditPath(courseId, moduleId, lessonId));
}

export async function updateLessonAction(
  courseId: string,
  moduleId: string,
  lessonId: string,
  _prev: LessonActionState,
  formData: FormData,
): Promise<LessonActionState> {
  await requireCampusAdmin();
  const lesson = await assertLessonContext(courseId, moduleId, lessonId);
  if (!lesson) {
    return { ok: false, message: "Aula não encontrada." };
  }
  const parsed = parseLessonFormData(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  try {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: data.title,
        slug: data.slug,
        status: data.status,
        sortOrder: data.sortOrder,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, message: "Este slug já está em uso neste módulo." };
    }
    throw e;
  }
  revalidatePath(adminCoursePath(courseId));
  revalidatePath(adminModuleEditPath(courseId, moduleId));
  revalidatePath(adminLessonEditPath(courseId, moduleId, lessonId));
  redirect(adminLessonEditPath(courseId, moduleId, lessonId));
}
