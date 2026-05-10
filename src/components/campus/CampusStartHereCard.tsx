"use client";

import { ChevronDown, ChevronRight, Compass } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useStudentGamification } from "@/hooks/useStudentGamification";
import {
  CAMPUS_START_HERE_SESSION_HIDE_KEY,
  CAMPUS_WELCOME_MODAL_SEEN_LS_KEY
} from "@/lib/campusOnboardingLs";
import { CAMPUS_PROGRESS_UPDATED_EVENT } from "@/lib/campusProgressStorage";
import { CANNABIS101_START_HINT_EVENT } from "@/lib/campusCannabis101Hint";
import { STUDENT_GAMIFICATION_UPDATED_EVENT } from "@/lib/studentGamificationStorage";
import {
  type CampusStartHereKind,
  getCampusStartHereRecommendation
} from "@/lib/campusStartHereRecommendations";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { useCampusGuidedTourStore } from "@/stores/campusGuidedTourStore";
import { markMissionPanelOpened, markMissionStoreEntered } from "@/lib/studentMissionsTelemetry";

function readLs(key: string): boolean {
  try {
    return typeof sessionStorage !== "undefined" && sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeLsSession(key: string): void {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* noop */
  }
}

function welcomeModalSeenBrowser(): boolean {
  try {
    return typeof localStorage !== "undefined" && localStorage.getItem(CAMPUS_WELCOME_MODAL_SEEN_LS_KEY) === "1";
  } catch {
    return false;
  }
}

export type CampusStartHereCardProps = {
  advancedMap: boolean;
  openCannabis101: () => void;
  openResumeLesson: () => void;
  /** Sem `fixed` — para empilhar no canto com `CampusResumeChip` (HUD map-first). */
  embed?: boolean;
};

function actForRecommendation(
  kind: CampusStartHereKind,
  setMissionsOpen: (v: boolean) => void,
  requestCampusProfileOpen: () => void,
  callbacks: CampusStartHereCardProps
): void {
  switch (kind) {
    case "cannabis101_entry":
      callbacks.openCannabis101();
      return;
    case "first_lesson":
      callbacks.openResumeLesson();
      return;
    case "missions":
      markMissionPanelOpened();
      setMissionsOpen(true);
      return;
    case "avatar_custom":
      requestCampusProfileOpen();
      return;
    default: {
      const _: never = kind;
      return void _;
    }
  }
}

/** Cartão contextual «Comece aqui» ou chip colapsável no mobile abaixo do HUD. */
export function CampusStartHereCard({
  advancedMap,
  openCannabis101,
  openResumeLesson,
  embed = false
}: CampusStartHereCardProps) {
  const profile = useStudentGamification();
  const [, bump] = useState(0);
  const refreshHints = useCallback(() => bump((x) => x + 1), []);

  useEffect(() => {
    const onLs = () => refreshHints();
    window.addEventListener(STUDENT_GAMIFICATION_UPDATED_EVENT, onLs);
    window.addEventListener("storage", onLs);
    window.addEventListener(CAMPUS_PROGRESS_UPDATED_EVENT, onLs);
    window.addEventListener(CANNABIS101_START_HINT_EVENT, onLs);
    return () => {
      window.removeEventListener(STUDENT_GAMIFICATION_UPDATED_EVENT, onLs);
      window.removeEventListener("storage", onLs);
      window.removeEventListener(CAMPUS_PROGRESS_UPDATED_EVENT, onLs);
      window.removeEventListener(CANNABIS101_START_HINT_EVENT, onLs);
    };
  }, [refreshHints]);

  const tourActive = useCampusGuidedTourStore((s) => s.tourActive);
  const setCampusStoreOpen = useCampusHudStore((s) => s.setCampusStoreOpen);
  const setCampusMissionsOpen = useCampusHudStore((s) => s.setCampusMissionsOpen);
  const requestCampusProfileOpen = useCampusHudStore((s) => s.requestCampusProfileOpen);

  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width:640px)");
    setExpanded(mq.matches);
    const onMq = () => setExpanded(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  const rec = useMemo(() => getCampusStartHereRecommendation(profile), [profile]);

  const sessionHidden = mounted && readLs(CAMPUS_START_HERE_SESSION_HIDE_KEY);
  const welcomeDone = mounted && welcomeModalSeenBrowser();

  const hiddenReason =
    advancedMap ||
    tourActive ||
    !mounted ||
    !welcomeDone ||
    sessionHidden ||
    rec == null;

  const onPrimary = () => {
    if (!rec) return;
    actForRecommendation(rec.kind, setCampusMissionsOpen, requestCampusProfileOpen, {
      advancedMap,
      openCannabis101,
      openResumeLesson
    });
  };

  const onSecondaryShop = () => {
    markMissionStoreEntered();
    setCampusStoreOpen(true);
  };

  const dismissChip = () => {
    writeLsSession(CAMPUS_START_HERE_SESSION_HIDE_KEY);
    refreshHints();
  };

  if (hiddenReason) return null;

  const label = expanded ? (
    <>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-canna-200/95">Comece aqui</p>
      <p className="mt-1 text-xs font-semibold leading-snug text-white sm:text-sm">{rec.headline}</p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-white/68 sm:text-[12px]">{rec.supportingLine}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={onPrimary}
          className="inline-flex items-center gap-1 rounded-lg bg-canna-500/26 px-2.5 py-1.5 text-[11px] font-bold text-canna-50 ring-1 ring-canna-400/42 transition hover:bg-canna-500/34 sm:text-xs"
        >
          Seguir <ChevronRight size={12} aria-hidden />
        </button>
        {rec.kind === "first_lesson" || rec.kind === "missions" ? (
          <button
            type="button"
            className="rounded-lg border border-amber-400/25 bg-black/26 px-2 py-1.5 text-[10px] font-semibold text-white/76 transition hover:bg-white/[0.06] sm:text-[11px]"
            onClick={onSecondaryShop}
          >
            Loja
          </button>
        ) : null}
      </div>
    </>
  ) : (
    <button
      type="button"
        className="flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-1 text-left"
      onClick={() => setExpanded(true)}
    >
        <span className="flex min-w-0 items-center gap-1.5">
        <Compass className="size-3.5 shrink-0 text-canna-200/95 sm:size-4" aria-hidden />
        <span className="text-[10px] font-semibold leading-snug text-white/88 [overflow-wrap:anywhere] sm:text-[11px]">
          {rec.headline}
        </span>
      </span>
      <span className="shrink-0 text-canna-100/92" aria-hidden>
        <ChevronDown size={14} aria-hidden />
      </span>
    </button>
  );

  const cardInner = (
    <>
      {expanded ? (
        <button
          type="button"
          className="absolute right-1.5 top-1.5 rounded-lg p-1 text-[10px] font-medium text-white/45 transition hover:bg-white/10 hover:text-white sm:hidden"
          aria-label="Recolher"
          onClick={() => setExpanded(false)}
        >
          <ChevronDown className="-rotate-90" size={16} aria-hidden />
        </button>
      ) : null}
      {!expanded ? null : (
        <button
          type="button"
          className="absolute right-2 bottom-2 hidden rounded-md px-2 py-0.5 text-[10px] text-white/40 transition hover:bg-white/10 hover:text-white sm:inline"
          onClick={dismissChip}
        >
          Ocultar
        </button>
      )}
      {label}
    </>
  );

  const card = (
    <div
      data-tour-id="campus-start-here"
      className={cn(
        "pointer-events-auto relative rounded-xl border border-white/[0.11] bg-black/[0.2] shadow-[0_8px_28px_rgba(0,0,0,0.18)] ring-1 ring-inset ring-emerald-500/12 backdrop-blur-2xl",
        expanded ? "p-3 sm:p-4" : "px-2.5 py-1.5 pr-9 sm:px-3 sm:py-2 sm:pr-10"
      )}
    >
      {cardInner}
    </div>
  );

  if (embed) {
    return (
      <div className="w-full max-w-[min(22rem,calc(100vw-1.25rem))]">
        {card}
        {!expanded ? (
          <button
            type="button"
            className="pointer-events-auto mt-1.5 self-end rounded-full border border-white/12 bg-black/42 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/72 backdrop-blur-sm sm:hidden"
            onClick={dismissChip}
          >
            Ocultar
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed bottom-[5.85rem] right-4 z-[18] flex max-w-[min(19rem,calc(100vw-2rem))] flex-col rounded-xl shadow-lg shadow-black/25 sm:right-5 lg:bottom-24">
      {card}
      {!expanded ? (
        <button
          type="button"
          className="pointer-events-auto mt-2 self-end rounded-full border border-white/12 bg-black/42 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/72 backdrop-blur-sm sm:hidden"
          onClick={dismissChip}
        >
          Ocultar esta sessão
        </button>
      ) : null}
    </div>
  );
}
