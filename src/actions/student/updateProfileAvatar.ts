"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { updateAvatarFormSchema } from "@/lib/profile/avatarOptions";
import { prisma } from "@/lib/prisma";

export type ProfileAvatarActionState = { ok: true } | { ok: false; message?: string };

export async function updateProfileAvatarAction(
  _prev: ProfileAvatarActionState,
  formData: FormData,
): Promise<ProfileAvatarActionState> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase() ?? null;
  if (!email) {
    return { ok: false, message: "Inicie sessão para guardar o avatar." };
  }

  const parsed = updateAvatarFormSchema.safeParse({
    avatarType: String(formData.get("avatarType") ?? "").trim(),
    avatarColor: String(formData.get("avatarColor") ?? "").trim(),
  });
  if (!parsed.success) {
    return { ok: false, message: "Seleção de avatar inválida." };
  }

  await prisma.profile.upsert({
    where: { email },
    create: {
      email,
      displayName: session?.user?.name?.trim() || email.split("@")[0] || "Aluno",
      avatarType: parsed.data.avatarType,
      avatarColor: parsed.data.avatarColor,
    },
    update: {
      avatarType: parsed.data.avatarType,
      avatarColor: parsed.data.avatarColor,
    },
  });

  revalidatePath("/perfil");
  return { ok: true };
}
