import type { CampusMissionPhase2Definition } from "@/lib/campusMissionsPhase2Types";

export const CAMPUS_MISSIONS_PHASE2_CATALOG: readonly CampusMissionPhase2Definition[] = [
  {
    id: "campus-p2-enter",
    title: "Primeira visita ao campus",
    description: "Entra no mapa do campus e mantém a navegação activa.",
    rewardXp: 12,
    rewardCredits: 3,
    rewardBadgeId: "camp_m2_first_visit",
    badgeLabel: "Visitante",
    badgeEmoji: "🗺️",
    rewardInventoryIds: ["p3-drop-campus-map-mini"]
  },
  {
    id: "campus-p2-cannabis101",
    title: "Abrir Cannabis 101",
    description: "Abre o painel da sala Cannabis 101 a partir do mapa.",
    rewardXp: 18,
    rewardCredits: 4,
    rewardBadgeId: "camp_m2_c101",
    badgeLabel: "Cannabis 101",
    badgeEmoji: "🌿"
  },
  {
    id: "campus-p2-first-lesson-complete",
    title: "Concluir a primeira aula",
    description:
      "Marca como vista/concluída a primeira aula localmente neste dispositivo (regra académica aplicada no painel).",
    rewardXp: 22,
    rewardCredits: 6,
    rewardBadgeId: "camp_m2_first_lesson_done",
    badgeLabel: "Primeira aula feita",
    badgeEmoji: "✅"
  },
  {
    id: "campus-p2-first-quiz-correct",
    title: "Acertar o primeiro quiz da aula",
    description: "Resposta correcta num quiz rápido integrado ao conteúdo da aula (inline).",
    rewardXp: 16,
    rewardCredits: 4,
    rewardBadgeId: "camp_m2_first_quiz",
    badgeLabel: "Quiz certeiro",
    badgeEmoji: "🎯"
  },
  {
    id: "campus-p2-mural",
    title: "Visitar o mural",
    description: "Abre o mural do campus pelo menu.",
    rewardXp: 10,
    rewardCredits: 2,
    rewardBadgeId: "camp_m2_mural",
    badgeLabel: "Leitor do mural",
    badgeEmoji: "📰"
  },
  {
    id: "campus-p2-cinema",
    title: "Abrir o cinema",
    description: "Abre o cinema ao vivo (painel no mapa) ou o drive‑in no avatar.",
    rewardXp: 16,
    rewardCredits: 4,
    rewardBadgeId: "camp_m2_cinema",
    badgeLabel: "Plateia campus",
    badgeEmoji: "🎬"
  },
  {
    id: "campus-p2-three-lessons",
    title: "Completar 3 aulas",
    description:
      "Marca como vistas/concluídas três aulas distintas no campus (acumulado neste dispositivo).",
    rewardXp: 35,
    rewardCredits: 8,
    rewardBadgeId: "camp_m2_three_lessons",
    badgeLabel: "Sequência de 3",
    badgeEmoji: "📚",
    rewardInventoryIds: ["p3-drop-seed-starter-pack"]
  },
  {
    id: "campus-p2-xp-twenty",
    title: "Ganhar 20 XP",
    description: "Atinge pelo menos 20 XP totais no progresso local (missões, aulas, etc.).",
    rewardXp: 10,
    rewardCredits: 2,
    rewardBadgeId: "camp_m2_xp_climber",
    badgeLabel: "Subindo de nível",
    badgeEmoji: "⚡"
  },
  {
    id: "campus-p2-profile",
    title: "Abrir Meu perfil",
    description: "Abre o modal ou a página «Meu perfil» local.",
    rewardXp: 10,
    rewardCredits: 2,
    rewardBadgeId: "camp_m2_profile",
    badgeLabel: "Espelho do aluno",
    badgeEmoji: "👤"
  }
] as const;
