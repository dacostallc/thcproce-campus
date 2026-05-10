"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type Phase = "day" | "night";

type SparkSeed = {
  id: number;
  left: string;
  top: string;
  /** horizontal drift amplitude (px) */
  sx: number;
  /** vertical drift amplitude (px) */
  sy: number;
  delay: number;
  duration: number;
  core: string;
  /** Smaller breakpoints only render `mobileOk` sparks (≤ ~4). */
  mobileOk: boolean;
};

/** Very low-contrast specks — must not compete with detailed map imagery. */
const SPARKS: SparkSeed[] = [
  {
    id: 0,
    left: "13%",
    top: "22%",
    sx: 5,
    sy: -4,
    delay: 0,
    duration: 44,
    core: "radial-gradient(circle,rgba(220,206,154,0.11)_0%,rgba(134,239,172,0.045)_55%,transparent_80%)",
    mobileOk: true
  },
  {
    id: 1,
    left: "28%",
    top: "36%",
    sx: -5,
    sy: -4,
    delay: 2.8,
    duration: 48,
    core: "radial-gradient(circle,rgba(186,220,188,0.09)_0%,rgba(251,224,71,0.04)_56%,transparent_82%)",
    mobileOk: true
  },
  {
    id: 2,
    left: "52%",
    top: "18%",
    sx: 4,
    sy: -5,
    delay: 5.2,
    duration: 46,
    core: "radial-gradient(circle,rgba(240,236,178,0.08)_0%,rgba(74,150,118,0.04)_56%,transparent_84%)",
    mobileOk: true
  },
  {
    id: 3,
    left: "69%",
    top: "34%",
    sx: -5,
    sy: -4,
    delay: 1.5,
    duration: 50,
    core: "radial-gradient(circle,rgba(190,220,174,0.09)_0%,rgba(251,191,36,0.032)_56%,transparent_82%)",
    mobileOk: true
  }
];

/**
 * Subtle soft lights (GPU-friendly drift via transform-only layer + inner opacity shimmer).
 */
export function CampusAmbientSparks({ phase = "night" }: { phase?: Phase }) {
  const isDay = phase === "day";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {SPARKS.map((s) => (
        <div
          key={s.id}
          className={cn(
            "campus-ambient-spark-node absolute rounded-full motion-reduce:!animate-none",
            !s.mobileOk && "max-md:hidden"
          )}
          style={
            {
              left: s.left,
              top: s.top,
              width: "min(7px,1.6vw)",
              height: "min(7px,1.6vw)",
              animation: `campusAmbientSparkMotion ${s.duration}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
              ["--sx"]: `${s.sx}px`,
              ["--sy"]: `${s.sy}px`,
              opacity: isDay ? 0.22 : 0.3,
              filter: "blur(0.65px)",
              willChange: "transform",
              isolation: "isolate"
            } as CSSProperties
          }
        >
          <span
            className="campus-ambient-spark-core absolute inset-[14%] rounded-full motion-safe:[will-change:opacity]"
            style={{
              background: s.core,
              animation: `campusAmbientSparkCore ${7.25 + (s.id % 4) * 0.55}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`
            }}
          />
        </div>
      ))}
    </div>
  );
}
