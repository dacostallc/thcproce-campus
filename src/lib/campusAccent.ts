import type { AreaColor } from "@/data/courses";

/** Classes reutilizáveis — sala premium 3 colunas, acento por curso (`Area.color`). */
export type CampusPanelAccent = {
  dialog: string;
  headerBar: string;
  asideLeft: string;
  asideRight: string;
  mobileDock: string;
  drawer: string;
  drawerHeader: string;
  railActiveRow: string;
};

const PANEL: Record<AreaColor, CampusPanelAccent> = {
  amber: {
    dialog: "border-amber-500/35 bg-[#040a07]/98 backdrop-blur-md",
    headerBar: "border-amber-500/15 bg-[#030806] py-2.5 sm:py-3",
    asideLeft:
      "border-amber-500/20 bg-[#030806]/98 md:border-r",
    asideRight: "border-amber-500/20 bg-[#030806]/95 md:border-l",
    mobileDock: "border-amber-500/30 bg-[#050805]/98",
    drawer: "border-amber-500/35 bg-[#040a07]",
    drawerHeader: "border-amber-500/25",
    railActiveRow: "bg-amber-500/20 font-semibold text-white"
  },
  canna: {
    dialog: "border-canna-400/35 bg-[#030806]/98 backdrop-blur-md",
    headerBar: "border-canna-500/15 bg-[#020a06] py-2.5 sm:py-3",
    asideLeft: "border-canna-500/20 bg-[#020806]/98 md:border-r",
    asideRight: "border-canna-500/20 bg-[#030a07]/95 md:border-l",
    mobileDock: "border-canna-500/30 bg-[#041208]/98",
    drawer: "border-canna-500/35 bg-[#030806]",
    drawerHeader: "border-canna-500/25",
    railActiveRow: "bg-canna-500/20 font-semibold text-white"
  },
  purple: {
    dialog: "border-purple-400/35 bg-[#0a0612]/98 backdrop-blur-md",
    headerBar: "border-purple-500/15 bg-[#080512] py-2.5 sm:py-3",
    asideLeft: "border-purple-500/20 bg-[#080512]/98 md:border-r",
    asideRight: "border-purple-500/20 bg-[#070510]/95 md:border-l",
    mobileDock: "border-purple-500/30 bg-[#0c0818]/98",
    drawer: "border-purple-500/35 bg-[#080612]",
    drawerHeader: "border-purple-500/25",
    railActiveRow: "bg-purple-500/20 font-semibold text-white"
  },
  cyan: {
    dialog: "border-cyan-400/35 bg-[#030c10]/98 backdrop-blur-md",
    headerBar: "border-cyan-500/15 bg-[#020c0f] py-2.5 sm:py-3",
    asideLeft: "border-cyan-500/20 bg-[#020c0f]/98 md:border-r",
    asideRight: "border-cyan-500/20 bg-[#030a0d]/95 md:border-l",
    mobileDock: "border-cyan-500/30 bg-[#041418]/98",
    drawer: "border-cyan-500/35 bg-[#030c10]",
    drawerHeader: "border-cyan-500/25",
    railActiveRow: "bg-cyan-500/20 font-semibold text-white"
  },
  rose: {
    dialog: "border-rose-400/35 bg-[#100608]/98 backdrop-blur-md",
    headerBar: "border-rose-500/15 bg-[#0d0508] py-2.5 sm:py-3",
    asideLeft: "border-rose-500/20 bg-[#0c0508]/98 md:border-r",
    asideRight: "border-rose-500/20 bg-[#0a0407]/95 md:border-l",
    mobileDock: "border-rose-500/30 bg-[#12080c]/98",
    drawer: "border-rose-500/35 bg-[#0e0609]",
    drawerHeader: "border-rose-500/25",
    railActiveRow: "bg-rose-500/20 font-semibold text-white"
  }
};

export function getCampusPanelAccent(accent: AreaColor): CampusPanelAccent {
  return PANEL[accent];
}

/** Lista de aulas — chips, busca, módulo atual, próxima aula. */
export type LessonListAccent = {
  headerBottom: string;
  kicker: string;
  search: string;
  searchIcon: string;
  chipOn: string;
  chipOff: string;
  lessonOn: string;
  lessonOff: string;
  numOn: string;
  numOff: string;
  atual: string;
  footerTop: string;
  modKicker: string;
  barTrack: string;
  barFill: string;
  nextBtn: string;
};

const LESSON_LIST: Record<AreaColor, LessonListAccent> = {
  amber: {
    headerBottom: "border-b border-amber-500/20",
    kicker: "text-amber-200/75",
    search: "border-amber-500/20",
    searchIcon: "text-amber-200/50",
    chipOn: "bg-amber-500/25 text-amber-100 ring-1 ring-amber-400/40",
    chipOff: "text-white/45 hover:bg-white/5 hover:text-white/80",
    lessonOn:
      "border-amber-400/55 bg-amber-500/20 text-white shadow-[0_0_24px_rgba(212,175,55,0.15)] ring-1 ring-amber-500/30",
    lessonOff: "border-white/10 bg-black/25 text-white/85 hover:border-amber-500/30",
    numOn: "bg-amber-500/30 text-amber-50",
    numOff: "bg-white/5 text-white/50",
    atual: "bg-amber-500/20 text-amber-200",
    footerTop: "border-t border-amber-500/20 bg-[#020705]/95",
    modKicker: "text-amber-200/55",
    barTrack: "bg-black/60 ring-1 ring-amber-500/10",
    barFill: "bg-gradient-to-r from-amber-700 to-canna-500",
    nextBtn: "bg-amber-600 font-bold text-ink-900 hover:bg-amber-500"
  },
  canna: {
    headerBottom: "border-b border-canna-500/20",
    kicker: "text-canna-200/75",
    search: "border-canna-500/20",
    searchIcon: "text-canna-200/50",
    chipOn: "bg-canna-500/25 text-canna-100 ring-1 ring-canna-400/40",
    chipOff: "text-white/45 hover:bg-white/5 hover:text-white/80",
    lessonOn:
      "border-canna-400/55 bg-canna-500/20 text-white shadow-[0_0_24px_rgba(34,197,94,0.15)] ring-1 ring-canna-500/30",
    lessonOff: "border-white/10 bg-black/25 text-white/85 hover:border-canna-500/30",
    numOn: "bg-canna-500/30 text-canna-50",
    numOff: "bg-white/5 text-white/50",
    atual: "bg-canna-500/20 text-canna-200",
    footerTop: "border-t border-canna-500/20 bg-[#020705]/95",
    modKicker: "text-canna-200/55",
    barTrack: "bg-black/60 ring-1 ring-canna-500/10",
    barFill: "bg-gradient-to-r from-canna-700 to-emerald-500",
    nextBtn: "bg-canna-600 font-bold text-ink-900 hover:bg-canna-500"
  },
  purple: {
    headerBottom: "border-b border-purple-500/20",
    kicker: "text-purple-200/75",
    search: "border-purple-500/20",
    searchIcon: "text-purple-200/50",
    chipOn: "bg-purple-500/25 text-purple-100 ring-1 ring-purple-400/40",
    chipOff: "text-white/45 hover:bg-white/5 hover:text-white/80",
    lessonOn:
      "border-purple-400/55 bg-purple-500/20 text-white shadow-[0_0_24px_rgba(168,85,247,0.12)] ring-1 ring-purple-500/30",
    lessonOff: "border-white/10 bg-black/25 text-white/85 hover:border-purple-500/30",
    numOn: "bg-purple-500/30 text-purple-50",
    numOff: "bg-white/5 text-white/50",
    atual: "bg-purple-500/20 text-purple-200",
    footerTop: "border-t border-purple-500/20 bg-[#080512]/95",
    modKicker: "text-purple-200/55",
    barTrack: "bg-black/60 ring-1 ring-purple-500/10",
    barFill: "bg-gradient-to-r from-purple-700 to-fuchsia-500",
    nextBtn: "bg-purple-600 font-bold text-white hover:bg-purple-500"
  },
  cyan: {
    headerBottom: "border-b border-cyan-500/20",
    kicker: "text-cyan-200/75",
    search: "border-cyan-500/20",
    searchIcon: "text-cyan-200/50",
    chipOn: "bg-cyan-500/25 text-cyan-100 ring-1 ring-cyan-400/40",
    chipOff: "text-white/45 hover:bg-white/5 hover:text-white/80",
    lessonOn:
      "border-cyan-400/55 bg-cyan-500/15 text-white shadow-[0_0_24px_rgba(6,182,212,0.12)] ring-1 ring-cyan-500/30",
    lessonOff: "border-white/10 bg-black/25 text-white/85 hover:border-cyan-500/30",
    numOn: "bg-cyan-500/30 text-cyan-50",
    numOff: "bg-white/5 text-white/50",
    atual: "bg-cyan-500/20 text-cyan-200",
    footerTop: "border-t border-cyan-500/20 bg-[#020c0f]/95",
    modKicker: "text-cyan-200/55",
    barTrack: "bg-black/60 ring-1 ring-cyan-500/10",
    barFill: "bg-gradient-to-r from-cyan-700 to-teal-500",
    nextBtn: "bg-cyan-600 font-bold text-ink-900 hover:bg-cyan-500"
  },
  rose: {
    headerBottom: "border-b border-rose-500/20",
    kicker: "text-rose-200/75",
    search: "border-rose-500/20",
    searchIcon: "text-rose-200/50",
    chipOn: "bg-rose-500/25 text-rose-100 ring-1 ring-rose-400/40",
    chipOff: "text-white/45 hover:bg-white/5 hover:text-white/80",
    lessonOn:
      "border-rose-400/55 bg-rose-500/15 text-white shadow-[0_0_24px_rgba(244,63,94,0.12)] ring-1 ring-rose-500/30",
    lessonOff: "border-white/10 bg-black/25 text-white/85 hover:border-rose-500/30",
    numOn: "bg-rose-500/30 text-rose-50",
    numOff: "bg-white/5 text-white/50",
    atual: "bg-rose-500/20 text-rose-200",
    footerTop: "border-t border-rose-500/20 bg-[#0c0508]/95",
    modKicker: "text-rose-200/55",
    barTrack: "bg-black/60 ring-1 ring-rose-500/10",
    barFill: "bg-gradient-to-r from-rose-700 to-amber-600",
    nextBtn: "bg-rose-600 font-bold text-white hover:bg-rose-500"
  }
};

export function getLessonListAccent(accent: AreaColor): LessonListAccent {
  return LESSON_LIST[accent];
}

export type RailAccent = {
  adminBanner: string;
  backBtn: string;
  progCard: string;
  progKicker: string;
  progPct: string;
  progBarTrack: string;
  progBarFill: string;
  milestoneCard: string;
  milestoneKicker: string;
  milestoneBar: string;
  milestoneXp: string;
  statCard: string;
  outrasKicker: string;
};

const RAIL: Record<AreaColor, RailAccent> = {
  amber: {
    adminBanner: "border-amber-400/40 bg-gradient-to-r from-amber-500/15 to-transparent text-amber-100",
    backBtn: "border-amber-500/35 bg-black/30 font-bold text-amber-100 hover:bg-amber-500/10",
    progCard: "border-amber-500/25 bg-gradient-to-br from-[#0c1812] to-[#050a08] text-amber-200/80",
    progKicker: "text-amber-200/80",
    progPct: "text-amber-300",
    progBarTrack: "bg-black/50 ring-1 ring-amber-500/15",
    progBarFill: "from-amber-600 via-amber-400 to-canna-500",
    milestoneCard: "border-amber-500/20 bg-[#081510]",
    milestoneKicker: "text-amber-200/70",
    milestoneBar: "from-amber-600 to-canna-500",
    milestoneXp: "text-amber-200/90",
    statCard: "border-amber-500/15",
    outrasKicker: "text-amber-200/50"
  },
  canna: {
    adminBanner: "border-canna-400/40 bg-gradient-to-r from-canna-500/15 to-transparent text-canna-100",
    backBtn: "border-canna-500/35 bg-black/30 font-bold text-canna-100 hover:bg-canna-500/10",
    progCard: "border-canna-500/25 bg-gradient-to-br from-[#051208] to-[#020806] text-canna-200/80",
    progKicker: "text-canna-200/80",
    progPct: "text-canna-300",
    progBarTrack: "bg-black/50 ring-1 ring-canna-500/15",
    progBarFill: "from-canna-600 via-emerald-400 to-canna-500",
    milestoneCard: "border-canna-500/20 bg-[#041208]",
    milestoneKicker: "text-canna-200/70",
    milestoneBar: "from-canna-600 to-emerald-500",
    milestoneXp: "text-canna-200/90",
    statCard: "border-canna-500/15",
    outrasKicker: "text-canna-200/50"
  },
  purple: {
    adminBanner: "border-purple-400/40 bg-gradient-to-r from-purple-500/15 to-transparent text-purple-100",
    backBtn: "border-purple-500/35 bg-black/30 font-bold text-purple-100 hover:bg-purple-500/10",
    progCard: "border-purple-500/25 bg-gradient-to-br from-[#100818] to-[#06040d] text-purple-200/80",
    progKicker: "text-purple-200/80",
    progPct: "text-purple-300",
    progBarTrack: "bg-black/50 ring-1 ring-purple-500/15",
    progBarFill: "from-purple-600 via-fuchsia-400 to-purple-500",
    milestoneCard: "border-purple-500/20 bg-[#0c0614]",
    milestoneKicker: "text-purple-200/70",
    milestoneBar: "from-purple-600 to-fuchsia-500",
    milestoneXp: "text-purple-200/90",
    statCard: "border-purple-500/15",
    outrasKicker: "text-purple-200/50"
  },
  cyan: {
    adminBanner: "border-cyan-400/40 bg-gradient-to-r from-cyan-500/15 to-transparent text-cyan-100",
    backBtn: "border-cyan-500/35 bg-black/30 font-bold text-cyan-100 hover:bg-cyan-500/10",
    progCard: "border-cyan-500/25 bg-gradient-to-br from-[#041418] to-[#020a0d] text-cyan-200/80",
    progKicker: "text-cyan-200/80",
    progPct: "text-cyan-300",
    progBarTrack: "bg-black/50 ring-1 ring-cyan-500/15",
    progBarFill: "from-cyan-600 via-teal-400 to-cyan-500",
    milestoneCard: "border-cyan-500/20 bg-[#031014]",
    milestoneKicker: "text-cyan-200/70",
    milestoneBar: "from-cyan-600 to-teal-500",
    milestoneXp: "text-cyan-200/90",
    statCard: "border-cyan-500/15",
    outrasKicker: "text-cyan-200/50"
  },
  rose: {
    adminBanner: "border-rose-400/40 bg-gradient-to-r from-rose-500/15 to-transparent text-rose-100",
    backBtn: "border-rose-500/35 bg-black/30 font-bold text-rose-100 hover:bg-rose-500/10",
    progCard: "border-rose-500/25 bg-gradient-to-br from-[#14060a] to-[#0a0406] text-rose-200/80",
    progKicker: "text-rose-200/80",
    progPct: "text-rose-300",
    progBarTrack: "bg-black/50 ring-1 ring-rose-500/15",
    progBarFill: "from-rose-600 via-amber-400 to-rose-500",
    milestoneCard: "border-rose-500/20 bg-[#100608]",
    milestoneKicker: "text-rose-200/70",
    milestoneBar: "from-rose-600 to-amber-500",
    milestoneXp: "text-rose-200/90",
    statCard: "border-rose-500/15",
    outrasKicker: "text-rose-200/50"
  }
};

export function getRailAccent(accent: AreaColor): RailAccent {
  return RAIL[accent];
}
