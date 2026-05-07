"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CINEMA_EMOJI_TTL_MS, isAllowedCinemaReactionEmoji } from "@/lib/campusCinemaSeats";

function useLightRepaint(active: boolean) {
  const [, bump] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => bump((n) => n + 1), 280);
    return () => window.clearInterval(id);
  }, [active]);
}

/** Reação visível — sobe e desvanece (Presence / broadcast). */
export function CampusCinemaEmojiBurst({
  emoji,
  at,
  emphasis = false
}: {
  emoji: string | null;
  at: number;
  emphasis?: boolean;
}) {
  const alive =
    Boolean(emoji && at > 0 && isAllowedCinemaReactionEmoji(emoji)) &&
    Date.now() - at < CINEMA_EMOJI_TTL_MS;
  useLightRepaint(alive);

  const show =
    Boolean(emoji && at > 0 && isAllowedCinemaReactionEmoji(emoji)) &&
    Date.now() - at < CINEMA_EMOJI_TTL_MS;

  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 z-[21] mb-0.5 -translate-x-1/2 whitespace-nowrap">
      <AnimatePresence mode="sync">
        {show && emoji ? (
          <motion.span
            key={at}
            initial={{ y: 16, opacity: 0, scale: 0.55 }}
            animate={{
              y: emphasis ? -52 : -46,
              opacity: [0, 1, 1, 0],
              scale: emphasis ? [0.55, 1.18, 1.12, 0.88] : [0.55, 1.08, 1.02, 0.82]
            }}
            exit={{ opacity: 0, y: emphasis ? -68 : -62 }}
            transition={{
              duration: 2.45,
              times: [0, 0.1, 0.48, 1],
              ease: [0.16, 0.74, 0.25, 1]
            }}
            className={`select-none text-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] ${
              emphasis ? "sm:text-[1.85rem]" : "text-xl sm:text-2xl"
            }`}
            aria-hidden
          >
            {emoji}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
