import type { PrismaClient } from "@prisma/client";

import { allocateUniqueReferralCode } from "@/lib/referral/referralCode";

/** Garante `referralCode` no perfil (perfis antigos ou criados fora do fluxo de inscrição). */
export async function ensureProfileReferralCode(
  prisma: PrismaClient,
  profileId: string,
): Promise<string> {
  const row = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { referralCode: true },
  });
  if (row?.referralCode) return row.referralCode;
  const code = await allocateUniqueReferralCode(prisma);
  await prisma.profile.update({
    where: { id: profileId },
    data: { referralCode: code },
  });
  return code;
}
