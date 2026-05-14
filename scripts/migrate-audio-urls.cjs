/**
 * Migra URLs de áudio local para o padrão canônico /api/audio/<courseId>/<lessonId>.mp3
 * que suporta Range Requests (HTTP 206).
 *
 * Padrões migrados:
 *   /audio/lessons/<courseId>/... → /api/audio/<courseId>/...
 *   /api/audio/<courseId>/lessons/... → /api/audio/<courseId>/...  (duplo lessons)
 *
 * Uso: node scripts/migrate-audio-urls.cjs
 */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

function normalizeUrl(url) {
  // /audio/lessons/cannabis-101/foo.mp3 → /api/audio/cannabis-101/foo.mp3
  if (url.startsWith("/audio/lessons/")) {
    return url.replace("/audio/lessons/", "/api/audio/");
  }
  // /api/audio/cannabis-101/lessons/foo.mp3 → /api/audio/cannabis-101/foo.mp3 (edge case)
  return url.replace(/\/lessons\//, "/");
}

async function main() {
  const records = await db.lessonAudio.findMany({
    where: {
      OR: [
        { audioUrl: { startsWith: "/audio/lessons/" } },
        { audioUrl: { contains: "/lessons/" } },
      ],
    },
  });

  if (records.length === 0) {
    console.log("Nenhuma URL antiga encontrada. Nada a migrar.");
    return;
  }

  console.log(`Migrando ${records.length} registro(s)...`);

  for (const r of records) {
    const newUrl = normalizeUrl(r.audioUrl);
    if (newUrl === r.audioUrl) continue;
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
