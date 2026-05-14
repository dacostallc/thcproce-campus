/**
 * Registra manualmente uma URL de áudio para uma aula no banco.
 * Equivalente ao UPDATE aulas SET audio_url = '...' WHERE slug = '...'
 *
 * Uso:
 *   node scripts/set-audio-url.cjs <courseId> <lessonId> <audioUrl>
 *
 * Exemplo:
 *   node scripts/set-audio-url.cjs extracoes-101 ext-l01-o-que-sao-extratos https://exemplo.com/audio.mp3
 */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const [, , courseId, lessonId, audioUrl] = process.argv;

  if (!courseId || !lessonId || !audioUrl) {
    console.error("Uso: node set-audio-url.cjs <courseId> <lessonId> <audioUrl>");
    process.exit(1);
  }

  const result = await db.lessonAudio.upsert({
    where: { courseId_lessonId: { courseId, lessonId } },
    create: { courseId, lessonId, audioUrl },
    update: { audioUrl },
    select: { courseId: true, lessonId: true, audioUrl: true },
  });

  console.log("✓ Áudio registrado:");
  console.log(`  curso  : ${result.courseId}`);
  console.log(`  aula   : ${result.lessonId}`);
  console.log(`  url    : ${result.audioUrl}`);
}

main()
  .catch(e => { console.error("ERRO:", e.message); process.exit(1); })
  .finally(() => db.$disconnect());
