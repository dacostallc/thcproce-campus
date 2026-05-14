/* eslint-disable */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  // 1. Todos os perfis — sem redactar o email
  const profiles = await db.profile.findMany({
    select: {
      id: true,
      email: true,
      displayName: true,
      lessonProgress: true,
      xpTotal: true,
      levelKey: true,
      accessStatus: true,
      moodleUserId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  console.log(`\n=== TODOS OS PERFIS (${profiles.length}) ===`);
  for (const p of profiles) {
    let lp = {};
    try { lp = JSON.parse(p.lessonProgress || "{}"); } catch {}
    const rawField = p.lessonProgress;
    const markedCount = Object.values(lp).flat().length;
    console.log(`\n  ID      : ${p.id}`);
    console.log(`  email   : ${p.email ?? "(null)"}`);
    console.log(`  nome    : ${p.displayName ?? "(null)"}`);
    console.log(`  XP/level: ${p.xpTotal} XP  ${p.levelKey}`);
    console.log(`  status  : ${p.accessStatus}  moodle: ${p.moodleUserId ?? "—"}`);
    console.log(`  criado  : ${p.createdAt.toISOString()}`);
    console.log(`  update  : ${p.updatedAt.toISOString()}`);
    console.log(`  lessonProgress raw: ${rawField?.slice(0, 200) ?? "(null)"}`);
    console.log(`  aulas marcadas: ${markedCount}`);
    if (markedCount > 0) {
      Object.entries(lp).forEach(([area, idxs]) => {
        console.log(`    ${area} -> [${idxs}]`);
      });
    }
  }

  // 2. UserCourseProgress
  const ucp = await db.userCourseProgress.findMany({
    orderBy: { lastAccessAt: "desc" },
  });
  console.log(`\n=== USER_COURSE_PROGRESS (${ucp.length} linha(s)) ===`);
  for (const r of ucp) {
    console.log(`  profileId   : ${r.profileId}`);
    console.log(`  courseSlug  : ${r.courseSlug}`);
    console.log(`  completados : ${JSON.stringify(r.completedLessonIndices)}`);
    console.log(`  lastLesson  : ${r.lastLessonIndex ?? "—"}`);
    console.log(`  lastAccess  : ${r.lastAccessAt.toISOString()}`);
    console.log("  ---");
  }

  // 3. RewardLogs (últimas 20 linhas de XP — para rastrear quando o progresso existiu)
  const logs = await db.profileRewardLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { profileId: true, type: true, source: true, xpAmount: true, createdAt: true },
  });
  console.log(`\n=== REWARD LOGS (últimas ${logs.length} entradas) ===`);
  for (const l of logs) {
    console.log(`  ${l.createdAt.toISOString()}  profile:${l.profileId.slice(0,10)}...  ${l.type}  source:${l.source ?? "-"}  +${l.xpAmount}xp`);
  }
}

main()
  .catch((e) => { console.error("ERRO:", e.message); })
  .finally(() => db.$disconnect());
