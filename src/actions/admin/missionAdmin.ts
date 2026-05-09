"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CourseActionState } from "@/actions/admin/course";
import { parseMissionForm } from "@/lib/admin/missionSchemas";
import { requireCampusAdmin } from "@/lib/admin/requireCampusAdmin";
import { prisma } from "@/lib/prisma";

export type MissionAdminState = CourseActionState;

const MISSIONS_PATH = "/admin/missions";

export async function createMissionAction(
  _prev: MissionAdminState,
  formData: FormData,
): Promise<MissionAdminState> {
  await requireCampusAdmin();
  const parsed = parseMissionForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const exists = await prisma.mission.findUnique({
    where: { code: parsed.data.code },
    select: { id: true },
  });
  if (exists) {
    return { ok: false, message: "Já existe uma missão com este código." };
  }
  const maxSo = await prisma.mission.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (maxSo._max.sortOrder ?? -1) + 1;
  const row = await prisma.mission.create({
    data: {
      code: parsed.data.code,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      type: parsed.data.type,
      targetValue: parsed.data.targetValue,
      xpReward: parsed.data.xpReward,
      souvenirCreditsReward: parsed.data.souvenirCreditsReward,
      active: parsed.data.active,
      sortOrder,
    },
  });
  revalidatePath(MISSIONS_PATH);
  revalidatePath("/perfil");
  redirect(`${MISSIONS_PATH}/${row.id}/edit`);
}

export async function updateMissionAction(
  missionId: string,
  _prev: MissionAdminState,
  formData: FormData,
): Promise<MissionAdminState> {
  await requireCampusAdmin();
  const parsed = parseMissionForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const current = await prisma.mission.findUnique({
    where: { id: missionId },
    select: { id: true, code: true },
  });
  if (!current) {
    return { ok: false, message: "Missão não encontrada." };
  }
  if (parsed.data.code !== current.code) {
    const taken = await prisma.mission.findUnique({
      where: { code: parsed.data.code },
      select: { id: true },
    });
    if (taken) {
      return { ok: false, message: "Este código já está em uso." };
    }
  }
  await prisma.mission.update({
    where: { id: missionId },
    data: {
      code: parsed.data.code,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      type: parsed.data.type,
      targetValue: parsed.data.targetValue,
      xpReward: parsed.data.xpReward,
      souvenirCreditsReward: parsed.data.souvenirCreditsReward,
      active: parsed.data.active,
    },
  });
  revalidatePath(MISSIONS_PATH);
  revalidatePath(`${MISSIONS_PATH}/${missionId}/edit`);
  revalidatePath("/perfil");
  return { ok: true };
}
