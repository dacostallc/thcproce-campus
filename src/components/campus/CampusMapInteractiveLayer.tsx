"use client";

import type { CSSProperties, KeyboardEventHandler, PointerEventHandler } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { areas, type Area } from "@/data/courses";
import {
  CAMPUS_MAP_INTERACTIVE_AREAS,
  imageMapCoordsToSvgPrimitiveArt,
  imageMapApproxCenterPct,
  imageMapApproxArtCentroid
} from "@/lib/campusMapAreasCatalog";
import type {
  CampusMapHotspotAccessStatus,
  CampusMapInteractiveArea
} from "@/lib/campusMapAreasInteractive.types";
import { summarizeInteractiveTarget } from "@/lib/campusMapInteractiveTargetSummary";
import {
  CAMPUS_MAP_TOPIC_PROXIMITY_UNITS,
  resolveCampusMapInteractiveLighting
} from "@/lib/campusMapInteractiveLighting";
import { CAMPUS_ART_HEIGHT, CAMPUS_ART_WIDTH, campusMapInteractiveSvgPreserveAspectRatio } from "@/lib/campusArt";
import { useCampusStore, type PctPos } from "@/stores/campusStore";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { isCampusMapInteractiveDebugEnabled } from "@/config/campusMapStability";
import { isCampusAdminEmail } from "@/lib/campusAdmin";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getCampusMapTopicByAreaId,
  isCampusMapPrimaryCourseArea
} from "@/lib/campusMapTopicCatalog";
import { hotspotDisplayLabel } from "@/lib/campusMapHotspotResolve";

type Props = {
  setPlayerLoose: (p: PctPos) => void;
  sky: "day" | "night";
  /** Alinhado ao `object-fit` da `<img>` do mapa no mesmo content-box. */
  imageObjectFit: "cover" | "contain";
  /** Opcional; por defeito deriva de {@link imageObjectFit}. */
  svgPreserveAspectRatio?: "xMidYMid meet" | "xMidYMid slice";
};

type MsgTone = "coming_soon" | "inactive" | "missing_course" | "missing_topic";

type InteractiveTopicDialog =
  | null
  | { variant: "message"; hit: CampusMapInteractiveArea; messageTone: MsgTone }
  | { variant: "welcome"; hit: CampusMapInteractiveArea }
  | { variant: "access_gate"; hit: CampusMapInteractiveArea; gate: "locked" | "coming_soon" };

function resolveCourseArea(hit: CampusMapInteractiveArea): Area | null {
  const t = hit.target;
  if (t.kind === "course") {
    return areas.find((a) => a.id === t.courseId) ?? null;
  }
  return null;
}

function clampPlayerPct(pos: { x: number; y: number }) {
  return {
    x: Math.min(99, Math.max(1, pos.x)),
    y: Math.min(99, Math.max(1, pos.y))
  };
}

function modalTitle(hit: CampusMapInteractiveArea): string {
  const label = hit.label?.trim();
  return hit.panelTitle ?? (label || hit.title);
}

function shortTarget(hit: CampusMapInteractiveArea): string {
  const s = summarizeInteractiveTarget(hit.target);
  return s.length > 48 ? `${s.slice(0, 47)}…` : s;
}

function hotspotHitAriaLabel(hit: CampusMapInteractiveArea): string {
  const name = hotspotDisplayLabel(hit);
  const status =
    hit.status === "locked"
      ? "bloqueada"
      : hit.status === "coming_soon"
        ? "em breve"
        : "disponível";
  const live = hit.live ? ", com transmissão ao vivo" : "";
  return `${name}. Área ${status}${live}. Abrir no mapa.`;
}

function welcomeBodyStudent(hit: CampusMapInteractiveArea): string {
  if (hit.studentSummary?.trim()) return hit.studentSummary.trim();
  return "Este recanto representa uma pausa antes da jornada: respira fundo, escolhe com calma o próximo passo e deixa a curiosidade guiar — o campus responde a quem chega com intenção.";
}

function accessGateBodyStudent(hit: CampusMapInteractiveArea, gate: "locked" | "coming_soon"): string {
  if (hit.studentSummary?.trim()) return hit.studentSummary.trim();
  if (gate === "locked") {
    return "Esta área está bloqueada no teu acesso actual. Explora outras salas do campus ou retorna quando o desbloqueio estiver disponível.";
  }
  return "Este conteúdo ainda está em preparação. Escolhe outro ponto do mapa ou volta em breve.";
}

function messageBodyStudent(hit: CampusMapInteractiveArea, tone: MsgTone): string {
  if (tone === "missing_topic") {
    return (
      hit.studentSummary ??
      "Este ponto ainda não tem ficha temática no campus. Escolha outra área ou volte mais tarde."
    );
  }
  if (tone === "missing_course") {
    return (
      hit.studentSummary ??
      "Este ponto ligava a um curso que ainda não está disponível. Escolha outra sala ou volte mais tarde."
    );
  }

  if (tone === "coming_soon") {
    if (hit.studentSummary?.trim()) return hit.studentSummary.trim();
    if (hit.target.kind === "none" && hit.target.reason?.trim()) return hit.target.reason.trim();
    return "Este conteúdo ainda vai abrir no campus.";
  }
  if (hit.studentSummary?.trim()) return hit.studentSummary.trim();
  if (hit.target.kind === "none" && hit.target.reason?.trim()) return hit.target.reason.trim();
  return "Não há ação disponível para esta sala neste momento.";
}

function clientToSvgViewBox(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const m = svg.getScreenCTM();
  if (!m) return null;
  return pt.matrixTransform(m.inverse());
}

/** Marcador compacto acima do hotspot — não altera polígonos; só decoração SVG. */
function CampusInteractiveHotspotMarker({
  cx,
  cy,
  status,
  live,
  hitId
}: {
  cx: number;
  cy: number;
  status: CampusMapHotspotAccessStatus;
  live?: boolean;
  hitId: string;
}) {
  const rootMod =
    status === "locked"
      ? "campus-hotspot-marker-root--locked"
      : status === "coming_soon"
        ? "campus-hotspot-marker-root--soon"
        : "campus-hotspot-marker-root--open";

  const stagger = ((hitId.length % 11) + (hitId.charCodeAt(0) % 7)) * 0.11;

  return (
    <g
      transform={`translate(${cx},${cy})`}
      className={cn(
        "campus-hotspot-marker-root pointer-events-none",
        rootMod,
        live ? "campus-hotspot-marker-root--with-live" : null
      )}
      aria-hidden
    >
      <g className="campus-hotspot-marker-hoverscale">
        <circle className="campus-hotspot-marker-halo" r={13.25} style={{ animationDelay: `${stagger}s` }} />
        <circle className="campus-hotspot-marker-ring" r={6.85} />
        <circle className="campus-hotspot-marker-core" r={5.15} />
        <ellipse
          className="campus-hotspot-marker-glint"
          cx={-2.1}
          cy={-2.35}
          rx={2.35}
          ry={1.28}
          transform="rotate(-26)"
        />
        {live ? <circle className="campus-hotspot-marker-live" cx={8.6} cy={-8.15} r={3.35} /> : null}
      </g>
    </g>
  );
}

/**
 * Sobreposição SVG do mapa simples — coords image-map em pixéis no viewBox 1536×1024 da arte com `preserveAspectRatio` espelhando o `object-fit` da PNG no mesmo rect.
 */
export function CampusMapInteractiveLayer({
  setPlayerLoose,
  sky,
  imageObjectFit,
  svgPreserveAspectRatio
}: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const campusAdminUser = isCampusAdminEmail(session?.user?.email);

  const cineOpen = useCampusStore((s) => s.isCineOpen);
  const cinemaDockOpen = useCampusHudStore((s) => s.campusMapCinemaLiveOpen);
  const mapInteractionsSuppressed = cineOpen || cinemaDockOpen;
  const [dialog, setDialog] = useState<InteractiveTopicDialog>(null);

  const interactiveDebugEnv = typeof process !== "undefined" && isCampusMapInteractiveDebugEnabled();
  const mapDebugChrome = interactiveDebugEnv || campusAdminUser;
  const showModalTechStripe = interactiveDebugEnv || campusAdminUser;
  const showSvgTargetStrip = mapDebugChrome && showModalTechStripe;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const preparedRef = useRef<
    {
      hit: CampusMapInteractiveArea;
      primitiveArt: ReturnType<typeof imageMapCoordsToSvgPrimitiveArt>;
      anchorPct: { x: number; y: number };
      anchorArt: { cx: number; cy: number };
    }[]
  >([]);
  const rafNearRef = useRef<number | null>(null);
  const pendingPtrRef = useRef<{ x: number; y: number } | null>(null);
  const lastProximityFlushRef = useRef(0);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [proximityPointerOk, setProximityPointerOk] = useState(false);
  const [nearTopicId, setNearTopicId] = useState<string | null>(null);
  const [flashAreaId, setFlashAreaId] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setProximityPointerOk(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(
    () => () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      if (rafNearRef.current != null) cancelAnimationFrame(rafNearRef.current);
    },
    []
  );

  const svgPar =
    svgPreserveAspectRatio ?? campusMapInteractiveSvgPreserveAspectRatio(imageObjectFit);
  const labelScale = CAMPUS_ART_HEIGHT / 100;

  const prepared = useMemo(() => {
    return CAMPUS_MAP_INTERACTIVE_AREAS.map((a) => ({
      hit: a,
      primitiveArt: imageMapCoordsToSvgPrimitiveArt(a.coords, a.shape),
      anchorPct: imageMapApproxCenterPct(a.coords, a.shape),
      anchorArt: imageMapApproxArtCentroid(a.coords, a.shape)
    }));
  }, []);

  preparedRef.current = prepared;

  const scheduleTopicProximity = useCallback(() => {
    if (rafNearRef.current != null) return;
    rafNearRef.current = requestAnimationFrame(() => {
      rafNearRef.current = null;
      const nowMs =
        typeof performance !== "undefined" && typeof performance.now === "function"
          ? performance.now()
          : Date.now();
      if (nowMs - lastProximityFlushRef.current < 50) return;
      lastProximityFlushRef.current = nowMs;
      const pending = pendingPtrRef.current;
      const svg = svgRef.current;
      if (!pending || !svg || mapInteractionsSuppressed || mapDebugChrome || !proximityPointerOk) {
        setNearTopicId(null);
        return;
      }
      const p = clientToSvgViewBox(svg, pending.x, pending.y);
      if (!p) return;

      const mx = (p.x / CAMPUS_ART_WIDTH) * 100;
      const my = (p.y / CAMPUS_ART_HEIGHT) * 100;

      let best: string | null = null;
      let bestD = Infinity;
      const threshold = CAMPUS_MAP_TOPIC_PROXIMITY_UNITS;

      for (const row of preparedRef.current) {
        const light = resolveCampusMapInteractiveLighting(row.hit.id, row.hit.lighting);
        if (light.preset === "primary") continue;
        const dx = mx - row.anchorPct.x;
        const dy = my - row.anchorPct.y;
        const d = Math.hypot(dx, dy);
        if (d < threshold && d < bestD) {
          bestD = d;
          best = row.hit.id;
        }
      }
      setNearTopicId((prev) => (prev === best ? prev : best));
    });
  }, [mapInteractionsSuppressed, mapDebugChrome, proximityPointerOk]);

  const onSvgPointerMove: PointerEventHandler<SVGSVGElement> = (e) => {
    if (mapInteractionsSuppressed || mapDebugChrome || !proximityPointerOk) return;
    pendingPtrRef.current = { x: e.clientX, y: e.clientY };
    scheduleTopicProximity();
  };

  const onSvgPointerLeave: PointerEventHandler<SVGSVGElement> = () => {
    pendingPtrRef.current = null;
    setNearTopicId(null);
  };

  const triggerHitFlash = useCallback((id: string) => {
    if (mapDebugChrome) return;
    setFlashAreaId(id);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => {
      setFlashAreaId((cur) => (cur === id ? null : cur));
      flashTimerRef.current = null;
    }, 380);
  }, [mapDebugChrome]);

  const activateInteractiveHit = useCallback(
    (hit: CampusMapInteractiveArea) => {
      triggerHitFlash(hit.id);

      setDialog(null);
      setPlayerLoose(clampPlayerPct(imageMapApproxCenterPct(hit.coords, hit.shape)));

      const t = hit.target;
      if (t.kind === "route") {
        router.push(t.href);
        return;
      }
      if (t.kind === "hud_store") {
        useCampusHudStore.getState().setCampusStoreOpen(true);
        return;
      }
      if (t.kind === "hud_mural") {
        useCampusHudStore.getState().setMuralOpen(true);
        return;
      }
      if (t.kind === "welcome_intro") {
        setDialog({ variant: "welcome", hit });
        return;
      }
      if (hit.status === "locked") {
        setDialog({ variant: "access_gate", hit, gate: "locked" });
        return;
      }
      if (hit.status === "coming_soon") {
        setDialog({ variant: "access_gate", hit, gate: "coming_soon" });
        return;
      }
      if (t.kind === "schedule_day") {
        useCampusHudStore.getState().setCampusMapScheduleDayOpen(true);
        return;
      }
      if (t.kind === "cinema_live_rail") {
        useCampusHudStore.getState().setCampusMapCinemaLiveOpen(true);
        useCampusHudStore.getState().setCampusMapCinemaLiveExpanded(true);
        return;
      }
      if (t.kind === "campus_mural_feed") {
        useCampusHudStore.getState().setCampusMapMuralFeedOpen(true);
        return;
      }

      if (isCampusMapPrimaryCourseArea(hit.id)) {
        const related = resolveCourseArea(hit);
        if (!related) {
          setDialog({ variant: "message", hit, messageTone: "missing_course" });
          return;
        }
        useCampusHudStore.getState().setCampusMapHotspotPanelHitId(hit.id);
        return;
      }
      const topic = getCampusMapTopicByAreaId(hit.id);
      if (topic) {
        useCampusHudStore.getState().setCampusMapHotspotPanelHitId(hit.id);
        return;
      }
      if (t.kind === "course") {
        const related = resolveCourseArea(hit);
        if (!related) {
          setDialog({ variant: "message", hit, messageTone: "missing_course" });
          return;
        }
        useCampusHudStore.getState().setCampusMapHotspotPanelHitId(hit.id);
        return;
      }
      setDialog({ variant: "message", hit, messageTone: "missing_topic" });
    },
    [router, setPlayerLoose, triggerHitFlash]
  );

  const handleHitFaceKeyDown = useCallback(
    (hit: CampusMapInteractiveArea): KeyboardEventHandler<SVGElement> =>
      (e) => {
        if (mapInteractionsSuppressed || mapDebugChrome) return;
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        activateInteractiveHit(hit);
      },
    [activateInteractiveHit, mapDebugChrome, mapInteractionsSuppressed]
  );

  const onShapePointerDown: PointerEventHandler<SVGElement> = (e) => {
    if (mapInteractionsSuppressed) return;
    if (e.button !== 0) return;
    const id = (e.target as SVGElement).closest("[data-hit-id]")?.getAttribute("data-hit-id");
    if (!id) return;
    e.preventDefault();
    e.stopPropagation();
    const hit = CAMPUS_MAP_INTERACTIVE_AREAS.find((x) => x.id === id);
    if (!hit) return;

    activateInteractiveHit(hit);
  };

  const renderTechFooter = (hit: CampusMapInteractiveArea | null) => {
    if (!showModalTechStripe || !hit) return null;
    return (
      <div className="relative z-[1] mt-5 rounded-xl border border-white/10 bg-black/35 px-3 py-2 font-mono text-[10px] leading-relaxed text-emerald-200/82">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/42">Equipa técnica</p>
        <p className="mt-1 break-all text-emerald-100/92">id: {hit.id}</p>
        <p className="mt-1 break-all text-emerald-100/92">tipo: {hit.type}</p>
        <p className="mt-1 break-all text-teal-200/95">target: {summarizeInteractiveTarget(hit.target)}</p>
      </div>
    );
  };

  return (
    <>
      <div
        data-campus-interactive-wrap
        data-sky={sky}
        className={cn(
          "campus-map-interactive-overlay pointer-events-none absolute inset-0 touch-none outline-none [&_circle]:motion-reduce:transition-none [&_polygon]:motion-reduce:transition-none",
          mapDebugChrome && "campus-map-interactive-overlay--debug"
        )}
        data-debug={mapDebugChrome ? "true" : "false"}
      >
        <svg
          ref={svgRef}
          className={cn(
            "campus-map-interactive-svg absolute inset-0 h-full w-full overflow-hidden",
            mapInteractionsSuppressed ? "pointer-events-none cursor-default" : "pointer-events-auto cursor-pointer"
          )}
          viewBox={`0 0 ${CAMPUS_ART_WIDTH} ${CAMPUS_ART_HEIGHT}`}
          preserveAspectRatio={svgPar}
          onPointerDown={onShapePointerDown}
          onPointerMove={onSvgPointerMove}
          onPointerLeave={onSvgPointerLeave}
          role={mapInteractionsSuppressed ? "presentation" : "group"}
          aria-label={
            mapInteractionsSuppressed ? undefined : "Áreas interativas do mapa do campus"
          }
        >
          {!mapInteractionsSuppressed ? (
            <rect
              x={0}
              y={0}
              width={CAMPUS_ART_WIDTH}
              height={CAMPUS_ART_HEIGHT}
              fill="transparent"
              className="campus-interactive-svg-capture"
              aria-hidden
            />
          ) : null}
          {prepared.map(({ hit, primitiveArt, anchorArt }) => {
            const targetLabel = shortTarget(hit);
            const light = resolveCampusMapInteractiveLighting(hit.id, hit.lighting);
            const isPrimaryLight = light.preset === "primary";
            const proximityNear = !mapDebugChrome && !isPrimaryLight && nearTopicId === hit.id;
            const isFlashing = flashAreaId === hit.id;
            const statusTone =
              hit.status === "locked"
                ? "campus-interactive-shape--access-locked"
                : hit.status === "coming_soon"
                  ? "campus-interactive-shape--access-soon"
                  : "campus-interactive-shape--access-open";

            const groupStyle = {
              ["--campus-glow-color" as string]: light.glowColor,
              ["--campus-glow-strength" as string]: String(light.glowIntensity),
              ["--campus-pulse-s" as string]: `${light.pulseSpeed}s`,
              ["--campus-ambient-opacity" as string]: String(light.ambientLightOpacity)
            } as CSSProperties;

            const hitFaceA11y = !mapDebugChrome && !mapInteractionsSuppressed;
            const hitTooltipTitle = hotspotDisplayLabel(hit);

            return primitiveArt.kind === "polygon" ? (
              <g
                key={hit.id}
                data-hit-id={hit.id}
                data-light-preset={light.preset}
                style={groupStyle}
                className={cn(
                  "campus-interactive-shape cursor-pointer",
                  !mapInteractionsSuppressed && "campus-interactive-shape--hits",
                  statusTone,
                  hit.live && "campus-interactive-shape--live",
                  !mapDebugChrome && isPrimaryLight && "campus-interactive-shape--light-primary",
                  !mapDebugChrome && !isPrimaryLight && "campus-interactive-shape--light-topic",
                  !mapDebugChrome && proximityNear && "campus-interactive-shape--proximity-near",
                  !mapDebugChrome && isFlashing && "campus-interactive-shape--hit-flash"
                )}
              >
                {!mapDebugChrome ? (
                  <polygon
                    className="campus-interactive-shape__glass-fill"
                    points={primitiveArt.pointsPx}
                    aria-hidden
                  />
                ) : null}
                <polygon
                  role={hitFaceA11y ? "button" : "presentation"}
                  tabIndex={hitFaceA11y ? 0 : undefined}
                  aria-label={hitFaceA11y ? hotspotHitAriaLabel(hit) : undefined}
                  data-hit-target="1"
                  points={primitiveArt.pointsPx}
                  className={cn(
                    mapDebugChrome && "campus-interactive-shape__outline",
                    !mapDebugChrome && "campus-interactive-shape__hit-face"
                  )}
                  vectorEffect={mapDebugChrome ? "non-scaling-stroke" : undefined}
                  onKeyDown={hitFaceA11y ? handleHitFaceKeyDown(hit) : undefined}
                >
                  {hitFaceA11y ? <title>{hitTooltipTitle}</title> : null}
                </polygon>
                {!mapDebugChrome ? (
                  <CampusInteractiveHotspotMarker
                    cx={anchorArt.cx}
                    cy={Math.max(16, anchorArt.cy - 21)}
                    status={hit.status}
                    live={Boolean(hit.live)}
                    hitId={hit.id}
                  />
                ) : null}
                {mapDebugChrome ? (
                  <text
                    x={anchorArt.cx}
                    y={Math.max(8, anchorArt.cy - 12)}
                    className="campus-interactive-shape__tech-label"
                  >
                    <tspan fill="rgba(226,255,250,0.92)" fontSize={2 * labelScale} fontWeight={700}>
                      {hit.id.length > 22 ? `${hit.id.slice(0, 21)}…` : hit.id}
                    </tspan>
                    {showSvgTargetStrip ? (
                      <tspan
                        x={anchorArt.cx}
                        dy={2.1 * labelScale}
                        fill="rgba(180,253,218,0.78)"
                        fontSize={1.55 * labelScale}
                        fontWeight={550}
                      >
                        {targetLabel}
                      </tspan>
                    ) : null}
                  </text>
                ) : null}
              </g>
            ) : (
              <g
                key={hit.id}
                data-hit-id={hit.id}
                data-light-preset={light.preset}
                style={groupStyle}
                className={cn(
                  "campus-interactive-shape cursor-pointer",
                  !mapInteractionsSuppressed && "campus-interactive-shape--hits",
                  statusTone,
                  hit.live && "campus-interactive-shape--live",
                  !mapDebugChrome && isPrimaryLight && "campus-interactive-shape--light-primary",
                  !mapDebugChrome && !isPrimaryLight && "campus-interactive-shape--light-topic",
                  !mapDebugChrome && proximityNear && "campus-interactive-shape--proximity-near",
                  !mapDebugChrome && isFlashing && "campus-interactive-shape--hit-flash"
                )}
              >
                {!mapDebugChrome ? (
                  <circle
                    className="campus-interactive-shape__glass-fill"
                    cx={primitiveArt.cx}
                    cy={primitiveArt.cy}
                    r={primitiveArt.r}
                    aria-hidden
                  />
                ) : null}
                <circle
                  role={hitFaceA11y ? "button" : "presentation"}
                  tabIndex={hitFaceA11y ? 0 : undefined}
                  aria-label={hitFaceA11y ? hotspotHitAriaLabel(hit) : undefined}
                  data-hit-target="1"
                  className={cn(
                    mapDebugChrome && "campus-interactive-shape__outline",
                    !mapDebugChrome && "campus-interactive-shape__hit-face"
                  )}
                  cx={primitiveArt.cx}
                  cy={primitiveArt.cy}
                  r={primitiveArt.r}
                  vectorEffect={mapDebugChrome ? "non-scaling-stroke" : undefined}
                  onKeyDown={hitFaceA11y ? handleHitFaceKeyDown(hit) : undefined}
                >
                  {hitFaceA11y ? <title>{hitTooltipTitle}</title> : null}
                </circle>
                {!mapDebugChrome ? (
                  <CampusInteractiveHotspotMarker
                    cx={primitiveArt.cx}
                    cy={Math.max(16, primitiveArt.cy - primitiveArt.r - 17)}
                    status={hit.status}
                    live={Boolean(hit.live)}
                    hitId={hit.id}
                  />
                ) : null}
                {mapDebugChrome ? (
                  <text
                    x={primitiveArt.cx}
                    y={Math.max(8, primitiveArt.cy - primitiveArt.r - 10)}
                    className="campus-interactive-shape__tech-label"
                  >
                    <tspan fill="rgba(226,255,250,0.92)" fontSize={2 * labelScale} fontWeight={700}>
                      {hit.id.length > 22 ? `${hit.id.slice(0, 21)}…` : hit.id}
                    </tspan>
                    {showSvgTargetStrip ? (
                      <tspan
                        x={primitiveArt.cx}
                        dy={2.1 * labelScale}
                        fill="rgba(180,253,218,0.78)"
                        fontSize={1.55 * labelScale}
                        fontWeight={550}
                      >
                        {targetLabel}
                      </tspan>
                    ) : null}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <AnimatePresence>
        {dialog ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "fixed inset-0 z-[54] backdrop-blur-sm",
                sky === "day" ? "bg-sky-950/30" : "bg-black/50"
              )}
              aria-label="Fechar"
              onClick={() => setDialog(null)}
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-labelledby="campus-interactive-dialog-title"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className={cn(
                "relative overflow-hidden",
                "fixed left-1/2 top-[44%] z-[55] w-[min(92%,400px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6",
                "campus-hud-glass",
                dialog.variant === "access_gate"
                  ? dialog.gate === "locked"
                    ? "border-cyan-200/28 shadow-[0_0_96px_rgba(56,189,248,0.14)]"
                    : "border-violet-200/32 shadow-[0_0_96px_rgba(167,139,250,0.16)]"
                  : "border-teal-300/22"
              )}
            >
              <button
                type="button"
                onClick={() => setDialog(null)}
                className="absolute right-3 top-3 z-[2] rounded-lg p-2 text-white/45 hover:bg-white/10 hover:text-white"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>

              <p
                id="campus-interactive-dialog-title"
                className="relative z-[1] pr-10 text-lg font-semibold tracking-tight text-white/95"
              >
                {modalTitle(dialog.hit)}
              </p>

              {dialog.variant === "welcome" ? (
                <div className="relative z-[1] mt-5 space-y-3 text-[15px] leading-relaxed tracking-tight text-white/76">
                  {welcomeBodyStudent(dialog.hit)
                    .split(/\n+/g)
                    .filter(Boolean)
                    .map((p, i) => (
                      <p key={i}>{p.trim()}</p>
                    ))}
                </div>
              ) : dialog.variant === "access_gate" ? (
                <>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_22%_0%,rgba(250,204,21,0.15),transparent_56%),linear-gradient(125deg,transparent_40%,rgba(255,255,255,0.06)_52%,transparent_64%)] opacity-[0.85]" />
                  <p className="relative z-[1] mt-4 text-[15px] leading-relaxed text-white/84">
                    {accessGateBodyStudent(dialog.hit, dialog.gate)}
                  </p>
                </>
              ) : null}
              {dialog.variant === "message" ? (
                <p className="relative z-[1] mt-3 text-sm leading-relaxed text-white/78">
                  {messageBodyStudent(dialog.hit, dialog.messageTone)}
                </p>
              ) : null}
              {renderTechFooter(dialog.hit)}

              <div className="relative z-[1] mt-6 flex justify-end">
                <Button type="button" variant="glass" size="sm" onClick={() => setDialog(null)}>
                  Voltar ao mapa
                </Button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
