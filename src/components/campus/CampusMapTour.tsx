"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { MapPin } from "lucide-react";
import { CAMPUS_CINE_POSITION } from "@/config/campusCinema";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { useCampusGuidedTourStore } from "@/stores/campusGuidedTourStore";
import { cn } from "@/lib/utils";
import {
  grantTourOfflineRewardsIfNeeded,
} from "@/lib/studentGamificationStorage";
import {
  CAMPUS_GUIDED_TOUR_DONE_LS_KEY,
  CAMPUS_TOUR_NUDGE_DISMISSED_LS_KEY,
  CAMPUS_TOUR_SEEN_LS_KEY,
  CAMPUS_WELCOME_MODAL_SEEN_LS_KEY
} from "@/lib/campusOnboardingLs";

/** @deprecated importar desde `@/lib/campusOnboardingLs` como `CAMPUS_TOUR_SEEN_LS_KEY` */
export const CAMPUS_TOUR_SEEN_KEY = CAMPUS_TOUR_SEEN_LS_KEY;

type MapSpot = { kind: "map"; x: number; y: number };
type HudTourSpot = { kind: "hud"; tourId: string };

type StepDef = {
  spot: MapSpot | HudTourSpot;
  title: string;
  lines: [string] | [string, string];
};

type HudAnchorPos = {
  left: number;
  top: number;
  maxWidth: number;
};

function fallbackHudAnch(): HudAnchorPos {
  const pad = 8;
  let top = 120;
  if (typeof window !== "undefined") {
    top = Math.min(Math.round(window.innerHeight * 0.32), Math.max(window.innerHeight - 320, pad + 96));
  }
  return {
    left: pad,
    top,
    maxWidth: typeof window !== "undefined" ? Math.min(320, window.innerWidth - 24) : 300
  };
}

function readLsBool(key: string): boolean {
  try {
    return typeof localStorage !== "undefined" && localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeLsBool(keys: readonly string[]): void {
  try {
    for (const k of keys) localStorage.setItem(k, "1");
  } catch {
    /* ignore */
  }
}

function tourEverFinishedOrSkipped(): boolean {
  return readLsBool(CAMPUS_GUIDED_TOUR_DONE_LS_KEY) || readLsBool(CAMPUS_TOUR_SEEN_LS_KEY);
}

function welcomeSeen(): boolean {
  return readLsBool(CAMPUS_WELCOME_MODAL_SEEN_LS_KEY);
}

/** Mede primeiro elemento HUD `data-tour-id` visível ou devolve centro seguro. */
function measureHudTourSpot(tourId: string): HudAnchorPos {
  if (typeof document === "undefined") return fallbackHudAnch();
  const pad = 8;
  const nodes = document.querySelectorAll(`[data-tour-id="${tourId}"]`);
  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue;
    const r = node.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const maxW = Math.min(300, Math.max(220, window.innerWidth - 24));
    const idealLeft = r.left + r.width / 2 - maxW / 2;
    const left = Math.max(pad, Math.min(idealLeft, window.innerWidth - maxW - pad));
    const topBelow = r.bottom + pad;
    if (topBelow + 120 < window.innerHeight) {
      return { left, top: topBelow, maxWidth: maxW };
    }
    return { left, top: Math.max(pad, r.top - pad - 4), maxWidth: maxW };
  }
  const maxW = Math.min(320, window.innerWidth - 24);
  return {
    left: pad,
    top: fallbackHudAnch().top,
    maxWidth: maxW
  };
}

function TourGlow({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-hidden
    >
      <div
        className="size-[7.5rem] rounded-full opacity-[0.38] sm:size-[8.5rem] sm:opacity-[0.42]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(190, 242, 100, 0.14) 0%, rgba(250, 204, 21, 0.07) 42%, transparent 68%)",
          boxShadow:
            "0 0 22px 10px rgba(134, 239, 172, 0.07), 0 0 46px 22px rgba(253, 224, 71, 0.04), inset 0 0 24px rgba(255, 255, 255, 0.04)"
        }}
      />
    </div>
  );
}

type Props = {
  advancedMap: boolean;
  cannabisPosition: { x: number; y: number };
};

export function CampusMapTour({ advancedMap, cannabisPosition }: Props) {
  const tourNonce = useCampusHudStore((s) => s.campusTourOpenNonce);
  const lastNonce = useRef(0);

  const setTourActiveGlobally = useCampusGuidedTourStore((s) => s.setTourActive);

  const steps = useMemo<StepDef[]>(
    () => [
      {
        spot: { kind: "map", x: 50, y: 44 },
        title: "Mapa do campus",
        lines: ["Toque nos edifícios para abrir cada curso.", "Explore o mapa pelo dia ou pela noite no ícone próximo."]
      },
      {
        spot: { kind: "hud", tourId: "campus-profile" },
        title: "Meu Perfil",
        lines: ["Aqui ficam nome, nível XP, inventário local e cosméticos do avatar."]
      },
      {
        spot: { kind: "hud", tourId: "campus-store" },
        title: "Loja",
        lines: ["Gaste os créditos do campus para itens só neste navegador."]
      },
      {
        spot: { kind: "hud", tourId: "campus-missions" },
        title: "Missões",
        lines: ["Objetivos extras e recompensas quando conclusos."]
      },
      {
        spot: { kind: "hud", tourId: "campus-ranking" },
        title: "Ranking",
        lines: ["Comparativo para te orientares — será substituído pelo ranking oficial da escola."]
      },
      {
        spot: { kind: "map", x: CAMPUS_CINE_POSITION.x, y: CAMPUS_CINE_POSITION.y },
        title: "Cinema · Ao vivo",
        lines: [
          "Este canto agrupa vídeos, lives da escola e anúncios da programação ao vivo.",
          "Volte aqui quando houver transmissão."
        ]
      },
      {
        spot: { kind: "map", x: cannabisPosition.x, y: cannabisPosition.y },
        title: "Cursos · Cannabis 101",
        lines: [
          "A trilha introdutória fica marcada aqui.",
          "O tour não move a sua vista — você abre quando quiser."
        ]
      }
    ],
    [cannabisPosition.x, cannabisPosition.y]
  );

  const [offerVisible, setOfferVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [hudPos, setHudPos] = useState<HudAnchorPos | null>(null);

  /** Chip de lembrete: só depois que o bem-vindo foi tratado para não sobrecarregar. */
  useEffect(() => {
    if (advancedMap) {
      setOfferVisible(false);
      setActive(false);
      return;
    }
    if (tourEverFinishedOrSkipped()) return;
    if (readLsBool(CAMPUS_TOUR_NUDGE_DISMISSED_LS_KEY)) return;
    setOfferVisible(Boolean(welcomeSeen()));
  }, [advancedMap]);

  useEffect(() => {
    setTourActiveGlobally(active);
    return () => setTourActiveGlobally(false);
  }, [active, setTourActiveGlobally]);

  useEffect(() => {
    if (advancedMap) return;
    if (tourNonce > lastNonce.current) {
      lastNonce.current = tourNonce;
      setOfferVisible(false);
      setStepIdx(0);
      setActive(true);
    }
  }, [tourNonce, advancedMap]);

  const step = steps[stepIdx] ?? steps[0];
  const isLast = stepIdx >= steps.length - 1;

  const refreshHudPos = useCallback(() => {
    if (!active || !step) return;
    if (step.spot.kind !== "hud") {
      setHudPos(null);
      return;
    }
    setHudPos(measureHudTourSpot(step.spot.tourId));
  }, [active, step]);

  useLayoutEffect(() => {
    refreshHudPos();
  }, [refreshHudPos, stepIdx]);

  useEffect(() => {
    if (!active || step?.spot.kind !== "hud") return;
    const onResize = () => refreshHudPos();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, step?.spot.kind, refreshHudPos]);

  const finalizeTourFully = useCallback(() => {
    /** Tour concluído → welcome definitivamente resolvido + espelhos de tour legado. XP/badge só aqui (`grantTourOfflineRewardsIfNeeded`). */
    writeLsBool([CAMPUS_GUIDED_TOUR_DONE_LS_KEY, CAMPUS_TOUR_SEEN_LS_KEY, CAMPUS_WELCOME_MODAL_SEEN_LS_KEY]);
    grantTourOfflineRewardsIfNeeded();
    setActive(false);
  }, []);

  /** Pular ou Encerrar: não marca welcome como visto — aluno pode ver o bem-vindo de novo; não concede XP. */
  const finalizeSkipped = useCallback(() => {
    writeLsBool([CAMPUS_GUIDED_TOUR_DONE_LS_KEY, CAMPUS_TOUR_SEEN_LS_KEY]);
    setActive(false);
  }, []);

  const dismissChip = useCallback(() => {
    try {
      localStorage.setItem(CAMPUS_TOUR_NUDGE_DISMISSED_LS_KEY, "1");
    } catch {
      /* noop */
    }
    setOfferVisible(false);
  }, []);

  const startFromChip = useCallback(() => {
    setOfferVisible(false);
    setStepIdx(0);
    setActive(true);
  }, []);

  const advance = useCallback(() => {
    if (isLast) {
      finalizeTourFully();
      return;
    }
    setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  }, [finalizeTourFully, isLast, steps.length]);

  if (advancedMap) return null;

  const mapSpot = step.spot.kind === "map" ? step.spot : null;
  const hudSpot = step.spot.kind === "hud" ? step.spot : null;

  return (
    <>
      {offerVisible && !active ? (
        <div className="pointer-events-none absolute inset-0 z-[16]">
          <div
            className={cn(
              "pointer-events-auto fixed left-1/2 z-[23] w-[min(calc(100vw-2rem),21rem)] -translate-x-1/2",
              "bottom-[5.85rem] sm:bottom-[6.85rem]"
            )}
          >
            <div className="campus-hud-glass relative max-h-[52dvh] overflow-y-auto rounded-xl border border-canna-400/28 px-3 py-2.5 text-sm shadow-lg shadow-black/20">
              <button
                type="button"
                className="absolute right-1.5 top-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium text-white/55 transition hover:bg-white/10 hover:text-white"
                onClick={dismissChip}
              >
                Fechar
              </button>
              <p className="pr-12 text-[11px] font-semibold uppercase tracking-[0.12em] text-canna-200/95">
                Novo por aqui?
              </p>
              <p className="mt-1 text-xs leading-snug text-white/78">
                Percurso curto pelo mapa, perfil e atalhos do campus ({steps.length} passos).
              </p>
              <button
                type="button"
                className="mt-2.5 w-full rounded-lg bg-canna-500/22 py-2 text-center text-xs font-semibold text-canna-50 ring-1 ring-canna-400/35 transition hover:bg-canna-500/30"
                onClick={startFromChip}
              >
                Iniciar tour
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {active ? (
        <>
          <div
            className="pointer-events-none fixed inset-0 z-[62]"
            aria-hidden
          >
            <div className="absolute inset-0 bg-black/[0.55] backdrop-blur-[1px] pointer-events-auto" />
          </div>

          <div className="pointer-events-none fixed inset-0 z-[63]" aria-live="polite">
            {mapSpot ? <TourGlow x={mapSpot.x} y={mapSpot.y} /> : null}

            {mapSpot ? (
              <div
                className="pointer-events-none absolute max-w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 px-3"
                style={{
                  left: `${mapSpot.x}%`,
                  top: `calc(${mapSpot.y}% - 5.25rem)`
                }}
              >
                <TourCard
                  step={step}
                  isLast={isLast}
                  onAdvance={advance}
                  onSkip={finalizeSkipped}
                  onClose={finalizeSkipped}
                />
              </div>
            ) : null}

            {hudSpot && hudPos ? (
              <div
                className="pointer-events-none fixed z-[63]"
                style={{
                  left: hudPos.left,
                  top: hudPos.top,
                  maxWidth: hudPos.maxWidth
                }}
              >
                <TourCard
                  step={step}
                  isLast={isLast}
                  onAdvance={advance}
                  onSkip={finalizeSkipped}
                  onClose={finalizeSkipped}
                />
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
}

function TourCard({
  step,
  isLast,
  onAdvance,
  onSkip,
  onClose
}: {
  step: StepDef;
  isLast: boolean;
  onAdvance: () => void;
  onSkip: () => void;
  onClose: () => void;
}) {
  return (
    <div className="pointer-events-auto campus-hud-glass relative max-h-[min(92dvh,28rem)] w-full overflow-y-auto rounded-xl border border-white/14 px-3.5 pb-4 pt-3 text-sm shadow-[0_8px_28px_rgba(0,0,0,0.35)] sm:max-h-[min(440px,calc(100dvh-8rem))]">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-canna-200/95">
          <MapPin className="size-3.5 shrink-0 text-canna-300/90" aria-hidden />
          {step.title}
        </p>
        <button
          type="button"
          className="shrink-0 rounded-md px-2 py-1 text-[10px] font-medium text-white/55 transition hover:bg-white/10 hover:text-white"
          onClick={onClose}
        >
          Encerrar
        </button>
      </div>
      {step.lines.map((line, i) => (
        <p key={`${step.title}-${i}`} className="text-xs leading-snug text-white/82">
          {line}
        </p>
      ))}
      <div className="mt-3 flex flex-col-reverse gap-2 border-t border-white/10 pt-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          className="rounded-lg bg-white/[0.12] px-3 py-2 text-xs font-semibold text-white/88 ring-1 ring-white/18 transition hover:bg-white/16"
          onClick={onSkip}
        >
          Pular tour
        </button>
        <button
          type="button"
          className={cn(
            "w-full rounded-lg bg-canna-500/28 px-3 py-2 text-xs font-bold text-white ring-1 ring-canna-400/36 transition hover:bg-canna-500/35 sm:ml-auto sm:w-auto sm:py-2"
          )}
          onClick={onAdvance}
        >
          {isLast ? "Concluir tour" : "Próximo"}
        </button>
      </div>
    </div>
  );
}
