/**
 * Catálogo MOCK de missões do campus (progressão offline).
 * TODO Prisma: `StudentMission`, atribuição por curso, progresso e recompensas no servidor.
 */

import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";
import {
  computeLocalCoursePctFromMarks,
  readLocalLessonMarks,
  sumDistinctLocalLessonMarksAcrossAreas
} from "@/lib/campusProgressStorage";
import type { StudentProfile } from "@/lib/studentGamificationStorage";

export type MissionTypeMock = "daily" | "weekly" | "course" | "special";

export type StudentMissionMockDef = {
  id: string;
  title: string;
  description: string;
  type: MissionTypeMock;
  /** Meta numérica exibida na barra (ex.: 3 aulas, 100% curso). */
  target: number;
  rewardXp: number;
  rewardCredits: number;
  rewardItemId?: string;
  courseId?: string;
  isMock: true;
};

export type MissionProgressSlice = {
  progressCurrent: number;
  target: number;
  completed: boolean;
};

/**
 * Regras derivadas — `readLocalLessonMarks` + telemetria + perfil.
 * “Ganhar o primeiro souvenir”: `unlockedSouvenirs.length >= 1` após `normalizeProfile`
 * (o boné `bone-thcproce` entra no primeiro ganho de XP; a missão acompanha essa curva).
 */
export const STUDENT_MISSIONS_MOCK_CATALOG: readonly StudentMissionMockDef[] = [
  {
    id: "mock-mission-daily-lesson-today",
    title: "Concluir 1 aula hoje",
    description:
      "Completa uma aula no campus hoje (recompensa de conclusão aplicada pela primeira vez nessa aula).",
    type: "daily",
    target: 1,
    rewardXp: 20,
    rewardCredits: 3,
    isMock: true
  },
  {
    id: "mock-mission-weekly-three-lessons",
    title: "Concluir 3 aulas",
    description: "Marca três aulas como vistas no mapa (soma das aulas distintas em todas as áreas).",
    type: "weekly",
    target: 3,
    rewardXp: 45,
    rewardCredits: 6,
    isMock: true
  },
  {
    id: "mock-mission-enter-campus",
    title: "Abrir o campus",
    description: "Entra no mapa do campus pelo menos uma vez.",
    type: "special",
    target: 1,
    rewardXp: 15,
    rewardCredits: 4,
    isMock: true
  },
  {
    id: "mock-mission-enter-store",
    title: "Visitar a loja",
    description: "Abre a Loja do Campus (HUD ou página da loja).",
    type: "special",
    target: 1,
    rewardXp: 15,
    rewardCredits: 4,
    rewardItemId: "store-mock-cert-micro",
    isMock: true
  },
  {
    id: "mock-mission-equip-avatar",
    title: "Equipar um avatar",
    description: "Escolhe um papel diferente de visitante ou equipa um item da loja num slot.",
    type: "special",
    target: 1,
    rewardXp: 30,
    rewardCredits: 8,
    isMock: true
  },
  {
    id: "mock-mission-finish-cannabis101",
    title: "Finalizar Cannabis 101",
    description: "Atinge 100% de progresso local na trilha Cannabis 101.",
    type: "course",
    target: 100,
    rewardXp: 120,
    rewardCredits: 20,
    courseId: CANNABIS101_AREA_ID,
    rewardItemId: "mock-bonus-outfit-labcoat",
    isMock: true
  },
  {
    id: "mock-mission-first-souvenir",
    title: "Ganhar o primeiro souvenir",
    description: "Desbloqueia o primeiro souvenir de curso no teu perfil (inclui o boné de boas-vindas).",
    type: "special",
    target: 1,
    rewardXp: 25,
    rewardCredits: 10,
    isMock: true
  }
] as const;

const MISSION_BY_ID: Record<string, StudentMissionMockDef> = Object.fromEntries(
  STUDENT_MISSIONS_MOCK_CATALOG.map((m) => [m.id, m])
);

export function getStudentMissionMockDef(id: string): StudentMissionMockDef | null {
  return MISSION_BY_ID[id] ?? null;
}

function hasAnyEquippedStoreSlot(profile: StudentProfile): boolean {
  const s = profile.equippedStoreSlots;
  return (
    Boolean(s.avatarItemId) ||
    Boolean(s.outfitItemId) ||
    Boolean(s.accessoryItemId) ||
    Boolean(s.specialItemId) ||
    Boolean(s.certificateItemId)
  );
}

/** Avalia progresso de todas as missões MOCK para o perfil + LS de aulas atual. */
export function computeStudentMockMissionProgressMap(
  profile: StudentProfile
): Record<string, MissionProgressSlice> {
  void readLocalLessonMarks();
  const totalDistinctLessons = sumDistinctLocalLessonMarksAcrossAreas();
  const telem = profile.missionTelemetry;
  const c101Pct = computeLocalCoursePctFromMarks(CANNABIS101_AREA_ID);
  const avatarOutfitted = profile.avatarVariant !== "visitor" || hasAnyEquippedStoreSlot(profile);
  const souvenirProgress = Math.min(1, profile.unlockedSouvenirs.length);

  const out: Record<string, MissionProgressSlice> = {};

  for (const m of STUDENT_MISSIONS_MOCK_CATALOG) {
    switch (m.id) {
      case "mock-mission-daily-lesson-today":
        out[m.id] = {
          progressCurrent: Math.min(m.target, telem.lessonsMarkedOnLocalDay),
          target: m.target,
          completed: telem.lessonsMarkedOnLocalDay >= m.target
        };
        break;
      case "mock-mission-weekly-three-lessons":
        out[m.id] = {
          progressCurrent: Math.min(m.target, totalDistinctLessons),
          target: m.target,
          completed: totalDistinctLessons >= m.target
        };
        break;
      case "mock-mission-enter-campus":
        out[m.id] = {
          progressCurrent: telem.campusEnteredOnceEver ? 1 : 0,
          target: m.target,
          completed: telem.campusEnteredOnceEver
        };
        break;
      case "mock-mission-enter-store":
        out[m.id] = {
          progressCurrent: telem.storeEnteredOnceEver ? 1 : 0,
          target: m.target,
          completed: telem.storeEnteredOnceEver
        };
        break;
      case "mock-mission-equip-avatar":
        out[m.id] = {
          progressCurrent: avatarOutfitted ? 1 : 0,
          target: m.target,
          completed: avatarOutfitted
        };
        break;
      case "mock-mission-finish-cannabis101":
        out[m.id] = {
          progressCurrent: Math.min(m.target, c101Pct),
          target: m.target,
          completed: c101Pct >= 100
        };
        break;
      case "mock-mission-first-souvenir":
        out[m.id] = {
          progressCurrent: souvenirProgress,
          target: m.target,
          completed: profile.unlockedSouvenirs.length >= 1
        };
        break;
      default:
        out[m.id] = { progressCurrent: 0, target: m.target, completed: false };
    }
  }

  return out;
}
