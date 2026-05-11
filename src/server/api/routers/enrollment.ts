import { z } from "zod";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "@/server/api/trpc";
import type { AccessStatus } from "@prisma/client";
import { ENROLLMENT_PLANS, type EnrollmentPlanId } from "@/config/enrollmentPlans";
import {
  createNewProfileWithOptionalReferral,
  upsertExistingEnrollmentProfile,
} from "@/lib/referral/createEnrollmentProfile";

const planIds = ENROLLMENT_PLANS.map((p) => p.id) as [EnrollmentPlanId, ...EnrollmentPlanId[]];

const resetPasswordInput = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").max(200),
  passwordConfirm: z.string()
});

const registerInput = z.object({
  email: z.string().email("E-mail inválido"),
  displayName: z.string().min(2, "Nome muito curto").max(120),
  password: z.string().min(8, "Mínimo 8 caracteres").max(200),
  passwordConfirm: z.string(),
  whatsapp: z.string().min(8, "Informe o WhatsApp").max(40),
  cpf: z.string().max(20).optional(),
  country: z.string().min(2).max(80),
  city: z.string().min(1).max(80),
  stateRegion: z.string().min(1).max(80),
  planId: z.enum(planIds),
  acceptTerms: z.boolean().refine((v) => v === true, "Aceite os termos para continuar"),
  /** Código do amigo (mesmo valor que o parâmetro `?ref=` na inscrição). */
  referralCode: z.string().max(32).optional().nullable(),
});

export const enrollmentRouter = router({
  /**
   * Só atualiza senha para perfil já existente — não pede plano nem checkout.
   * Fluxo para donos/dev ou utilizadores que esqueceram a senha sem refazer matrícula.
   */
  resetPassword: publicProcedure.input(resetPasswordInput).mutation(async ({ ctx, input }) => {
    if (input.password !== input.passwordConfirm) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "As senhas não coincidem"
      });
    }
    const email = input.email.trim().toLowerCase();
    const existing = await ctx.prisma.profile.findUnique({ where: { email } });
    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Não há conta com este e-mail. Para criar conta, use Matrícula (/inscrever-se)."
      });
    }
    const hash = await bcrypt.hash(input.password, 12);
    await ctx.prisma.profile.update({
      where: { email },
      data: { passwordHash: hash }
    });
    return { ok: true as const };
  }),

  register: publicProcedure.input(registerInput).mutation(async ({ ctx, input }) => {
    if (input.password !== input.passwordConfirm) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "As senhas não coincidem"
      });
    }

    const email = input.email.trim().toLowerCase();
    const existing = await ctx.prisma.profile.findUnique({ where: { email } });
    // Referral: apenas perfil novo (`!existing`). Re-inscrição ignora `referralCode` (sem bónus).

    const hash = await bcrypt.hash(input.password, 12);

    const keepPaidStatus = (s: AccessStatus | undefined): boolean =>
      s === "ativo" || s === "vitalicio";

    const nextStatus: AccessStatus =
      existing?.accessStatus && keepPaidStatus(existing.accessStatus)
        ? existing.accessStatus
        : "pendente";

    const moodlePending = Boolean(process.env.MOODLE_WS_TOKEN?.trim());

    const row = existing
      ? await upsertExistingEnrollmentProfile(
          ctx.prisma,
          {
            email,
            displayName: input.displayName.trim(),
            passwordHash: hash,
            whatsapp: input.whatsapp.trim(),
            cpf: input.cpf?.trim().replace(/\D/g, "") || null,
            country: input.country.trim(),
            city: input.city.trim(),
            stateRegion: input.stateRegion.trim(),
            planId: input.planId,
            accessStatus: "pendente",
            moodleSyncPending: moodlePending,
          },
          nextStatus,
        )
      : await createNewProfileWithOptionalReferral(ctx.prisma, {
          email,
          displayName: input.displayName.trim(),
          passwordHash: hash,
          whatsapp: input.whatsapp.trim(),
          cpf: input.cpf?.trim().replace(/\D/g, "") || null,
          country: input.country.trim(),
          city: input.city.trim(),
          stateRegion: input.stateRegion.trim(),
          planId: input.planId,
          accessStatus: "pendente",
          moodleSyncPending: moodlePending,
          referralCode: input.referralCode?.trim() ? input.referralCode.trim() : null,
        });

    return {
      ok: true as const,
      profileId: row.id,
      email: row.email,
      planId: row.selectedPlanId,
      accessStatus: row.accessStatus
    };
  })
});
