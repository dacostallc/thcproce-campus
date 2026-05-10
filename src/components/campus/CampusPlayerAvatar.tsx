"use client";

import clsx from "clsx";
import type { StudentAvatarVariant } from "@/lib/studentGamificationStorage";

export type CampusPlayerAvatarVariant = StudentAvatarVariant;

type Tone = {
  bodyFill: string;
  bodyStroke: string;
  headFill: string;
  headStroke: string;
  cheek: string;
  mouth: string;
  charmFill: string;
  charmStroke: string;
  shadow: string;
};

const TONES: Record<StudentAvatarVariant, Tone> = {
  visitor: {
    bodyFill: "fill-slate-400",
    bodyStroke: "stroke-slate-600",
    headFill: "fill-slate-200",
    headStroke: "stroke-slate-500",
    cheek: "fill-slate-500/35",
    mouth: "stroke-slate-500/80",
    charmFill: "fill-slate-300",
    charmStroke: "stroke-slate-500",
    shadow: "fill-black/25"
  },
  student: {
    bodyFill: "fill-canna-700",
    bodyStroke: "stroke-canna-900/80",
    headFill: "fill-canna-100",
    headStroke: "stroke-canna-600",
    cheek: "fill-canna-700/25",
    mouth: "stroke-canna-800/75",
    charmFill: "fill-gold-400",
    charmStroke: "stroke-gold-600/90",
    shadow: "fill-black/30"
  },
  cultivator: {
    bodyFill: "fill-emerald-800",
    bodyStroke: "stroke-emerald-950",
    headFill: "fill-lime-50",
    headStroke: "stroke-emerald-700",
    cheek: "fill-emerald-800/28",
    mouth: "stroke-emerald-900/80",
    charmFill: "fill-lime-400",
    charmStroke: "stroke-emerald-800",
    shadow: "fill-black/28"
  },
  researcher: {
    bodyFill: "fill-indigo-800",
    bodyStroke: "stroke-indigo-950",
    headFill: "fill-indigo-50",
    headStroke: "stroke-indigo-600",
    cheek: "fill-indigo-700/30",
    mouth: "stroke-indigo-900/78",
    charmFill: "fill-violet-400",
    charmStroke: "stroke-indigo-900",
    shadow: "fill-black/28"
  },
  chef: {
    bodyFill: "fill-white",
    bodyStroke: "stroke-neutral-400",
    headFill: "fill-amber-50",
    headStroke: "stroke-amber-700",
    cheek: "fill-amber-700/22",
    mouth: "stroke-amber-900/75",
    charmFill: "fill-amber-400",
    charmStroke: "stroke-amber-700",
    shadow: "fill-black/26"
  }
};

type Props = {
  variant?: StudentAvatarVariant;
  /** When seated, idle motion is disabled to match calmer posture. */
  sit?: boolean;
  className?: string;
};

/**
 * Top-down / light figurine for the campus map player (inline SVG, no raster).
 */
export function CampusPlayerAvatar({
  variant = "student",
  sit = false,
  className
}: Props) {
  const visitor = variant === "visitor";
  const tone = TONES[variant];

  return (
    <div
      className={clsx(
        "relative flex h-[52px] w-[52px] shrink-0 items-end justify-center pb-1",
        className
      )}
      aria-hidden
    >
      <div
        className={clsx(
          "origin-bottom",
          !sit && "motion-reduce:animate-none animate-campusPlayerIdle"
        )}
      >
        <svg
          width={44}
          height={48}
          viewBox="0 0 44 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <ellipse
            cx={22}
            cy={44}
            rx={13}
            ry={3.2}
            className={clsx(
              tone.shadow,
              !sit &&
                "motion-safe:animate-campusPlayerFootShadow motion-reduce:animate-none motion-safe:[will-change:opacity]"
            )}
          />

          {visitor ? (
            <>
              <path
                d="M22 11c-4.5 0-8 3.2-8 7.1 0 2.1.9 4 2.3 5.3-1.9 1.2-3.2 3.3-3.5 5.8l-.4 3.5c-.2 1.6 1 3 2.6 3h13.5c1.6 0 2.8-1.4 2.6-3l-.4-3.5c-.3-2.5-1.6-4.6-3.5-5.8 1.4-1.3 2.3-3.2 2.3-5.3 0-3.9-3.5-7.1-8-7.1z"
                className={clsx(tone.bodyFill, tone.bodyStroke)}
                strokeWidth={1.1}
                strokeLinejoin="round"
              />
              <circle
                cx={22}
                cy={18.1}
                r={8.2}
                className={clsx(tone.headFill, tone.headStroke)}
                strokeWidth={1.1}
              />
              <ellipse cx={20.2} cy={16.8} rx={1.1} ry={1.35} className={tone.cheek} />
              <ellipse cx={23.6} cy={16.8} rx={1.1} ry={1.35} className={tone.cheek} />
              <path
                d="M19 22.2c1.2 1 2.8 1 4 0"
                className={tone.mouth}
                strokeWidth={0.9}
                strokeLinecap="round"
              />
              <circle
                cx={22}
                cy={30}
                r={1.35}
                className={clsx(tone.charmFill, tone.charmStroke)}
                strokeWidth={0.65}
              />
            </>
          ) : (
            <>
              <path
                d="M22 11c-4.5 0-8 3.2-8 7.1 0 2.1.9 4 2.3 5.3-1.9 1.2-3.2 3.3-3.5 5.8l-.4 3.5c-.2 1.6 1 3 2.6 3h13.5c1.6 0 2.8-1.4 2.6-3l-.4-3.5c-.3-2.5-1.6-4.6-3.5-5.8 1.4-1.3 2.3-3.2 2.3-5.3 0-3.9-3.5-7.1-8-7.1z"
                className={clsx(tone.bodyFill, tone.bodyStroke)}
                strokeWidth={1.1}
                strokeLinejoin="round"
              />
              <circle
                cx={22}
                cy={18.1}
                r={8.2}
                className={clsx(tone.headFill, tone.headStroke)}
                strokeWidth={1.1}
              />
              <ellipse cx={20} cy={16.8} rx={1.05} ry={1.3} className={tone.cheek} />
              <ellipse cx={24} cy={16.8} rx={1.05} ry={1.3} className={tone.cheek} />
              <path
                d="M18.8 22c1.3 1.1 3.1 1.1 4.4 0"
                className={tone.mouth}
                strokeWidth={0.9}
                strokeLinecap="round"
              />
              <circle
                cx={22}
                cy={29.6}
                r={2.1}
                className={clsx(tone.charmFill, tone.charmStroke)}
                strokeWidth={0.55}
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
