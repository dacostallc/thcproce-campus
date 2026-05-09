"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCampusAdmin } from "@/lib/admin/requireCampusAdmin";
import { parseCourseFormData } from "@/lib/admin/courseSchema";
import { prisma } from "@/lib/prisma";

export type CourseActionState =
  | { ok: true }
  | {
      ok: false;
      message?: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function createCourseAction(
  _prev: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  await requireCampusAdmin();
  const parsed = parseCourseFormData(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  try {
    await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        status: data.status,
        sortOrder: data.sortOrder,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, message: "Este slug já está em uso." };
    }
    throw e;
  }
  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}

export async function updateCourseAction(
  courseId: string,
  _prev: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  await requireCampusAdmin();
  const parsed = parseCourseFormData(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  try {
    await prisma.course.update({
      where: { id: courseId },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        status: data.status,
        sortOrder: data.sortOrder,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, message: "Este slug já está em uso." };
    }
    throw e;
  }
  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}
