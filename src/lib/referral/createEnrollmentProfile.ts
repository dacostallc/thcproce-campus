import type { AccessStatus } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

import { REFERRAL_REWARD_REFERRED, REFERRAL_REWARD_REFERRER } from "@/config/referralRewards";
import { allocateUniqueReferralCode, normalizeReferralCodeInput } from "@/lib/referral/referralCode";
import { appendProfileRewardLog } from "@/lib/rewards/rewardLedger";
import { REWARD_LOG_TYPE } from "@/lib/rewards/rewardLogTypes";

export type EnrollmentRegisterInput = {
  email: string;
  displayName: string;
  passwordHash: string;
  whatsapp: string;
  cpf: string | null;
  country: string;
  city: string;
  stateRegion: string;
  planId: string;
  accessStatus: AccessStatus;
  moodleSyncPending: boolean;
  referralCode?: string | null;
};

/**
 * Atualiza perfil existente (re-inscrição) — não aplica indicação nem altera código de referral.
 */
export async function upsertExistingEnrollmentProfile(
  prisma: PrismaClient,
  input: Omit<EnrollmentRegisterInput, "referralCode">,
  nextStatus: AccessStatus,
) {
  return prisma.profile.update({
    where: { email: input.email },
    data: {
      displayName: input.displayName,
      passwordHash: input.passwordHash,
      whatsapp: input.whatsapp,
      cpf: input.cpf,
      country: input.country,
      city: input.city,
      stateRegion: input.stateRegion,
      selectedPlanId: input.planId,
      termsAcceptedAt: new Date(),
      accessStatus: nextStatus,
      moodleSyncPending: input.moodleSyncPending,
    },
  });
}

/**
 * Cria conta nova com código de indicação opcional; recompensas só se o código for válido e não for auto-indicação.
 */
export async function createNewProfileWithOptionalReferral(
  prisma: PrismaClient,
  input: EnrollmentRegisterInput,
) {
  const email = input.email.trim().toLowerCase();
  const normalizedRef = normalizeReferralCodeInput(input.referralCode ?? null);

  return prisma.$transaction(async (tx) => {
    const myCode = await allocateUniqueReferralCode(tx);

    let referrerId: string | null = null;
    if (normalizedRef) {
      const refProfile = await tx.profile.findFirst({
        where: { referralCode: normalizedRef },
        select: { id: true, email: true },
      });
      if (refProfile && refProfile.email?.trim().toLowerCase() !== email) {
        referrerId = refProfile.id;
      }
    }

    const row = await tx.profile.create({
      data: {
        email,
        displayName: input.displayName,
        passwordHash: input.passwordHash,
        whatsapp: input.whatsapp,
        cpf: input.cpf,
        country: input.country,
        city: input.city,
        stateRegion: input.stateRegion,
        selectedPlanId: input.planId,
        accessStatus: input.accessStatus,
        termsAcceptedAt: new Date(),
        moodleSyncPending: input.moodleSyncPending,
        referralCode: myCode,
        referredByProfileId: null,
      },
    });

    if (referrerId && referrerId !== row.id) {
      const existingBonus = await tx.referral.findUnique({
        where: { referredProfileId: row.id },
        select: { id: true },
      });
      if (!existingBonus) {
        await tx.referral.create({
          data: {
            referrerProfileId: referrerId,
            referredProfileId: row.id,
            referrerRewardAmount: REFERRAL_REWARD_REFERRER,
            referredRewardAmount: REFERRAL_REWARD_REFERRED,
          },
        });
        await tx.profile.update({
          where: { id: referrerId },
          data: {
            souvenirCredits: { increment: REFERRAL_REWARD_REFERRER },
            referralSouvenirEarned: { increment: REFERRAL_REWARD_REFERRER },
          },
        });
        await tx.profile.update({
          where: { id: row.id },
          data: {
            souvenirCredits: { increment: REFERRAL_REWARD_REFERRED },
            referredByProfileId: referrerId,
          },
        });

        await appendProfileRewardLog(tx, {
          profileId: referrerId,
          type: REWARD_LOG_TYPE.REFERRAL_REFERRER,
          source: normalizedRef,
          description: "Créditos souvenir por indicação: novo aluno inscrito com o seu código.",
          xpAmount: 0,
          souvenirCreditsAmount: REFERRAL_REWARD_REFERRER,
        });
        await appendProfileRewardLog(tx, {
          profileId: row.id,
          type: REWARD_LOG_TYPE.REFERRAL_RECIPIENT,
          source: normalizedRef ?? undefined,
          description: "Créditos souvenir de boas-vindas (indicação de um amigo).",
          xpAmount: 0,
          souvenirCreditsAmount: REFERRAL_REWARD_REFERRED,
        });
      }
    }

    return row;
  });
}
