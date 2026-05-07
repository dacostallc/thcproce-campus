"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useCampusStore } from "@/stores/campusStore";

/** Avatar do visitante/aluno — segue coords em % (mesmo espaço dos hotspots). */
export function CampusPlayer() {
  const player = useCampusStore((s) => s.player);

  return (
    <motion.div
      className="absolute z-[11] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${player.x}%`, top: `${player.y}%` }}
      initial={false}
      animate={{ left: `${player.x}%`, top: `${player.y}%` }}
      transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.8 }}
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
