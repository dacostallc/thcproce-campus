"use server";

import { AvatarItemType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export type ActiveCosmeticsState = { ok: true } | { ok: false; message?: string };

function normalizeId(raw: FormDataEntryValue | null): string | null {
  const s = typeof raw === "string" ? raw.trim() : "";
  return s === "" ? null : s;
}

export async function setActiveAvatarCosmeticsAction(
  _prev: ActiveCosmeticsState,
  formData: FormData,
): Promise<ActiveCosmeticsState> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase() ?? null;
  if (!email) {
    return { ok: false, message: "Inicie sessão para guardar." };
  }

  const profile = await prisma.profile.findUnique({ where: { email } });
  if (!profile) {
    return { ok: false, message: "Perfil não encontrado." };
  }

  const profileId = profile.id;

  const activeHatItemId = normalizeId(formData.get("activeHatItemId"));
  const activeBadgeItemId = normalizeId(formData.get("activeBadgeItemId"));

  async function assertOwnedAndType(itemId: string, type: AvatarItemType): Promise<boolean> {
    const link = await prisma.userAvatarItem.findUnique({
      where: {
        profileId_avatarItemId: { profileId, avatarItemId: itemId },
      },
      include: { avatarItem: { select: { type: true, active: true } } },
    });
    return Boolean(link && link.avatarItem.active && link.avatarItem.type === type);
  }

  if (activeHatItemId && !(await assertOwnedAndType(activeHatItemId, AvatarItemType.HAT))) {
    return { ok: false, message: "Chapéu inválido ou ainda não desbloqueado." };
  }
  if (activeBadgeItemId && !(await assertOwnedAndType(activeBadgeItemId, AvatarItemType.BADGE))) {
    return { ok: false, message: "Insígnia inválida ou ainda não desbloqueada." };
  }

  await prisma.profile.update({
    where: { id: profileId },
    data: { activeHatItemId, activeBadgeItemId },
  });

  revalidatePath("/perfil");
  return { ok: true };
}
