"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CAMPUS_PROGRESS_UPDATED_EVENT,
  loadCampusProgress,
  type CampusProgress
} from "@/lib/campusProgressStorage";

export function useCampusProgressClient(): CampusProgress {
  const [snap, setSnap] = useState<CampusProgress>(() => loadCampusProgress());
  const refresh = useCallback(() => setSnap(loadCampusProgress()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(CAMPUS_PROGRESS_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CAMPUS_PROGRESS_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return snap;
}
