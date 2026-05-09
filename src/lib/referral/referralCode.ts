import { randomInt } from "crypto";

import type { PrismaClient } from "@prisma/client";

import type { PrismaTransaction } from "@/lib/referral/transactionClient";

/** Conjunto legível (evita O/0 e I/1). */
const REFERRAL_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const CODE_LEN = 8;

export function normalizeReferralCodeInput(raw: string | null | undefined): string | null {
  const s = String(raw ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return s.length > 0 ? s : null;
}

function randomCodeSegment(): string {
  let out = "";
  for (let i = 0; i < CODE_LEN; i++) {
    const idx = randomInt(REFERRAL_CODE_ALPHABET.length);
    out += REFERRAL_CODE_ALPHABET[idx]!;
  }
  return out;
}

export async function allocateUniqueReferralCode(
  db: PrismaTransaction | PrismaClient,
  maxAttempts = 24,
): Promise<string> {
  for (let a = 0; a < maxAttempts; a++) {
    const candidate = randomCodeSegment();
    const taken = await db.profile.findUnique({
      where: { referralCode: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
  }
  throw new Error("referral_code_allocate_failed");
}
