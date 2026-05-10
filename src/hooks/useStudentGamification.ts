"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadStudentProfile,
  studentProfileHydrationSeed,
  STUDENT_GAMIFICATION_UPDATED_EVENT,
  type StudentProfile
} from "@/lib/studentGamificationStorage";

export function useStudentGamification(): StudentProfile {
  const [profile, setProfile] = useState<StudentProfile>(() => studentProfileHydrationSeed());
  const refresh = useCallback(() => setProfile(loadStudentProfile()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(STUDENT_GAMIFICATION_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(STUDENT_GAMIFICATION_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return profile;
}
