import { z } from "zod";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "@/server/api/trpc";
import type { AccessStatus } from "@prisma/client";
import { ENROLLMENT_PLANS, type EnrollmentPlanId } from "@/config/enrollmentPlans";

const planIds = ENROLLMENT_PLANS.map((p) => p.id) as [EnrollmentPlanId, ...EnrollmentPlanId[]];

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
  acceptTerms: z.boolean().refine((v) => v === true, "Aceite os termos para continuar")
});

export const enrollmentRouter = router({
  register: publicProcedure.input(registerInput).mutation(async ({ ctx, input }) => {
    if (input.password !== input.passwordConfirm) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "As senhas não coincidem"
      });
    }

    const email = input.email.trim().toLowerCase();
    const existing = await ctx.prisma.profile.findUnique({ where: { email } });

    const hash = await bcrypt.hash(input.password, 12);

    const keepPaidStatus = (s: AccessStatus | undefined): boolean =>
      s === "ativo" || s === "vitalicio";

    const nextStatus: AccessStatus =
      existing?.accessStatus && keepPaidStatus(existing.accessStatus)
        ? existing.accessStatus
        : "pendente";

    const row = await ctx.prisma.profile.upsert({
      where: { email },
      create: {
        email,
        displayName: input.displayName.trim(),
        passwordHash: hash,
        whatsapp: input.whatsapp.trim(),
        cpf: input.cpf?.trim().replace(/\D/g, "") || null,
        country: input.country.trim(),
        city: input.city.trim(),
        stateRegion: input.stateRegion.trim(),
        selectedPlanId: input.planId,
        accessStatus: "pendente",
        termsAcceptedAt: new Date(),
        moodleSyncPending: Boolean(process.env.MOODLE_WS_TOKEN?.trim())
      },
      update: {
        displayName: input.displayName.trim(),
        passwordHash: hash,
        whatsapp: input.whatsapp.trim(),
        cpf: input.cpf?.trim().replace(/\D/g, "") || null,
        country: input.country.trim(),
        city: input.city.trim(),
        stateRegion: input.stateRegion.trim(),
        selectedPlanId: input.planId,
        termsAcceptedAt: new Date(),
        accessStatus: nextStatus,
        moodleSyncPending: Boolean(process.env.MOODLE_WS_TOKEN?.trim())
      }
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
