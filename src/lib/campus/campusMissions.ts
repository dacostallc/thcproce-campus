/**
 * Catálogo de orientações / primeiros passos no campus THCProce.
 * Tom pedagógico — objetivos de exploração e familiarização com a plataforma.
 */

export type CampusMissionObjectiveType =
  | "DISCOVER_ZONE"
  | "OPEN_GREENHOUSE"
  | "OPEN_MICROLESSON"
  | "COMPLETE_MICROLESSON"
  | "OPEN_PROFILE"
  | "OPEN_CINEMA";

export type CampusMissionDefinition = {
  id: string;
  title: string;
  description: string;
  objectiveType: CampusMissionObjectiveType;
  targetValue: number;
  xpReward: number;
  badgeId?: string;
  /** Zona pedagógica relacionada (rótulo estável do mapa), para sugestões na UI. */
  suggestedZoneLabel?: string;
};

export const CAMPUS_MISSION_CATALOG: CampusMissionDefinition[] = [
  {
    id: "campus-guided-explore-map",
    title: "Explorar o mapa do campus",
    description:
      "Descubra pelo menos uma zona no mapa. É o primeiro passo para navegar conteúdos e percursos com orientação.",
    objectiveType: "DISCOVER_ZONE",
    targetValue: 1,
    xpReward: 10,
    suggestedZoneLabel: "fundamentos"
  },
  {
    id: "campus-guided-greenhouse",
    title: "Visitar a zona greenhouse",
    description:
      "Abra a área de greenhouse no mapa ou através do painel do curso correspondente, para alinhar o mapa ao tema de cultivo protegido.",
    objectiveType: "OPEN_GREENHOUSE",
    targetValue: 1,
    xpReward: 12,
    badgeId: "orientacao_greenhouse",
    suggestedZoneLabel: "greenhouse"
  },
  {
    id: "campus-guided-micro-start",
    title: "Iniciar uma microaula",
    description:
      "Comece uma microaula contextualizada ao campus — formato breve para introduzir conceitos antes do curso completo.",
    objectiveType: "OPEN_MICROLESSON",
    targetValue: 1,
    xpReward: 8,
    suggestedZoneLabel: "fundamentos"
  },
  {
    id: "campus-guided-micro-complete",
    title: "Concluir uma microaula",
    description:
      "Finalize uma microaula até ao fim para registar progresso e consolidar o fluxo de estudo no campus.",
    objectiveType: "COMPLETE_MICROLESSON",
    targetValue: 1,
    xpReward: 15,
    badgeId: "orientacao_microaula"
  },
  {
    id: "campus-guided-profile",
    title: "Abrir o perfil no campus",
    description:
      "Aceda ao seu perfil para rever progresso, gamificação e preferências ligadas à experiência no campus.",
    objectiveType: "OPEN_PROFILE",
    targetValue: 1,
    xpReward: 6
  },
  {
    id: "campus-guided-discover-zones",
    title: "Descobrir várias zonas",
    description:
      "Explore três zonas diferentes no mapa para ganhar contexto espacial e encontrar os principais eixos de conteúdo.",
    objectiveType: "DISCOVER_ZONE",
    targetValue: 3,
    xpReward: 18
  },
  {
    id: "campus-guided-cinema",
    title: "Abrir o cinema do campus",
    description:
      "Visite o espaço de cinema ao vivo ou registado para acompanhar transmissões e materiais em vídeo integrados ao campus.",
    objectiveType: "OPEN_CINEMA",
    targetValue: 1,
    xpReward: 10,
    suggestedZoneLabel: "cinema"
  }
];

export function campusMissionIdsForGuidedEvent(
  event: "OPEN_PROFILE" | "OPEN_CINEMA"
): string[] {
  return CAMPUS_MISSION_CATALOG.filter((m) => m.objectiveType === event).map((m) => m.id);
}
