import type { AccessStatus } from "@prisma/client";
import { router, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  fetchCompletionStatus,
  fetchEnrolledCoursesForUser,
  fetchCourseContentsFlat,
  MoodleCourse
} from "@/lib/moodle/ws";
import { matchMoodleModuleForCampusLesson } from "@/lib/moodle/moodleMatchLesson";
import { areas } from "@/data/courses";
import { prisma } from "@/server/db";
import { LEVELS, levelFromXp } from "@/server/gamification";
import { moodleCourseIdForArea } from "@/lib/moodle/courseMap";
import { signedBunnyStreamEmbedUrl } from "@/lib/bunny/signedEmbed";
import { canOpenCampusCoursesWithPulse } from "@/lib/campusAccess";
import { isCampusAdminEmail } from "@/lib/campusAdmin";
import {
  getMergedLiveBroadcast,
  type MergedLiveBroadcast
} from "@/server/campusLiveSettings";
import { areaUsesMoodleLessonSnippet } from "@/content/courses";
import { resolveCampusLessonDbContent } from "@/lib/campus/resolveCampusLessonDbContent";
import { loadStaticLessonForAreaLesson } from "@/lib/lessons/staticLessonLoader";
import { getPublishedQuizWithAnswers } from "@/lib/quiz/playable";
import { loadCampusMapPointReaderPayload } from "@/lib/campus/loadCampusMapPointContent";
import { buildCampusWorldSnapshot } from "@/server/campus/buildCampusWorldSnapshot";
import {
  appendNavigationHistory,
  refreshCampusRecommendedZones
} from "@/server/campus/campusPersistenceHelpers";
import { syncCampusGuidedMissions } from "@/server/campus/campusGuidedMissionsSync";
import {
  CAMPUS_MISSION_CATALOG,
  campusMissionIdsForGuidedEvent
} from "@/lib/campus/campusMissions";
import {
  campusSocialHeartbeat as persistCampusSocialHeartbeat,
  campusSocialPoll as loadCampusSocialPoll,
  campusSocialSendGesture as recordCampusSocialGestureAction,
  campusSocialUpdatePrefs as persistCampusSocialPrefs
} from "@/server/campus/campusSocialPresenceServer";
import { recordCampusAction, syncCampusBadgeUnlocks } from "@/lib/campus/campusXpEngine";
import { getUserProgression } from "@/lib/progression/progression";
import {
  awardSouvenirs,
  awardXp,
  PROGRESSION_SOUVENIR_REASON,
  PROGRESSION_XP_REASON,
} from "@/lib/progression/rewards";
import { applyLessonMarkedBonuses } from "@/lib/progression/lessonProgressBonuses";
import {
  lessonOpenKey,
  parseProgressionClaims,
  tryAwardFirstCompletionOfDaySouvenirs,
  utcDayString,
} from "@/lib/progression/claims";
import { XP_REWARD_COMPLETE_LESSON, XP_REWARD_DAILY_LOGIN, XP_REWARD_STREAK_7_DAY } from "@/lib/progression/xp";
import { SOUVENIR_REWARD_LIVE_EVENT, SOUVENIR_REWARD_OPEN_LESSON } from "@/lib/progression/souvenirs";
import {
  findMicroLessonBlueprintById,
  resolveCampusMapZoneLabel
} from "@/data/campusMicroLessonContext";

const mockCourses: MoodleCourse[] = areas.map((a, i) => ({
  id: 100 + i,
  fullname: a.name,
  shortname: a.id
}));

/** Eventos exibidos no mural/HUD; `mapHighlight` liga borda animada no mapa. */
export type CampusEventPublic = {
  id: string;
  title: string;
  when: string;
  href?: string;
  mapZoneId?: string;
  mapHighlight?: boolean;
};

const CAMPUS_EVENTS_STATIC: CampusEventPublic[] = [
  {
    id: "festival-420",
    title: "Festival 4/20 — Colheita aberta virtual",
    when: "Abril · lives e encontros no campus",
    href: "https://youtube.com/@thcproce",
    mapZoneId: "entrada-principal",
    mapHighlight: true
  },
  {
    id: "colheita-anual",
    title: "Colheita anual THCProce",
    when: "Fim do ano · desafios e ranking",
    href: "/planos",
    mapZoneId: "praca-central",
    mapHighlight: false
  }
];

function areaProgressZero(): { areas: Record<string, boolean> } {
  const map: Record<string, boolean> = {};
  for (const a of areas) map[a.id] = false;
  return { areas: map };
}

function parseLessonMap(raw: unknown): Record<string, number[]> {
  let v: unknown = raw;
  if (typeof v === "string") {
    try {
      v = JSON.parse(v) as unknown;
    } catch {
      return {};
    }
  }
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  const out: Record<string, number[]> = {};
  for (const [k, val] of Object.entries(v)) {
    if (!Array.isArray(val)) continue;
    const nums = val.filter((x): x is number => typeof x === "number" && Number.isInteger(x));
    out[k] = nums.sort((a, b) => a - b);
  }
  return out;
}

function utcDayStartMs(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

async function requireCampusProfile(session: {
  user?: { email?: string | null; name?: string | null } | null;
} | null) {
  const email = session?.user?.email;
  if (!email) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sem sessão válida." });
  }
  const displayName = session?.user?.name?.trim() || "Aluno";
  let p = await prisma.profile.findUnique({ where: { email } });
  if (!p) {
    p = await prisma.profile.create({
      data: { email, displayName, levelKey: "iniciante" },
    });
  }
  return p;
}

export const campusRouter = router({
  health: publicProcedure.query(() => ({ ok: true as const, ts: Date.now() })),

  /**
   * Conteúdo textual do hotspot (`overview.md` + frontmatter) gerado em `src/content/campus/map-points/`.
   */
  mapPointReaderContent: publicProcedure
    .input(z.object({ mapPointId: z.string().min(1).max(140) }))
    .query(({ input }) => loadCampusMapPointReaderPayload(input.mapPointId)),

  /** Live + URL do Cine — só variáveis públicas de ambiente (sem Prisma). */
  liveBroadcast: publicProcedure.query(async (): Promise<MergedLiveBroadcast> => {
    try {
      return await getMergedLiveBroadcast();
    } catch (e) {
      console.warn("[campus] liveBroadcast: fallback", e);
      return await getMergedLiveBroadcast();
    }
  }),

  /** Sem persistência na BD: devolve valores para a UI; produção usa NEXT_PUBLIC_* na Vercel. */
  adminSetLiveBroadcast: protectedProcedure
    .input(
      z.object({
        liveActive: z.boolean(),
        youtubeUrl: z.string().max(2048)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.session?.user?.email;
      if (!email || !isCampusAdminEmail(email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Só administradores." });
      }
      const url = input.youtubeUrl.trim();
      if (url && !/^https?:\/\//i.test(url)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "O link deve começar com http:// ou https://"
        });
      }
      const merged = await getMergedLiveBroadcast();
      const envUrl = merged.youtubeUrl;
      return {
        ...merged,
        liveActive: input.liveActive,
        youtubeUrl: url || envUrl
      } satisfies MergedLiveBroadcast;
    }),

  /** Lista cursos (Moodle se token + userId; senão mock da grade local). */
  courses: publicProcedure.query(async () => {
    const uid = process.env.MOODLE_MOCK_USER_ID;
    if (process.env.MOODLE_WS_TOKEN && uid) {
      const list = await fetchEnrolledCoursesForUser(Number(uid));
      return list.length ? list : mockCourses;
    }
    return mockCourses;
  }),

  /**
   * Resumo (description) + URL do módulo Moodle para uma posição do outline do campus.
   * Só é resolvido para áreas registadas em `areaUsesMoodleLessonSnippet` (Cannabis 101).
   * Requer `core_course_get_contents` no serviço WS + `MOODLE_WS_TOKEN` + id em `MOODLE_COURSE_MAP`.
   */
  moodleLessonSnippet: publicProcedure
    .input(
      z.object({
        areaId: z.string(),
        lessonIndex: z.number().int().min(0),
        lessonTitle: z.string()
      })
    )
    .query(async ({ input }) => {
      const idx = areas.findIndex((a) => a.id === input.areaId);
      if (idx < 0) {
        return { ok: false as const, reason: "unknown_area" as const };
      }
      if (!areaUsesMoodleLessonSnippet(input.areaId)) {
        return { ok: false as const, reason: "not_supported" as const };
      }
      const courseId = moodleCourseIdForArea(input.areaId, idx);
      try {
        const flat = await fetchCourseContentsFlat(courseId);
        if (!flat?.length) {
          return { ok: false as const, reason: "ws_empty" as const, courseId };
        }
        const mod = matchMoodleModuleForCampusLesson(
          flat,
          input.lessonTitle,
          input.lessonIndex
        );
        if (!mod) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[campus] moodleLessonSnippet no_match", {
              lessonTitle: input.lessonTitle,
              lessonIndex: input.lessonIndex,
              flatLength: flat.length
            });
          }
          return { ok: false as const, reason: "no_match" as const, courseId };
        }
        return {
          ok: true as const,
          courseId,
          sectionTitle: mod.sectionTitle.trim(),
          moduleName: mod.moduleName,
          modname: mod.modname,
          summaryText: mod.summaryText,
          moodleUrl: mod.moodleUrl
        };
      } catch (e) {
        console.warn("[campus] moodleLessonSnippet", e);
        return { ok: false as const, reason: "error" as const, courseId };
      }
    }),

  /** Progresso por área (mapa acende) — integração real quando houver user Moodle. */
  areaProgress: publicProcedure
    .input(z.object({ moodleUserId: z.number().optional() }))
    .query(async ({ input }) => {
      try {
        const map: Record<string, boolean> = {};
        for (const a of areas) {
          map[a.id] = false;
        }

        const uid =
          input.moodleUserId ??
          (process.env.MOODLE_MOCK_USER_ID ? Number(process.env.MOODLE_MOCK_USER_ID) : 1);

        if (process.env.MOODLE_WS_TOKEN) {
          try {
            for (let i = 0; i < areas.length; i++) {
              const a = areas[i]!;
              const courseId = moodleCourseIdForArea(a.id, i);
              const s = await fetchCompletionStatus(courseId, uid);
              if (s?.completed) map[a.id] = true;
            }
          } catch (e) {
            console.warn("[campus] areaProgress: Moodle indisponível, progresso zerado", e);
          }
        }

        return { areas: map };
      } catch (e) {
        console.warn("[campus] areaProgress: fallback", e);
        return areaProgressZero();
      }
    }),

  /** Perfil XP / níveis (SQLite local ou cria skeleton). */
  myProgress: protectedProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    if (!session?.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Sem e-mail na sessão." });
    }
    const email = session.user.email;
    const name = session.user.name ?? "Aluno";
    try {
      let p = await prisma.profile.findUnique({ where: { email } });
      if (!p)
        p = await prisma.profile.create({
          data: { email, displayName: name, levelKey: "iniciante" }
        });

      const prog = await getUserProgression(prisma, p.id);
      return {
        xp: prog.xp,
        levelKey: prog.levelKey,
        levelLabel: prog.avatar.label,
        streak: p.streakDays,
        nextLevel: prog.nextAvatarPreview,
        souvenirCredits: prog.souvenirCredits,
        progressToNext: prog.avatar.progressToNext,
        progressPercent: prog.progressPercent,
        avatar: {
          key: prog.avatar.key,
          label: prog.avatar.label,
          imageSrc: prog.avatar.imageSrc,
          minXp: prog.avatar.minXp,
        },
        nextTierLabel: prog.nextAvatarPreview?.label ?? null,
        nextTierMinXp: prog.nextAvatarPreview?.minXp ?? null,
      };
    } catch (e) {
      console.warn("[campus] myProgress: fallback sem BD", e);
      const level = levelFromXp(0);
      const next0 = LEVELS.find((x) => x.minXp > 0) ?? null;
      return {
        xp: 0,
        levelKey: level.key,
        levelLabel: level.label,
        streak: 0,
        nextLevel: next0,
        souvenirCredits: 0,
        progressToNext: 0,
        progressPercent: 0,
        avatar: {
          key: level.key,
          label: level.label,
          imageSrc: "/avatar/iniciante.png",
          minXp: level.minXp,
        },
        nextTierLabel: next0?.label ?? null,
        nextTierMinXp: next0?.minXp ?? null,
      };
    }
  }),

  /** Acesso às salas do mapa (perfil local + flags públicas resolvidas no cliente para anônimos). */
  myCampusAccess: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Sem e-mail na sessão." });
    }
    const email = ctx.session.user.email;
    try {
      const p = await prisma.profile.findUnique({
        where: { email },
        select: { accessStatus: true, createdAt: true }
      });
      const accessStatus = p?.accessStatus ?? "pendente";
      const isCampusAdmin = isCampusAdminEmail(email);
      const mergedLive = await getMergedLiveBroadcast();
      return {
        accessStatus,
        isCampusAdmin,
        memberSinceIso: p?.createdAt ? p.createdAt.toISOString() : null,
        canOpenCourses:
          isCampusAdmin ||
          canOpenCampusCoursesWithPulse(accessStatus, true, mergedLive.liveActive)
      };
    } catch (e) {
      console.warn("[campus] myCampusAccess: fallback sem BD", e);
      const isCampusAdmin = isCampusAdminEmail(email);
      const accessStatus: AccessStatus = "pendente";
      const envLive = process.env.NEXT_PUBLIC_CAMPUS_LIVE_ACTIVE === "true";
      return {
        accessStatus,
        isCampusAdmin,
        memberSinceIso: null,
        canOpenCourses:
          isCampusAdmin ||
          process.env.NEXT_PUBLIC_CAMPUS_PUBLIC_ALL === "true" ||
          canOpenCampusCoursesWithPulse(accessStatus, true, envLive)
      };
    }
  }),

  addXpDemo: protectedProcedure
    .input(z.object({ amount: z.number().min(1).max(500) }))
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;
      if (!session?.user?.email) {
        throw new Error("Sessão sem e-mail");
      }
      const email = session.user.email;
      const name = session.user.name ?? "Aluno";
      const p = await prisma.profile.upsert({
        where: { email },
        create: {
          email,
          displayName: name,
          xpTotal: input.amount
        },
        update: { xpTotal: { increment: input.amount } }
      });
      const level = levelFromXp(p.xpTotal);
      await prisma.profile.update({
        where: { id: p.id },
        data: { levelKey: level.key }
      });
      return { xp: p.xpTotal, level: level.label };
    }),

  chatHistory: publicProcedure
    .input(z.object({ channel: z.string().default("global"), take: z.number().max(100).default(40) }))
    .query(async ({ input }) => {
      try {
        return await prisma.chatMessage.findMany({
          where: { channel: input.channel },
          orderBy: { createdAt: "desc" },
          take: input.take
        });
      } catch (e) {
        console.warn("[campus] chatHistory: indisponível, devolvendo vazio", e);
        return [];
      }
    }),

  chatPost: publicProcedure
    .input(
      z.object({
        channel: z.string(),
        authorName: z.string().min(1).max(64),
        body: z.string().min(1).max(2000)
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Inicia sessão para enviar mensagens no chat."
        });
      }
      try {
        return await prisma.chatMessage.create({
          data: {
            channel: input.channel,
            authorName: input.authorName,
            body: input.body
          }
        });
      } catch (e) {
        console.warn("[campus] chatPost: falha ao gravar", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Chat temporariamente indisponível."
        });
      }
    }),

  leaderboard: publicProcedure
    .input(z.object({ take: z.number().max(50).default(10) }))
    .query(async ({ input }) => {
      try {
        return await prisma.profile.findMany({
          orderBy: { xpTotal: "desc" },
          take: input.take,
          select: { displayName: true, xpTotal: true, levelKey: true }
        });
      } catch (e) {
        console.warn("[campus] leaderboard: indisponível, devolvendo vazio", e);
        return [];
      }
    }),

  campusEvents: publicProcedure.query(() => {
    try {
      return [...CAMPUS_EVENTS_STATIC];
    } catch (e) {
      console.warn("[campus] campusEvents: fallback", e);
      return [];
    }
  }),

  muralFeed: publicProcedure
    .input(z.object({ take: z.number().max(30).default(12) }))
    .query(async ({ input }) => {
      try {
        return await prisma.chatMessage.findMany({
          where: { channel: "mural" },
          orderBy: { createdAt: "desc" },
          take: input.take
        });
      } catch (e) {
        console.warn("[campus] muralFeed: indisponível, devolvendo vazio", e);
        return [];
      }
    }),

  muralPost: publicProcedure
    .input(
      z.object({
        authorName: z.string().min(1).max(64),
        body: z.string().min(1).max(500)
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Inicia sessão para publicar no mural."
        });
      }
      try {
        return await prisma.chatMessage.create({
          data: {
            channel: "mural",
            authorName: input.authorName,
            body: input.body
          }
        });
      } catch (e) {
        console.warn("[campus] muralPost: falha ao gravar", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Mural temporariamente indisponível."
        });
      }
    }),

  myBadges: protectedProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    if (!session?.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Sem e-mail na sessão." });
    }
    const p = await prisma.profile.findUnique({
      where: { email: session.user.email }
    });
    const xp = p?.xpTotal ?? 0;
    const badges: { id: string; label: string }[] = [];
    if (xp >= 150) badges.push({ id: "first", label: "Primeira chama" });
    if (xp >= 600) badges.push({ id: "grow", label: "Grower em ação" });
    if (xp >= 2000) badges.push({ id: "flor", label: "Floração completa" });
    return { badges, streakDays: p?.streakDays ?? 0 };
  }),

  /**
   * Progresso de aulas por área.
   * Leitura dual: UserCourseProgress (relacional, novo) + Profile.lessonProgress (JSON legado).
   * UserCourseProgress tem precedência por slug quando ambos existem; os índices são mesclados.
   */
  lessonProgressMine: protectedProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    if (!session?.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Sem e-mail na sessão." });
    }
    const p = await prisma.profile.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        lessonProgress: true,
        courseProgresses: {
          select: { courseSlug: true, completedLessonIndices: true },
        },
      },
    });

    // Base: JSON legado { [areaId]: number[] }
    const byArea: Record<string, number[]> = parseLessonMap(p?.lessonProgress);

    // Merge com fonte relacional (UserCourseProgress tem precedência por slug)
    for (const row of p?.courseProgresses ?? []) {
      const relational = Array.isArray(row.completedLessonIndices)
        ? (row.completedLessonIndices as unknown[]).filter(
            (x): x is number => typeof x === "number" && Number.isInteger(x),
          )
        : [];
      const legacy = byArea[row.courseSlug] ?? [];
      // União dos dois conjuntos, ordenada — preserva dados que só existem em um dos lados
      byArea[row.courseSlug] = [...new Set([...legacy, ...relational])].sort(
        (a, b) => a - b,
      );
    }

    return { byArea };
  }),

  /**
   * Marca uma aula como vista/concluída.
   * Usa $transaction para evitar race condition quando múltiplas aulas são marcadas
   * simultaneamente (cada uma lia {} e sobrescrevia o resultado da anterior).
   */
  lessonMarkSeen: protectedProcedure
    .input(
      z.object({
        areaId: z.string().min(2).max(64),
        lessonIndex: z.number().int().min(0).max(199)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;
      if (!session?.user?.email) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Sem e-mail na sessão." });
      }
      const email = session.user.email;
      const displayName = session.user.name ?? "Aluno";

      // $transaction com SELECT … FOR UPDATE (serializable) elimina a race condition:
      // leitura e escrita do lessonProgress acontecem atomicamente.
      const { pr, lpMap, wasNew } = await prisma.$transaction(async (tx) => {
        const existing = await tx.profile.findUnique({ where: { email } });
        const lpMap = parseLessonMap(existing?.lessonProgress);
        const arr = [...(lpMap[input.areaId] ?? [])];
        const wasNew = !arr.includes(input.lessonIndex);
        arr.push(input.lessonIndex);
        lpMap[input.areaId] = [...new Set(arr)].sort((a, b) => a - b);
        const pr = await tx.profile.upsert({
          where: { email },
          create: { email, displayName, xpTotal: 0, levelKey: "iniciante", lessonProgress: JSON.stringify(lpMap) },
          update: { lessonProgress: JSON.stringify(lpMap) },
          select: { id: true }
        });
        return { pr, lpMap, wasNew };
      });

      const completedArr = lpMap[input.areaId] ?? [];
      await prisma.userCourseProgress.upsert({
        where: {
          profileId_courseSlug: { profileId: pr.id, courseSlug: input.areaId },
        },
        create: {
          profileId: pr.id,
          courseSlug: input.areaId,
          completedLessonIndices: completedArr,
          lastLessonIndex: input.lessonIndex,
        },
        update: {
          completedLessonIndices: completedArr,
          lastLessonIndex: input.lessonIndex,
          // lastAccessAt é @updatedAt — atualizado automaticamente pelo Prisma
          // completedAt: preenchido externamente quando 100 % confirmado
        },
      });

      if (wasNew) {
        await awardXp(prisma, pr.id, XP_REWARD_COMPLETE_LESSON, PROGRESSION_XP_REASON.COMPLETE_LESSON, {
          areaId: input.areaId,
          lessonIndex: input.lessonIndex
        });
        await applyLessonMarkedBonuses(prisma, pr.id, {
          areaId: input.areaId,
          lessonIndex: input.lessonIndex
        });
      }

      return { done: lpMap[input.areaId]!, awardedXp: wasNew ? XP_REWARD_COMPLETE_LESSON : 0 };
    }),

  /**
   * Sincronização em lote localStorage→DB.
   * Chamada uma vez quando o usuário loga: passa TODOS os índices de uma área
   * que estão no localStorage mas não no DB. Operação atômica via $transaction.
   */
  lessonProgressSync: protectedProcedure
    .input(
      z.object({
        areaId: z.string().min(2).max(64),
        indices: z.array(z.number().int().min(0).max(199)).min(1).max(200),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;
      if (!session?.user?.email) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Sem e-mail na sessão." });
      }
      const email = session.user.email;
      const displayName = session.user.name ?? "Aluno";

      const { pr, merged, newCount } = await prisma.$transaction(async (tx) => {
        const existing = await tx.profile.findUnique({ where: { email } });
        const lpMap = parseLessonMap(existing?.lessonProgress);
        const current = lpMap[input.areaId] ?? [];
        const merged = [...new Set([...current, ...input.indices])].sort((a, b) => a - b);
        const newCount = merged.length - current.length;
        lpMap[input.areaId] = merged;
        const pr = await tx.profile.upsert({
          where: { email },
          create: { email, displayName, xpTotal: 0, levelKey: "iniciante", lessonProgress: JSON.stringify(lpMap) },
          update: { lessonProgress: JSON.stringify(lpMap) },
          select: { id: true }
        });
        return { pr, merged, newCount };
      });

      await prisma.userCourseProgress.upsert({
        where: { profileId_courseSlug: { profileId: pr.id, courseSlug: input.areaId } },
        create: { profileId: pr.id, courseSlug: input.areaId, completedLessonIndices: merged, lastLessonIndex: merged[merged.length - 1] ?? null },
        update: { completedLessonIndices: merged, lastLessonIndex: merged[merged.length - 1] ?? null },
      });

      console.info("[lessonProgressSync]", { email: email.replace(/@.*/, "@***"), areaId: input.areaId, total: merged.length, new: newCount });
      return { synced: merged.length, newCount };
    }),

  /** Primeira abertura de uma aula (painel) — créditos souvenir; idempotente por (área, índice). */
  lessonFirstOpen: protectedProcedure
    .input(
      z.object({
        areaId: z.string().min(2).max(64),
        lessonIndex: z.number().int().min(0).max(199),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const p = await requireCampusProfile(ctx.session);
      const row = await prisma.profile.findUnique({
        where: { id: p.id },
        select: { progressionClaims: true },
      });
      let c = parseProgressionClaims(row?.progressionClaims);
      const key = lessonOpenKey(input.areaId, input.lessonIndex);
      if (c.lessonOpenSouvenirKeys?.[key]) {
        return { ok: true as const, awarded: 0 as const };
      }
      await awardSouvenirs(prisma, p.id, SOUVENIR_REWARD_OPEN_LESSON, PROGRESSION_SOUVENIR_REASON.OPEN_LESSON, {
        areaId: input.areaId,
        lessonIndex: input.lessonIndex,
      });
      c = {
        ...c,
        lessonOpenSouvenirKeys: { ...c.lessonOpenSouvenirKeys, [key]: true },
      };
      await prisma.profile.update({
        where: { id: p.id },
        data: { progressionClaims: c as object },
      });
      return { ok: true as const, awarded: SOUVENIR_REWARD_OPEN_LESSON };
    }),

  /** Estado persistente do mapa + microaulas (Fase A). */
  campusWorldSnapshot: protectedProcedure.query(async ({ ctx }) => {
    const p = await requireCampusProfile(ctx.session);
    const level = levelFromXp(p.xpTotal);
    return buildCampusWorldSnapshot(prisma, p.id, p.xpTotal, level.key, level.label);
  }),

  campusPersistenceSummary: protectedProcedure.query(async ({ ctx }) => {
    const p = await requireCampusProfile(ctx.session);
    const [zonesCount, microCompleted, badges, zoneRows] = await Promise.all([
      prisma.userZoneDiscovery.count({ where: { profileId: p.id } }),
      prisma.userMicroLessonProgress.count({
        where: { profileId: p.id, completedAt: { not: null } }
      }),
      prisma.userBadge.findMany({
        where: { profileId: p.id },
        orderBy: { unlockedAt: "desc" }
      }),
      prisma.userZoneDiscovery.findMany({
        where: { profileId: p.id },
        orderBy: { visitCount: "desc" },
        take: 8,
        select: { zoneLabel: true, visitCount: true }
      })
    ]);
    const level = levelFromXp(p.xpTotal);
    return {
      xpTotal: p.xpTotal,
      levelKey: level.key,
      levelLabel: level.label,
      zonesDiscovered: zonesCount,
      microLessonsCompleted: microCompleted,
      badges: badges.map((b) => ({
        badgeCode: b.badgeCode,
        unlockedAt: b.unlockedAt.toISOString()
      })),
      topZones: zoneRows
    };
  }),

  /** Orientação no campus — catálogo em `src/lib/campus/campusMissions.ts`. */
  campusGuidedMissions: protectedProcedure.query(async ({ ctx }) => {
    const p = await requireCampusProfile(ctx.session);
    await syncCampusGuidedMissions(prisma, p.id);
    const rows = await prisma.campusMissionProgress.findMany({
      where: { profileId: p.id },
      select: {
        missionId: true,
        progressCurrent: true,
        completedAt: true,
        rewardClaimedAt: true
      }
    });
    const byId = new Map(rows.map((r) => [r.missionId, r]));
    return {
      missions: CAMPUS_MISSION_CATALOG.map((def) => {
        const row = byId.get(def.id);
        const progressCurrent = row?.progressCurrent ?? 0;
        const done =
          !!row?.completedAt && progressCurrent >= def.targetValue;
        return {
          id: def.id,
          title: def.title,
          description: def.description,
          objectiveType: def.objectiveType,
          targetValue: def.targetValue,
          xpReward: def.xpReward,
          badgeId: def.badgeId ?? null,
          suggestedZoneLabel: def.suggestedZoneLabel ?? null,
          progressCurrent,
          completedAt: row?.completedAt?.toISOString() ?? null,
          rewardClaimedAt: row?.rewardClaimedAt?.toISOString() ?? null,
          done
        };
      })
    };
  }),

  campusGuidedMissionEvent: protectedProcedure
    .input(z.object({ event: z.enum(["OPEN_PROFILE", "OPEN_CINEMA"]) }))
    .mutation(async ({ ctx, input }) => {
      const p = await requireCampusProfile(ctx.session);

      if (input.event === "OPEN_CINEMA") {
        const row = await prisma.profile.findUnique({
          where: { id: p.id },
          select: { progressionClaims: true },
        });
        let c = parseProgressionClaims(row?.progressionClaims);
        const d = utcDayString();
        if (c.liveEventSouvenirDayUtc !== d) {
          await awardSouvenirs(prisma, p.id, SOUVENIR_REWARD_LIVE_EVENT, PROGRESSION_SOUVENIR_REASON.LIVE_EVENT, {
            dayUtc: d,
          });
          c = { ...c, liveEventSouvenirDayUtc: d };
          await prisma.profile.update({
            where: { id: p.id },
            data: { progressionClaims: c as object },
          });
        }
      }

      const ids = campusMissionIdsForGuidedEvent(input.event);
      for (const missionId of ids) {
        const existing = await prisma.campusMissionProgress.findUnique({
          where: { profileId_missionId: { profileId: p.id, missionId } }
        });
        const next = Math.max(existing?.progressCurrent ?? 0, 1);
        await prisma.campusMissionProgress.upsert({
          where: { profileId_missionId: { profileId: p.id, missionId } },
          create: {
            profileId: p.id,
            missionId,
            progressCurrent: next,
            completedAt: null,
            rewardClaimedAt: null
          },
          update: {
            progressCurrent: next
          }
        });
      }
      await syncCampusGuidedMissions(prisma, p.id);
      return { ok: true as const };
    }),

  /** Presença social leve — estado consolidado para polling (~15–30s no cliente). */
  campusSocialPoll: protectedProcedure.query(async ({ ctx }) => {
    const p = await requireCampusProfile(ctx.session);
    return loadCampusSocialPoll({ profileId: p.id });
  }),

  campusSocialHeartbeat: protectedProcedure
    .input(
      z.object({
        currentZoneLabel: z.string().min(2).max(64).nullable().optional(),
        statusLight: z.enum(["exploring", "studying", "cinema", "rest"]).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const p = await requireCampusProfile(ctx.session);
      const name = ctx.session?.user?.name?.trim() ?? null;
      const img =
        typeof ctx.session?.user?.image === "string" ? ctx.session.user.image : null;
      return persistCampusSocialHeartbeat({
        profileId: p.id,
        sessionDisplayName: name,
        sessionImage: img,
        currentZoneLabel: input.currentZoneLabel ?? undefined,
        statusLightOverride: input.statusLight
      });
    }),

  campusSocialUpdatePrefs: protectedProcedure
    .input(
      z.object({
        visibility: z.enum(["name", "anonymous", "hidden"]).optional(),
        statusLight: z.enum(["exploring", "studying", "cinema", "rest"]).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const p = await requireCampusProfile(ctx.session);
      await persistCampusSocialPrefs({
        profileId: p.id,
        visibility: input.visibility,
        statusLight: input.statusLight
      });
      return { ok: true as const };
    }),

  campusSocialSendGesture: protectedProcedure
    .input(
      z.object({
        targetPeerToken: z.string().min(8).max(96),
        kind: z.enum(["wave", "salve", "emoji"]),
        emoji: z.string().max(8).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const p = await requireCampusProfile(ctx.session);
      try {
        await recordCampusSocialGestureAction({
          fromProfileId: p.id,
          targetPeerToken: input.targetPeerToken,
          kind: input.kind,
          emoji: input.emoji
        });
        return { ok: true as const };
      } catch (e) {
        const code = e instanceof Error ? e.message : "";
        if (code === "RATE_LIMIT_GESTURES") {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Vá devagar com as interações."
          });
        }
        if (code === "TARGET_UNAVAILABLE") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Este colega já não está disponível."
          });
        }
        if (code === "SELF_TARGET") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Não é possível interagir consigo mesmo."
          });
        }
        if (code === "BAD_EMOJI") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Emoji não permitido nesta interação."
          });
        }
        throw e;
      }
    }),

  campusMapMemory: protectedProcedure
    .input(
      z.object({
        lastZoneLabel: z.string().max(64).optional(),
        lastLegacyHitId: z.string().max(140).optional().nullable(),
        lastBuildingCourseId: z.string().max(64).optional().nullable(),
        lastMicroLessonBlueprintId: z.string().max(120).optional().nullable(),
        lastPanelKind: z.enum(["course", "hotspot", "lesson"]).optional().nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const p = await requireCampusProfile(ctx.session);
      await prisma.userCampusProgress.upsert({
        where: { profileId: p.id },
        create: {
          profileId: p.id,
          lastZoneLabel: input.lastZoneLabel ?? null,
          lastLegacyHitId: input.lastLegacyHitId ?? null,
          lastBuildingCourseId: input.lastBuildingCourseId ?? null,
          lastMicroLessonBlueprintId: input.lastMicroLessonBlueprintId ?? null,
          lastPanelKind: input.lastPanelKind ?? null
        },
        update: {
          ...(input.lastZoneLabel !== undefined ? { lastZoneLabel: input.lastZoneLabel } : {}),
          ...(input.lastLegacyHitId !== undefined ? { lastLegacyHitId: input.lastLegacyHitId } : {}),
          ...(input.lastBuildingCourseId !== undefined
            ? { lastBuildingCourseId: input.lastBuildingCourseId }
            : {}),
          ...(input.lastMicroLessonBlueprintId !== undefined
            ? { lastMicroLessonBlueprintId: input.lastMicroLessonBlueprintId }
            : {}),
          ...(input.lastPanelKind !== undefined ? { lastPanelKind: input.lastPanelKind } : {})
        }
      });
      return { ok: true as const };
    }),

  campusTouchZone: protectedProcedure
    .input(
      z.object({
        zoneLabel: z.string().min(2).max(64),
        legacyHitId: z.string().max(140).optional().nullable(),
        courseAreaId: z.string().max(64).optional().nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const p = await requireCampusProfile(ctx.session);
      const existing = await prisma.userZoneDiscovery.findUnique({
        where: {
          profileId_zoneLabel: { profileId: p.id, zoneLabel: input.zoneLabel }
        }
      });
      const first = !existing;

      await prisma.userZoneDiscovery.upsert({
        where: {
          profileId_zoneLabel: { profileId: p.id, zoneLabel: input.zoneLabel }
        },
        create: {
          profileId: p.id,
          zoneLabel: input.zoneLabel,
          visitCount: 1,
          status: "discovered"
        },
        update: {
          visitCount: { increment: 1 },
          lastSeenAt: new Date(),
          status: "discovered"
        }
      });

      const prog = await prisma.userCampusProgress.findUnique({
        where: { profileId: p.id }
      });
      const nav = appendNavigationHistory(prog?.navigationHistory, {
        at: new Date().toISOString(),
        zoneLabel: input.zoneLabel,
        hitId: input.legacyHitId ?? null
      });

      await prisma.userCampusProgress.upsert({
        where: { profileId: p.id },
        create: {
          profileId: p.id,
          lastZoneLabel: input.zoneLabel,
          lastLegacyHitId: input.legacyHitId ?? null,
          lastBuildingCourseId: input.courseAreaId ?? null,
          navigationHistory: nav
        },
        update: {
          lastZoneLabel: input.zoneLabel,
          ...(input.legacyHitId !== undefined ? { lastLegacyHitId: input.legacyHitId } : {}),
          ...(input.courseAreaId !== undefined ? { lastBuildingCourseId: input.courseAreaId } : {}),
          navigationHistory: nav
        }
      });

      if (first) {
        await recordCampusAction(prisma, p.id, "VISIT_ZONE_FIRST");
      } else {
        await recordCampusAction(prisma, p.id, "VISIT_ZONE_REPEAT");
      }

      await refreshCampusRecommendedZones(prisma, p.id);
      await syncCampusGuidedMissions(prisma, p.id);

      return { ok: true as const };
    }),

  campusMicroLessonStart: protectedProcedure
    .input(
      z.object({
        blueprintId: z.string().min(2).max(140),
        legacyHitId: z.string().max(140).optional().nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const p = await requireCampusProfile(ctx.session);
      const found = findMicroLessonBlueprintById(input.blueprintId);
      if (!found) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Microaula desconhecida."
        });
      }
      const zoneLabel = found.zone;
      const existing = await prisma.userMicroLessonProgress.findUnique({
        where: {
          profileId_blueprintId: { profileId: p.id, blueprintId: input.blueprintId }
        }
      });
      const firstOpen = !existing?.startedAt;

      await prisma.userMicroLessonProgress.upsert({
        where: {
          profileId_blueprintId: { profileId: p.id, blueprintId: input.blueprintId }
        },
        create: {
          profileId: p.id,
          blueprintId: input.blueprintId,
          zoneLabel,
          legacyHitId: input.legacyHitId ?? null,
          startedAt: new Date()
        },
        update: {
          startedAt: existing?.startedAt ?? new Date(),
          ...(input.legacyHitId !== undefined ? { legacyHitId: input.legacyHitId } : {}),
          zoneLabel
        }
      });

      if (firstOpen) {
        await recordCampusAction(prisma, p.id, "OPEN_MICRO_LESSON", {
          meta: { blueprintId: input.blueprintId }
        });
      }

      await prisma.userCampusProgress.upsert({
        where: { profileId: p.id },
        create: {
          profileId: p.id,
          lastMicroLessonBlueprintId: input.blueprintId,
          lastZoneLabel: zoneLabel,
          lastLegacyHitId: input.legacyHitId ?? null,
          lastPanelKind: "lesson"
        },
        update: {
          lastMicroLessonBlueprintId: input.blueprintId,
          lastZoneLabel: zoneLabel,
          ...(input.legacyHitId !== undefined ? { lastLegacyHitId: input.legacyHitId } : {}),
          lastPanelKind: "lesson"
        }
      });

      await refreshCampusRecommendedZones(prisma, p.id);
      await syncCampusGuidedMissions(prisma, p.id);
      return { ok: true as const, zoneLabel };
    }),

  campusMicroLessonPulse: protectedProcedure
    .input(
      z.object({
        blueprintId: z.string().min(2).max(140),
        deltaSeconds: z.number().int().min(1).max(180)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const p = await requireCampusProfile(ctx.session);
      await prisma.userMicroLessonProgress.updateMany({
        where: { profileId: p.id, blueprintId: input.blueprintId },
        data: { secondsEngaged: { increment: input.deltaSeconds } }
      });
      return { ok: true as const };
    }),

  campusMicroLessonComplete: protectedProcedure
    .input(z.object({ blueprintId: z.string().min(2).max(140) }))
    .mutation(async ({ ctx, input }) => {
      const p = await requireCampusProfile(ctx.session);
      const row = await prisma.userMicroLessonProgress.findUnique({
        where: {
          profileId_blueprintId: { profileId: p.id, blueprintId: input.blueprintId }
        }
      });
      if (row?.completedAt) {
        return { ok: true as const, xpAwarded: 0, alreadyDone: true as const };
      }

      const found = findMicroLessonBlueprintById(input.blueprintId);
      const zoneLabel = found?.zone ?? row?.zoneLabel ?? "fundamentos";

      await prisma.userMicroLessonProgress.upsert({
        where: {
          profileId_blueprintId: { profileId: p.id, blueprintId: input.blueprintId }
        },
        create: {
          profileId: p.id,
          blueprintId: input.blueprintId,
          zoneLabel,
          startedAt: new Date(),
          completedAt: new Date(),
          xpEarned: XP_REWARD_COMPLETE_LESSON
        },
        update: {
          completedAt: new Date(),
          xpEarned: XP_REWARD_COMPLETE_LESSON,
          zoneLabel
        }
      });

      await recordCampusAction(prisma, p.id, "COMPLETE_MICRO_LESSON", {
        meta: { blueprintId: input.blueprintId }
      });

      await tryAwardFirstCompletionOfDaySouvenirs(prisma, p.id);

      await refreshCampusRecommendedZones(prisma, p.id);
      await syncCampusGuidedMissions(prisma, p.id);
      return { ok: true as const, xpAwarded: XP_REWARD_COMPLETE_LESSON, alreadyDone: false as const };
    }),

  campusCoursePanelOpened: protectedProcedure
    .input(
      z.object({
        courseAreaId: z.string().min(2).max(64),
        legacyHitId: z.string().max(140).optional().nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const p = await requireCampusProfile(ctx.session);
      await recordCampusAction(prisma, p.id, "OPEN_COURSE_PANEL", {
        meta: { courseAreaId: input.courseAreaId }
      });
      const zoneLabel = resolveCampusMapZoneLabel({
        legacyHitId: input.legacyHitId ?? undefined,
        courseId: input.courseAreaId
      });

      await prisma.userZoneDiscovery.upsert({
        where: {
          profileId_zoneLabel: { profileId: p.id, zoneLabel }
        },
        create: {
          profileId: p.id,
          zoneLabel,
          visitCount: 1,
          status: "discovered"
        },
        update: {
          lastSeenAt: new Date()
        }
      });

      const prog = await prisma.userCampusProgress.findUnique({
        where: { profileId: p.id }
      });
      const nav = appendNavigationHistory(prog?.navigationHistory, {
        at: new Date().toISOString(),
        zoneLabel,
        hitId: input.legacyHitId ?? null
      });

      await prisma.userCampusProgress.upsert({
        where: { profileId: p.id },
        create: {
          profileId: p.id,
          lastZoneLabel: zoneLabel,
          lastLegacyHitId: input.legacyHitId ?? null,
          lastBuildingCourseId: input.courseAreaId,
          lastPanelKind: "course",
          navigationHistory: nav
        },
        update: {
          lastZoneLabel: zoneLabel,
          lastLegacyHitId: input.legacyHitId ?? undefined,
          lastBuildingCourseId: input.courseAreaId,
          lastPanelKind: "course",
          navigationHistory: nav
        }
      });

      await refreshCampusRecommendedZones(prisma, p.id);
      await syncCampusGuidedMissions(prisma, p.id);
      return { ok: true as const, zoneLabel };
    }),

  quizForPlay: publicProcedure
    .input(z.object({ quizId: z.string().min(1) }))
    .query(async ({ input }) => {
      const quiz = await getPublishedQuizWithAnswers(input.quizId);
      if (!quiz?.questions.length) return null;
      for (const q of quiz.questions) {
        if (q.type !== "SINGLE_CHOICE" && q.type !== "TRUE_FALSE") return null;
      }
      return {
        id: quiz.id,
        title: quiz.title,
        passingPercent: quiz.passingPercent,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          prompt: q.prompt,
          type: q.type,
          sortOrder: q.sortOrder,
          options: [...q.options]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((o) => ({
              id: o.id,
              label: o.label,
              sortOrder: o.sortOrder,
            })),
        })),
      };
    }),

  streamFlags: publicProcedure.query(() => ({
    bunnySigningEnabled: Boolean(process.env.BUNNY_STREAM_TOKEN_AUTH_KEY?.trim())
  })),

  /**
   * Aula publicada no CMS (Prisma) para o slot área + índice, quando configurada em
   * `CAMPUS_DB_LESSONS` e válida. Caso contrário devolve `null` — a UI usa conteúdo legado.
   */
  lessonFromDb: publicProcedure
    .input(
      z.object({
        areaId: z.string().min(1),
        lessonIndex: z.number().int().min(0),
      }),
    )
    .query(async ({ input }) => {
      const r = await resolveCampusLessonDbContent(input.areaId, input.lessonIndex);
      if (r.mode !== "db") return null;
      return {
        title: r.lesson.title,
        courseSlug: r.lesson.module.course.slug,
        moduleSlug: r.lesson.module.slug,
        lessonSlug: r.lesson.slug,
        blocks: r.lesson.blocks.map((b) => ({
          id: b.id,
          type: b.type,
          sortOrder: b.sortOrder,
          data: b.data as unknown,
        })),
      };
    }),

  /**
   * Leitura estática em `content/courses/<areaId>/lessons/<lessonId>.md` (sem Prisma/Moodle).
   * Hoje suportado para `cannabis-101`; outras áreas devolvem `found: false`.
   */
  staticLessonMarkdown: publicProcedure
    .input(
      z.object({
        areaId: z.string().min(1),
        lessonIndex: z.number().int().min(0),
      }),
    )
    .query(({ input }) => loadStaticLessonForAreaLesson(input.areaId, input.lessonIndex)),

  /** Iframe Bunny assinada (só com token de visualização ativo na biblioteca). */
  bunnyEmbedUrl: protectedProcedure
    .input(z.object({ videoId: z.string().min(4).max(120) }))
    .query(({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Sem sessão." });
      }
      const secret = process.env.BUNNY_STREAM_TOKEN_AUTH_KEY?.trim();
      const lib =
        process.env.BUNNY_STREAM_LIBRARY_ID?.trim() ??
        process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID?.trim() ??
        "";
      if (!secret || !lib) {
        return { url: null as string | null };
      }
      return {
        url: signedBunnyStreamEmbedUrl(lib, input.videoId, secret, 7200)
      };
    }),

  tickStreak: protectedProcedure.mutation(async ({ ctx }) => {
    const session = ctx.session;
    if (!session?.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Sem e-mail na sessão." });
    }
    const email = session.user.email;
    const displayName = session.user.name ?? "Aluno";

    const existing = await prisma.profile.findUnique({
      where: { email },
      select: { streakDays: true, lastActive: true, progressionClaims: true },
    });

    const todayStart = utcDayStartMs(new Date());
    const lastStart = existing?.lastActive ? utcDayStartMs(existing.lastActive) : null;
    if (lastStart === todayStart && existing) {
      return { streakDays: existing.streakDays };
    }

    let nextStreak = 1;
    if (existing && lastStart !== null) {
      const yesterdayStart = todayStart - 86_400_000;
      if (lastStart === yesterdayStart) {
        nextStreak = existing.streakDays + 1;
      }
    }

    const p = await prisma.profile.upsert({
      where: { email },
      create: { email, displayName, streakDays: 1, lastActive: new Date() },
      update: {
        streakDays: nextStreak,
        lastActive: new Date(),
      },
      select: { id: true, streakDays: true, progressionClaims: true },
    });

    let claims = parseProgressionClaims(p.progressionClaims);
    const dayStr = utcDayString();

    if (claims.lastDailyLoginXpDayUtc !== dayStr) {
      await awardXp(prisma, p.id, XP_REWARD_DAILY_LOGIN, PROGRESSION_XP_REASON.DAILY_LOGIN, {
        dayUtc: dayStr,
      });
      claims = { ...claims, lastDailyLoginXpDayUtc: dayStr };
    }

    if (p.streakDays > 0 && p.streakDays % 7 === 0) {
      await awardXp(prisma, p.id, XP_REWARD_STREAK_7_DAY, PROGRESSION_XP_REASON.STREAK_7_DAY, {
        streakDays: p.streakDays,
      });
    }

    await prisma.profile.update({
      where: { email },
      data: { progressionClaims: claims as object },
    });

    return { streakDays: p.streakDays };
  }),

  /**
   * URL do áudio narrado de uma aula.
   * Retorna `null` quando ainda não foi gerado (script `generate-lesson-audio.mts`).
   * staleTime alto no cliente — a URL não muda após gerada.
   */
  lessonAudioUrl: publicProcedure
    .input(
      z.object({
        courseId: z.string().min(1).max(64),
        lessonId: z.string().min(1).max(160),
      }),
    )
    .query(async ({ input }) => {
      try {
        const row = await prisma.lessonAudio.findUnique({
          where: {
            courseId_lessonId: {
              courseId: input.courseId,
              lessonId: input.lessonId,
            },
          },
          select: { audioUrl: true, durationSec: true },
        });
        return {
          url: row?.audioUrl ?? null,
          durationSec: row?.durationSec ?? null,
        };
      } catch {
        return { url: null, durationSec: null };
      }
    }),
});

export type CampusRouter = typeof campusRouter;
