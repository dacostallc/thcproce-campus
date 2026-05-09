"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CourseActionState } from "@/actions/admin/course";
import { parseAvatarItemForm } from "@/lib/admin/avatarItemAdminSchemas";
import { requireCampusAdmin } from "@/lib/admin/requireCampusAdmin";
import { prisma } from "@/lib/prisma";

export type AvatarItemAdminState = CourseActionState;

const AVATAR_ITEMS_PATH = "/admin/avatar-items";

export async function createAvatarItemAction(
  _prev: AvatarItemAdminState,
  formData: FormData,
): Promise<AvatarItemAdminState> {
  await requireCampusAdmin();
  const parsed = parseAvatarItemForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const exists = await prisma.avatarItem.findUnique({
    where: { code: parsed.data.code },
    select: { id: true },
  });
  if (exists) {
    return { ok: false, message: "Já existe um item com este código." };
  }
  const row = await prisma.avatarItem.create({
    data: {
      code: parsed.data.code,
      name: parsed.data.title,
      description: parsed.data.description ?? null,
      type: parsed.data.type,
      displayGlyph: parsed.data.displayGlyph,
      unlockAchievementCode: parsed.data.unlockAchievementCode,
      active: parsed.data.active,
    },
  });
  revalidatePath(AVATAR_ITEMS_PATH);
  revalidatePath("/perfil");
  redirect(`${AVATAR_ITEMS_PATH}/${row.id}/edit`);
}

export async function updateAvatarItemAction(
  avatarItemId: string,
  _prev: AvatarItemAdminState,
  formData: FormData,
): Promise<AvatarItemAdminState> {
  await requireCampusAdmin();
  const parsed = parseAvatarItemForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const current = await prisma.avatarItem.findUnique({
    where: { id: avatarItemId },
    select: { id: true, code: true },
  });
  if (!current) {
    return { ok: false, message: "Item não encontrado." };
  }
  if (parsed.data.code !== current.code) {
    const taken = await prisma.avatarItem.findUnique({
      where: { code: parsed.data.code },
      select: { id: true },
    });
    if (taken) {
      return { ok: false, message: "Este código já está em uso." };
    }
  }
  await prisma.avatarItem.update({
    where: { id: avatarItemId },
    data: {
      code: parsed.data.code,
      name: parsed.data.title,
      description: parsed.data.description ?? null,
      type: parsed.data.type,
      displayGlyph: parsed.data.displayGlyph,
      unlockAchievementCode: parsed.data.unlockAchievementCode,
      active: parsed.data.active,
    },
  });
  revalidatePath(AVATAR_ITEMS_PATH);
  revalidatePath(`${AVATAR_ITEMS_PATH}/${avatarItemId}/edit`);
  revalidatePath("/perfil");
  return { ok: true };
}
