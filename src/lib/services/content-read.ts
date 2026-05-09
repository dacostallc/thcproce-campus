import { type Prisma, PublishStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const published: PublishStatus = PublishStatus.PUBLISHED;

/** Curso publicado pelo slug (único global). */
export async function getPublishedCourseBySlug(slug: string) {
  return prisma.course.findFirst({
    where: { slug, status: published },
  });
}

type ModuleWithCourse = Prisma.ModuleGetPayload<{ include: { course: true } }>;

/** Módulo publicado pertencente a um curso publicado. */
export async function getPublishedModuleBySlugs(
  courseSlug: string,
  moduleSlug: string,
): Promise<ModuleWithCourse | null> {
  return prisma.module.findFirst({
    where: {
      slug: moduleSlug,
      status: published,
      course: { slug: courseSlug, status: published },
    },
    include: { course: true },
  });
}

export type PublishedLessonWithBlocks = Prisma.LessonGetPayload<{
  include: {
    module: { include: { course: true } };
    blocks: true;
  };
}>;

/**
 * Aula publicada com blocos ordenados, toda a cadeia curso → módulo → aula deve estar PUBLISHED.
 */
export async function getPublishedLessonWithBlocks(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
): Promise<PublishedLessonWithBlocks | null> {
  return prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      status: published,
      module: {
        slug: moduleSlug,
        status: published,
        course: { slug: courseSlug, status: published },
      },
    },
    include: {
      module: { include: { course: true } },
      blocks: { orderBy: { sortOrder: "asc" } },
    },
  });
}
