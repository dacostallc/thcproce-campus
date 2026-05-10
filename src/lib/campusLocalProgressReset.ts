/**
 * Reset agressivo do progresso LOCAL do campus (QA / admins em dev ou com flag/env).
 */

import {
  CAMPUS_GUIDED_TOUR_DONE_LS_KEY,
  CAMPUS_START_HERE_SESSION_HIDE_KEY,
  CAMPUS_TOUR_NUDGE_DISMISSED_LS_KEY,
  CAMPUS_TOUR_SEEN_LS_KEY,
  CAMPUS_WELCOME_MODAL_SEEN_LS_KEY
} from "@/lib/campusOnboardingLs";
import {
  clearAllCampusLessonWatchAwardFlags,
  clearCampusLessonMarksStorage,
  clearCampusProgress
} from "@/lib/campusProgressStorage";
import {
  CANNABIS101_START_HINT_LS_KEY,
  notifyCannabis101StartHintListeners
} from "@/lib/campusCannabis101Hint";
import { clearCampusLastLessonIndicesStorage } from "@/lib/campusLastLesson";
import {
  CAMPUS_FIRST_VISIT_AWARD_LS_KEY,
  CAMPUS_TOUR_OFFLINE_XP_AWARD_LS_KEY,
  resetStudentProfile
} from "@/lib/studentGamificationStorage";

/** Dias de série local usados apenas para evitar re-chamadas no HUD (ligado ao streak servidor). */
const HUD_STREAK_LOCAL_DAY_LS_KEY = "thc-campus-streak-day";

const ONBOARDING_AND_TOUR_LS_KEYS_READ = [
  CAMPUS_WELCOME_MODAL_SEEN_LS_KEY,
  CAMPUS_TOUR_SEEN_LS_KEY,
  CAMPUS_GUIDED_TOUR_DONE_LS_KEY,
  CAMPUS_TOUR_NUDGE_DISMISSED_LS_KEY
] as const;

/**
 * Permitir ferramentas de reset / painéis técnicos: build de desenvolvimento,
 * `NEXT_PUBLIC_DEBUG_PROFILE_RESET=true`, ou e-mail marcado como admin do campus.
 */
export function isCampusLocalProgressResetAllowed(isCampusAdminUser: boolean): boolean {
  if (process.env.NODE_ENV === "development") return true;
  if (process.env.NEXT_PUBLIC_DEBUG_PROFILE_RESET === "true") return true;
  return Boolean(isCampusAdminUser);
}

/** Apaga bem-vindo, tour, marcações de aulas locais, inventário XP/créditos, missões reclamadas, etc. Idempotente dentro do próprio navegador. */
export function resetCampusLocalProgressAll(): void {
  if (typeof window === "undefined") return;

  try {
    for (const k of ONBOARDING_AND_TOUR_LS_KEYS_READ) {
      window.localStorage.removeItem(k);
    }
    window.localStorage.removeItem(CAMPUS_TOUR_OFFLINE_XP_AWARD_LS_KEY);
    window.localStorage.removeItem(CAMPUS_FIRST_VISIT_AWARD_LS_KEY);
    window.localStorage.removeItem(CANNABIS101_START_HINT_LS_KEY);
    window.localStorage.removeItem(HUD_STREAK_LOCAL_DAY_LS_KEY);
  } catch {
    /* noop */
  }

  clearCampusLessonMarksStorage();
  clearAllCampusLessonWatchAwardFlags();
  clearCampusLastLessonIndicesStorage();
  clearCampusProgress();

  try {
    window.sessionStorage.removeItem(CAMPUS_START_HERE_SESSION_HIDE_KEY);
  } catch {
    /* noop */
  }

  resetStudentProfile();
  try {
    notifyCannabis101StartHintListeners();
  } catch {
    /* noop */
  }
}
