/**
 * Telemetria de missões MOCK — sem dependências de UI; seguro importar desde módulos `lib` usados no cliente.
 */

import {
  getLocalCalendarDayKey,
  loadStudentProfile,
  saveStudentProfile
} from "@/lib/studentGamificationStorage";

/** Chamado quando `grantLessonCompletionReward` aplicou recompensa (aula nova). */
export function bumpMissionLessonMarkedOnce(): void {
  if (typeof window === "undefined") return;
  const day = getLocalCalendarDayKey();
  const p = loadStudentProfile();
  const mt = p.missionTelemetry;
  const base = mt.localDayKey === day ? mt.lessonsMarkedOnLocalDay : 0;
  saveStudentProfile({
    missionTelemetry: {
      ...mt,
      localDayKey: day,
      lessonsMarkedOnLocalDay: base + 1
    }
  });
}

export function markMissionCampusEntered(): void {
  if (typeof window === "undefined") return;
  const p = loadStudentProfile();
  if (p.missionTelemetry.campusEnteredOnceEver) return;
  saveStudentProfile({
    missionTelemetry: { ...p.missionTelemetry, campusEnteredOnceEver: true }
  });
}

export function markMissionStoreEntered(): void {
  if (typeof window === "undefined") return;
  const p = loadStudentProfile();
  if (p.missionTelemetry.storeEnteredOnceEver) return;
  saveStudentProfile({
    missionTelemetry: { ...p.missionTelemetry, storeEnteredOnceEver: true }
  });
}

/** Primeira vez que o aluno abre o painel de missões pelo HUD ou por atalhos. */
export function markMissionPanelOpened(): void {
  if (typeof window === "undefined") return;
  const p = loadStudentProfile();
  if (p.missionTelemetry.missionsPanelOpenedOnceEver) return;
  saveStudentProfile({
    missionTelemetry: { ...p.missionTelemetry, missionsPanelOpenedOnceEver: true }
  });
}
