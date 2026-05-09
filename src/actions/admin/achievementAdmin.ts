"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CourseActionState } from "@/actions/admin/course";
import { parseAchievementForm } from "@/lib/admin/achievementSchemas";
import { requireCampusAdmin } from "@/lib/admin/requireCampusAdmin";
import { prisma } from "@/lib/prisma";

export type AchievementAdminState = CourseActionState;

const ACHIEVEMENTS_PATH = "/admin/achievements";

export async function createAchievementAction(
  _prev: AchievementAdminState,
  formData: FormData,
): Promise<AchievementAdminState> {
  await requireCampusAdmin();
  const parsed = parseAchievementForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const exists = await prisma.achievement.findUnique({
    where: { code: parsed.data.code },
    select: { id: true },
  });
  if (exists) {
    return { ok: false, message: "Já existe um achievement com este código." };
  }
  const row = await prisma.achievement.create({
    data: {
      code: parsed.data.code,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      xpReward: parsed.data.xpReward,
      souvenirCredits: parsed.data.souvenirCredits,
    },
  });
  revalidatePath(ACHIEVEMENTS_PATH);
  redirect(`${ACHIEVEMENTS_PATH}/${row.id}/edit`);
}

export async function updateAchievementAction(
  achievementId: string,
  _prev: AchievementAdminState,
  formData: FormData,
): Promise<AchievementAdminState> {
  await requireCampusAdmin();
  const parsed = parseAchievementForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const current = await prisma.achievement.findUnique({
    where: { id: achievementId },
    select: { id: true, code: true },
  });
  if (!current) {
    return { ok: false, message: "Achievement não encontrado." };
  }
  if (parsed.data.code !== current.code) {
    const taken = await prisma.achievement.findUnique({
      where: { code: parsed.data.code },
      select: { id: true },
    });
    if (taken) {
      return { ok: false, message: "Este código já está em uso." };
    }
  }
  await prisma.achievement.update({
    where: { id: achievementId },
    data: {
      code: parsed.data.code,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      xpReward: parsed.data.xpReward,
      souvenirCredits: parsed.data.souvenirCredits,
    },
  });
  revalidatePath(ACHIEVEMENTS_PATH);
  revalidatePath(`${ACHIEVEMENTS_PATH}/${achievementId}/edit`);
  return { ok: true };
}
