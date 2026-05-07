"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Transition } from "framer-motion";
import { useCampusStore } from "@/stores/campusStore";

/** Avatar do visitante/aluno — segue coords em % (mesmo espaço dos hotspots). */
export function CampusPlayer() {
  const player = useCampusStore((s) => s.player);
  const prevRef = useRef(player);
  const [moveTransition, setMoveTransition] = useState<Transition>({
    type: "spring",
    stiffness: 95,
    damping: 26,
    mass: 1
  });

  useEffect(() => {
    const prev = prevRef.current;
    const d = Math.hypot(player.x - prev.x, player.y - prev.y);
    prevRef.current = player;
    if (d < 0.05) return;
    setMoveTransition({
      type: "tween",
      duration: Math.min(1.85, Math.max(0.32, 0.28 + d * 0.028)),
      ease: [0.22, 0.85, 0.36, 1]
    });
  }, [player.x, player.y]);

  return (
    <motion.div
      className="absolute z-[11] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${player.x}%`, top: `${player.y}%` }}
      initial={false}
      animate={{ left: `${player.x}%`, top: `${player.y}%` }}
      transition={moveTransition}
    >
      <div className="relative flex flex-col items-center">
        <div className="w-11 h-11 rounded-full glass-strong ring-2 ring-canna-400/60 shadow-lg shadow-black/40 flex items-center justify-center">
          <User size={22} className="text-canna-200" />
        </div>
        <span className="mt-1 px-2 py-0.5 rounded-md glass-strong text-[10px] uppercase tracking-wide text-white/90 font-semibold whitespace-nowrap">
          Você
        </span>
      </div>
    </motion.div>
  );
}
