/**
 * Migra URLs de áudio local do padrão antigo /audio/lessons/...
 * para /api/audio/... que suporta Range Requests (HTTP 206).
 *
 * Uso: node scripts/migrate-audio-urls.cjs
 */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const records = await db.lessonAudio.findMany({
    where: { audioUrl: { startsWith: "/audio/lessons/" } },
  });

  if (records.length === 0) {
    console.log("Nenhuma URL antiga encontrada. Nada a migrar.");
    return;
  }

  console.log(`Migrando ${records.length} registro(s)...`);

  for (const r of records) {
    const newUrl = r.audioUrl.replace("/audio/lessons/", "/api/audio/");
    await db.lessonAudio.update({
      where: { courseId_lessonId: { courseId: r.courseId, lessonId: r.lessonId } },
      data: { audioUrl: newUrl },
    });
    console.log(`  ✓ ${r.courseId}/${r.lessonId}: ${r.audioUrl} → ${newUrl}`);
  }

  console.log("Migração concluída.");
}

main()
  .catch(e => { console.error("ERRO:", e.message); process.exit(1); })
  .finally(() => db.$disconnect());
