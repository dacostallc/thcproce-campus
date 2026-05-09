import type { PrismaClient } from "@prisma/client";

import type { RewardLogTypeCode } from "@/lib/rewards/rewardLogTypes";

export type RewardLogTx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export type AppendRewardLogInput = {
  profileId: string;
  type: RewardLogTypeCode;
  source?: string | null;
  description: string;
  xpAmount?: number;
  souvenirCreditsAmount?: number;
};

export async function appendProfileRewardLog(tx: RewardLogTx, input: AppendRewardLogInput): Promise<void> {
  await tx.profileRewardLog.create({
    data: {
      profileId: input.profileId,
      type: input.type,
      source: input.source ?? null,
      description: input.description,
      xpAmount: input.xpAmount ?? 0,
      souvenirCreditsAmount: input.souvenirCreditsAmount ?? 0,
    },
  });
}
