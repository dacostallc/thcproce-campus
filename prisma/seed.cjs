/**
 * Dados fixos (sem loja): avatar items + missões. Após `prisma db push`:
 *   npm run db:seed
 * ou
 *   npx prisma db seed
 *
 * Checklist de validação CMS + gamificação (manual): docs/GAMIFICATION_E2E_CHECKLIST.md
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.avatarItem.upsert({
    where: { code: "hat_mestre_cultivo" },
    create: {
      code: "hat_mestre_cultivo",
      name: "Chapéu Mestre do Cultivo",
      description: "Desbloqueia com a conquista XP_1000.",
      type: "HAT",
      displayGlyph: "🎓",
      unlockAchievementCode: "XP_1000",
      active: true,
    },
    update: {
      name: "Chapéu Mestre do Cultivo",
      description: "Desbloqueia com a conquista XP_1000.",
      type: "HAT",
      displayGlyph: "🎓",
      unlockAchievementCode: "XP_1000",
      active: true,
    },
  });

  await prisma.avatarItem.upsert({
    where: { code: "badge_primeiro_quiz" },
    create: {
      code: "badge_primeiro_quiz",
      name: "Insígnia Primeiro Quiz",
      description: "Desbloqueia com a conquista FIRST_QUIZ_PASSED.",
      type: "BADGE",
      displayGlyph: "🏅",
      unlockAchievementCode: "FIRST_QUIZ_PASSED",
      active: true,
    },
    update: {
      name: "Insígnia Primeiro Quiz",
      description: "Desbloqueia com a conquista FIRST_QUIZ_PASSED.",
      type: "BADGE",
      displayGlyph: "🏅",
      unlockAchievementCode: "FIRST_QUIZ_PASSED",
      active: true,
    },
  });

  await prisma.mission.upsert({
    where: { code: "mission_pass_first_quiz" },
    create: {
      code: "mission_pass_first_quiz",
      title: "Passe no primeiro quiz",
      description: "Obtenha uma aprovação num quiz.",
      type: "PASS_QUIZ",
      targetValue: 1,
      xpReward: 15,
      souvenirCreditsReward: 2,
      sortOrder: 1,
    },
    update: {
      title: "Passe no primeiro quiz",
      description: "Obtenha uma aprovação num quiz.",
      type: "PASS_QUIZ",
      targetValue: 1,
      xpReward: 15,
      souvenirCreditsReward: 2,
      sortOrder: 1,
    },
  });

  await prisma.mission.upsert({
    where: { code: "mission_earn_100_xp" },
    create: {
      code: "mission_earn_100_xp",
      title: "Ganhe 100 XP",
      description: "Alcance pelo menos 100 XP no campus.",
      type: "EARN_XP",
      targetValue: 100,
      xpReward: 20,
      souvenirCreditsReward: 2,
      sortOrder: 2,
    },
    update: {
      title: "Ganhe 100 XP",
      description: "Alcance pelo menos 100 XP no campus.",
      type: "EARN_XP",
      targetValue: 100,
      xpReward: 20,
      souvenirCreditsReward: 2,
      sortOrder: 2,
    },
  });

  await prisma.mission.upsert({
    where: { code: "mission_first_achievement" },
    create: {
      code: "mission_first_achievement",
      title: "Desbloqueie sua primeira conquista",
      description: "Desbloqueie a primeira conquista no perfil.",
      type: "UNLOCK_ACHIEVEMENT",
      targetValue: 1,
      xpReward: 15,
      souvenirCreditsReward: 2,
      sortOrder: 3,
    },
    update: {
      title: "Desbloqueie sua primeira conquista",
      description: "Desbloqueie a primeira conquista no perfil.",
      type: "UNLOCK_ACHIEVEMENT",
      targetValue: 1,
      xpReward: 15,
      souvenirCreditsReward: 2,
      sortOrder: 3,
    },
  });
}

main()
  .then(() => {
    console.log("Seed avatar items + missions OK.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
