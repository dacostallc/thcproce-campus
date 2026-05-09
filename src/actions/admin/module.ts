"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { adminCoursePath, adminModuleEditPath } from "@/lib/admin/adminRevalidate";
import { requireCampusAdmin } from "@/lib/admin/requireCampusAdmin";
import { parseModuleFormData } from "@/lib/admin/moduleSchema";
import { prisma } from "@/lib/prisma";

import type { CourseActionState } from "@/actions/admin/course";

export type ModuleActionState = CourseActionState;

export async function createModuleAction(
  courseId: string,
  _prev: ModuleActionState,
  formData: FormData,
): Promise<ModuleActionState> {
  await requireCampusAdmin();
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return { ok: false, message: "Curso não encontrado." };
  }
  const parsed = parseModuleFormData(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  let moduleId: string;
  try {
    const created = await prisma.module.create({
      data: {
        courseId,
        title: data.title,
        slug: data.slug,
        description: data.description,
        status: data.status,
        sortOrder: data.sortOrder,
      },
    });
    moduleId = created.id;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, message: "Este slug já está em uso neste curso." };
    }
    throw e;
  }
  revalidatePath(adminCoursePath(courseId));
  redirect(adminModuleEditPath(courseId, moduleId));
}

export async function updateModuleAction(
  courseId: string,
  moduleId: string,
  _prev: ModuleActionState,
  formData: FormData,
): Promise<ModuleActionState> {
  await requireCampusAdmin();
  const mod = await prisma.module.findFirst({
    where: { id: moduleId, courseId },
  });
  if (!mod) {
    return { ok: false, message: "Módulo não encontrado." };
  }
  const parsed = parseModuleFormData(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  try {
    await prisma.module.update({
      where: { id: moduleId },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        status: data.status,
        sortOrder: data.sortOrder,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, message: "Este slug já está em uso neste curso." };
    }
    throw e;
  }
  revalidatePath(adminCoursePath(courseId));
  revalidatePath(adminModuleEditPath(courseId, moduleId));
  redirect(adminModuleEditPath(courseId, moduleId));
}
