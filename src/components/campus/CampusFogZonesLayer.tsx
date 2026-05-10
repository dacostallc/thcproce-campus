"use client";

import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Area } from "@/data/courses";
import type { MapZone } from "@/data/mapZones";
import { mapZones } from "@/data/mapZones";
import { snapZoneEntryToWalkable } from "@/lib/resolveCampusClickTarget";
import {
  campusZoneLockedTooltip,
  getAreaForMapZone,
  type CampusUnlockContext,
  isCampusZoneUnlocked
} from "@/lib/campusZoneProgress";
import type { PctPos } from "@/stores/campusStore";
import { useZoneStatus } from "@/hooks/useZoneStatus";
import { ZoneTooltip } from "./ZoneTooltip";

type TooltipModel = {
  x: number;
  y: number;
  zoneName: string;
  statusLine: string;
  detail: string | null;
};

type Props = {
  isNight: boolean;
  unlockCtx: CampusUnlockContext;
  liveActive: boolean;
  areaProgress: Record<string, boolean> | undefined;
  onSelectArea: (area: Area) => void;
  /** Caminhada até a entrada na calçada (não o centro do telhado). */
  onWalkTo: (p: PctPos) => void;
  /** `NEXT_PUBLIC_CUSTOM_CURSOR=true`: esconde cursor nativo nas zonas. */
  hideNativeCursor?: boolean;
};

function polygonCentroid(pts: ReadonlyArray<{ x: number; y: number }>): {
  x: number;
  y: number;
} {
  if (pts.length === 0) return { x: 50, y: 50 };
  let sx = 0;
  let sy = 0;
  for (const p of pts) {
    sx += p.x;
    sy += p.y;
  }
  const n = pts.length;
  return { x: sx / n, y: sy / n };
}

function FogZoneItem({
  zone,
  unlockCtx,
  hoverId,
  liveActive,
  areaProgress,
  hideNativeCursor,
  onPathMove,
  onPathLeave,
  onPathClick
}: {
  zone: MapZone;
  unlockCtx: CampusUnlockContext;
  hoverId: string | null;
  liveActive: boolean;
  areaProgress: Record<string, boolean> | undefined;
  hideNativeCursor?: boolean;
  onPathMove: (zone: MapZone, e: React.MouseEvent<SVGPathElement>) => void;
  onPathLeave: (zoneId: string) => void;
  onPathClick: (zone: MapZone, e: React.MouseEvent<SVGPathElement>) => void;
}) {
  const active = hoverId === zone.id;
  const st = useZoneStatus(zone, unlockCtx, active);
  const unlocked = st.isUnlocked;
  const hasLive = Boolean(zone.isLivePulseAnchor && liveActive);
  const hasNewLesson =
    unlocked &&
    Boolean(zone.courseSlug && !areaProgress?.[zone.courseSlug]);
  const { x: cx, y: cy } = polygonCentroid(zone.points);

  const hitPath = (
    <path
      d={zone.path}
      className="campus-map-zone__hit"
      vectorEffect="non-scaling-stroke"
      style={{
        cursor: hideNativeCursor ? "none" : st.cursor
      }}
      onMouseMove={(e) => onPathMove(zone, e)}
      onMouseLeave={() => onPathLeave(zone.id)}
      onClick={(e) => onPathClick(zone, e)}
    />
  );

  return (
    <g
      className={cn(
        "campus-map-zone",
        active && unlocked && "campus-map-zone--active",
        hasLive && "campus-map-zone--has-live",
        hasNewLesson && "campus-map-zone--new-lesson"
      )}
      style={
        {
          ["--zone-opacity" as string]: String(st.opacity),
          ["--zone-grayscale" as string]: st.grayscale,
          ["--zone-glow" as string]: st.zoneGlow,
          ["--zone-stroke" as string]: st.zoneStroke,
          ["--zone-fill" as string]: st.zoneFill
        } as React.CSSProperties
      }
    >
      {hasLive ? (
        <g className="campus-map-zone-live-scale">{hitPath}</g>
      ) : (
        hitPath
      )}
      {hasNewLesson ? (
        <>
          <circle
            cx={cx - 1.1}
            cy={cy - 0.8}
            r={0.35}
            className="pointer-events-none campus-zone-spark campus-zone-spark--a"
            fill="var(--zone-stroke)"
          />
          <circle
            cx={cx + 1.2}
            cy={cy + 0.6}
            r={0.28}
            className="pointer-events-none campus-zone-spark campus-zone-spark--b"
            fill="var(--zone-stroke)"
          />
          <circle
            cx={cx + 0.2}
            cy={cy + 1.4}
            r={0.22}
            className="pointer-events-none campus-zone-spark campus-zone-spark--c"
            fill="var(--zone-stroke)"
          />
        </>
      ) : null}
    </g>
  );
}

export function CampusFogZonesLayer({
  isNight: _isNight,
  unlockCtx,
  liveActive,
  areaProgress,
  onSelectArea,
  onWalkTo,
  hideNativeCursor = false
}: Props) {
  const zones = useMemo(() => mapZones, []);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [tip, setTip] = useState<TooltipModel | null>(null);

  const clearTip = useCallback(() => {
    setHoverId(null);
    setTip(null);
  }, []);

  const handlePathMove = useCallback(
    (zone: MapZone, e: React.MouseEvent<SVGPathElement>) => {
      setHoverId(zone.id);
      const unlocked = isCampusZoneUnlocked(zone, unlockCtx);
      const hasLive = Boolean(zone.isLivePulseAnchor && liveActive);
      const hasNew =
        unlocked &&
        Boolean(zone.courseSlug && !areaProgress?.[zone.courseSlug]);

      let detail: string | null = null;
      if (!unlocked) {
        detail = campusZoneLockedTooltip(zone, unlockCtx);
      } else if (hasNew) {
        detail = "Nova aula disponível nesta sala.";
      }

      const statusLine = !unlocked
        ? "Bloqueada"
        : hasLive
          ? "LIVE agora"
          : "Desbloqueada";

      setTip({
        x: e.clientX,
        y: e.clientY,
        zoneName: zone.name,
        statusLine,
        detail
      });
    },
    [unlockCtx, liveActive, areaProgress]
  );

  const handlePathLeave = useCallback((zoneId: string) => {
    setHoverId((h) => (h === zoneId ? null : h));
    setTip(null);
  }, []);

  const handlePathClick = useCallback(
    (zone: MapZone, e: React.MouseEvent<SVGPathElement>) => {
      const unlocked = isCampusZoneUnlocked(zone, unlockCtx);
      if (!unlocked) {
        const detail = campusZoneLockedTooltip(zone, unlockCtx);
        setTip({
          x: e.clientX,
          y: e.clientY,
          zoneName: zone.name,
          statusLine: "Bloqueada",
          detail
        });
        return;
      }
      const area = getAreaForMapZone(zone);
      if (area) {
        onWalkTo(snapZoneEntryToWalkable(zone.entryPoint));
        onSelectArea(area);
      }
    },
    [unlockCtx, onSelectArea, onWalkTo]
  );

  void _isNight;

  return (
    <div className="pointer-events-none absolute inset-0 z-[9]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full touch-none select-none"
        style={{ pointerEvents: "none" }}
        role="presentation"
        onMouseLeave={clearTip}
      >
        {zones.map((zone) => (
          <FogZoneItem
            key={zone.id}
            zone={zone}
            unlockCtx={unlockCtx}
            hoverId={hoverId}
            liveActive={liveActive}
            areaProgress={areaProgress}
            hideNativeCursor={hideNativeCursor}
            onPathMove={handlePathMove}
            onPathLeave={handlePathLeave}
            onPathClick={handlePathClick}
          />
        ))}
      </svg>
      <ZoneTooltip
        open={tip != null}
        x={tip?.x ?? 0}
        y={tip?.y ?? 0}
        zoneName={tip?.zoneName ?? ""}
        statusLine={tip?.statusLine ?? ""}
        detail={tip?.detail ?? null}
      />
    </div>
  );
}
