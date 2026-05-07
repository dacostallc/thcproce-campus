"use client";

import { motion } from "framer-motion";
import { Film } from "lucide-react";
import { useState } from "react";
import { CAMPUS_CINE_POSITION } from "@/config/campusCinema";
import { useCampusStore } from "@/stores/campusStore";
import { cn } from "@/lib/utils";

const CINE_SCREEN_IMG = "/campus/cine-tela.png";

/** Telão pulsante quando há live + zona clicável sobre o prédio do cinema. */
export function CampusCineHotspot() {
  const isLiveActive = useCampusStore((s) => s.isLiveActive);
  const setIsCineOpen = useCampusStore((s) => s.setIsCineOpen);

  return (
    <div className="pointer-events-none absolute inset-0 z-[14]" data-cine-marker>
      <motion.button
        type="button"
        className={cn(
          "pointer-events-auto absolute touch-manipulation rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-canna-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900/90",
          isLiveActive
            ? "-translate-x-1/2 -translate-y-[55%]"
            : "-translate-x-1/2 -translate-y-1/2 bg-black/25 ring-2 ring-white/25 hover:bg-black/35"
        )}
        style={{
          left: `${CAMPUS_CINE_POSITION.x}%`,
          top: `${CAMPUS_CINE_POSITION.y}%`,
          minWidth: "min(22vw, 140px)",
          minHeight: "min(26vw, 160px)",
          width: "11%",
          aspectRatio: "4 / 5"
        }}
        aria-label={
          isLiveActive
            ? "Cine THC — live agora — abrir transmissão"
            : "Cine THC — abrir drive-in"
        }
        title="Cine THC"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsCineOpen(true);
        }}
      >
        {isLiveActive ? (
          <motion.span
            className="relative block h-full min-h-[100px] w-full overflow-hidden rounded-xl border border-canna-400/80 shadow-[0_0_28px_rgba(74,222,128,0.55)]"
            animate={{ scale: [1, 1.035, 1], opacity: [0.94, 1, 0.94] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          >
            <TelaoLayer />
          </motion.span>
        ) : (
          <span className="flex size-full flex-col items-center justify-center rounded-xl px-1">
            <Film className="text-white/50" size={28} aria-hidden />
            <span className="mt-1 text-center text-[8px] font-bold uppercase tracking-wider text-white/70">
              Cine THC
            </span>
          </span>
        )}
      </motion.button>
    </div>
  );
}

function TelaoLayer() {
  const [broken, setBroken] = useState(false);

  return (
    <span className="relative flex size-full overflow-hidden rounded-[inherit]">
      {!broken ? (
        /* Arte opcional: `public/campus/cine-tela.png` */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={CINE_SCREEN_IMG}
          alt="Telão de cinema THCProce"
          className="absolute inset-0 size-full object-cover"
          draggable={false}
          onError={() => setBroken(true)}
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-canna-900/90 via-ink-900 to-black"
        />
      )}

      {broken ? (
        <span className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
          <Film
            size={42}
            className="text-canna-300 opacity-95 drop-shadow-[0_0_14px_rgba(74,222,128,0.85)]"
            aria-hidden
          />
        </span>
      ) : null}

      {!broken ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,transparent_55%,rgba(0,0,0,0.35)_100%)]"
        />
      ) : null}

      <span className="pointer-events-none absolute bottom-2 left-0 right-0 z-[2] flex justify-center">
        <span className="rounded-full border border-red-500/55 bg-red-950/92 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-red-100 shadow-[0_0_14px_rgba(239,68,68,0.45)]">
          Live agora
        </span>
      </span>
    </span>
  );
}
