"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Leaf,
  MessageCircle,
  Sparkles,
  User2,
  Bell,
  Sun,
  Moon,
  CalendarHeart,
  Newspaper,
  Radio,
  Home,
  ClipboardList,
  ShoppingBag,
  Trophy,
  Medal,
  MoreHorizontal,
  MapPin,
  Play,
  LogOut,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { cn } from "@/lib/utils";
import { useCampusSkyStore } from "@/stores/campusSkyStore";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { isCampusAdminEmail } from "@/lib/campusAdmin";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";
import { cannabis101HudNextLessonCue } from "@/content/courses";
import { isCampusAdvancedMap } from "@/config/campusMapStability";
import { CampusStudentGamificationHudChip } from "@/components/campus/CampusStudentGamificationHudChip";
import { CampusProfileForm } from "@/components/campus/CampusProfileForm";
import { CampusStoreModal } from "@/components/campus/CampusStoreModal";
import { CreditBalanceChip } from "@/components/campus/CreditBalanceChip";
import { StudentRewardToast } from "@/components/campus/StudentRewardToast";
import { LiveHudNotifications } from "@/components/campus/LiveHudNotifications";
import { CampusPresencePanel } from "@/components/campus/presence/CampusPresencePanel";
import { LiveCampusFeed } from "@/components/campus/presence/LiveCampusFeed";
import { MissionRewardToast } from "@/components/campus/missions/MissionRewardToast";
import { StudentMissionsPanel } from "@/components/campus/missions/StudentMissionsPanel";
import {
  markMissionCampusEntered,
  markMissionPanelOpened,
  markMissionStoreEntered
} from "@/lib/studentMissionsTelemetry";
import { useCampusPresenceBreakdown } from "@/hooks/useCampusPresenceBreakdown";
import { useLiveCampusHudFeedStore } from "@/stores/liveCampusHudFeedStore";
import { useCampusStore } from "@/stores/campusStore";
import { CampusHudAmbientMusic } from "@/components/campus/CampusHudAmbientMusic";

const CampusLeaderboardLazy = lazy(async () => {
  const m = await import("@/components/campus/leaderboard/CampusLeaderboard");
  return { default: m.CampusLeaderboard };
});

const mapHudGlassBtn =
  "flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.14] bg-black/[0.16] text-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition hover:border-emerald-300/35 hover:bg-white/[0.12] hover:text-white sm:h-9 sm:w-9";

const mapHudGlassPill =
  "inline-flex items-center gap-1 rounded-full border border-white/[0.12] bg-black/[0.18] px-2.5 py-1 text-[10px] font-semibold text-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition hover:border-emerald-300/28 hover:bg-white/[0.1] sm:text-[11px]";

function campusProfileInitials(name: string | null | undefined, email: string | null | undefined): string {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase().slice(0, 2);
    }
    return n.slice(0, 2).toUpperCase();
  }
  const e = email?.trim();
  if (e) return e.slice(0, 2).toUpperCase();
  return "?";
}

export function HUD() {
  const pathname = usePathname();
  const router = useRouter();
  const campusNavActive =
    pathname === CAMPUS_HOME_PATH || pathname.startsWith(`${CAMPUS_HOME_PATH}/`);
  const sky = useCampusSkyStore((s) => s.sky);
  const toggleSky = useCampusSkyStore((s) => s.toggleSky);
  const onlineCount = useCampusHudStore((s) => s.campusVisitorCount);
  const chatOpen = useCampusHudStore((s) => s.chatOpen);
  const setChatOpen = useCampusHudStore((s) => s.setChatOpen);
  const setEventsOpen = useCampusHudStore((s) => s.setEventsOpen);
  const setMuralOpen = useCampusHudStore((s) => s.setMuralOpen);
  const eventsOpen = useCampusHudStore((s) => s.eventsOpen);
  const muralOpen = useCampusHudStore((s) => s.muralOpen);
  const setCampusLiveComposerOpen = useCampusHudStore(
    (s) => s.setCampusLiveComposerOpen
  );
  const campusMapUnlockPct = useCampusHudStore((s) => s.campusMapUnlockPct);
  const requestCampusTourOpen = useCampusHudStore((s) => s.requestCampusTourOpen);
  const campusProfileOpenNonce = useCampusHudStore((s) => s.campusProfileOpenNonce);
  const campusStoreOpen = useCampusHudStore((s) => s.campusStoreOpen);
  const setCampusStoreOpen = useCampusHudStore((s) => s.setCampusStoreOpen);
  const campusMissionsOpen = useCampusHudStore((s) => s.campusMissionsOpen);
  const setCampusMissionsOpen = useCampusHudStore((s) => s.setCampusMissionsOpen);
  const requestCampusResumeLesson = useCampusHudStore((s) => s.requestCampusResumeLesson);

  const { data: session, status } = useSession();
  const campusAdmin = isCampusAdminEmail(session?.user?.email ?? null);
  const { data: xpData } = trpc.campus.myProgress.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 30_000
  });
  const { data: events } = trpc.campus.campusEvents.useQuery(undefined, {
    staleTime: 3600_000
  });
  const { data: mural } = trpc.campus.muralFeed.useQuery(
    { take: 10 },
    {
      enabled: muralOpen,
      staleTime: 15_000
    }
  );
  const utils = trpc.useUtils();
  const [muralBody, setMuralBody] = useState("");
  const [campusProfileOpen, setCampusProfileOpen] = useState(false);
  const muralPost = trpc.campus.muralPost.useMutation({
    onSuccess: () => {
      void utils.campus.muralFeed.invalidate();
      setMuralBody("");
    }
  });
  const { data: badges } = trpc.campus.myBadges.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 120_000
  });
  const tickStreak = trpc.campus.tickStreak.useMutation();
  const streakOnceRef = useRef(false);
  const profileOpenNonceHandled = useRef(0);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const presenceBreakdown = useCampusPresenceBreakdown();
  const hudFeedItems = useLiveCampusHudFeedStore((s) => s.items);
  const [campusMoreOpen, setCampusMoreOpen] = useState(false);
  const [campusNotifOpen, setCampusNotifOpen] = useState(false);
  const [campusPresenceOpen, setCampusPresenceOpen] = useState(false);
  const campusMoreWrapRef = useRef<HTMLDivElement>(null);
  const campusNotifWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!campusMoreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        campusMoreWrapRef.current &&
        !campusMoreWrapRef.current.contains(e.target as Node)
      ) {
        setCampusMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [campusMoreOpen]);

  useEffect(() => {
    if (!campusNotifOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        campusNotifWrapRef.current &&
        !campusNotifWrapRef.current.contains(e.target as Node)
      ) {
        setCampusNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [campusNotifOpen]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const k = "thc-campus-streak-day";
    const today = new Date().toDateString();
    try {
      if (typeof localStorage === "undefined") return;
      if (localStorage.getItem(k) === today) return;
      if (streakOnceRef.current) return;
      streakOnceRef.current = true;
      tickStreak.mutate(undefined, {
        onSuccess: () => {
          localStorage.setItem(k, today);
        },
        onError: () => {
          streakOnceRef.current = false;
        }
      });
    } catch {
      streakOnceRef.current = false;
    }
  }, [status, tickStreak]);

  useEffect(() => {
    if (!campusNavActive) return;
    markMissionCampusEntered();
  }, [campusNavActive]);

  useEffect(() => {
    if (campusProfileOpenNonce <= profileOpenNonceHandled.current) return;
    profileOpenNonceHandled.current = campusProfileOpenNonce;
    setCampusProfileOpen(true);
  }, [campusProfileOpenNonce]);

  useEffect(() => {
    if (!campusMissionsOpen) return;
    markMissionPanelOpened();
  }, [campusMissionsOpen]);

  const campusAdvancedMap = isCampusAdvancedMap();

  const recenterMap = () => {
    useCampusStore.getState().setPlayer({ x: 42, y: 82 });
  };

  return (
    <>
      <StudentRewardToast />
      <MissionRewardToast />
      <LiveHudNotifications campusNavActive={campusNavActive} />

      {campusNavActive ? (
        <>
          <motion.header
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="pointer-events-none fixed left-0 right-0 top-0 z-20 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 [&_a]:pointer-events-auto [&_button]:pointer-events-auto"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="pointer-events-auto flex items-center gap-1.5">
                <Link
                  href="/"
                  className={cn(mapHudGlassBtn, "shrink-0")}
                  aria-label="THCProce — início"
                  title="Início"
                >
                  <Leaf size={16} className="text-canna-200" />
                </Link>
                <Link href={CAMPUS_HOME_PATH} className={mapHudGlassPill} title="Mapa do campus">
                  <MapPin size={13} className="text-amber-200/90" aria-hidden />
                  <span className="whitespace-nowrap">Mapa</span>
                </Link>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5">
                <CampusHudAmbientMusic />
                <div className="pointer-events-auto relative" ref={campusMoreWrapRef}>
                  <button
                    type="button"
                    className={mapHudGlassBtn}
                    aria-expanded={campusMoreOpen}
                    aria-haspopup="true"
                    aria-label="Menu do campus"
                    onClick={() => {
                      setCampusMoreOpen((v) => !v);
                      setCampusNotifOpen(false);
                    }}
                  >
                    <MoreHorizontal size={17} strokeWidth={2} />
                  </button>
                  <AnimatePresence>
                    {campusMoreOpen ? (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-[calc(100%+0.35rem)] z-[60] min-w-[12.5rem] rounded-xl border border-white/[0.12] bg-black/[0.34] py-1 shadow-xl shadow-black/25 backdrop-blur-2xl ring-1 ring-emerald-400/12"
                        role="menu"
                      >
                        <OverflowAction
                          onClick={() => {
                            setLeaderboardOpen(true);
                            setCampusMoreOpen(false);
                          }}
                        >
                          <Medal size={14} className="text-sky-200/90" /> Ranking
                        </OverflowAction>
                        <OverflowAction
                          onClick={() => {
                            setCampusMissionsOpen(true);
                            setCampusMoreOpen(false);
                          }}
                        >
                          <Trophy size={14} className="text-amber-200/90" /> Missões
                        </OverflowAction>
                        <OverflowAction
                          onClick={() => {
                            markMissionStoreEntered();
                            setCampusStoreOpen(true);
                            setCampusMoreOpen(false);
                          }}
                        >
                          <ShoppingBag size={14} className="text-amber-200/90" /> Loja
                        </OverflowAction>
                        <Link
                          href="/planos"
                          role="menuitem"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-medium text-white/88 transition hover:bg-white/10"
                          data-campus-tour-anchor="planos"
                          onClick={() => setCampusMoreOpen(false)}
                        >
                          <ClipboardList size={14} className="text-canna-200/95" /> Planos
                        </Link>
                        <Link
                          href="/inscrever-se"
                          role="menuitem"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-medium text-white/88 transition hover:bg-white/10"
                          data-campus-tour-anchor="inscrever"
                          onClick={() => setCampusMoreOpen(false)}
                        >
                          <User2 size={14} className="text-amber-200/90" /> Prof THC
                        </Link>
                        {!campusAdvancedMap ? (
                          <OverflowAction
                            onClick={() => {
                              requestCampusTourOpen();
                              setCampusMoreOpen(false);
                            }}
                          >
                            <Sparkles size={14} className="text-gold-300/90" /> Tour do campus
                          </OverflowAction>
                        ) : null}
                        <div className="my-1 h-px bg-white/10" />
                        <OverflowAction
                          onClick={() => {
                            toggleSky();
                            setCampusMoreOpen(false);
                          }}
                        >
                          {sky === "night" ? (
                            <Sun size={14} className="text-amber-200" />
                          ) : (
                            <Moon size={14} className="text-sky-200" />
                          )}
                          {sky === "night" ? "Modo dia" : "Modo noite"}
                        </OverflowAction>
                        <OverflowAction
                          onClick={() => {
                            setEventsOpen(true);
                            setCampusMoreOpen(false);
                          }}
                        >
                          <CalendarHeart size={14} /> Eventos
                        </OverflowAction>
                        <OverflowAction
                          onClick={() => {
                            setMuralOpen(true);
                            setCampusMoreOpen(false);
                          }}
                        >
                          <Newspaper size={14} /> Mural
                        </OverflowAction>
                        <OverflowAction
                          onClick={() => {
                            setChatOpen(!chatOpen);
                            setCampusMoreOpen(false);
                          }}
                        >
                          <MessageCircle size={14} className={chatOpen ? "text-canna-300" : undefined} />
                          Chat
                        </OverflowAction>
                        {campusMapUnlockPct != null ? (
                          <p className="px-3 py-1.5 text-[10px] tabular-nums text-emerald-200/85">
                            Campus · {campusMapUnlockPct}% desbloqueado
                          </p>
                        ) : null}
                        <div className="border-t border-white/10 px-2 py-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <CreditBalanceChip compact className="border-white/12" />
                          </div>
                          <div className="mt-2">
                            <CampusStudentGamificationHudChip className="max-w-none border-emerald-400/25" />
                          </div>
                        </div>
                        {status === "authenticated" ? (
                          <>
                            <div className="my-1 h-px bg-white/10" />
                            {campusAdmin ? (
                              <OverflowAction
                                onClick={() => {
                                  setCampusLiveComposerOpen(true);
                                  setCampusMoreOpen(false);
                                }}
                              >
                                <Radio size={14} className="text-emerald-300" /> Live (admin)
                              </OverflowAction>
                            ) : null}
                            <Link
                              href="/perfil"
                              role="menuitem"
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-medium text-white/88 transition hover:bg-white/10"
                              onClick={() => setCampusMoreOpen(false)}
                            >
                              Progresso (conta)
                            </Link>
                            <OverflowAction
                              onClick={() => {
                                void signOut({ callbackUrl: CAMPUS_HOME_PATH });
                                setCampusMoreOpen(false);
                              }}
                            >
                              <LogOut size={14} /> Sair
                            </OverflowAction>
                          </>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="pointer-events-auto relative" ref={campusNotifWrapRef}>
                  <button
                    type="button"
                    className={mapHudGlassBtn}
                    aria-expanded={campusNotifOpen}
                    aria-label="Alertas do campus"
                    onClick={() => {
                      setCampusNotifOpen((v) => !v);
                      setCampusMoreOpen(false);
                    }}
                  >
                    <Bell size={16} className="text-amber-200/90" />
                  </button>
                  <AnimatePresence>
                    {campusNotifOpen ? (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute right-0 top-[calc(100%+0.35rem)] z-[60] w-[min(17.5rem,calc(100vw-2rem))] rounded-xl border border-white/[0.12] bg-black/[0.36] p-2.5 shadow-xl shadow-black/25 backdrop-blur-2xl ring-1 ring-emerald-400/10"
                      >
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-200/90">
                          Alertas recentes
                        </p>
                        {hudFeedItems.length === 0 ? (
                          <p className="mt-2 text-[11px] text-white/55">Sem alertas recentes.</p>
                        ) : (
                          <ul className="mt-2 max-h-48 space-y-1.5 overflow-y-auto pr-1 text-[11px] text-white/82">
                            {[...hudFeedItems].reverse().map((it) => (
                              <li
                                key={it.id}
                                className="rounded-lg border border-white/8 bg-white/[0.04] px-2 py-1.5"
                              >
                                {it.message}
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {status === "authenticated" ? (
                  <button
                    type="button"
                    data-tour-id="campus-profile"
                    className={cn(
                      mapHudGlassBtn,
                      "h-8 w-8 overflow-hidden border-amber-400/25 sm:h-9 sm:w-9"
                    )}
                    title="Meu perfil"
                    onClick={() => setCampusProfileOpen(true)}
                  >
                    <span className="text-[10px] font-bold tabular-nums text-amber-100/95 sm:text-[11px]">
                      {campusProfileInitials(session?.user?.name, session?.user?.email ?? null)}
                    </span>
                  </button>
                ) : (
                  <div className="pointer-events-auto flex items-center gap-1 sm:gap-1.5">
                    <Link href="/login" className={cn(mapHudGlassPill, "text-white/90")}>
                      Entrar
                    </Link>
                    <Link
                      href="/inscrever"
                      className={cn(mapHudGlassPill, "border-amber-400/30 text-amber-100/95")}
                      data-campus-tour-anchor="inscrever"
                    >
                      Inscrever-se
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.header>
        </>
      ) : null}

      {campusNavActive ? (
        <div
          className={cn(
            "pointer-events-none fixed z-[25] flex flex-col items-start gap-1.5",
            "left-3 max-sm:bottom-[calc(4.75rem+env(safe-area-inset-bottom))] sm:bottom-6 sm:left-4"
          )}
        >
          <button
            type="button"
            onClick={() => setCampusPresenceOpen((v) => !v)}
            className={cn(mapHudGlassPill, "pointer-events-auto text-[10px]")}
            aria-expanded={campusPresenceOpen}
          >
            <Users size={13} className="text-emerald-200/90" aria-hidden />
            <span className="tabular-nums">
              {onlineCount != null ? `${onlineCount} online` : "Campus vivo"}
            </span>
          </button>
          <AnimatePresence>
            {campusPresenceOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="pointer-events-auto w-[min(17.25rem,calc(100vw-2rem))] max-h-[min(40vh,18rem)] overflow-y-auto rounded-xl border border-white/[0.11] bg-black/[0.34] shadow-lg shadow-black/20 backdrop-blur-2xl ring-1 ring-emerald-400/10"
              >
                <div className="p-2">
                  <CampusPresencePanel
                    presence={presenceBreakdown}
                    className="border-white/10 bg-transparent shadow-none"
                  />
                  <div className="mt-2 max-h-[10rem] overflow-y-auto rounded-lg border border-white/[0.08] bg-black/[0.18] p-1.5">
                    <LiveCampusFeed />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

      {campusNavActive ? (
        <nav
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[40] border-t border-white/[0.07] bg-black/[0.22] pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl sm:hidden"
          aria-label="Navegação rápida"
        >
          <div className="pointer-events-auto flex h-12 items-center justify-around px-1">
            <button
              type="button"
              className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[9px] font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Centrar mapa"
              onClick={recenterMap}
            >
              <MapPin size={18} className="text-emerald-200/90" />
              Mapa
            </button>
            <button
              type="button"
              className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[9px] font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Perfil"
              onClick={() =>
                status === "authenticated" ? setCampusProfileOpen(true) : router.push("/login")
              }
            >
              <User2 size={18} className="text-amber-200/90" />
              Perfil
            </button>
            <button
              type="button"
              className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[9px] font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Continuar aula"
              onClick={() => requestCampusResumeLesson()}
            >
              <Play size={18} className="text-teal-200/90" />
              Continuar
            </button>
          </div>
        </nav>
      ) : null}

      {!campusNavActive ? (
        <>
          <motion.header
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="fixed top-0 left-0 right-0 z-20 px-4 sm:px-6 pt-4 pointer-events-none [&_button]:pointer-events-auto [&_a]:pointer-events-auto"
          >
            <div className="max-w-[1700px] mx-auto flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href="/"
                  className="flex shrink-0 items-center gap-2.5 rounded-2xl glass-hud pointer-events-auto transition-transform hover:scale-[1.02] duration-300 px-4 py-2.5"
                  aria-label="THCProce Escola Aberta — início"
                >
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-canna-500/30 to-amber-500/20 border border-canna-400/45 flex items-center justify-center shadow-md shadow-canna-900/40">
                    <Leaf size={18} className="text-canna-200" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-amber-200/85 font-semibold">
                      THCProce
                    </div>
                    <div className="text-sm font-bold text-white">Escola Aberta</div>
                    <div className="text-[9px] text-white/45 font-medium tracking-wide max-sm:hidden">
                      Campus · cultura & cultivo
                    </div>
                  </div>
                </Link>

                <nav className="hidden md:flex flex-1 justify-center gap-1 px-2 py-2 rounded-2xl glass-hud max-w-lg pointer-events-auto">
                  <NavLink active={campusNavActive} href={CAMPUS_HOME_PATH}>
                    Mapa
                  </NavLink>
                  <NavLink href="/planos">Trilhas</NavLink>
                  <NavLink href={`${CAMPUS_HOME_PATH}/ranking`}>Ranking</NavLink>
                  <NavLink href="/inscrever-se" tourAnchor="inscrever">
                    Prof THC
                  </NavLink>
                  <NavLink href="/planos" tourAnchor="planos">
                    Planos
                  </NavLink>
                  <NavLink href="/inscrever" tourAnchor="inscrever">
                    Inscrever
                  </NavLink>
                </nav>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSky()}
                    className={cn(
                      "flex h-10 w-12 items-center justify-center rounded-xl border transition-all pointer-events-auto",
                      sky === "day"
                        ? "border-sky-400/50 bg-sky-500/15 text-sky-100"
                        : "border-canna-400/35 text-white/90 glass-strong"
                    )}
                    aria-label={sky === "night" ? "Modo dia" : "Modo noite"}
                  >
                    {sky === "night" ? (
                      <Moon size={15} />
                    ) : (
                      <Sun size={16} className="text-amber-200" />
                    )}
                  </button>

                  <IconButton aria-label="Eventos no campus" onClick={() => setEventsOpen(true)}>
                    <CalendarHeart size={16} />
                  </IconButton>
                  <IconButton aria-label="Mural social" onClick={() => setMuralOpen(true)}>
                    <Newspaper size={16} />
                  </IconButton>
                  <IconButton aria-label="Notificações">
                    <Bell size={16} />
                  </IconButton>
                  <IconButton aria-label="Abrir chat" onClick={() => setChatOpen(!chatOpen)}>
                    <MessageCircle size={16} className={chatOpen ? "text-canna-300" : undefined} />
                  </IconButton>

                  {status === "authenticated" ? (
                    <>
                      {campusAdmin ? (
                        <>
                          <IconButton
                            aria-label="Configurar live do Cine"
                            title="Live do campus (Ctrl+Shift+L)"
                            onClick={() => setCampusLiveComposerOpen(true)}
                          >
                            <Radio size={16} className="text-emerald-300" />
                          </IconButton>
                          <span className="rounded-md border border-amber-400/45 bg-amber-500/15 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-100 shadow-sm shadow-amber-900/40">
                            Admin THCProce
                          </span>
                        </>
                      ) : null}
                      <Link
                        href="/perfil"
                        className="inline-block max-w-[7rem] truncate sm:max-w-none rounded-lg px-1.5 py-1 text-[10px] text-white/55 underline-offset-2 transition hover:text-canna-200 hover:underline sm:px-2 sm:text-[11px]"
                      >
                        Meu progresso
                      </Link>
                      <span className="hidden xl:inline max-w-[120px] truncate text-[11px] text-white/60">
                        {session?.user?.email}
                      </span>
                      <Button
                        type="button"
                        variant="glass"
                        size="sm"
                        className="!px-3"
                        onClick={() => void signOut({ callbackUrl: CAMPUS_HOME_PATH })}
                      >
                        Sair
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="glass" size="sm" className="!px-3" asChild>
                        <Link href="/login">
                          <User2 size={14} /> Entrar
                        </Link>
                      </Button>
                      <Button size="sm" className="shadow-lg shadow-canna-500/25" asChild>
                        <Link href="/inscrever" data-campus-tour-anchor="inscrever">
                          Inscrever-se
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.header>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="fixed bottom-4 left-1/2 z-20 hidden -translate-x-1/2 pointer-events-none sm:block"
          >
            <div className="glass-hud rounded-full px-5 py-2.5 flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="relative w-2 h-2 rounded-full bg-canna-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]">
                  <span className="absolute inset-0 rounded-full bg-canna-400 animate-ping opacity-60" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65">
                  Mundo vivo
                </span>
              </div>
              <span className="w-px h-5 bg-gradient-to-b from-transparent via-white/25 to-transparent" />
              <div className="flex flex-wrap items-center gap-2">
                <Sparkles size={14} className="text-gold-400 shrink-0" />
                <span className="text-[11px] uppercase tracking-wider text-white/55">Progressão</span>
                <span className="text-xs font-semibold text-white">
                  {xpData?.xp ?? "—"}
                  {xpData?.levelLabel ? (
                    <span className="ml-2 text-gold-300/90"> · {xpData.levelLabel}</span>
                  ) : null}
                  {xpData?.streak != null && xpData.streak > 0 ? (
                    <span className="ml-2 text-orange-300/90">🔥 {xpData.streak}d</span>
                  ) : null}
                </span>
                {badges?.badges && badges.badges.length > 0 ? (
                  <>
                    <span className="w-px h-5 bg-gradient-to-b from-transparent via-amber-400/25 to-transparent hidden lg:block" />
                    <span className="hidden lg:flex flex-wrap gap-1 max-w-[280px]">
                      {badges.badges.slice(0, 4).map((b) => (
                        <span
                          key={b.id}
                          className="text-[10px] font-bold rounded-full bg-gradient-to-r from-gold-500/20 to-amber-600/15 border border-gold-400/40 text-amber-100 px-2 py-0.5 shadow-sm shadow-amber-900/30"
                        >
                          {b.label}
                        </span>
                      ))}
                    </span>
                  </>
                ) : null}
                <span className="w-px h-5 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <span className="text-[11px] text-white/55 uppercase tracking-wider">Próximo:</span>
                <span className="text-xs font-semibold text-white">
                  {cannabis101HudNextLessonCue()}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}

      <AnimatePresence>
        {eventsOpen ? (
          <CampusOverlay onClose={() => setEventsOpen(false)} title="Eventos sazonais">
            <ul className="space-y-3 text-sm text-white/85">
              {(events ?? []).map((ev) => (
                <li key={ev.id} className="rounded-xl campus-hud-glass p-3">
                  <div className="font-semibold text-canna-200">{ev.title}</div>
                  <div className="text-xs text-white/60 mt-1">{ev.when}</div>
                  {ev.href ? (
                    ev.href.startsWith("http") ? (
                      <a
                        href={ev.href}
                        className="mt-2 inline-block text-xs text-sky-300 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir →
                      </a>
                    ) : (
                      <Link href={ev.href} className="mt-2 inline-block text-xs text-sky-300 hover:underline">
                        Abrir →
                      </Link>
                    )
                  ) : null}
                </li>
              ))}
              {events?.length === 0 ? (
                <li className="text-white/60">Nenhum evento cadastrado ainda.</li>
              ) : null}
            </ul>
          </CampusOverlay>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {campusProfileOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm pointer-events-auto"
              onClick={() => setCampusProfileOpen(false)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 32, opacity: 0 }}
              className="fixed inset-x-2 sm:inset-x-3 bottom-[max(env(safe-area-inset-bottom),10px)] top-[calc(3.2rem+env(safe-area-inset-top))] z-[60] mx-auto flex max-h-[min(92dvh,calc(100dvh-7.75rem-env(safe-area-inset-bottom)))] max-w-xl flex-col overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(155deg,rgba(255,255,255,0.07)_0%,rgba(6,24,14,0.18)_45%,rgba(6,18,12,0.12)_100%)] p-px shadow-[0_0_60px_rgba(52,211,153,0.08)] pointer-events-auto sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-[5.5rem] sm:w-[min(calc(100vw-2rem),36rem)] sm:-translate-x-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex max-h-[inherit] min-h-0 flex-1 flex-col overflow-hidden rounded-[0.9rem] campus-hud-glass">
                <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-white max-sm:text-base">
                      Meu perfil
                    </h2>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/52 max-sm:text-xs">
                      Perfil neste navegador: nível XP, nome, cosméticos e inventário salvos apenas aqui neste
                      computador ou telemóvel.
                    </p>
                  </div>
                  <Button type="button" variant="glass" size="sm" onClick={() => setCampusProfileOpen(false)}>
                    Fechar
                  </Button>
                </div>
                {campusNavActive && status !== "authenticated" ? (
                  <p className="border-b border-white/10 px-4 py-2 text-[11px] text-white/55 sm:px-5">
                    <Link href="/login" className="text-canna-300 hover:underline">
                      Entrar
                    </Link>{" "}
                    para sincronizar conta. Loja campus:{" "}
                    <button
                      type="button"
                      className="font-semibold text-amber-200/90 hover:underline"
                      onClick={() => {
                        markMissionStoreEntered();
                        setCampusStoreOpen(true);
                      }}
                    >
                      abrir
                    </button>
                    .
                  </p>
                ) : null}
                <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin p-4 pb-5 sm:p-5">
                  <CampusProfileForm density="modal" />
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <CampusStoreModal open={campusStoreOpen} onClose={() => setCampusStoreOpen(false)} />

      <AnimatePresence>
        {campusMissionsOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm pointer-events-auto"
              onClick={() => setCampusMissionsOpen(false)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 32, opacity: 0 }}
              className="fixed inset-x-2 sm:inset-x-3 bottom-[max(env(safe-area-inset-bottom),10px)] top-[calc(3.2rem+env(safe-area-inset-top))] z-[60] mx-auto flex max-h-[min(92dvh,calc(100dvh-7.75rem-env(safe-area-inset-bottom)))] max-w-xl flex-col overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(155deg,rgba(255,255,255,0.07)_0%,rgba(6,24,14,0.18)_45%,rgba(6,18,12,0.12)_100%)] p-px shadow-[0_0_60px_rgba(52,211,153,0.08)] pointer-events-auto sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-[5.5rem] sm:w-[min(calc(100vw-2rem),36rem)] sm:-translate-x-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex max-h-[inherit] min-h-0 flex-1 flex-col overflow-hidden rounded-[0.9rem] campus-hud-glass">
                <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-white max-sm:text-base">Missões</h2>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/52 max-sm:text-xs">
                      Objetivos e recompensas guardados neste dispositivo. No futuro serão ligados ao teu conta na
                      escola.
                    </p>
                  </div>
                  <Button type="button" variant="glass" size="sm" onClick={() => setCampusMissionsOpen(false)}>
                    Fechar
                  </Button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin p-4 pb-5 text-sm sm:p-5">
                  <StudentMissionsPanel variant="compact" title="Missões ativas" />
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {leaderboardOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm pointer-events-auto"
              onClick={() => setLeaderboardOpen(false)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 32, opacity: 0 }}
              className="fixed inset-x-2 sm:inset-x-3 bottom-[max(env(safe-area-inset-bottom),10px)] top-[calc(3.2rem+env(safe-area-inset-top))] z-[60] mx-auto flex max-h-[min(92dvh,calc(100dvh-7.75rem-env(safe-area-inset-bottom)))] max-w-xl flex-col overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(155deg,rgba(255,255,255,0.07)_0%,rgba(6,24,14,0.18)_45%,rgba(6,18,12,0.12)_100%)] p-px shadow-[0_0_60px_rgba(52,211,153,0.08)] pointer-events-auto sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-[5.5rem] sm:w-[min(calc(100vw-2rem),36rem)] sm:-translate-x-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex max-h-[inherit] min-h-0 flex-1 flex-col overflow-hidden rounded-[0.9rem] campus-hud-glass">
                <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-white max-sm:text-base">Ranking</h2>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/52 max-sm:text-xs">
                      Pré-visualização apenas para te orientar · podes seguir também na página própria.
                    </p>
                  </div>
                  <Button type="button" variant="glass" size="sm" onClick={() => setLeaderboardOpen(false)}>
                    Fechar
                  </Button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4 text-sm sm:p-5">
                  <Suspense
                    fallback={
                      <div className="space-y-2 py-6 text-center text-sm text-white/55">
                        Ranking a carregar…
                      </div>
                    }
                  >
                    <CampusLeaderboardLazy />
                  </Suspense>
                </div>
                <div className="shrink-0 border-t border-white/10 px-4 py-4 sm:p-5 sm:pt-3">
                  <Button asChild variant="glass" size="sm" className="w-full sm:w-auto">
                    <Link href={`${CAMPUS_HOME_PATH}/ranking`} onClick={() => setLeaderboardOpen(false)}>
                      Abrir página de ranking
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {muralOpen ? (
          <CampusOverlay onClose={() => setMuralOpen(false)} title="Mural do campus">
            <div className="space-y-2 max-h-[50vh] overflow-y-auto scrollbar-thin pr-2">
              {(mural ?? []).map((row) => (
                <article key={row.id} className="rounded-lg campus-hud-glass p-3 text-sm">
                  <span className="text-[11px] font-bold text-canna-300">{row.authorName}</span>
                  <p className="mt-1 text-white/85 whitespace-pre-wrap">{row.body}</p>
                </article>
              ))}
              {mural?.length === 0 ? (
                <p className="text-white/55 text-sm">
                  Nenhum post no mural ainda — seja o primeiro se estiver logado.
                </p>
              ) : null}
              {status === "authenticated" ? (
                <form
                  className="mt-4 pt-4 border-t border-white/10 space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = (
                      session?.user?.name ??
                      session?.user?.email?.split("@")[0] ??
                      "Aluno"
                    ).slice(0, 64);
                    const b = muralBody.trim().slice(0, 500);
                    if (!b) return;
                    muralPost.mutate({ authorName: name, body: b });
                  }}
                >
                  <label htmlFor="mural-body" className="text-xs text-white/60 sr-only">
                    Mensagem no mural
                  </label>
                  <textarea
                    id="mural-body"
                    value={muralBody}
                    onChange={(e) => setMuralBody(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Compartilhe um recado ou vitória na jornada…"
                    className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-sm resize-none outline-none focus:border-canna-400/50"
                  />
                  <Button type="submit" size="sm" disabled={muralPost.isPending || !muralBody.trim()}>
                    Publicar
                  </Button>
                </form>
              ) : (
                <p className="mt-4 text-[11px] text-white/50 border-t border-white/10 pt-4">
                  <Link href="/login" className="text-canna-300 hover:underline font-semibold">
                    Entrar
                  </Link>{" "}
                  para publicar no mural.
                </p>
              )}
            </div>
          </CampusOverlay>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function OverflowAction({
  children,
  onClick,
  className
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const c = cn(
    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-medium text-white/88 transition hover:bg-white/10",
    className
  );
  return (
    <button type="button" role="menuitem" className={c} onClick={onClick}>
      {children}
    </button>
  );
}

function CampusOverlay({
  title,
  children,
  onClose
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 32, opacity: 0 }}
        className="fixed left-4 right-4 top-28 z-[60] mx-auto max-h-[70vh] max-w-lg overflow-hidden rounded-2xl campus-hud-glass p-6 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <Button type="button" variant="glass" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
        {children}
      </motion.div>
    </>
  );
}

function NavLink({
  href,
  children,
  active = false,
  tourAnchor
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  tourAnchor?: "planos" | "inscrever";
}) {
  const isExt = /^https?:\/\//.test(href);
  const cnBase =
    "px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 " +
    (active
      ? "bg-gradient-to-r from-canna-500/25 to-amber-500/15 text-amber-100 border border-amber-400/35 shadow-md shadow-black/25"
      : "text-white/72 hover:bg-white/8 hover:text-white border border-transparent hover:border-white/10");
  const dataTour = tourAnchor ? { "data-campus-tour-anchor": tourAnchor } : {};
  return isExt ? (
    <a href={href} className={cnBase} target="_blank" rel="noreferrer" {...dataTour}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cnBase} {...dataTour}>
      {children}
    </Link>
  );
}

function IconButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="w-10 h-10 rounded-xl glass-hud hover:bg-white/12 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-white/80 hover:text-white hover:shadow-[0_0_18px_rgba(80,255,160,0.07)]"
      {...props}
    >
      {children}
    </button>
  );
}
