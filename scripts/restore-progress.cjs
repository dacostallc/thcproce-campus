/**
 * Script de recuperação manual de progresso de aulas.
 *
 * Use quando lessonProgress no DB estiver {} e o aluno lembrar quais aulas concluiu.
 *
 * Uso:
 *   node scripts/restore-progress.cjs <email> <areaId> <índices...>
 *
 * Exemplos:
 *   node scripts/restore-progress.cjs sdelvair@gmail.com cannabis-101 0 1 2 3 4 5 6 7
 *   node scripts/restore-progress.cjs sdelvair@gmail.com cannabis-101 0,1,2,3,4,5,6,7
 */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const [, , email, areaId, ...rest] = process.argv;

  if (!email || !areaId) {
    console.error("Uso: node restore-progress.cjs <email> <areaId> <índices...>");
    process.exit(1);
  }

  // Aceita "0,1,2,3" ou "0 1 2 3"
  const rawIndices = rest.join(",").split(/[,\s]+/).filter(Boolean);
  const indices = [...new Set(rawIndices.map(Number).filter(n => !isNaN(n) && Number.isInteger(n) && n >= 0))].sort((a, b) => a - b);

  if (indices.length === 0) {
    console.error("Nenhum índice válido fornecido.");
    process.exit(1);
  }

  console.log(`\nRestaurando progresso para:`);
  console.log(`  email  : ${email}`);
  console.log(`  área   : ${areaId}`);
  console.log(`  aulas  : [${indices.join(", ")}]  (${indices.length} no total)`);

  const profile = await db.profile.findUnique({ where: { email }, select: { id: true, lessonProgress: true } });
  if (!profile) {
    console.error(`\n❌ Perfil não encontrado para: ${email}`);
    process.exit(1);
  }

  // Lê o mapa atual e faz merge
  let current = {};
  try { current = JSON.parse(profile.lessonProgress || "{}"); } catch {}
  const existing = Array.isArray(current[areaId]) ? current[areaId] : [];
  const merged = [...new Set([...existing, ...indices])].sort((a, b) => a - b);
  current[areaId] = merged;

  // Salva no Profile
  await db.profile.update({
    where: { email },
    data: { lessonProgress: JSON.stringify(current) },
  });

  // Sincroniza também com UserCourseProgress (tabela nova)
  await db.userCourseProgress.upsert({
    where: { profileId_courseSlug: { profileId: profile.id, courseSlug: areaId } },
    create: { profileId: profile.id, courseSlug: areaId, completedLessonIndices: merged, lastLessonIndex: indices[indices.length - 1] },
    update: { completedLessonIndices: merged, lastLessonIndex: indices[indices.length - 1] },
  });

  console.log(`\n✓ Progresso restaurado com sucesso!`);
  console.log(`  ${areaId}: [${merged.join(", ")}]  (${merged.length} aulas)`);
}

main()
  .catch(e => { console.error("ERRO:", e.message); process.exit(1); })
  .finally(() => db.$disconnect());
