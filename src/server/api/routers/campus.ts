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
import { getPublishedQuizWithAnswers } from "@/lib/quiz/playable";
import { loadCampusMapPointReaderPayload } from "@/lib/campus/loadCampusMapPointContent";

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

/** Suaviza títulos vindos do LMS só para exposição ao aluno — mantém etiquetas internas tipo Secção N no ingest. */
function softenPublicSectionHeading(raw: string): string {
  const s = raw.trim();
  const stripNum = s.match(/^Sec(c|ç)[aã]o\s*(\d+)\s*[.:)\-–—]\s*(.+)$/iu);
  if (stripNum?.[3]?.trim()) return stripNum[3].trim();

  const onlySecPt = s.match(/^Sec(c|ç)[aã]o\s*(\d+)\s*$/iu);
  if (onlySecPt?.[2] !== undefined && onlySecPt[2] !== "")
    return `Parte ${Number(onlySecPt[2]) + 1}`;

  const stripEn = s.match(/^Section\s*\d+\s*[.:)\-–—]\s*(.+)$/iu);
  if (stripEn?.[1]?.trim()) return stripEn[1].trim();
  const onlySectionEn = s.match(/^Section\s*(\d+)\s*$/iu);
  if (onlySectionEn?.[1] !== undefined && onlySectionEn[1] !== "")
    return `Parte ${Number(onlySectionEn[1]) + 1}`;

  if (/^sec(c|ç)[aã]o$/iu.test(s) || /^section$/iu.test(s)) return "Panorama inicial";

  return s.replace(/\bGeneral\b/i, "Abertura").replace(/^Topics?\s+/iu, "Bloco ").trim();
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
          sectionTitle: softenPublicSectionHeading(mod.sectionTitle),
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
          data: { email, displayName: name }
        });

      const level = levelFromXp(p.xpTotal);
      return {
        xp: p.xpTotal,
        levelKey: p.levelKey,
        levelLabel: level.label,
        streak: p.streakDays,
        nextLevel: LEVELS.find((x) => x.minXp > p.xpTotal) ?? null
      };
    } catch (e) {
      console.warn("[campus] myProgress: fallback sem BD", e);
      const level = levelFromXp(0);
      return {
        xp: 0,
        levelKey: level.key,
        levelLabel: level.label,
        streak: 0,
        nextLevel: LEVELS.find((x) => x.minXp > 0) ?? null
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
      return prisma.chatMessage.findMany({
        where: { channel: input.channel },
        orderBy: { createdAt: "desc" },
        take: input.take
      });
    }),

  chatPost: publicProcedure
    .input(
      z.object({
        channel: z.string(),
        authorName: z.string().min(1).max(64),
        body: z.string().min(1).max(2000)
      })
    )
    .mutation(async ({ input }) => {
      return prisma.chatMessage.create({
        data: {
          channel: input.channel,
          authorName: input.authorName,
          body: input.body
        }
      });
    }),

  leaderboard: publicProcedure
    .input(z.object({ take: z.number().max(50).default(10) }))
    .query(async ({ input }) => {
      return prisma.profile.findMany({
        orderBy: { xpTotal: "desc" },
        take: input.take,
        select: { displayName: true, xpTotal: true, levelKey: true }
      });
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
    .query(async ({ input }) =>
      prisma.chatMessage.findMany({
        where: { channel: "mural" },
        orderBy: { createdAt: "desc" },
        take: input.take
      })
    ),

  muralPost: publicProcedure
    .input(
      z.object({
        authorName: z.string().min(1).max(64),
        body: z.string().min(1).max(500)
      })
    )
    .mutation(async ({ input }) =>
      prisma.chatMessage.create({
        data: {
          channel: "mural",
          authorName: input.authorName,
          body: input.body
        }
      })
    ),

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

  lessonProgressMine: protectedProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    if (!session?.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Sem e-mail na sessão." });
    }
    const p = await prisma.profile.findUnique({
      where: { email: session.user.email },
      select: { lessonProgress: true }
    });
    return { byArea: parseLessonMap(p?.lessonProgress) };
  }),

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

      const existing = await prisma.profile.findUnique({ where: { email } });
      const lpMap = parseLessonMap(existing?.lessonProgress);

      const arr = [...(lpMap[input.areaId] ?? [])];
      const wasNew = !arr.includes(input.lessonIndex);
      arr.push(input.lessonIndex);
      lpMap[input.areaId] = [...new Set(arr)].sort((a, b) => a - b);

      const oldXp = existing?.xpTotal ?? 0;
      const newLevel = wasNew ? levelFromXp(oldXp + 8) : levelFromXp(oldXp);

      await prisma.profile.upsert({
        where: { email },
        create: {
          email,
          displayName,
          xpTotal: wasNew ? 8 : 0,
          levelKey: wasNew ? newLevel.key : "semente",
          lessonProgress: JSON.stringify(lpMap)
        },
        update: {
          lessonProgress: JSON.stringify(lpMap),
          ...(wasNew
            ? {
                xpTotal: { increment: 8 },
                levelKey: newLevel.key
              }
            : {})
        }
      });

      return { done: lpMap[input.areaId]!, awardedXp: wasNew ? 8 : 0 };
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
    const p = await prisma.profile.upsert({
      where: { email },
      create: { email, displayName, streakDays: 1 },
      update: {
        streakDays: { increment: 1 },
        lastActive: new Date()
      }
    });
    return { streakDays: p.streakDays };
  })
});

export type CampusRouter = typeof campusRouter;
