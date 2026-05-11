"use client";

import { useEffect, useLayoutEffect, useMemo, useState, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { areas, type Area } from "@/data/courses";
import { Hotspot } from "./Hotspot";
import { AmbientLife } from "./AmbientLife";
import { CampusAmbientSparks } from "./CampusAmbientSparks";
import { CampusVivoLayer } from "./CampusVivoLayer";
import { CoursePanel } from "./CoursePanel";
import { LessonPanel } from "./LessonPanel";
import { HUD } from "./HUD";
import { CampusPlayer } from "./CampusPlayer";
import { CampusMapPeerLayer } from "./CampusMapPeerLayer";
import { CampusMicroHotspotDecorLayer } from "./CampusMicroHotspotDecorLayer";
import { CampusPresenceSync } from "./CampusPresenceSync";
import { CampusSelfPresenceSync } from "./CampusSelfPresenceSync";
import { CampusWorldPersistenceSync } from "./CampusWorldPersistenceSync";
import { CampusSocialPresenceDots } from "@/components/campus/presence/CampusSocialPresenceDots";
import { MapWalkLayer } from "./MapWalkLayer";
import { ProximityBanner } from "./ProximityBanner";
import { CampusChatDrawer } from "./CampusChatDrawer";
import { CampusAdminBroadcastLayer } from "./CampusAdminBroadcastLayer";
import { CampusAdminBroadcastComposer } from "./CampusAdminBroadcastComposer";
import { CampusLiveAdminComposer } from "./CampusLiveAdminComposer";
import { useCampusAdminBroadcastHotkeys } from "./useCampusAdminBroadcastHotkeys";
import { useCampusLiveAdminHotkeys } from "./useCampusLiveAdminHotkeys";
import { InternalPreviewBanner } from "./InternalPreviewBanner";
import { useCampusSkyStore } from "@/stores/campusSkyStore";
import { useCampusStore } from "@/stores/campusStore";
import { nearestArea } from "@/lib/campusProximity";
import { isCampusZoneEntryPromptEnabled } from "@/lib/campusZonePromptEnv";
import {
  dismissZoneEntryPromptForArea,
  readDismissedZoneEntryPromptIds
} from "@/lib/campusZonePromptDismiss";
import {
  CAMPUS_ART_HEIGHT,
  CAMPUS_ART_WIDTH,
  CAMPUS_IMAGE_OBJECT_FIT_SIMPLE,
  CAMPUS_MAP_BACKGROUND_IMG_STYLE,
  CAMPUS_MAP_BACKGROUND_IMG_STYLE_CONTAIN,
  CAMPUS_MAP_SIMPLE_STAGE_BACKDROP_IMG_STYLE,
  campusMapInteractiveSvgPreserveAspectRatio
} from "@/lib/campusArt";
import { isCampusAreaConstruction } from "@/config/campusAreaRollout";
import { getLastLessonIndex } from "@/lib/campusLastLesson";
import {
  areaByCampusId,
  getResumeLessonIndex,
  loadCampusProgress,
  touchCampusCourseEntry
} from "@/lib/campusProgressStorage";
import {
  CANNABIS101_START_HINT_EVENT,
  cannabis101HasLocalLessonMarksSync,
  hasCannabis101FirstLessonBegunSync,
  markCannabis101FirstLessonBegun
} from "@/lib/campusCannabis101Hint";
import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";
import { cannabis101StableIdToLessonIndex } from "@/content/courses/cannabis-101/lessons";
import { trpc } from "@/lib/trpc/react";
import { resolveCampusMapZoneLabel } from "@/data/campusMicroLessonContext";
import {
  CAMPUS_MAP_INTERACTIVE_AREAS,
  imageMapApproxCenterPct
} from "@/lib/campusMapAreasCatalog";
import type { CampusMapInteractiveArea } from "@/lib/campusMapAreasInteractive.types";
import { hotspotEffectiveCourseId } from "@/lib/campusMapHotspotResolve";
import { CampusAreaGateModal, type CampusGateKind } from "./CampusAreaGateModal";
import { isCampusAdminEmail } from "@/lib/campusAdmin";
import {
  isCampusLiveCourseHourActiveWithPulse,
  isCampusLiveVisitorAreaAccessWithPulse
} from "@/lib/campusAccess";
import { deriveCampusPresenceRole } from "@/config/userRoles";
import { CineDriveIn } from "@/components/CineDriveIn";
import { CampusCineHotspot } from "./CampusCineHotspot";
import { useCampusEmojiReactionHotkeys } from "./useCampusEmojiReactionHotkeys";
import { CampusMapErrorBoundary } from "./CampusMapErrorBoundary";
import { CampusBiomeOverlays } from "./CampusBiomeOverlays";
import { CampusWalkableLayer } from "./CampusWalkableLayer";
import { CampusFogZonesLayer } from "./CampusFogZonesLayer";
import { CampusSimpleMapLayer } from "./CampusSimpleMapLayer";
import { CampusMapInteractiveLayer } from "./CampusMapInteractiveLayer";
import {
  CampusSemanticMapOverlay,
  ENABLE_SEMANTIC_MAP_OVERLAY
} from "./CampusSemanticMapOverlay";
import { CampusMapInteractiveMapPanels } from "./CampusMapInteractiveMapPanels";
import { Cannabis101StartBeacon } from "./Cannabis101StartBeacon";
import { CampusResumeChip } from "./CampusResumeChip";
import { CampusMapTour } from "./CampusMapTour";
import { CampusWelcomeModal } from "./CampusWelcomeModal";
import { CampusStartHereCard } from "./CampusStartHereCard";
import { CampusMapCustomCursor } from "./CampusMapCustomCursor";
import { CampusMapAreasDebugOverlay } from "./CampusMapAreasDebugOverlay";
import { cn } from "@/lib/utils";
import { useStudentGamification } from "@/hooks/useStudentGamification";
import { useCampusPresence } from "@/hooks/useCampusPresence";
import { useCampusPresenceBreakdown } from "@/hooks/useCampusPresenceBreakdown";
import { useCampusLivePresenceHeartbeat } from "@/hooks/useCampusLivePresenceHeartbeat";
import type { CampusLivePresenceOnlineDto } from "@/lib/campusLivePresenceDto";
import { useCampusSocialZoneStore } from "@/stores/campusSocialZoneStore";
import { grantFirstCampusVisitCreditsIfNeeded } from "@/lib/studentGamificationStorage";
import {
  campusUnlockStats,
  type CampusUnlockContext
} from "@/lib/campusZoneProgress";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { resolveCampusHotspotDebugParam } from "@/lib/campusHotspotDebugQuery";
import { markMissionStoreEntered } from "@/lib/studentMissionsTelemetry";
import { ShoppingBag } from "lucide-react";
import {
  isCampusAdvancedMap,
  isCampusAutoOnboardingUxEnabled,
  isCampusMapAreasPolygonOverlayEnabled,
  isCampusMapDebugOutline,
  isCampusMapInteractiveDebugEnabled
} from "@/config/campusMapStability";
import {
  readCampusAvatarPositionV1,
  writeCampusAvatarPositionV1
} from "@/lib/campusAvatarPositionStorage";
import { mergeCampusMapMemory } from "@/lib/campusMapMemoryStorage";
import { recordCampusZoneVisit } from "@/lib/campusVisitedZonesStorage";
import {
  readCampusDebugZonesQuery,
  shouldShowCampusMapZonesPolygonDebug
} from "@/lib/campusMapZonesDebug";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";

/** Recarga total da página em rotas `/campus*` para limpar estado cliente + lista de visitantes. 0 ou false = desliga. */
function campusMapAutoReloadIntervalMs(): number {
  const raw = process.env.NEXT_PUBLIC_CAMPUS_MAP_RELOAD_INTERVAL_MS;
  if (raw === "0" || raw === "false") return 0;
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) return Math.max(15_000, n);
  return 60_000;
}

const PLACEHOLDER_NIGHT = `
  radial-gradient(ellipse at 20% 30%, rgba(34, 197, 94, 0.20), transparent 45%),
  radial-gradient(ellipse at 70% 25%, rgba(168, 85, 247, 0.18), transparent 40%),
  radial-gradient(ellipse at 80% 70%, rgba(251, 191, 36, 0.15), transparent 45%),
  radial-gradient(ellipse at 30% 80%, rgba(34, 211, 238, 0.10), transparent 40%),
  linear-gradient(180deg, #050a07 0%, #0a1510 60%, #050a07 100%)
`;

const PLACEHOLDER_DAY = `
  radial-gradient(ellipse at 25% 18%, rgba(56, 189, 248, 0.28), transparent 42%),
  radial-gradient(ellipse at 72% 22%, rgba(250, 204, 21, 0.22), transparent 40%),
  radial-gradient(ellipse at 48% 88%, rgba(74, 222, 128, 0.18), transparent 48%),
  linear-gradient(180deg, #e0f2fe 0%, #fef9c3 45%, #dcfce7 100%)
`;

type Props = {
  bgNightSrc?: string;
  bgDaySrc?: string;
  /** Bolinhas por curso no mapa (legacy). No mapa principal mostramos só âncoras editoriais (Cannabis 101 + Cine já tem camada própria). */
  showHotspots?: boolean;
  showCourseLabels?: boolean;
  internalPreview?: boolean;
};

export function CampusMap({
  bgNightSrc = "/campus/campus.png",
  bgDaySrc = "/campus/campus-day.png",
  showHotspots = true,
  showCourseLabels = false,
  internalPreview = false
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sky = useCampusSkyStore((s) => s.sky);
  const setPlayer = useCampusStore((s) => s.setPlayer);
  const setPlayerLoose = useCampusStore((s) => s.setPlayerLoose);
  const player = useCampusStore((s) => s.player);
  const cineDriveInOpen = useCampusStore((s) => s.isCineOpen);
  const { data: session, status } = useSession();
  const utils = trpc.useUtils();
  const localGamification = useStudentGamification();

  useEffect(() => {
    grantFirstCampusVisitCreditsIfNeeded();
  }, []);

  const [selected, setSelected] = useState<Area | null>(null);
  /** Hit SVG legado (`campusMapAreasCatalog.seed`) quando o painel abre a partir do mapa interactivo — contextualiza microaulas. */
  const [coursePanelLegacyHitId, setCoursePanelLegacyHitId] = useState<string | null>(null);
  const campusRestoreDoneRef = useRef(false);
  const campusAvatarLsHydratedRef = useRef(false);
  const [campusLesson, setCampusLesson] = useState<{
    area: Area;
    idx: number;
  } | null>(null);

  useEffect(() => {
    useCampusHudStore.getState().setCampusLessonPanelOpen(campusLesson != null);
    return () => {
      useCampusHudStore.getState().setCampusLessonPanelOpen(false);
    };
  }, [campusLesson]);

  const [nightOk, setNightOk] = useState(true);
  const [dayOk, setDayOk] = useState(true);
  const [dismissNearId, setDismissNearId] = useState<string | null>(null);
  const [zonePromptDismissTick, setZonePromptDismissTick] = useState(0);
  const [zoneProximityHydrated, setZoneProximityHydrated] = useState(false);

  useEffect(() => {
    setZoneProximityHydrated(true);
  }, []);

  const [gateOpen, setGateOpen] = useState<{
    kind: CampusGateKind;
    area: Area;
  } | null>(null);
  const phase = sky;
  const anyMissing = sky === "night" ? !nightOk : !dayOk;

  const { data: progress } = trpc.campus.areaProgress.useQuery({}, {
    staleTime: 120_000
  });

  const { data: campusAccess } = trpc.campus.myCampusAccess.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 60_000
  });

  const { data: myGamification } = trpc.campus.myProgress.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 60_000
  });

  const { data: lessonProgressMine, isFetched: lessonMineFetched } =
    trpc.campus.lessonProgressMine.useQuery(undefined, {
      enabled: status === "authenticated",
      staleTime: 45_000
    });

  const { data: campusWorld } = trpc.campus.campusWorldSnapshot.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 45_000
  });

  const { data: campusSocialPoll } = trpc.campus.campusSocialPoll.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 18_000,
    refetchInterval: 26_000
  });

  const touchCampusZoneMut = trpc.campus.campusTouchZone.useMutation({
    onSuccess: () => {
      void utils.campus.campusWorldSnapshot.invalidate();
      void utils.campus.campusGuidedMissions.invalidate();
      void utils.campus.campusSocialPoll.invalidate();
    }
  });
  const campusMapMemoryMut = trpc.campus.campusMapMemory.useMutation();

  useEffect(() => {
    if (status !== "authenticated" || !campusLesson) return;
    campusMapMemoryMut.mutate({
      lastBuildingCourseId: campusLesson.area.id,
      lastPanelKind: "lesson",
      lastZoneLabel: resolveCampusMapZoneLabel({ courseId: campusLesson.area.id }),
      lastLegacyHitId: null
    });
  }, [status, campusLesson, campusMapMemoryMut]);

  useEffect(() => {
    const z = campusWorld?.restore?.lastZoneLabel ?? null;
    if (typeof z === "string" && z.trim().length >= 2) {
      useCampusSocialZoneStore.getState().setCampusSocialZoneLabel(z.trim());
    }
  }, [campusWorld?.restore?.lastZoneLabel]);

  const microLessonProgressById = useMemo(() => {
    const rows = campusWorld?.microLessons;
    if (!rows?.length) return undefined;
    const m: Record<string, { completedAt: string | null }> = {};
    for (const r of rows) {
      m[r.blueprintId] = { completedAt: r.completedAt };
    }
    return m;
  }, [campusWorld?.microLessons]);

  const { data: liveBroadcast } = trpc.campus.liveBroadcast.useQuery(undefined, {
    staleTime: 8_000,
    refetchInterval: 18_000
  });

  const envLivePulse = process.env.NEXT_PUBLIC_CAMPUS_LIVE_ACTIVE === "true";
  const livePulse =
    liveBroadcast !== undefined ? liveBroadcast.liveActive : envLivePulse;

  useEffect(() => {
    useCampusStore.getState().setLiveActive(livePulse);
  }, [livePulse]);

  const mapZonesPolygonDebug = useMemo(() => {
    const q = readCampusDebugZonesQuery(searchParams);
    return shouldShowCampusMapZonesPolygonDebug(q);
  }, [searchParams]);

  const isCampusAdmin = useMemo(
    () => isCampusAdminEmail(session?.user?.email ?? null),
    [session?.user?.email]
  );

  const canEnterCourses = useMemo(() => {
    if (process.env.NEXT_PUBLIC_CAMPUS_PUBLIC_ALL === "true") return true;
    if (isCampusAdmin) return true;
    if (isCampusLiveVisitorAreaAccessWithPulse(livePulse) && status === "unauthenticated") {
      return true;
    }
    if (status === "authenticated" && isCampusLiveCourseHourActiveWithPulse(livePulse))
      return true;

    if (status !== "authenticated") return false;
    if (!campusAccess) return false;
    return campusAccess.canOpenCourses;
  }, [status, campusAccess, isCampusAdmin, livePulse]);

  const persistInteractiveActivation = useCallback(
    (hit: CampusMapInteractiveArea) => {
      const courseId = hotspotEffectiveCourseId(hit);
      const zoneLabel = resolveCampusMapZoneLabel({
        legacyHitId: hit.id,
        courseId: courseId ?? undefined
      });
      recordCampusZoneVisit(hit.id);
      mergeCampusMapMemory({
        lastPanelKind: "hotspot",
        lastLegacyHitId: hit.id,
        lastBuildingCourseId: courseId ?? null,
        lastZoneLabel: zoneLabel,
        lastAvatarPct: useCampusStore.getState().player,
        lastActivityAt: Date.now(),
        discoveredHotspotIds: [hit.id]
      });
      if (status !== "authenticated") return;
      useCampusSocialZoneStore.getState().setCampusSocialZoneLabel(zoneLabel);
      touchCampusZoneMut.mutate({
        zoneLabel,
        legacyHitId: hit.id,
        courseAreaId: courseId
      });
    },
    [status, touchCampusZoneMut]
  );

  const handleSelectArea = (area: Area, opts?: { legacyHitId?: string | null }) => {
    const touchLocalZoneVisit = () => {
      const zoneLabel = resolveCampusMapZoneLabel({
        legacyHitId: opts?.legacyHitId ?? undefined,
        courseId: area.id
      });
      const visitKey = opts?.legacyHitId?.trim() || area.id;
      recordCampusZoneVisit(visitKey);
      mergeCampusMapMemory({
        lastPanelKind: "course",
        lastBuildingCourseId: area.id,
        lastLegacyHitId: opts?.legacyHitId ?? null,
        lastZoneLabel: zoneLabel,
        lastAvatarPct: useCampusStore.getState().player,
        lastActivityAt: Date.now()
      });
    };

    const touchIfAuthed = () => {
      touchLocalZoneVisit();
      if (status !== "authenticated") return;
      const zoneLabel = resolveCampusMapZoneLabel({
        legacyHitId: opts?.legacyHitId ?? undefined,
        courseId: area.id
      });
      useCampusSocialZoneStore.getState().setCampusSocialZoneLabel(zoneLabel);
      touchCampusZoneMut.mutate({
        zoneLabel,
        legacyHitId: opts?.legacyHitId ?? null,
        courseAreaId: area.id
      });
    };

    if (isCampusAdmin) {
      setSelected(area);
      setCoursePanelLegacyHitId(opts?.legacyHitId ?? null);
      touchIfAuthed();
      return;
    }
    if (isCampusAreaConstruction(area.id)) {
      setGateOpen({ kind: "construction", area });
      return;
    }
    if (!canEnterCourses) {
      setGateOpen({ kind: "enroll", area });
      return;
    }
    setSelected(area);
    setCoursePanelLegacyHitId(opts?.legacyHitId ?? null);
    touchIfAuthed();
  };

  const openCampusLessonFromMap = useCallback(
    (area: Area, lessonIndex: number) => {
      if (isCampusAdmin) {
        setCampusLesson({ area, idx: lessonIndex });
        setSelected(null);
        return;
      }
      if (isCampusAreaConstruction(area.id)) {
        setGateOpen({ kind: "construction", area });
        return;
      }
      if (!canEnterCourses) {
        setGateOpen({ kind: "enroll", area });
        return;
      }
      setCampusLesson({ area, idx: lessonIndex });
      setSelected(null);
    },
    [canEnterCourses, isCampusAdmin]
  );

  const c101Area = useMemo(
    () => areas.find((a) => a.id === CANNABIS101_AREA_ID) ?? null,
    []
  );

  const hotspotDebugConsumedRef = useRef<string | null>(null);
  useEffect(() => {
    const raw = searchParams.get("hotspot")?.trim();
    if (!raw) {
      hotspotDebugConsumedRef.current = null;
      return;
    }
    if (hotspotDebugConsumedRef.current === raw) return;

    const action = resolveCampusHotspotDebugParam(raw);
    hotspotDebugConsumedRef.current = raw;

    queueMicrotask(() => {
      if (action?.kind === "panel_hit") {
        useCampusHudStore.getState().setCampusMapHotspotPanelHitId(action.hitId);
        setCampusLesson(null);
        setSelected(null);
      } else if (action?.kind === "lesson" && c101Area) {
        useCampusHudStore.getState().setCampusMapHotspotPanelHitId(null);
        openCampusLessonFromMap(c101Area, action.lessonIndex);
      }
      const params = new URLSearchParams(searchParams.toString());
      params.delete("hotspot");
      const qs = params.toString();
      const base = pathname || "/campus";
      router.replace(qs ? `${base}?${qs}` : base, { scroll: false });
    });
  }, [pathname, searchParams, router, openCampusLessonFromMap, c101Area]);

  const cinemaParamConsumedRef = useRef<string | null>(null);
  useEffect(() => {
    const raw = searchParams.get("cinema")?.trim().toLowerCase();
    if (!raw || (raw !== "1" && raw !== "open")) {
      cinemaParamConsumedRef.current = null;
      return;
    }
    if (cinemaParamConsumedRef.current === raw) return;
    cinemaParamConsumedRef.current = raw;

    queueMicrotask(() => {
      useCampusHudStore.getState().setCampusMapCinemaLiveOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("cinema");
      const qs = params.toString();
      const base = pathname || "/campus";
      router.replace(qs ? `${base}?${qs}` : base, { scroll: false });
    });
  }, [pathname, searchParams, router]);

  const serverHasCannabis101LessonProgress = useMemo(() => {
    if (status !== "authenticated") return false;
    if (!lessonMineFetched) return false;
    const arr = lessonProgressMine?.byArea?.[CANNABIS101_AREA_ID];
    return Array.isArray(arr) && arr.length > 0;
  }, [lessonMineFetched, lessonProgressMine?.byArea, status]);

  const [c101BeaconVisible, setC101BeaconVisible] = useState(false);

  const computeC101StartBeacon = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!isCampusAutoOnboardingUxEnabled()) {
      setC101BeaconVisible(false);
      return;
    }
    if (!c101Area || !canEnterCourses) {
      setC101BeaconVisible(false);
      return;
    }
    if (!isCampusAdmin && isCampusAreaConstruction(c101Area.id)) {
      setC101BeaconVisible(false);
      return;
    }
    if (hasCannabis101FirstLessonBegunSync()) {
      setC101BeaconVisible(false);
      return;
    }
    if (cannabis101HasLocalLessonMarksSync()) {
      setC101BeaconVisible(false);
      return;
    }
    if (getLastLessonIndex(CANNABIS101_AREA_ID, 0) > 0) {
      setC101BeaconVisible(false);
      return;
    }
    if (serverHasCannabis101LessonProgress) {
      setC101BeaconVisible(false);
      return;
    }
    setC101BeaconVisible(true);
  }, [c101Area, canEnterCourses, isCampusAdmin, serverHasCannabis101LessonProgress]);

  useLayoutEffect(() => {
    computeC101StartBeacon();
  }, [computeC101StartBeacon]);

  useEffect(() => {
    window.addEventListener(CANNABIS101_START_HINT_EVENT, computeC101StartBeacon);
    window.addEventListener("storage", computeC101StartBeacon);
    return () => {
      window.removeEventListener(CANNABIS101_START_HINT_EVENT, computeC101StartBeacon);
      window.removeEventListener("storage", computeC101StartBeacon);
    };
  }, [computeC101StartBeacon]);

  useEffect(() => {
    const id = selected?.id;
    if (id) touchCampusCourseEntry(id);
  }, [selected?.id]);

  const openResumeLesson = useCallback(() => {
    const snap = loadCampusProgress();
    const resumeArea =
      typeof snap.lastAreaId === "string" ? areaByCampusId(snap.lastAreaId) : undefined;
    if (!resumeArea) return;
    if (!isCampusAdmin && isCampusAreaConstruction(resumeArea.id)) {
      setGateOpen({ kind: "construction", area: resumeArea });
      return;
    }
    if (!canEnterCourses) {
      setGateOpen({ kind: "enroll", area: resumeArea });
      return;
    }
    const idx = getResumeLessonIndex(resumeArea.id, snap);
    setCampusLesson({ area: resumeArea, idx });
  }, [canEnterCourses, isCampusAdmin]);

  const campusResumeLessonNonce = useCampusHudStore((s) => s.campusResumeLessonNonce);
  const setCampusStoreOpen = useCampusHudStore((s) => s.setCampusStoreOpen);
  const resumeFromHudRef = useRef(0);
  useEffect(() => {
    if (campusResumeLessonNonce <= resumeFromHudRef.current) return;
    resumeFromHudRef.current = campusResumeLessonNonce;
    openResumeLesson();
  }, [campusResumeLessonNonce, openResumeLesson]);

  const openCannabis101FromBeacon = useCallback(() => {
    if (!c101Area) return;
    if (!isCampusAdmin && isCampusAreaConstruction(c101Area.id)) {
      setGateOpen({ kind: "construction", area: c101Area });
      return;
    }
    if (!canEnterCourses) {
      setGateOpen({ kind: "enroll", area: c101Area });
      return;
    }
    markCannabis101FirstLessonBegun();
    setPlayerLoose(c101Area.position);
    setSelected(null);
    setCampusLesson({ area: c101Area, idx: 0 });
  }, [canEnterCourses, c101Area, isCampusAdmin, setPlayerLoose]);

  const zoneEntryPromptEnabled = useMemo(() => isCampusZoneEntryPromptEnabled(), []);

  const nearResult = useMemo(
    () => nearestArea(player, 10),
    [player.x, player.y]
  );

  useEffect(() => {
    setDismissNearId(null);
  }, [nearResult?.area.id]);

  const proximityName = useMemo(() => {
    if (!zoneEntryPromptEnabled || !zoneProximityHydrated) return null;
    if (
      !nearResult ||
      dismissNearId === nearResult.area.id ||
      selected?.id === nearResult.area.id
    ) {
      return null;
    }
    if (readDismissedZoneEntryPromptIds().has(nearResult.area.id)) return null;
    return nearResult.area.mapLabel ?? nearResult.area.name;
  }, [
    zoneEntryPromptEnabled,
    zoneProximityHydrated,
    nearResult,
    dismissNearId,
    selected?.id,
    zonePromptDismissTick
  ]);

  const dismissProximityPrompt = useCallback(() => {
    if (!nearResult) return;
    dismissZoneEntryPromptForArea(nearResult.area.id);
    setDismissNearId(nearResult.area.id);
    setZonePromptDismissTick((t) => t + 1);
  }, [nearResult]);

  const authLabel =
    session?.user?.name?.trim() ||
    session?.user?.email?.split("@")[0]?.trim() ||
    "Aluno THC";
  const presenceDisplayName =
    status === "authenticated" ? authLabel.slice(0, 28) : "Aluno THC";

  const presenceLevelLabel =
    status !== "authenticated"
      ? "Visitante"
      : (myGamification?.levelLabel?.trim() ?? "···").slice(0, 28);

  const presenceXpTotal =
    status === "authenticated" && typeof myGamification?.xp === "number"
      ? myGamification.xp
      : 0;

  const presenceCampusRole = useMemo(
    () =>
      deriveCampusPresenceRole({
        email: session?.user?.email,
        accessStatus: campusAccess?.accessStatus ?? null
      }),
    [session?.user?.email, campusAccess?.accessStatus]
  );

  const membershipSinceIso =
    status === "authenticated" ? campusAccess?.memberSinceIso ?? null : null;

  const unlockCtx: CampusUnlockContext = useMemo(
    () => ({
      studentXP: presenceXpTotal,
      areaDone: progress?.areas,
      isAdmin: isCampusAdmin,
      publicAll: process.env.NEXT_PUBLIC_CAMPUS_PUBLIC_ALL === "true"
    }),
    [presenceXpTotal, progress?.areas, isCampusAdmin]
  );

  const campusUnlockPct = useMemo(
    () => campusUnlockStats(unlockCtx).pct,
    [unlockCtx]
  );

  const advancedMap = isCampusAdvancedMap();

  useLayoutEffect(() => {
    if (campusAvatarLsHydratedRef.current) return;
    campusAvatarLsHydratedRef.current = true;
    const saved = readCampusAvatarPositionV1();
    if (!saved) return;
    if (advancedMap) setPlayer({ x: saved.xPercent, y: saved.yPercent });
    else setPlayerLoose({ x: saved.xPercent, y: saved.yPercent });
  }, [advancedMap, setPlayer, setPlayerLoose]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      writeCampusAvatarPositionV1({ xPercent: player.x, yPercent: player.y });
    }, 320);
    return () => window.clearTimeout(id);
  }, [player.x, player.y]);

  useEffect(() => {
    if (status !== "authenticated" || !campusWorld || campusRestoreDoneRef.current) return;
    const { restore } = campusWorld;
    const hasMemory =
      Boolean(restore.lastPanelKind) ||
      Boolean(restore.lastLegacyHitId) ||
      Boolean(restore.lastBuildingCourseId) ||
      Boolean(restore.lastMicroLessonBlueprintId);
    if (!hasMemory) return;

    campusRestoreDoneRef.current = true;

    if (restore.lastLegacyHitId && !advancedMap) {
      const hit = CAMPUS_MAP_INTERACTIVE_AREAS.find((h) => h.id === restore.lastLegacyHitId);
      if (hit) {
        const c = imageMapApproxCenterPct(hit.coords, hit.shape);
        setPlayerLoose({
          x: Math.min(99, Math.max(1, c.x)),
          y: Math.min(99, Math.max(1, c.y))
        });
      }
    }

    if (!canEnterCourses && !isCampusAdmin) return;

    if (restore.lastPanelKind === "course" && restore.lastBuildingCourseId) {
      const a = areas.find((x) => x.id === restore.lastBuildingCourseId);
      if (a) {
        setSelected(a);
        setCoursePanelLegacyHitId(restore.lastLegacyHitId);
      }
    } else if (restore.lastPanelKind === "hotspot" && restore.lastLegacyHitId) {
      useCampusHudStore.getState().setCampusMapHotspotPanelHitId(restore.lastLegacyHitId);
    }
  }, [status, campusWorld, advancedMap, canEnterCourses, isCampusAdmin, setPlayerLoose]);

  /**
   * Mapa simples: sempre `contain` (arte inteira, sem corte nem distorção). Debug/preview/overlays seguem o mesmo alinhamento.
   * Mapa avançado: `cover` no palco cheio (exceto quando flags de debug pedem contain).
   */
  const campusMapUsesContainLayout = useMemo(
    () =>
      !advancedMap ||
      internalPreview ||
      mapZonesPolygonDebug ||
      isCampusMapInteractiveDebugEnabled() ||
      isCampusMapAreasPolygonOverlayEnabled(),
    [advancedMap, internalPreview, mapZonesPolygonDebug]
  );

  const useSimpleArtFrame = !advancedMap;

  const campusMapBgImgStyle = useMemo(
    () => (campusMapUsesContainLayout ? CAMPUS_MAP_BACKGROUND_IMG_STYLE_CONTAIN : CAMPUS_MAP_BACKGROUND_IMG_STYLE),
    [campusMapUsesContainLayout]
  );

  const interactiveMapSvgPar = useMemo(
    () => campusMapInteractiveSvgPreserveAspectRatio(CAMPUS_IMAGE_OBJECT_FIT_SIMPLE),
    []
  );

  /**
   * Hotspots flutuantes legacy (pino + label HTML): só em preview interno.
   * No `/campus` público o `CampusMapInteractiveLayer` cobre cliques — pins âmbar duplicavam o polo Cannabis 101.
   */
  const mapLegacyHotspotAreas = useMemo(() => {
    if (!showHotspots) return [];
    if (internalPreview) return areas;
    return [];
  }, [showHotspots, internalPreview]);

  const setCampusMapUnlockPct = useCampusHudStore((s) => s.setCampusMapUnlockPct);

  useEffect(() => {
    if (!advancedMap) {
      setCampusMapUnlockPct(null);
      return;
    }
    setCampusMapUnlockPct(campusUnlockPct);
    return () => setCampusMapUnlockPct(null);
  }, [advancedMap, campusUnlockPct, setCampusMapUnlockPct]);

  const customCursor =
    advancedMap && process.env.NEXT_PUBLIC_CUSTOM_CURSOR === "true";
  useCampusAdminBroadcastHotkeys(isCampusAdmin);
  useCampusLiveAdminHotkeys(isCampusAdmin);

  useCampusEmojiReactionHotkeys();
  useCampusPresence();

  const [httpPresencePeers, setHttpPresencePeers] = useState<CampusLivePresenceOnlineDto[]>([]);
  useCampusLivePresenceHeartbeat(setHttpPresencePeers);

  const campusAutoReloadMs = useMemo(() => campusMapAutoReloadIntervalMs(), []);

  useEffect(() => {
    if (campusAutoReloadMs <= 0 || typeof window === "undefined") return;
    const onCampus =
      pathname === CAMPUS_HOME_PATH ||
      (pathname?.startsWith(`${CAMPUS_HOME_PATH}/`) ?? false);
    if (!onCampus) return;
    const id = window.setInterval(() => window.location.reload(), campusAutoReloadMs);
    return () => window.clearInterval(id);
  }, [pathname, campusAutoReloadMs]);

  const presenceBreakdown = useCampusPresenceBreakdown();

  return (
    <div
      className="relative w-full h-[100svh] overflow-hidden bg-ink-900 no-select"
      data-campus-immersive="1"
      data-sky={sky}
    >
      {internalPreview ? <InternalPreviewBanner /> : null}

      <CampusPresenceSync
        displayName={presenceDisplayName}
        levelLabel={presenceLevelLabel}
        xpTotal={presenceXpTotal}
        campusRole={presenceCampusRole}
        memberSinceIso={membershipSinceIso}
      />
      <CampusSelfPresenceSync />
      <CampusWorldPersistenceSync />

      <div className="absolute inset-0 z-[1] min-h-0 bg-ink-900">
        <div
          id="campus-map-stage"
          data-tour-id="campus-map"
          className={cn(
            "relative isolate h-full min-h-0 w-full overflow-hidden",
            useSimpleArtFrame && "flex items-center justify-center",
            advancedMap && "shadow-xl shadow-black/35 ring-1 ring-amber-400/8",
            customCursor && "campus-map-native-cursor-hidden",
            isCampusMapDebugOutline() &&
              "outline outline-[3px] outline-red-600 outline-offset-[-3px]"
          )}
        >
          {useSimpleArtFrame ? (
            <div
              className="campus-map-blur-backdrop pointer-events-none absolute inset-0 z-0 overflow-hidden"
              aria-hidden
            >
              <div
                className={cn(
                  "campus-map-blur-backdrop__phase absolute inset-0 transition-opacity duration-700 ease-out",
                  sky === "night" ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                {nightOk ? (
                  /* eslint-disable-next-line @next/next/no-img-element -- fundo blur full-bleed (ambience) */
                  <img
                    src={bgNightSrc}
                    alt=""
                    className="pointer-events-none"
                    style={{ ...CAMPUS_MAP_SIMPLE_STAGE_BACKDROP_IMG_STYLE }}
                    decoding="async"
                  />
                ) : (
                  <div
                    className="absolute inset-0 opacity-[0.22]"
                    style={{ background: PLACEHOLDER_NIGHT, filter: "blur(24px) saturate(0.8)" }}
                  />
                )}
              </div>
              <div
                className={cn(
                  "campus-map-blur-backdrop__phase absolute inset-0 transition-opacity duration-700 ease-out",
                  sky === "day" ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                {dayOk ? (
                  /* eslint-disable-next-line @next/next/no-img-element -- fundo blur full-bleed (ambience) */
                  <img
                    src={bgDaySrc}
                    alt=""
                    className="pointer-events-none"
                    style={{ ...CAMPUS_MAP_SIMPLE_STAGE_BACKDROP_IMG_STYLE }}
                    decoding="async"
                  />
                ) : (
                  <div
                    className="absolute inset-0 opacity-[0.22]"
                    style={{ background: PLACEHOLDER_DAY, filter: "blur(24px) saturate(0.8)" }}
                  />
                )}
              </div>
            </div>
          ) : null}

          {useSimpleArtFrame ? (
            <div className="campus-map-letterbox-gutter pointer-events-none absolute inset-0 z-[1]" aria-hidden />
          ) : null}

          <div
            id={useSimpleArtFrame ? "campus-map-art-frame" : undefined}
            className={cn(
              "campus-map-art-root min-h-0 min-w-0",
              useSimpleArtFrame
                ? "campus-map-art-frame-premium relative z-[2] mx-auto w-full max-h-full max-w-full shrink-0 overflow-hidden"
                : "absolute inset-0 overflow-hidden"
            )}
            style={
              useSimpleArtFrame ? { aspectRatio: `${CAMPUS_ART_WIDTH} / ${CAMPUS_ART_HEIGHT}` } : undefined
            }
          >
            <CampusMapErrorBoundary
              bgNightSrc={bgNightSrc}
              bgDaySrc={bgDaySrc}
              campusMapAlignmentPreview={campusMapUsesContainLayout}
            >
            {/* Fundos estáticos (<img>): sem Opacity inicial do Framer no pai — evita tela só com bg-ink-900. */}
            <div
              className={cn(
                "absolute inset-0 z-[2] transition-opacity duration-700 ease-out",
                sky === "night" ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              aria-hidden={sky !== "night"}
            >
              {nightOk ? (
                /* eslint-disable-next-line @next/next/no-img-element -- fundo full-viewport estável */
                <img
                  src={bgNightSrc}
                  alt=""
                  className="campus-map-base-art pointer-events-none opacity-100"
                  style={{ ...campusMapBgImgStyle }}
                  decoding="async"
                  onError={() => setNightOk(false)}
                />
              ) : (
                <div
                  className="absolute inset-0 z-0"
                  style={{ background: PLACEHOLDER_NIGHT }}
                />
              )}
              {!cineDriveInOpen ? (
                <div
                  className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/12 via-transparent to-black/24"
                  aria-hidden
                />
              ) : null}
            </div>

            <div
              className={cn(
                "absolute inset-0 z-[3] transition-opacity duration-700 ease-out",
                sky === "day" ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              aria-hidden={sky !== "day"}
            >
              {dayOk ? (
                /* eslint-disable-next-line @next/next/no-img-element -- fundo full-viewport estável */
                <img
                  src={bgDaySrc}
                  alt=""
                  className="campus-map-base-art pointer-events-none opacity-100"
                  style={{ ...campusMapBgImgStyle }}
                  decoding="async"
                  onError={() => setDayOk(false)}
                />
              ) : (
                <div
                  className="absolute inset-0 z-0"
                  style={{ background: PLACEHOLDER_DAY }}
                />
              )}
              {!cineDriveInOpen ? (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-sky-400/4 via-transparent to-amber-200/7"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_14%,rgba(255,251,235,0.075),transparent_58%)]"
                    aria-hidden
                  />
                </>
              ) : null}
            </div>

            {!advancedMap && !cineDriveInOpen ? (
              <div
                className="campus-map-art-vignette pointer-events-none absolute inset-0 z-[4]"
                aria-hidden
              />
            ) : null}

            {!cineDriveInOpen ? (
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out",
                  advancedMap ? "z-[4]" : "z-[5]",
                  sky === "night" ? "campus-depth-night" : "campus-depth-day"
                )}
                aria-hidden
              />
            ) : null}

            {mapZonesPolygonDebug || isCampusMapAreasPolygonOverlayEnabled() ? (
              <CampusMapAreasDebugOverlay
                catalogMergeEnabled={
                  mapZonesPolygonDebug || isCampusMapAreasPolygonOverlayEnabled()
                }
              />
            ) : null}

            {advancedMap ? <CampusWalkableLayer /> : null}

            {advancedMap && !cineDriveInOpen ? (
              <CampusBiomeOverlays phase={sky === "day" ? "day" : "night"} />
            ) : null}

            <div className="campus-map-fx-clip pointer-events-none absolute inset-0 z-[7] overflow-hidden">
              <AmbientLife phase={phase} />
              <CampusAmbientSparks phase={phase} />
              <CampusVivoLayer
                phase={phase}
                presence={presenceBreakdown}
                socialRegisteredOnline={campusSocialPoll?.registeredOnlineCount ?? null}
              />
              <CampusSocialPresenceDots
                phase={phase}
                peers={status === "authenticated" ? campusSocialPoll?.peers ?? null : null}
                httpPeers={httpPresencePeers}
              />
            </div>

            {!cineDriveInOpen ? (
              <>
                <div
                  className="campus-map-cinematic-ledge-top pointer-events-none absolute inset-x-0 top-0 z-[7]"
                  aria-hidden
                />
                <div
                  className="campus-map-cinematic-ledge-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[7]"
                  aria-hidden
                />
              </>
            ) : null}
          </CampusMapErrorBoundary>

          {advancedMap ? (
            <>
              <div className="absolute inset-0 z-[8]">
                <MapWalkLayer onWalkTo={setPlayer} />
              </div>
              {!cineDriveInOpen ? (
                <CampusFogZonesLayer
                  isNight={sky === "night"}
                  unlockCtx={unlockCtx}
                  liveActive={livePulse}
                  areaProgress={progress?.areas}
                  onSelectArea={handleSelectArea}
                  onWalkTo={setPlayer}
                  hideNativeCursor={customCursor}
                />
              ) : null}
              <CampusMapCustomCursor active={customCursor} />
            </>
          ) : (
            <div className="absolute inset-0 z-[8]">
              <CampusSimpleMapLayer
                onSelectArea={handleSelectArea}
                setPlayerLoose={setPlayerLoose}
              />
              <CampusMapInteractiveLayer
                sky={phase}
                setPlayerLoose={setPlayerLoose}
                imageObjectFit={CAMPUS_IMAGE_OBJECT_FIT_SIMPLE}
                svgPreserveAspectRatio={interactiveMapSvgPar}
                hitZoneStates={campusWorld?.hitZoneStates}
                onPersistInteractiveActivation={persistInteractiveActivation}
                zonesDebugChrome={mapZonesPolygonDebug}
                cinemaLiveActive={livePulse}
                onOpenCampusCourse={(courseId, legacyHitId) => {
                  const area = areas.find((a) => a.id === courseId);
                  if (area) handleSelectArea(area, { legacyHitId: legacyHitId ?? null });
                }}
                onOpenCampusLesson={(courseId, lessonIndex) => {
                  const area = areas.find((a) => a.id === courseId);
                  if (area) openCampusLessonFromMap(area, lessonIndex);
                }}
              />
              {ENABLE_SEMANTIC_MAP_OVERLAY ? (
                <CampusSemanticMapOverlay
                  areas={areas}
                  onSelectCourseArea={handleSelectArea}
                  onTryOpenCannabis101LessonByStableId={(stableId) => {
                    if (!c101Area) return false;
                    const idx = cannabis101StableIdToLessonIndex(stableId);
                    if (idx === null) return false;
                    openCampusLessonFromMap(c101Area, idx);
                    return true;
                  }}
                />
              ) : null}
            </div>
          )}
          {mapLegacyHotspotAreas.length > 0 ? (
            // Sem isto, o rect fullscreen intercepta cliques antes do SVG (`CampusMapInteractiveLayer`, z-8).
            <div className="pointer-events-none absolute inset-0 z-10">
              {mapLegacyHotspotAreas.map((area) => (
                <Hotspot
                  key={area.id}
                  area={area}
                  showCourseLabels={showCourseLabels}
                  onSelect={handleSelectArea}
                  active={selected?.id === area.id}
                  completed={Boolean(progress?.areas[area.id])}
                />
              ))}
            </div>
          ) : null}

          {c101Area ? (
            <Cannabis101StartBeacon
              area={c101Area}
              sky={phase}
              visible={c101BeaconVisible}
              onActivate={openCannabis101FromBeacon}
            />
          ) : null}

          <CampusCineHotspot />

          <div className="pointer-events-none absolute inset-0 z-[10]">
            <CampusMicroHotspotDecorLayer />
          </div>

          <div className="pointer-events-none absolute inset-0 z-[12]">
            <CampusPlayer
              tagDisplayName={presenceDisplayName}
              tagXpTotal={presenceXpTotal}
              campusRole={presenceCampusRole}
              memberSinceIso={membershipSinceIso}
              gamificationAvatarVariant={localGamification.avatarVariant}
            />
            <CampusMapPeerLayer
              socialPeers={status === "authenticated" ? campusSocialPoll?.peers ?? null : null}
              socialPollResolved={status !== "authenticated" || campusSocialPoll !== undefined}
              allowAmbientMock={false}
            />
          </div>
          </div>
        </div>
      </div>

      {!advancedMap ? (
        <>
          <CampusMapTour
            advancedMap={advancedMap}
            cannabisPosition={c101Area?.position ?? { x: 86, y: 36 }}
          />
          <CampusWelcomeModal
            advancedMap={advancedMap}
            onStartTour={() => useCampusHudStore.getState().requestCampusTourOpen()}
          />
        </>
      ) : (
        <CampusMapTour advancedMap={advancedMap} cannabisPosition={c101Area?.position ?? { x: 86, y: 36 }} />
      )}

      {anyMissing ? <PlaceholderHint mode={sky} /> : null}

      <ProximityBanner
        areaName={proximityName}
        onOpen={() => {
          if (nearResult) handleSelectArea(nearResult.area);
        }}
        onDismiss={dismissProximityPrompt}
      />

      <CineDriveIn liveBroadcast={liveBroadcast} />

      <CampusAdminBroadcastLayer isCampusAdmin={isCampusAdmin} />
      <CampusAdminBroadcastComposer isCampusAdmin={isCampusAdmin} />
      <CampusLiveAdminComposer isCampusAdmin={isCampusAdmin} />

      <HUD />

      {!advancedMap ? (
        <CampusMapInteractiveMapPanels sky={phase} showHotspotTechStripe={mapZonesPolygonDebug} />
      ) : null}

      <div
        className={cn(
          "pointer-events-none fixed z-[28] flex max-w-[min(22rem,calc(100vw-1.25rem))] flex-col items-end gap-2",
          "max-sm:left-3 max-sm:right-3 max-sm:max-w-none",
          "bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-3 sm:bottom-6 sm:right-4 sm:max-w-[min(340px,calc(100vw-2rem))]"
        )}
        aria-label="Atalhos do mapa"
      >
        <button
          type="button"
          className="pointer-events-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.14] bg-black/[0.18] text-amber-200/95 shadow-[0_4px_22px_rgba(0,0,0,0.2)] ring-1 ring-amber-400/18 backdrop-blur-2xl transition hover:border-emerald-300/35 hover:bg-white/[0.12] hover:text-white"
          aria-label="Abrir loja do campus"
          title="Loja"
          onClick={() => {
            markMissionStoreEntered();
            setCampusStoreOpen(true);
          }}
        >
          <ShoppingBag size={15} strokeWidth={2} aria-hidden />
        </button>
        {!advancedMap ? (
          <CampusStartHereCard
            advancedMap={advancedMap}
            openCannabis101={openCannabis101FromBeacon}
            openResumeLesson={openResumeLesson}
            embed
          />
        ) : null}
        <CampusResumeChip
          lessonPanelOpen={campusLesson != null}
          onContinue={openResumeLesson}
          embed
        />
      </div>

      <CoursePanel
        area={selected}
        legacyHitId={coursePanelLegacyHitId}
        microLessonProgressById={microLessonProgressById}
        onClose={() => {
          setSelected(null);
          setCoursePanelLegacyHitId(null);
        }}
        onOpenCampusLesson={(lessonIndex) => {
          if (!selected) return;
          const idx =
            typeof lessonIndex === "number"
              ? lessonIndex
              : getLastLessonIndex(selected.id, 0);
          setCampusLesson({ area: selected, idx });
          setSelected(null);
        }}
      />

      <CampusAreaGateModal
        open={gateOpen != null}
        kind={gateOpen?.kind ?? null}
        area={gateOpen?.area ?? null}
        sky={sky}
        onClose={() => setGateOpen(null)}
      />

      <LessonPanel
        open={campusLesson != null}
        area={campusLesson?.area ?? null}
        lessonIndex={campusLesson?.idx ?? 0}
        allAreas={areas}
        onClose={() => setCampusLesson(null)}
        onSelectArea={(a) =>
          setCampusLesson({ area: a, idx: getLastLessonIndex(a.id, 0) })
        }
        onSelectLesson={(idx) =>
          setCampusLesson((c) =>
            c ? { area: c.area, idx } : c
          )
        }
      />

      <CampusChatDrawer />
    </div>
  );
}

function PlaceholderHint({ mode }: { mode: "day" | "night" }) {
  const isDay = mode === "day";

  return (
    <div className="absolute bottom-20 left-4 z-[25] max-w-lg px-0 sm:bottom-16">
      <div className="glass-strong rounded-2xl border border-canna-400/28 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-canna-300">
          Arte {isDay ? "diurna" : "noturna"} não encontrada
        </p>
        <p className="mt-2 text-sm text-white/75 leading-snug">
          Salve sua imagem do campus em{" "}
          <code className="rounded bg-black/35 px-1.5 py-0.5 text-canna-200 text-[11px]">
            public/campus/{isDay ? "campus-day.png" : "campus.png"}
          </code>{" "}
          (ou .webp) e atualize — o fundo provisório de{" "}
          {isDay ? "dia" : "noite"} está ativo.
        </p>
      </div>
    </div>
  );
}
