"use client";

import { cn } from "@/lib/utils";
import {
  walkableZones,
  walkablePolygonToSvgPath
} from "@/data/walkableZones";

const campusDebug =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_CAMPUS_DEBUG === "true";

/**
 * Malha passeável (SVG invisível em produção; preview em debug).
 * Entre a imagem de fundo e as zonas de curso.
 */
export function CampusWalkableLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5]"
      aria-hidden
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ pointerEvents: "none" }}
      >
        {walkableZones.map((poly, i) => (
          <path
            key={i}
            d={walkablePolygonToSvgPath(poly)}
            className={cn(
              campusDebug
                ? "pointer-events-auto fill-cyan-400/12 stroke-cyan-300/55 stroke-[0.35] [stroke-dasharray:3_2]"
                : "pointer-events-none fill-transparent stroke-transparent opacity-[0.02]"
            )}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {campusDebug
          ? walkableZones.flatMap((poly, pi) =>
              poly.map((v, vi) => (
                <circle
                  key={`${pi}-${vi}`}
                  cx={v.x}
                  cy={v.y}
                  r={0.45}
                  className="pointer-events-none fill-cyan-200/90"
                />
              ))
            )
          : null}
      </svg>
    </div>
  );
}
